<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\DetailPenjualan;
use App\Models\Pelanggan;
use App\Models\Penjualan;
use App\Models\Sekolah;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PenjualanController extends Controller
{
    public function index(Request $request): Response
    {
        $user         = $request->user();
        $roleName     = $user->role?->nama_role;
        $isSuperAdmin = $roleName === 'super admin';
        $isKasir      = $roleName === 'kasir';
        $isReadOnly   = $isSuperAdmin || $isKasir;

        $sekolahId = $isSuperAdmin
            ? ($request->integer('id_sekolah') ?: null)
            : $user->id_sekolah;

        $penjualan = Penjualan::with(['user', 'pelanggan'])
            ->when($sekolahId, fn ($q) => $q->where('id_sekolah', $sekolahId))
            ->orderByDesc('tanggal_penjualan')
            ->get();

        return Inertia::render('penjualan/index', [
            'penjualan'          => $penjualan,
            'isReadOnly'         => $isReadOnly,
            'sekolahList'        => $isSuperAdmin ? Sekolah::orderBy('nama_sekolah')->get(['id_sekolah', 'nama_sekolah']) : [],
            'selectedSekolahId'  => $sekolahId,
        ]);
    }

    public function pos(Request $request): Response
    {
        $sekolahId = $request->user()->id_sekolah;

        $barang = Barang::when($sekolahId, fn ($q) => $q->where('id_sekolah', $sekolahId))
            ->where('is_active', 1)
            ->where('stok', '>', 0)
            ->with('kategori')
            ->orderBy('nama')
            ->get();

        $pelanggan = Pelanggan::whereHas(
            'kelompok',
            fn ($q) => $sekolahId ? $q->where('id_sekolah', $sekolahId) : $q
        )->orderBy('nama_pelanggan')->get();

        return Inertia::render('pos/index', [
            'barang' => $barang,
            'pelanggan' => $pelanggan,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_pelanggan' => 'nullable|exists:tb_pelanggan,id_pelanggan',
            'total_bayar' => 'required|numeric|min:0',
            'jenis_transaksi' => 'required|in:tunai,kredit',
            'cara_bayar' => 'nullable|string|max:50',
            'note' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id_barang' => 'required|exists:tb_barang,id_barang',
            'items.*.jumlah_barang' => 'required|integer|min:1',
            'items.*.harga_beli' => 'required|numeric|min:0',
            'items.*.harga_jual' => 'required|numeric|min:0',
            'items.*.diskon_tipe' => 'nullable|in:persen,nominal',
            'items.*.diskon_nilai' => 'nullable|numeric|min:0',
            'items.*.diskon_nominal' => 'nullable|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
        ]);

        $user = $request->user();
        $sekolahId = $user->id_sekolah; // null untuk SuperAdmin — transaksi tanpa sekolah (global)
        $totalFaktur = collect($validated['items'])->sum('subtotal');

        $penjualan = null; // inisialisasi sebelum closure

        DB::transaction(function () use ($validated, $user, $sekolahId, $totalFaktur, &$penjualan) {
            $penjualan = Penjualan::create([
                'id_sekolah' => $sekolahId,
                'id_user' => $user->id_user,
                'id_pelanggan' => $validated['id_pelanggan'] ?? null,
                'total_faktur' => $totalFaktur,
                'total_bayar' => $validated['total_bayar'],
                'kembalian' => $validated['total_bayar'] - $totalFaktur,
                'status_pembayaran' => $validated['total_bayar'] < $totalFaktur ? 'hutang' : 'sudah bayar',
                'jenis_transaksi' => $validated['jenis_transaksi'],
                'cara_bayar' => $validated['cara_bayar'] ?? null,
                'note' => $validated['note'] ?? null,
                'created_by' => $user->id_user,
            ]);

            foreach ($validated['items'] as $item) {
                $barang = Barang::lockForUpdate()->find($item['id_barang']);
                if ($barang->stok < $item['jumlah_barang']) {
                    throw new \Exception("Stok {$barang->nama} tidak mencukupi.");
                }

                DetailPenjualan::create([
                    'id_penjualan' => $penjualan->id_penjualan,
                    'id_barang' => $item['id_barang'],
                    'jumlah_barang' => $item['jumlah_barang'],
                    'harga_beli' => $item['harga_beli'],
                    'harga_jual' => $item['harga_jual'],
                    'diskon_tipe' => $item['diskon_tipe'] ?? 'nominal',
                    'diskon_nilai' => $item['diskon_nilai'] ?? 0,
                    'diskon_nominal' => $item['diskon_nominal'] ?? 0,
                    'subtotal' => $item['subtotal'],
                ]);

                $barang->decrement('stok', $item['jumlah_barang']);
            }
        });

        ActivityLogger::log('create', 'Penjualan', 'Transaksi penjualan baru disimpan.');

        return back()->with([
            'success' => 'Transaksi berhasil disimpan.',
            'print_id' => $penjualan->id_penjualan,
        ]);
    }

    public function lunasi(Penjualan $penjualan): RedirectResponse
    {
        if ($penjualan->status_pembayaran !== 'hutang') {
            return back()->with('error', 'Transaksi ini bukan hutang.');
        }

        $penjualan->update([
            'total_bayar' => $penjualan->total_faktur,
            'kembalian' => 0,
            'status_pembayaran' => 'sudah bayar',
        ]);

        ActivityLogger::log('update', 'Penjualan', "Melunasi hutang transaksi ID: {$penjualan->id_penjualan}");

        return back()->with('success', 'Hutang berhasil dilunasi.');
    }

    public function show(Penjualan $penjualan): Response
    {
        $penjualan->load(['user', 'pelanggan', 'detail.barang', 'sekolah']);

        return Inertia::render('pos/struk', ['penjualan' => $penjualan]);
    }

    public function destroy(Penjualan $penjualan): RedirectResponse
    {
        $idPenjualan = $penjualan->id_penjualan;
        DB::transaction(function () use ($penjualan) {
            foreach ($penjualan->detail as $item) {
                Barang::where('id_barang', $item->id_barang)->increment('stok', $item->jumlah_barang);
            }
            $penjualan->delete();
        });
        ActivityLogger::log('delete', 'Penjualan', "Membatalkan transaksi penjualan ID: {$idPenjualan}");

        return back()->with('success', 'Transaksi berhasil dibatalkan.');
    }
}
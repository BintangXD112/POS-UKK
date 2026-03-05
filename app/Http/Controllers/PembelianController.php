<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\DetailPembelian;
use App\Models\Pembelian;
use App\Models\Supplier;
use App\Services\ActivityLogger;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PembelianController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $sekolahId = $user->id_sekolah;

        $pembelian = Pembelian::with(['supplier', 'user'])
            ->when($sekolahId, fn ($q) => $q->where('id_sekolah', $sekolahId))
            ->orderBy('id_pembelian')
            ->get();

        $suppliers = Supplier::when($sekolahId, fn ($q) => $q->where('id_sekolah', $sekolahId))
            ->orderBy('nama')->get();
        $barang = Barang::when($sekolahId, fn ($q) => $q->where('id_sekolah', $sekolahId))
            ->where('is_active', 1)->orderBy('nama')->get();

        return Inertia::render('pembelian/index', [
            'pembelian' => $pembelian,
            'suppliers' => $suppliers,
            'barang' => $barang,
        ]);
    }

    public function show(Pembelian $pembelian): Response
    {
        $pembelian->load(['supplier', 'user', 'detail.barang']);

        return Inertia::render('pembelian/show', ['pembelian' => $pembelian]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_supplier' => 'required|exists:tb_supplier,id_supplier',
            'nomor_faktur' => 'required|string|max:50',
            'tanggal_faktur' => 'required|date',
            'jenis_transaksi' => 'required|in:tunai,kredit',
            'cara_bayar' => 'nullable|string|max:50',
            'note' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id_barang' => 'required|exists:tb_barang,id_barang',
            'items.*.jumlah' => 'required|integer|min:1',
            'items.*.harga_beli' => 'required|numeric|min:0',
            'items.*.satuan' => 'required|string|max:20',
        ]);

        $user = $request->user();
        $sekolahId = $user->id_sekolah;

        try {
            DB::transaction(function () use ($validated, $user, $sekolahId) {
                $total = 0;
                foreach ($validated['items'] as $item) {
                    $total += $item['jumlah'] * $item['harga_beli'];
                }

                $pembelian = Pembelian::create([
                    'id_sekolah' => $sekolahId,
                    'id_supplier' => $validated['id_supplier'],
                    'id_user' => $user->id_user,
                    'nomor_faktur' => $validated['nomor_faktur'],
                    'tanggal_faktur' => $validated['tanggal_faktur'],
                    'total_bayar' => $total,
                    'status_pembelian' => 'selesai',
                    'jenis_transaksi' => $validated['jenis_transaksi'],
                    'cara_bayar' => $validated['cara_bayar'] ?? null,
                    'note' => $validated['note'] ?? null,
                    'created_by' => $user->id_user,
                ]);

                foreach ($validated['items'] as $item) {
                    DetailPembelian::create([
                        'id_pembelian' => $pembelian->id_pembelian,
                        'id_barang' => $item['id_barang'],
                        'satuan' => $item['satuan'],
                        'jumlah' => $item['jumlah'],
                        'harga_beli' => $item['harga_beli'],
                        'subtotal' => $item['jumlah'] * $item['harga_beli'],
                    ]);

                    Barang::where('id_barang', $item['id_barang'])->increment('stok', $item['jumlah']);
                }
            });
        } catch (UniqueConstraintViolationException) {
            return back()
                ->withErrors(['nomor_faktur' => 'Nomor faktur "'.$validated['nomor_faktur'].'" sudah digunakan. Gunakan nomor faktur yang berbeda.'])
                ->withInput();
        }

        ActivityLogger::log('create', 'Pembelian', "Menambah pembelian faktur: {$validated['nomor_faktur']}");

        return back()->with('success', 'Pembelian berhasil disimpan dan stok telah diperbarui.');
    }

    public function destroy(Pembelian $pembelian): RedirectResponse
    {
        $faktur = $pembelian->nomor_faktur;
        DB::transaction(function () use ($pembelian) {
            foreach ($pembelian->detail as $item) {
                Barang::where('id_barang', $item->id_barang)->decrement('stok', $item->jumlah);
            }
            $pembelian->delete();
        });
        ActivityLogger::log('delete', 'Pembelian', "Menghapus pembelian faktur: {$faktur}");

        return back()->with('success', 'Pembelian berhasil dihapus.');
    }
}

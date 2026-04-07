<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Kategori;
use App\Models\Pelanggan;
use App\Models\Pembelian;
use App\Models\Penjualan;
use App\Models\Sekolah;
use App\Models\Supplier;
use App\Models\TbUser;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RestoreDataController extends Controller
{
    private array $supportedModels = [
        'barang'    => Barang::class,
        'kategori'  => Kategori::class,
        'pelanggan' => Pelanggan::class,
        'supplier'  => Supplier::class,
        'pembelian' => Pembelian::class,
        'penjualan' => Penjualan::class,
        'user'      => TbUser::class,
    ];

    public function index(Request $request): Response
    {
        $user         = $request->user();
        $isSuperAdmin = $user->isSuperAdmin();

        // Super admin bisa filter per sekolah, admin hanya melihat data sekolahnya sendiri
        $sekolahId = $isSuperAdmin
            ? ($request->integer('id_sekolah') ?: null)
            : $user->id_sekolah;

        $type = $request->query('type', 'barang');
        
        if (!array_key_exists($type, $this->supportedModels)) {
            $type = 'barang';
        }

        $modelClass = $this->supportedModels[$type];

        // Fetch data
        $query = $modelClass::onlyTrashed();

        if ($sekolahId) {
            if ($type === 'kategori' || $type === 'pelanggan') {
                $query->whereHas('kelompok', function ($q) use ($sekolahId) {
                    $q->where('id_sekolah', $sekolahId);
                });
            } else {
                $query->where('id_sekolah', $sekolahId);
            }
        }

        $deletedRecords = $query->orderBy('deleted_at', 'desc')->get();

        // Map data to standardize the output format for frontend
        $mappedData = $deletedRecords->map(function ($item) use ($type) {
            $data = [
                'id'         => $item->getKey(),
                'deleted_at' => $item->deleted_at?->format('Y-m-d H:i:s'),
                'raw'        => $item,
            ];

            // Setup identifier based on model type
            switch ($type) {
                case 'barang':
                    $data['identifier'] = $item->nama . ' (Barcode: ' . $item->barcode . ')';
                    break;
                case 'kategori':
                    $data['identifier'] = $item->nama;
                    break;
                case 'pelanggan':
                    $data['identifier'] = $item->nama_pelanggan;
                    break;
                case 'supplier':
                    $data['identifier'] = $item->nama;
                    break;
                case 'pembelian':
                    $data['identifier'] = 'Nota: ' . $item->nomor_faktur;
                    break;
                case 'penjualan':
                    $data['identifier'] = 'Nota ID: ' . $item->id_penjualan;
                    break;
                case 'user':
                    $data['identifier'] = $item->nama_lengkap . ' (' . $item->username . ')';
                    break;
            }

            return $data;
        });

        return Inertia::render('restore-data/index', [
            'deletedRecords'     => $mappedData,
            'currentType'        => $type,
            'supportedTypes'     => array_keys($this->supportedModels),
            'isSuperAdmin'       => $isSuperAdmin,
            'sekolahList'        => $isSuperAdmin ? Sekolah::orderBy('nama_sekolah')->get(['id_sekolah', 'nama_sekolah']) : [],
            'selectedSekolahId'  => $sekolahId,
        ]);
    }

    public function restore(Request $request, string $type, int|string $id): RedirectResponse
    {
        if (!array_key_exists($type, $this->supportedModels)) {
            return back()->with('error', 'Tipe data tidak valid.');
        }

        $modelClass = $this->supportedModels[$type];
        
        $item = $modelClass::onlyTrashed()->find($id);

        if (!$item) {
            return back()->with('error', 'Data tidak ditemukan atau belum dihapus.');
        }

        $user = $request->user();
        
        $itemSekolahId = $item->id_sekolah;
        if ($type === 'kategori' || $type === 'pelanggan') {
            $itemSekolahId = $item->kelompok->id_sekolah ?? null;
        }

        if (!$user->isSuperAdmin() && $itemSekolahId !== $user->id_sekolah) {
            return back()->with('error', 'Akses ditolak.');
        }

        $item->restore();

        // Update soft delete flags (is_delete) if the table relies on it. Laravel restore just unsets deleted_at.
        if (in_array($type, ['kategori', 'pelanggan', 'supplier', 'barang', 'pembelian', 'penjualan'])) {
            $item->is_delete = 0;
            $item->save();
        }

        ActivityLogger::log('update', 'Restore Data', "Mengembalikan data {$type} dengan ID {$id}");

        return back()->with('success', 'Data berhasil dikembalikan.');
    }

    public function forceDelete(Request $request, string $type, int|string $id): RedirectResponse
    {
        if (!array_key_exists($type, $this->supportedModels)) {
            return back()->with('error', 'Tipe data tidak valid.');
        }

        $modelClass = $this->supportedModels[$type];
        
        $item = $modelClass::onlyTrashed()->find($id);

        if (!$item) {
            return back()->with('error', 'Data tidak ditemukan atau belum dihapus.');
        }

        $user = $request->user();
        
        $itemSekolahId = $item->id_sekolah;
        if ($type === 'kategori' || $type === 'pelanggan') {
            $itemSekolahId = $item->kelompok->id_sekolah ?? null;
        }

        if (!$user->isSuperAdmin() && $itemSekolahId !== $user->id_sekolah) {
            return back()->with('error', 'Akses ditolak.');
        }

        // Hapus file icon/gambar jika model adalah barang
        if ($type === 'barang' && $item->icon && str_starts_with($item->icon, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $item->icon);
            \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
        }

        $item->forceDelete();

        ActivityLogger::log('delete', 'Restore Data', "Menghapus permanen data {$type} dengan ID {$id}");

        return back()->with('success', 'Data berhasil dihapus secara permanen.');
    }
}

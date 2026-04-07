<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use App\Models\KelompokKategori;
use App\Models\Sekolah;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KategoriController extends Controller
{
    public function index(Request $request): Response
    {
        $user         = $request->user();
        $isSuperAdmin = $user->role?->nama_role === 'super admin';

        $sekolahId = $isSuperAdmin
            ? ($request->integer('id_sekolah') ?: null)
            : $user->id_sekolah;

        $query = KelompokKategori::with(['kategori' => fn ($q) => $q->orderBy('nama')])
            ->orderBy('nama_kelompok');
        if ($sekolahId) {
            $query->where('id_sekolah', $sekolahId);
        }

        return Inertia::render('kategori/index', [
            'kelompok'           => $query->get(),
            'isReadOnly'         => $isSuperAdmin,
            'sekolahList'        => $isSuperAdmin ? Sekolah::orderBy('nama_sekolah')->get(['id_sekolah', 'nama_sekolah']) : [],
            'selectedSekolahId'  => $sekolahId,
        ]);
    }

    public function storeKelompok(Request $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'nama_kelompok' => 'required|string|max:100',
            'id_sekolah' => $user->isSuperAdmin()
                ? 'required|exists:tb_sekolah,id_sekolah'
                : 'nullable',
        ]);
        $validated['id_sekolah'] = $user->isSuperAdmin()
            ? $validated['id_sekolah']
            : $user->id_sekolah;
        $validated['created_by'] = $user->id_user;

        KelompokKategori::create($validated);
        ActivityLogger::log('create', 'Kategori', "Menambah kelompok kategori: {$validated['nama_kelompok']}");

        return back()->with('success', 'Kelompok kategori berhasil ditambahkan.');
    }

    public function updateKelompok(Request $request, KelompokKategori $kelompok): RedirectResponse
    {
        $validated = $request->validate(['nama_kelompok' => 'required|string|max:100']);
        $kelompok->update($validated);
        ActivityLogger::log('update', 'Kategori', "Mengubah kelompok kategori: {$kelompok->nama_kelompok}");

        return back()->with('success', 'Kelompok kategori berhasil diperbarui.');
    }

    public function destroyKelompok(KelompokKategori $kelompok): RedirectResponse
    {
        if ($kelompok->kategori()->exists()) {
            return back()->with('error', 'Kelompok kategori tidak dapat dihapus karena masih memiliki data kategori aktif di dalamnya.');
        }

        // Jika hanya ada kategori yang sudah di-soft-delete, coba hapus permanen
        $trashed = $kelompok->kategori()->withTrashed()->get();
        if ($trashed->isNotEmpty()) {
            try {
                foreach ($trashed as $k) {
                    $k->forceDelete();
                }
            } catch (\Exception $e) {
                return back()->with('error', 'Kelompok kategori tidak dapat dihapus karena riwayat kategorinya masih digunakan oleh data Barang.');
            }
        }
        
        $nama = $kelompok->nama_kelompok;
        $kelompok->delete();
        ActivityLogger::log('delete', 'Kategori', "Menghapus kelompok kategori: {$nama}");

        return back()->with('success', 'Kelompok kategori berhasil dihapus.');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_kelompok' => 'required|exists:tb_kelompok_kategori,id_kelompok',
            'nama' => 'required|string|max:100',
        ]);
        $validated['created_by'] = $request->user()->id_user;

        Kategori::create($validated);
        ActivityLogger::log('create', 'Kategori', "Menambah kategori: {$validated['nama']}");

        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, Kategori $kategori): RedirectResponse
    {
        $validated = $request->validate([
            'id_kelompok' => 'required|exists:tb_kelompok_kategori,id_kelompok',
            'nama' => 'required|string|max:100',
        ]);
        $validated['updated_by'] = $request->user()->id_user;
        $kategori->update($validated);
        ActivityLogger::log('update', 'Kategori', "Mengubah kategori: {$kategori->nama}");

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Kategori $kategori): RedirectResponse
    {
        $nama = $kategori->nama;
        $kategori->delete();
        ActivityLogger::log('delete', 'Kategori', "Menghapus kategori: {$nama}");

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}

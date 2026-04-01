<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Kategori;
use App\Models\KelompokKategori;
use App\Models\Sekolah;
use App\Models\Supplier;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BarangController extends Controller
{
    public function index(Request $request): Response
    {
        $user         = $request->user();
        $isSuperAdmin = $user->role?->nama_role === 'super admin';

        // Super admin bisa filter per sekolah, admin hanya lihat sekolahnya
        $sekolahId = $isSuperAdmin
            ? ($request->integer('id_sekolah') ?: null)   // null = semua sekolah
            : $user->id_sekolah;

        $barang = Barang::with(['kategori.kelompok', 'supplier'])
            ->when($sekolahId, fn ($q) => $q->where('id_sekolah', $sekolahId))
            ->orderBy('nama')
            ->get();

        $kategori = Kategori::whereHas(
            'kelompok',
            fn ($q) => $sekolahId ? $q->where('id_sekolah', $sekolahId) : $q
        )->with('kelompok')->orderBy('nama')->get();

        $kelompok = KelompokKategori::when($sekolahId, fn ($q) => $q->where('id_sekolah', $sekolahId))
            ->orderBy('nama_kelompok')->get();

        $suppliers = Supplier::when($sekolahId, fn ($q) => $q->where('id_sekolah', $sekolahId))
            ->orderBy('nama')->get();

        return Inertia::render('barang/index', [
            'barang'             => $barang,
            'kategori'           => $kategori,
            'kelompok'           => $kelompok,
            'suppliers'          => $suppliers,
            'isReadOnly'         => $isSuperAdmin,
            'sekolahList'        => $isSuperAdmin ? Sekolah::orderBy('nama_sekolah')->get(['id_sekolah', 'nama_sekolah']) : [],
            'selectedSekolahId'  => $sekolahId,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'barcode'               => 'required|string|max:50',
            'nama'                  => 'required|string|max:150',
            'icon'                  => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'id_kategori'           => 'required|exists:tb_kategori,id_kategori',
            'id_kelompok_kategori'  => 'required|exists:tb_kelompok_kategori,id_kelompok',
            'id_supplier'           => 'required|exists:tb_supplier,id_supplier',
            'satuan'                => 'required|string|max:20',
            'harga_beli'            => 'required|numeric|min:0',
            'harga_jual'            => 'required|numeric|min:0',
            'stok'                  => 'required|integer|min:0',
            'id_sekolah'            => $user->isSuperAdmin()
                ? 'required|exists:tb_sekolah,id_sekolah'
                : 'nullable',
        ]);

        // Handle image upload
        if ($request->hasFile('icon')) {
            $path = $request->file('icon')->store('barang', 'public');
            $validated['icon'] = Storage::url($path);
        } else {
            // Set default placeholder if no image uploaded
            $validated['icon'] = 'https://picsum.photos/seed/' . rand(1, 100) . '/200/200';
        }

        $validated['id_sekolah'] = $user->isSuperAdmin()
            ? $validated['id_sekolah']
            : $user->id_sekolah;
        $validated['created_by'] = $user->id_user;
        $validated['is_active']  = 1;

        Barang::create($validated);
        ActivityLogger::log('create', 'Barang', "Menambah barang: {$validated['nama']}");

        return back()->with('success', 'Barang berhasil ditambahkan.');
    }

    public function update(Request $request, Barang $barang): RedirectResponse
    {
        $validated = $request->validate([
            'barcode'               => 'required|string|max:50',
            'nama'                  => 'required|string|max:150',
            'icon'                  => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'id_kategori'           => 'required|exists:tb_kategori,id_kategori',
            'id_kelompok_kategori'  => 'required|exists:tb_kelompok_kategori,id_kelompok',
            'id_supplier'           => 'required|exists:tb_supplier,id_supplier',
            'satuan'                => 'required|string|max:20',
            'harga_beli'            => 'required|numeric|min:0',
            'harga_jual'            => 'required|numeric|min:0',
            'stok'                  => 'required|integer|min:0',
            'is_active'             => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('icon')) {
            // Delete old image if it's a stored file (not a placeholder URL)
            if ($barang->icon && str_starts_with($barang->icon, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $barang->icon);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('icon')->store('barang', 'public');
            $validated['icon'] = Storage::url($path);
        } else {
            // Keep existing icon if no new file uploaded
            unset($validated['icon']);
        }

        $validated['updated_by'] = $request->user()->id_user;
        $barang->update($validated);
        ActivityLogger::log('update', 'Barang', "Mengubah barang: {$barang->nama}");

        return back()->with('success', 'Barang berhasil diperbarui.');
    }

    public function destroy(Barang $barang): RedirectResponse
    {
        // Delete stored image if applicable
        if ($barang->icon && str_starts_with($barang->icon, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $barang->icon);
            Storage::disk('public')->delete($oldPath);
        }

        $nama = $barang->nama;
        $barang->delete();
        ActivityLogger::log('delete', 'Barang', "Menghapus barang: {$nama}");

        return back()->with('success', 'Barang berhasil dihapus.');
    }
}

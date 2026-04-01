<?php

namespace App\Http\Controllers;

use App\Models\Sekolah;
use App\Models\Supplier;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function index(Request $request): Response
    {
        $user         = $request->user();
        $isSuperAdmin = $user->role?->nama_role === 'super admin';

        $sekolahId = $isSuperAdmin
            ? ($request->integer('id_sekolah') ?: null)
            : $user->id_sekolah;

        $query = Supplier::orderBy('nama');
        if ($sekolahId) {
            $query->where('id_sekolah', $sekolahId);
        }

        return Inertia::render('supplier/index', [
            'suppliers'          => $query->get(),
            'isReadOnly'         => $isSuperAdmin,
            'sekolahList'        => $isSuperAdmin ? Sekolah::orderBy('nama_sekolah')->get(['id_sekolah', 'nama_sekolah']) : [],
            'selectedSekolahId'  => $sekolahId,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'no_telepon' => 'nullable|string|max:20',
            'alamat_supplier' => 'nullable|string',
            'id_sekolah' => $user->isSuperAdmin()
                ? 'required|exists:tb_sekolah,id_sekolah'
                : 'nullable',
        ]);

        $validated['id_sekolah'] = $user->isSuperAdmin()
            ? $validated['id_sekolah']
            : $user->id_sekolah;
        $validated['created_by'] = $user->id_user;

        Supplier::create($validated);
        ActivityLogger::log('create', 'Supplier', "Menambah supplier: {$validated['nama']}");

        return back()->with('success', 'Supplier berhasil ditambahkan.');
    }

    public function update(Request $request, Supplier $supplier): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'no_telepon' => 'nullable|string|max:20',
            'alamat_supplier' => 'nullable|string',
        ]);
        $supplier->update($validated);
        ActivityLogger::log('update', 'Supplier', "Mengubah supplier: {$supplier->nama}");

        return back()->with('success', 'Supplier berhasil diperbarui.');
    }

    public function destroy(Supplier $supplier): RedirectResponse
    {
        $nama = $supplier->nama;
        $supplier->delete();
        ActivityLogger::log('delete', 'Supplier', "Menghapus supplier: {$nama}");

        return back()->with('success', 'Supplier berhasil dihapus.');
    }
}

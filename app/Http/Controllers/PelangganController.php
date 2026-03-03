<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use App\Models\KelompokPelanggan;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PelangganController extends Controller
{
    public function index(Request $request): Response
    {
        $user      = $request->user();
        $sekolahId = $user->id_sekolah;

        $query = KelompokPelanggan::with(['pelanggan' => fn ($q) => $q->orderBy('nama_pelanggan')])
            ->orderBy('nama_kelompok');
        if ($sekolahId) {
            $query->where('id_sekolah', $sekolahId);
        }

        return Inertia::render('pelanggan/index', ['kelompok' => $query->get()]);
    }

    public function storeKelompok(Request $request): RedirectResponse
    {
        $user      = $request->user();
        $validated = $request->validate([
            'nama_kelompok' => 'required|string|max:50',
            'id_sekolah'    => $user->isSuperAdmin()
                ? 'required|exists:tb_sekolah,id_sekolah'
                : 'nullable',
        ]);
        $validated['id_sekolah'] = $user->isSuperAdmin()
            ? $validated['id_sekolah']
            : $user->id_sekolah;
        KelompokPelanggan::create($validated);
        ActivityLogger::log('create', 'Pelanggan', "Menambah kelompok pelanggan: {$validated['nama_kelompok']}");
        return back()->with('success', 'Kelompok pelanggan berhasil ditambahkan.');
    }

    public function updateKelompok(Request $request, KelompokPelanggan $kelompok): RedirectResponse
    {
        $validated = $request->validate(['nama_kelompok' => 'required|string|max:50']);
        $kelompok->update($validated);
        ActivityLogger::log('update', 'Pelanggan', "Mengubah kelompok pelanggan: {$kelompok->nama_kelompok}");
        return back()->with('success', 'Kelompok pelanggan berhasil diperbarui.');
    }

    public function destroyKelompok(KelompokPelanggan $kelompok): RedirectResponse
    {
        $nama = $kelompok->nama_kelompok;
        $kelompok->pelanggan()->each(fn ($p) => $p->delete());
        $kelompok->delete();
        ActivityLogger::log('delete', 'Pelanggan', "Menghapus kelompok pelanggan: {$nama}");
        return back()->with('success', 'Kelompok pelanggan berhasil dihapus.');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_kelompok_pelanggan' => 'required|exists:tb_kelompok_pelanggan,id_kelompok_pelanggan',
            'nama_pelanggan'        => 'required|string|max:150',
            'telepon'               => 'nullable|string|max:20',
            'alamat'                => 'nullable|string',
        ]);
        $validated['created_by'] = $request->user()->id_user;
        Pelanggan::create($validated);
        ActivityLogger::log('create', 'Pelanggan', "Menambah pelanggan: {$validated['nama_pelanggan']}");
        return back()->with('success', 'Pelanggan berhasil ditambahkan.');
    }

    public function update(Request $request, Pelanggan $pelanggan): RedirectResponse
    {
        $validated = $request->validate([
            'id_kelompok_pelanggan' => 'required|exists:tb_kelompok_pelanggan,id_kelompok_pelanggan',
            'nama_pelanggan'        => 'required|string|max:150',
            'telepon'               => 'nullable|string|max:20',
            'alamat'                => 'nullable|string',
        ]);
        $validated['updated_by'] = $request->user()->id_user;
        $pelanggan->update($validated);
        ActivityLogger::log('update', 'Pelanggan', "Mengubah pelanggan: {$pelanggan->nama_pelanggan}");
        return back()->with('success', 'Pelanggan berhasil diperbarui.');
    }

    public function destroy(Pelanggan $pelanggan): RedirectResponse
    {
        $nama = $pelanggan->nama_pelanggan;
        $pelanggan->delete();
        ActivityLogger::log('delete', 'Pelanggan', "Menghapus pelanggan: {$nama}");
        return back()->with('success', 'Pelanggan berhasil dihapus.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Sekolah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SekolahController extends Controller
{
    public function index(): Response
    {
        $sekolah = Sekolah::orderBy('nama_sekolah')->get();

        return Inertia::render('sekolah/index', ['sekolah' => $sekolah]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode_sekolah' => 'required|string|max:20|unique:tb_sekolah,kode_sekolah',
            'nama_sekolah' => 'required|string|max:150',
            'alamat_sekolah' => 'nullable|string',
            'website' => 'nullable|string|max:200',
            'is_active' => 'boolean',
        ]);

        Sekolah::create($validated);

        return back()->with('success', 'Sekolah berhasil ditambahkan.');
    }

    public function update(Request $request, Sekolah $sekolah): RedirectResponse
    {
        $validated = $request->validate([
            'kode_sekolah' => 'required|string|max:20|unique:tb_sekolah,kode_sekolah,'.$sekolah->id_sekolah.',id_sekolah',
            'nama_sekolah' => 'required|string|max:150',
            'alamat_sekolah' => 'nullable|string',
            'website' => 'nullable|string|max:200',
            'is_active' => 'boolean',
        ]);

        $sekolah->update($validated);

        return back()->with('success', 'Data sekolah berhasil diperbarui.');
    }

    public function destroy(Sekolah $sekolah): RedirectResponse
    {
        // Sekolah tidak menggunakan soft delete — data tenant penting, disable saja
        $sekolah->update(['is_active' => 0]);

        return back()->with('success', 'Sekolah berhasil dinonaktifkan.');
    }
}

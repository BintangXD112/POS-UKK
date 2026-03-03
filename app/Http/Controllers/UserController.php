<?php

namespace App\Http\Controllers;

use App\Models\TbUser;
use App\Models\Role;
use App\Models\Sekolah;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $authUser = $request->user();
        $query    = TbUser::with(['role', 'sekolah']);

        if ($authUser->isAdmin()) {
            // Admin hanya bisa lihat user di sekolahnya sendiri
            $query->where('id_sekolah', $authUser->id_sekolah);
        }

        $users   = $query->orderBy('nama_lengkap')->get();

        // Admin tidak bisa lihat / memilih role super admin
        $roles = $authUser->isAdmin()
            ? Role::where('nama_role', '!=', 'super admin')->get()
            : Role::all();

        $sekolah = Sekolah::where('is_active', 1)->get();

        return Inertia::render('users/index', [
            'users'    => $users,
            'roles'    => $roles,
            'sekolah'  => $sekolah,
            'authUser' => [
                'id_sekolah' => $authUser->id_sekolah,
                'role'       => $authUser->role?->nama_role,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $authUser = $request->user();

        $validated = $request->validate([
            'id_sekolah'   => 'nullable|exists:tb_sekolah,id_sekolah',
            'id_role'      => 'required|exists:roles,id_role',
            'username'     => 'required|string|max:50|unique:tb_user,username',
            'password'     => 'required|string|min:6',
            'nama_lengkap' => 'required|string|max:100',
            'is_active'    => 'boolean',
        ]);

        // Proteksi tambahan di backend
        if ($authUser->isAdmin()) {
            // Admin selalu dicopy sekolahnya sendiri (ignore input id_sekolah)
            $validated['id_sekolah'] = $authUser->id_sekolah;

            // Admin tidak boleh membuat user dengan role super admin
            $targetRole = Role::find($validated['id_role']);
            if ($targetRole && $targetRole->nama_role === 'super admin') {
                return back()->withErrors(['id_role' => 'Anda tidak memiliki izin untuk menetapkan role Super Admin.']);
            }
        }

        $validated['password']   = Hash::make($validated['password']);
        $validated['created_by'] = $authUser->id_user;

        TbUser::create($validated);
        ActivityLogger::log('create', 'User', "Menambah user: {$validated['nama_lengkap']} ({$validated['username']})");
        return back()->with('success', 'User berhasil ditambahkan.');
    }

    public function update(Request $request, TbUser $user): RedirectResponse
    {
        $authUser = $request->user();

        // Admin tidak boleh edit user yang bukan milik sekolahnya
        if ($authUser->isAdmin() && $user->id_sekolah !== $authUser->id_sekolah) {
            abort(403, 'Anda tidak memiliki akses ke user ini.');
        }

        $validated = $request->validate([
            'id_sekolah'   => 'nullable|exists:tb_sekolah,id_sekolah',
            'id_role'      => 'required|exists:roles,id_role',
            'username'     => 'required|string|max:50|unique:tb_user,username,' . $user->id_user . ',id_user',
            'nama_lengkap' => 'required|string|max:100',
            'is_active'    => 'boolean',
            'password'     => 'nullable|string|min:6',
        ]);

        // Proteksi backend untuk admin
        if ($authUser->isAdmin()) {
            $validated['id_sekolah'] = $authUser->id_sekolah;

            $targetRole = Role::find($validated['id_role']);
            if ($targetRole && $targetRole->nama_role === 'super admin') {
                return back()->withErrors(['id_role' => 'Anda tidak memiliki izin untuk menetapkan role Super Admin.']);
            }
        }

        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $validated['updated_by'] = $authUser->id_user;
        $user->update($validated);
        ActivityLogger::log('update', 'User', "Mengubah user: {$user->nama_lengkap} ({$user->username})");
        return back()->with('success', 'Data user berhasil diperbarui.');
    }

    public function destroy(TbUser $user): RedirectResponse
    {
        $authUser = request()->user();

        // Admin tidak boleh hapus user dari sekolah lain
        if ($authUser->isAdmin() && $user->id_sekolah !== $authUser->id_sekolah) {
            abort(403, 'Anda tidak memiliki akses ke user ini.');
        }

        $nama = $user->nama_lengkap;
        $user->delete();
        ActivityLogger::log('delete', 'User', "Menghapus user: {$nama}");
        return back()->with('success', 'User berhasil dihapus.');
    }
}

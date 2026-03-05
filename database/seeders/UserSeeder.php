<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tb_user')->insert([
            // Super Admin — tidak terikat sekolah (id_sekolah = null)
            [
                'id_user' => 1,
                'id_sekolah' => null,
                'id_role' => 1,
                'username' => 'superadmin',
                'password' => Hash::make('admin123'),
                'nama_lengkap' => 'Super Admin',
                'is_active' => 1,
                'created_at' => '2026-02-26 06:00:00',
                'created_by' => null,
                'updated_at' => null,
                'updated_by' => null,
                'deleted_at' => null,
                'deleted_by' => null,
            ],
            // Admin Sekolah 1
            [
                'id_user' => 2,
                'id_sekolah' => 1,
                'id_role' => 2,
                'username' => 'admin.smknusa',
                'password' => Hash::make('admin123'),
                'nama_lengkap' => 'Admin SMK Nusa Harapan',
                'is_active' => 1,
                'created_at' => '2026-02-26 06:10:00',
                'created_by' => 1,
                'updated_at' => null,
                'updated_by' => null,
                'deleted_at' => null,
                'deleted_by' => null,
            ],
            // Admin Sekolah 2
            [
                'id_user' => 3,
                'id_sekolah' => 2,
                'id_role' => 2,
                'username' => 'admin.smkn2',
                'password' => Hash::make('admin123'),
                'nama_lengkap' => 'Admin SMKN 2 Tasikmalaya',
                'is_active' => 1,
                'created_at' => '2026-02-26 06:15:00',
                'created_by' => 1,
                'updated_at' => null,
                'updated_by' => null,
                'deleted_at' => null,
                'deleted_by' => null,
            ],
            // Kasir Sekolah 1
            [
                'id_user' => 4,
                'id_sekolah' => 1,
                'id_role' => 3,
                'username' => 'kasir.nusa1',
                'password' => Hash::make('kasir123'),
                'nama_lengkap' => 'Kasir Utama Nusa Harapan',
                'is_active' => 1,
                'created_at' => '2026-02-26 06:20:00',
                'created_by' => 2,
                'updated_at' => null,
                'updated_by' => null,
                'deleted_at' => null,
                'deleted_by' => null,
            ],
            // Kasir Sekolah 2
            [
                'id_user' => 5,
                'id_sekolah' => 2,
                'id_role' => 3,
                'username' => 'kasir.smkn2',
                'password' => Hash::make('kasir123'),
                'nama_lengkap' => 'Kasir SMKN 2',
                'is_active' => 1,
                'created_at' => '2026-02-26 06:25:00',
                'created_by' => 3,
                'updated_at' => null,
                'updated_by' => null,
                'deleted_at' => null,
                'deleted_by' => null,
            ],
            // Kasir Sekolah 1 (cadangan)
            [
                'id_user' => 6,
                'id_sekolah' => 1,
                'id_role' => 3,
                'username' => 'kasir.nusa2',
                'password' => Hash::make('kasir123'),
                'nama_lengkap' => 'Kasir Cadangan Nusa',
                'is_active' => 0,
                'created_at' => '2026-02-26 06:30:00',
                'created_by' => 2,
                'updated_at' => null,
                'updated_by' => null,
                'deleted_at' => null,
                'deleted_by' => null,
            ],
        ]);
    }
}

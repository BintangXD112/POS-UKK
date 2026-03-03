<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->insert([
            ['id_role' => 1, 'nama_role' => 'super admin'],
            ['id_role' => 2, 'nama_role' => 'admin'],
            ['id_role' => 3, 'nama_role' => 'kasir'],
        ]);
    }
}

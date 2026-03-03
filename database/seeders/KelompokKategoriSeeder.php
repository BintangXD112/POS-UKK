<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KelompokKategoriSeeder extends Seeder
{
    public function run(): void
    {
        $kelompok = [
            ['id_sekolah' => 1, 'nama_kelompok' => 'Makanan & Minuman', 'created_by' => 2],
            ['id_sekolah' => 1, 'nama_kelompok' => 'Alat Tulis',        'created_by' => 2],
            ['id_sekolah' => 1, 'nama_kelompok' => 'Elektronik',        'created_by' => 2],
            ['id_sekolah' => 1, 'nama_kelompok' => 'Perlengkapan',      'created_by' => 2],
            ['id_sekolah' => 1, 'nama_kelompok' => 'Pakaian & Seragam', 'created_by' => 2],
        ];

        foreach ($kelompok as $data) {
            DB::table('tb_kelompok_kategori')->insert($data);
        }
    }
}

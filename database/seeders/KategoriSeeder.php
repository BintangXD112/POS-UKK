<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KategoriSeeder extends Seeder
{
    public function run(): void
    {
        // id_kelompok 1 = Makanan & Minuman, 2 = Alat Tulis, 3 = Elektronik, 4 = Perlengkapan
        $kategori = [
            // Makanan & Minuman
            ['id_kelompok' => 1, 'nama' => 'Minuman Botol',    'created_by' => 1],
            ['id_kelompok' => 1, 'nama' => 'Minuman Sachet',   'created_by' => 1],
            ['id_kelompok' => 1, 'nama' => 'Makanan Ringan',   'created_by' => 1],
            ['id_kelompok' => 1, 'nama' => 'Makanan Berat',    'created_by' => 1],
            // Alat Tulis
            ['id_kelompok' => 2, 'nama' => 'Pena & Pensil',    'created_by' => 1],
            ['id_kelompok' => 2, 'nama' => 'Buku & Kertas',    'created_by' => 1],
            ['id_kelompok' => 2, 'nama' => 'Penghapus & Tip-X','created_by' => 1],
            // Elektronik
            ['id_kelompok' => 3, 'nama' => 'Aksesoris HP',     'created_by' => 1],
            ['id_kelompok' => 3, 'nama' => 'Kabel & Charger',  'created_by' => 1],
            // Perlengkapan
            ['id_kelompok' => 4, 'nama' => 'Kebersihan',       'created_by' => 1],
            ['id_kelompok' => 4, 'nama' => 'Lainnya',          'created_by' => 1],
        ];

        foreach ($kategori as $data) {
            DB::table('tb_kategori')->insert($data);
        }
    }
}

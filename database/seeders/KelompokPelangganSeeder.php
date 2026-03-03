<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KelompokPelangganSeeder extends Seeder
{
    public function run(): void
    {
        $kelompok = [
            ['id_sekolah' => 1, 'nama_kelompok' => 'Siswa'],
            ['id_sekolah' => 1, 'nama_kelompok' => 'Guru & Staff'],
            ['id_sekolah' => 1, 'nama_kelompok' => 'Umum'],
            ['id_sekolah' => 1, 'nama_kelompok' => 'Alumni'],
            ['id_sekolah' => 1, 'nama_kelompok' => 'Mitra'],
        ];

        foreach ($kelompok as $data) {
            DB::table('tb_kelompok_pelanggan')->insert($data);
        }
    }
}

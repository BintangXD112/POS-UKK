<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PelangganSeeder extends Seeder
{
    public function run(): void
    {
        // id_kelompok_pelanggan: 1=Siswa, 2=Guru & Staff, 3=Umum
        $pelanggan = [
            // Siswa
            ['id_kelompok_pelanggan' => 1, 'nama_pelanggan' => 'Ahmad Fauzi',       'telepon' => '081234567001', 'alamat' => 'Jl. Merdeka No.1',   'created_by' => 1],
            ['id_kelompok_pelanggan' => 1, 'nama_pelanggan' => 'Siti Rahmawati',    'telepon' => '081234567002', 'alamat' => 'Jl. Sudirman No.5',  'created_by' => 1],
            ['id_kelompok_pelanggan' => 1, 'nama_pelanggan' => 'Budi Santoso',      'telepon' => '081234567003', 'alamat' => 'Jl. Pahlawan No.12', 'created_by' => 1],
            ['id_kelompok_pelanggan' => 1, 'nama_pelanggan' => 'Dewi Lestari',      'telepon' => '081234567004', 'alamat' => 'Jl. Diponegoro No.3', 'created_by' => 1],
            ['id_kelompok_pelanggan' => 1, 'nama_pelanggan' => 'Rizky Prasetyo',    'telepon' => '081234567005', 'alamat' => null,                  'created_by' => 1],
            // Guru & Staff
            ['id_kelompok_pelanggan' => 2, 'nama_pelanggan' => 'Drs. Hendra W.',    'telepon' => '082345678001', 'alamat' => 'Jl. Guru No.10',      'created_by' => 1],
            ['id_kelompok_pelanggan' => 2, 'nama_pelanggan' => 'Ibu Ratna, S.Pd',   'telepon' => '082345678002', 'alamat' => 'Jl. Pendidikan No.7', 'created_by' => 1],
            // Umum
            ['id_kelompok_pelanggan' => 3, 'nama_pelanggan' => 'Pelanggan Umum 1',  'telepon' => null,           'alamat' => null,                  'created_by' => 1],
        ];

        foreach ($pelanggan as $data) {
            DB::table('tb_pelanggan')->insert($data);
        }
    }
}

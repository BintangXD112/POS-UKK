<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SekolahSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tb_sekolah')->insert([
            [
                'id_sekolah' => 1,
                'kode_sekolah' => 'KOPERASI-001',
                'nama_sekolah' => 'SMK Nusa Harapan',
                'alamat_sekolah' => 'Jl. Pendidikan No. 1, Tasikmalaya',
                'website' => 'smknusaharapan.sch.id',
                'is_active' => 1,
                'created_at' => '2026-02-11 06:24:15',
            ],
            [
                'id_sekolah' => 2,
                'kode_sekolah' => 'KOPERASI-002',
                'nama_sekolah' => 'SMKN 2 Kota Tasikmalaya',
                'alamat_sekolah' => 'Jl. Peta No. 22, Tasikmalaya',
                'website' => 'smkn2kotatasik.sch.id',
                'is_active' => 1,
                'created_at' => '2026-02-11 07:00:00',
            ],
            [
                'id_sekolah' => 3,
                'kode_sekolah' => 'KOPERASI-003',
                'nama_sekolah' => 'SMK Muhammadiyah 1',
                'alamat_sekolah' => 'Jl. Ahmad Yani No. 5, Bandung',
                'website' => null,
                'is_active' => 1,
                'created_at' => '2026-02-12 08:00:00',
            ],
            [
                'id_sekolah' => 4,
                'kode_sekolah' => 'KOPERASI-004',
                'nama_sekolah' => 'SMA Bina Bangsa',
                'alamat_sekolah' => 'Jl. Merdeka No. 10, Garut',
                'website' => 'smabinabangsa.sch.id',
                'is_active' => 1,
                'created_at' => '2026-02-13 09:00:00',
            ],
            [
                'id_sekolah' => 5,
                'kode_sekolah' => 'KOPERASI-005',
                'nama_sekolah' => 'SMK Teknologi Mandiri',
                'alamat_sekolah' => 'Jl. Industri No. 8, Ciamis',
                'website' => null,
                'is_active' => 0,
                'created_at' => '2026-02-14 10:00:00',
            ],
        ]);
    }
}

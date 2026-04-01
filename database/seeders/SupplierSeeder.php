<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            [
                'id_sekolah' => 1,
                'nama' => 'CV. Sumber Jaya',
                'no_telepon' => '0217654321',
                'alamat_supplier' => 'Jl. Industri No. 15, Jakarta',
                'created_by' => 2,
            ],
            [
                'id_sekolah' => 1,
                'nama' => 'PT. Maju Bersama',
                'no_telepon' => '02112345678',
                'alamat_supplier' => 'Jl. Raya Bogor No. 88, Bogor',
                'created_by' => 2,
            ],
            [
                'id_sekolah' => 1,
                'nama' => 'UD. Berkah Jaya',
                'no_telepon' => '085788991122',
                'alamat_supplier' => 'Jl. Pasar Baru No. 5, Bandung',
                'created_by' => 2,
            ],
            [
                'id_sekolah' => 1,
                'nama' => 'Toko Serba Ada',
                'no_telepon' => '087712345678',
                'alamat_supplier' => 'Jl. Pahlawan No. 22, Tasikmalaya',
                'created_by' => 2,
            ],
            [
                'id_sekolah' => 1,
                'nama' => 'UD. Mandiri Sejahtera',
                'no_telepon' => '082211334455',
                'alamat_supplier' => 'Jl. Raya Ciawi No. 3, Tasikmalaya',
                'created_by' => 2,
            ],
        ];

        foreach ($suppliers as $data) {
            DB::table('tb_supplier')->insert($data);
        }

        $faker = \Faker\Factory::create('id_ID');
        $autoSuppliers = [];
        
        for ($i = 0; $i < 45; $i++) {
            $autoSuppliers[] = [
                'id_sekolah' => 1,
                'nama' => $faker->company,
                'no_telepon' => $faker->phoneNumber,
                'alamat_supplier' => $faker->address,
                'created_by' => 2,
            ];
        }

        DB::table('tb_supplier')->insert($autoSuppliers);
    }
}

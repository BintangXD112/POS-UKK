<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // Referensi (tanpa dependency)
            RolesSeeder::class,
            SekolahSeeder::class,
            UserSeeder::class,

            // Kategori
            KelompokKategoriSeeder::class,
            KategoriSeeder::class,

            // Pelanggan
            KelompokPelangganSeeder::class,
            PelangganSeeder::class,

            // Supplier & Barang
            SupplierSeeder::class,
            BarangSeeder::class,

            // Transaksi
            PembelianSeeder::class,
            PenjualanSeeder::class,
        ]);
    }
}

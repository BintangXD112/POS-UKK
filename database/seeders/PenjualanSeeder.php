<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PenjualanSeeder extends Seeder
{
    public function run(): void
    {
        // Transaksi 1 — hari ini pagi, kasir (id_user=1), pelanggan Siswa
        $pj1 = DB::table('tb_penjualan')->insertGetId([
            'id_sekolah' => 1,
            'id_user' => 1,
            'id_pelanggan' => 1,
            'tanggal_penjualan' => Carbon::today()->setTime(8, 15),
            'total_faktur' => 25000,
            'total_bayar' => 30000,
            'kembalian' => 5000,
            'status_pembayaran' => 'sudah bayar',
            'jenis_transaksi' => 'tunai',
            'cara_bayar' => 'Cash',
            'note' => null,
            'created_by' => 1,
        ]);
        DB::table('tb_detail_penjualan')->insert([
            ['id_penjualan' => $pj1, 'id_barang' => 1, 'jumlah_barang' => 2, 'harga_beli' => 2500, 'harga_jual' => 4000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 8000],
            ['id_penjualan' => $pj1, 'id_barang' => 7, 'jumlah_barang' => 1, 'harga_beli' => 2800, 'harga_jual' => 4000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 4000],
            ['id_penjualan' => $pj1, 'id_barang' => 9, 'jumlah_barang' => 1, 'harga_beli' => 5000, 'harga_jual' => 8000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 8000],
            ['id_penjualan' => $pj1, 'id_barang' => 11, 'jumlah_barang' => 1, 'harga_beli' => 3500, 'harga_jual' => 6000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 6000],
        ]);

        // Transaksi 2 — hari ini siang, umum (tidak ada pelanggan)
        $pj2 = DB::table('tb_penjualan')->insertGetId([
            'id_sekolah' => 1,
            'id_user' => 1,
            'id_pelanggan' => null,
            'tanggal_penjualan' => Carbon::today()->setTime(11, 30),
            'total_faktur' => 33000,
            'total_bayar' => 33000,
            'kembalian' => 0,
            'status_pembayaran' => 'sudah bayar',
            'jenis_transaksi' => 'tunai',
            'cara_bayar' => 'QRIS',
            'note' => null,
            'created_by' => 1,
        ]);
        DB::table('tb_detail_penjualan')->insert([
            ['id_penjualan' => $pj2, 'id_barang' => 2,  'jumlah_barang' => 2, 'harga_beli' => 4000, 'harga_jual' => 6000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 12000],
            ['id_penjualan' => $pj2, 'id_barang' => 4,  'jumlah_barang' => 3, 'harga_beli' => 1000, 'harga_jual' => 2000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 6000],
            ['id_penjualan' => $pj2, 'id_barang' => 8,  'jumlah_barang' => 1, 'harga_beli' => 4000, 'harga_jual' => 6000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 6000],
            ['id_penjualan' => $pj2, 'id_barang' => 10, 'jumlah_barang' => 1, 'harga_beli' => 3000, 'harga_jual' => 5000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 5000],
            ['id_penjualan' => $pj2, 'id_barang' => 13, 'jumlah_barang' => 1, 'harga_beli' => 1500, 'harga_jual' => 3000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 3000],
            ['id_penjualan' => $pj2, 'id_barang' => 17, 'jumlah_barang' => 1, 'harga_beli' => 7000, 'harga_jual' => 12000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 12000],
        ]);

        // Transaksi 3 — kemarin, pelanggan Guru
        $pj3 = DB::table('tb_penjualan')->insertGetId([
            'id_sekolah' => 1,
            'id_user' => 1,
            'id_pelanggan' => 6,
            'tanggal_penjualan' => Carbon::yesterday()->setTime(14, 0),
            'total_faktur' => 60000,
            'total_bayar' => 60000,
            'kembalian' => 0,
            'status_pembayaran' => 'sudah bayar',
            'jenis_transaksi' => 'tunai',
            'cara_bayar' => 'Transfer',
            'note' => null,
            'created_by' => 1,
        ]);
        DB::table('tb_detail_penjualan')->insert([
            ['id_penjualan' => $pj3, 'id_barang' => 12, 'jumlah_barang' => 1, 'harga_beli' => 45000, 'harga_jual' => 60000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 60000],
        ]);

        // Transaksi 4 — 5 hari lalu, pelanggan Siswa
        $pj4 = DB::table('tb_penjualan')->insertGetId([
            'id_sekolah' => 1,
            'id_user' => 1,
            'id_pelanggan' => 2,
            'tanggal_penjualan' => Carbon::now()->subDays(5)->setTime(9, 45),
            'total_faktur' => 17000,
            'total_bayar' => 20000,
            'kembalian' => 3000,
            'status_pembayaran' => 'sudah bayar',
            'jenis_transaksi' => 'tunai',
            'cara_bayar' => 'Cash',
            'note' => null,
            'created_by' => 1,
        ]);
        DB::table('tb_detail_penjualan')->insert([
            ['id_penjualan' => $pj4, 'id_barang' => 3,  'jumlah_barang' => 1, 'harga_beli' => 6000, 'harga_jual' => 9000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 9000],
            ['id_penjualan' => $pj4, 'id_barang' => 5,  'jumlah_barang' => 1, 'harga_beli' => 3000, 'harga_jual' => 5000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 5000],
            ['id_penjualan' => $pj4, 'id_barang' => 13, 'jumlah_barang' => 1, 'harga_beli' => 1500, 'harga_jual' => 3000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 3000],
        ]);

        // Transaksi 5 — bulan lalu
        $pj5 = DB::table('tb_penjualan')->insertGetId([
            'id_sekolah' => 1,
            'id_user' => 1,
            'id_pelanggan' => null,
            'tanggal_penjualan' => Carbon::now()->subMonth()->startOfMonth()->addDays(5)->setTime(10, 0),
            'total_faktur' => 42000,
            'total_bayar' => 42000,
            'kembalian' => 0,
            'status_pembayaran' => 'sudah bayar',
            'jenis_transaksi' => 'tunai',
            'cara_bayar' => 'Cash',
            'note' => 'Pembelian banyak',
            'created_by' => 1,
        ]);
        DB::table('tb_detail_penjualan')->insert([
            ['id_penjualan' => $pj5, 'id_barang' => 6,  'jumlah_barang' => 3, 'harga_beli' => 6000, 'harga_jual' => 9000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 27000],
            ['id_penjualan' => $pj5, 'id_barang' => 11, 'jumlah_barang' => 2, 'harga_beli' => 3500, 'harga_jual' => 6000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 12000],
            ['id_penjualan' => $pj5, 'id_barang' => 13, 'jumlah_barang' => 1, 'harga_beli' => 1500, 'harga_jual' => 3000, 'diskon_tipe' => 'nominal', 'diskon_nilai' => 0, 'diskon_nominal' => 0, 'subtotal' => 3000],
        ]);

        // ==========================================
        // AUTO GENERATE BANYAK DATA TRANSAKSI
        // ==========================================
        $faker = \Faker\Factory::create('id_ID');

        for ($i = 0; $i < 150; $i++) {
            $totalFaktur = 0;
            $items = [];
            $numItems = rand(1, 4);

            $availableItems = range(1, 15);
            shuffle($availableItems);
            $selectedItems = array_slice($availableItems, 0, $numItems);

            foreach ($selectedItems as $idBarang) {
                $jumlah = rand(1, 3);
                $hargaBeli = rand(10, 30) * 100;
                $hargaJual = $hargaBeli + (rand(1, 10) * 100);
                $subtotal = $hargaJual * $jumlah;

                $items[] = [
                    'id_barang' => $idBarang,
                    'jumlah_barang' => $jumlah,
                    'harga_beli' => $hargaBeli,
                    'harga_jual' => $hargaJual,
                    'diskon_tipe' => 'nominal',
                    'diskon_nilai' => 0,
                    'diskon_nominal' => 0,
                    'subtotal' => $subtotal,
                ];
                $totalFaktur += $subtotal;
            }

            $idPenjualan = DB::table('tb_penjualan')->insertGetId([
                'id_sekolah' => rand(1, 2) === 1 ? 1 : 1, // Tetap dominan di sekolah 1
                'id_user' => rand(1, 3), // Kasir/Admin
                'id_pelanggan' => rand(1, 10) > 4 ? rand(1, 8) : null, // Ada yg umum, ada yg terdaftar
                'tanggal_penjualan' => Carbon::now()->subDays(rand(0, 45))->setTime(rand(7, 18), rand(0, 59)),
                'total_faktur' => $totalFaktur,
                'total_bayar' => $totalFaktur,
                'kembalian' => 0,
                'status_pembayaran' => 'sudah bayar',
                'jenis_transaksi' => 'tunai',
                'cara_bayar' => $faker->randomElement(['Cash', 'Cash', 'Transfer', 'QRIS']),
                'note' => $faker->optional(0.1)->sentence,
                'created_by' => 1,
            ]);

            foreach ($items as &$item) {
                $item['id_penjualan'] = $idPenjualan;
            }
            DB::table('tb_detail_penjualan')->insert($items);
        }
    }
}

<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PembelianSeeder extends Seeder
{
    public function run(): void
    {
        // Pembelian 1 — bulan lalu, supplier CV Sumber Jaya
        $p1 = DB::table('tb_pembelian')->insertGetId([
            'id_sekolah' => 1,
            'id_supplier' => 1,
            'id_user' => 4,
            'nomor_faktur' => 'PB-2026-001',
            'tanggal_faktur' => Carbon::now()->subMonth()->startOfMonth()->addDays(2),
            'total_bayar' => 750000,
            'status_pembelian' => 'selesai',
            'jenis_transaksi' => 'tunai',
            'cara_bayar' => 'Transfer',
            'note' => 'Pembelian minuman & makanan',
            'created_by' => 4,
        ]);
        DB::table('tb_detail_pembelian')->insert([
            ['id_pembelian' => $p1, 'id_barang' => 1, 'satuan' => 'botol',   'jumlah' => 100, 'harga_beli' => 2500, 'subtotal' => 250000],
            ['id_pembelian' => $p1, 'id_barang' => 2, 'satuan' => 'botol',   'jumlah' => 50,  'harga_beli' => 4000, 'subtotal' => 200000],
            ['id_pembelian' => $p1, 'id_barang' => 7, 'satuan' => 'bungkus', 'jumlah' => 100, 'harga_beli' => 2800, 'subtotal' => 280000],
            ['id_pembelian' => $p1, 'id_barang' => 16, 'satuan' => 'pcs',     'jumlah' => 20,  'harga_beli' => 1000, 'subtotal' => 20000],
        ]);

        // Pembelian 2 — minggu lalu, supplier PT Maju Bersama
        $p2 = DB::table('tb_pembelian')->insertGetId([
            'id_sekolah' => 1,
            'id_supplier' => 2,
            'id_user' => 4,
            'nomor_faktur' => 'PB-2026-002',
            'tanggal_faktur' => Carbon::now()->subDays(7),
            'total_bayar' => 615000,
            'status_pembelian' => 'selesai',
            'jenis_transaksi' => 'tunai',
            'cara_bayar' => 'Cash',
            'note' => null,
            'created_by' => 4,
        ]);
        DB::table('tb_detail_pembelian')->insert([
            ['id_pembelian' => $p2, 'id_barang' => 11, 'satuan' => 'buku',  'jumlah' => 100, 'harga_beli' => 3500,  'subtotal' => 350000],
            ['id_pembelian' => $p2, 'id_barang' => 5,  'satuan' => 'kotak', 'jumlah' => 50,  'harga_beli' => 3000,  'subtotal' => 150000],
            ['id_pembelian' => $p2, 'id_barang' => 12, 'satuan' => 'rim',   'jumlah' => 3,   'harga_beli' => 38000, 'subtotal' => 114000],
        ]);

        // Pembelian 3 — hari ini, supplier UD Berkah Jaya
        $p3 = DB::table('tb_pembelian')->insertGetId([
            'id_sekolah' => 1,
            'id_supplier' => 3,
            'id_user' => 4,
            'nomor_faktur' => 'PB-2026-003',
            'tanggal_faktur' => Carbon::now(),
            'total_bayar' => 430000,
            'status_pembelian' => 'selesai',
            'jenis_transaksi' => 'kredit',
            'cara_bayar' => 'Tempo 30 hari',
            'note' => 'Restok snack dan minuman',
            'created_by' => 4,
        ]);
        DB::table('tb_detail_pembelian')->insert([
            ['id_pembelian' => $p3, 'id_barang' => 4, 'satuan' => 'sachet',  'jumlah' => 100, 'harga_beli' => 1000, 'subtotal' => 100000],
            ['id_pembelian' => $p3, 'id_barang' => 6, 'satuan' => 'bungkus', 'jumlah' => 30,  'harga_beli' => 6000, 'subtotal' => 180000],
            ['id_pembelian' => $p3, 'id_barang' => 3, 'satuan' => 'botol',   'jumlah' => 25,  'harga_beli' => 6000, 'subtotal' => 150000],
        ]);

        // Pembelian 4 — 3 hari lalu, supplier Toko Serba Ada
        $p4 = DB::table('tb_pembelian')->insertGetId([
            'id_sekolah' => 1,
            'id_supplier' => 4,
            'id_user' => 4,
            'nomor_faktur' => 'PB-2026-004',
            'tanggal_faktur' => Carbon::now()->subDays(3),
            'total_bayar' => 320000,
            'status_pembelian' => 'selesai',
            'jenis_transaksi' => 'tunai',
            'cara_bayar' => 'Cash',
            'note' => 'Restok alat tulis',
            'created_by' => 4,
        ]);
        DB::table('tb_detail_pembelian')->insert([
            ['id_pembelian' => $p4, 'id_barang' => 9,  'satuan' => 'pcs', 'jumlah' => 100, 'harga_beli' => 2000, 'subtotal' => 200000],
            ['id_pembelian' => $p4, 'id_barang' => 13, 'satuan' => 'pcs', 'jumlah' => 80,  'harga_beli' => 1500, 'subtotal' => 120000],
        ]);

        // Pembelian 5 — 2 bulan lalu, supplier UD Mandiri
        $p5 = DB::table('tb_pembelian')->insertGetId([
            'id_sekolah' => 1,
            'id_supplier' => 5,
            'id_user' => 4,
            'nomor_faktur' => 'PB-2026-005',
            'tanggal_faktur' => Carbon::now()->subMonths(2)->startOfMonth()->addDays(10),
            'total_bayar' => 875000,
            'status_pembelian' => 'selesai',
            'jenis_transaksi' => 'kredit',
            'cara_bayar' => 'Tempo 45 hari',
            'note' => 'Pembelian awal stok koperasi',
            'created_by' => 4,
        ]);
        DB::table('tb_detail_pembelian')->insert([
            ['id_pembelian' => $p5, 'id_barang' => 14, 'satuan' => 'pcs', 'jumlah' => 50,  'harga_beli' => 5000,  'subtotal' => 250000],
            ['id_pembelian' => $p5, 'id_barang' => 15, 'satuan' => 'pcs', 'jumlah' => 30,  'harga_beli' => 10000, 'subtotal' => 300000],
            ['id_pembelian' => $p5, 'id_barang' => 16, 'satuan' => 'pcs', 'jumlah' => 50,  'harga_beli' => 3000,  'subtotal' => 150000],
            ['id_pembelian' => $p5, 'id_barang' => 17, 'satuan' => 'pak', 'jumlah' => 25,  'harga_beli' => 7000,  'subtotal' => 175000],
        ]);

        // ==========================================
        // AUTO GENERATE BANYAK DATA PEMBELIAN
        // ==========================================
        $faker = \Faker\Factory::create('id_ID');
        
        for ($i = 0; $i < 65; $i++) {
            $totalBeli = 0;
            $items = [];
            $numItems = rand(2, 6);

            for ($j = 0; $j < $numItems; $j++) {
                $idBarang = rand(1, 15);
                $jumlah = rand(10, 100);
                $hargaBeli = rand(10, 50) * 100;
                $subtotal = $hargaBeli * $jumlah;

                $items[] = [
                    'id_barang' => $idBarang,
                    'satuan' => $faker->randomElement(['pcs', 'botol', 'bungkus', 'box', 'pak']),
                    'jumlah' => $jumlah,
                    'harga_beli' => $hargaBeli,
                    'subtotal' => $subtotal,
                ];
                $totalBeli += $subtotal;
            }

            $idPembelian = DB::table('tb_pembelian')->insertGetId([
                'id_sekolah' => 1,
                'id_supplier' => rand(1, 5),
                'id_user' => rand(1, 4),
                'nomor_faktur' => 'INV-PB-' . $faker->unique()->numerify('#####'),
                'tanggal_faktur' => Carbon::now()->subDays(rand(0, 90)),
                'total_bayar' => $totalBeli,
                'status_pembelian' => 'selesai',
                'jenis_transaksi' => $faker->randomElement(['tunai', 'tunai', 'kredit']),
                'cara_bayar' => $faker->randomElement(['Cash', 'Transfer', 'Tempo 30 Hari']),
                'note' => $faker->optional(0.3)->sentence,
                'created_by' => 4,
            ]);

            foreach ($items as &$item) {
                $item['id_pembelian'] = $idPembelian;
            }
            DB::table('tb_detail_pembelian')->insert($items);
        }
    }
}

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
    }
}

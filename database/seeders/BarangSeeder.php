<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BarangSeeder extends Seeder
{
    /**
     * Generate a consistent placeholder image URL for each item.
     * Uses picsum.photos with a seed so the same barang always
     * gets the same image.
     */
    private function dummyImage(int $seed): string
    {
        return "https://picsum.photos/seed/{$seed}/200/200";
    }

    public function run(): void
    {
        // id_sekolah=1, id_kelompok_kategori: 1=Makan&Minum, 2=Alat Tulis, 3=Elektronik, 4=Perlengkapan
        // id_kategori: 1=MinBotol,2=MinSachet,3=MakRingan,4=MakBerat,5=Pena,6=Buku,7=Penghapus,8=AksHp,9=Kabel,10=Kebersihan,11=Lainnya
        // id_supplier: 1=CV.Sumber Jaya, 2=PT.Maju, 3=UD.Berkah, 4=Toko Serba Ada

        $barang = [
            // Minuman Botol (kelompok 1, kategori 1)
            [
                'id_sekolah' => 1, 'barcode' => 'MNM001', 'nama' => 'Aqua Botol 600ml', 'icon' => $this->dummyImage(1),
                'id_kategori' => 1, 'id_kelompok_kategori' => 1, 'id_supplier' => 1,
                'satuan' => 'botol', 'harga_beli' => 2500, 'harga_jual' => 4000, 'stok' => 100,
                'is_active' => 1, 'created_by' => 1,
            ],
            [
                'id_sekolah' => 1, 'barcode' => 'MNM002', 'nama' => 'Teh Botol Sosro 450ml', 'icon' => $this->dummyImage(2),
                'id_kategori' => 1, 'id_kelompok_kategori' => 1, 'id_supplier' => 1,
                'satuan' => 'botol', 'harga_beli' => 4000, 'harga_jual' => 6000, 'stok' => 80,
                'is_active' => 1, 'created_by' => 1,
            ],
            [
                'id_sekolah' => 1, 'barcode' => 'MNM003', 'nama' => 'Pocari Sweat 500ml', 'icon' => $this->dummyImage(3),
                'id_kategori' => 1, 'id_kelompok_kategori' => 1, 'id_supplier' => 2,
                'satuan' => 'botol', 'harga_beli' => 6000, 'harga_jual' => 9000, 'stok' => 60,
                'is_active' => 1, 'created_by' => 1,
            ],
            // Minuman Sachet (kelompok 1, kategori 2)
            [
                'id_sekolah' => 1, 'barcode' => 'MNS001', 'nama' => 'Kopi Sachet Kapal Api', 'icon' => $this->dummyImage(4),
                'id_kategori' => 2, 'id_kelompok_kategori' => 1, 'id_supplier' => 3,
                'satuan' => 'sachet', 'harga_beli' => 1000, 'harga_jual' => 2000, 'stok' => 200,
                'is_active' => 1, 'created_by' => 1,
            ],
            [
                'id_sekolah' => 1, 'barcode' => 'MNS002', 'nama' => 'Susu Ultra 200ml', 'icon' => $this->dummyImage(5),
                'id_kategori' => 2, 'id_kelompok_kategori' => 1, 'id_supplier' => 2,
                'satuan' => 'kotak', 'harga_beli' => 3000, 'harga_jual' => 5000, 'stok' => 120,
                'is_active' => 1, 'created_by' => 1,
            ],
            // Makanan Ringan (kelompok 1, kategori 3)
            [
                'id_sekolah' => 1, 'barcode' => 'MKR001', 'nama' => 'Chitato Rasa Sapi', 'icon' => $this->dummyImage(6),
                'id_kategori' => 3, 'id_kelompok_kategori' => 1, 'id_supplier' => 3,
                'satuan' => 'bungkus', 'harga_beli' => 6000, 'harga_jual' => 9000, 'stok' => 50,
                'is_active' => 1, 'created_by' => 1,
            ],
            [
                'id_sekolah' => 1, 'barcode' => 'MKR002', 'nama' => 'Indomie Goreng', 'icon' => $this->dummyImage(7),
                'id_kategori' => 3, 'id_kelompok_kategori' => 1, 'id_supplier' => 1,
                'satuan' => 'bungkus', 'harga_beli' => 2800, 'harga_jual' => 4000, 'stok' => 150,
                'is_active' => 1, 'created_by' => 1,
            ],
            [
                'id_sekolah' => 1, 'barcode' => 'MKR003', 'nama' => 'Tango Wafer Coklat', 'icon' => $this->dummyImage(8),
                'id_kategori' => 3, 'id_kelompok_kategori' => 1, 'id_supplier' => 4,
                'satuan' => 'bungkus', 'harga_beli' => 4000, 'harga_jual' => 6000, 'stok' => 80,
                'is_active' => 1, 'created_by' => 1,
            ],
            // Pena & Pensil (kelompok 2, kategori 5)
            [
                'id_sekolah' => 1, 'barcode' => 'ATK001', 'nama' => 'Pena Pilot G-2 (Hitam)', 'icon' => $this->dummyImage(9),
                'id_kategori' => 5, 'id_kelompok_kategori' => 2, 'id_supplier' => 4,
                'satuan' => 'pcs', 'harga_beli' => 5000, 'harga_jual' => 8000, 'stok' => 60,
                'is_active' => 1, 'created_by' => 1,
            ],
            [
                'id_sekolah' => 1, 'barcode' => 'ATK002', 'nama' => 'Pensil 2B Staedtler', 'icon' => $this->dummyImage(10),
                'id_kategori' => 5, 'id_kelompok_kategori' => 2, 'id_supplier' => 4,
                'satuan' => 'pcs', 'harga_beli' => 3000, 'harga_jual' => 5000, 'stok' => 100,
                'is_active' => 1, 'created_by' => 1,
            ],
            // Buku & Kertas (kelompok 2, kategori 6)
            [
                'id_sekolah' => 1, 'barcode' => 'ATK003', 'nama' => 'Buku Tulis 58 Lembar', 'icon' => $this->dummyImage(11),
                'id_kategori' => 6, 'id_kelompok_kategori' => 2, 'id_supplier' => 2,
                'satuan' => 'buku', 'harga_beli' => 3500, 'harga_jual' => 6000, 'stok' => 200,
                'is_active' => 1, 'created_by' => 1,
            ],
            [
                'id_sekolah' => 1, 'barcode' => 'ATK004', 'nama' => 'Kertas HVS A4 80gr (rim)', 'icon' => $this->dummyImage(12),
                'id_kategori' => 6, 'id_kelompok_kategori' => 2, 'id_supplier' => 2,
                'satuan' => 'rim', 'harga_beli' => 45000, 'harga_jual' => 60000, 'stok' => 30,
                'is_active' => 1, 'created_by' => 1,
            ],
            // Penghapus (kelompok 2, kategori 7)
            [
                'id_sekolah' => 1, 'barcode' => 'ATK005', 'nama' => 'Penghapus Faber-Castell', 'icon' => $this->dummyImage(13),
                'id_kategori' => 7, 'id_kelompok_kategori' => 2, 'id_supplier' => 4,
                'satuan' => 'pcs', 'harga_beli' => 1500, 'harga_jual' => 3000, 'stok' => 80,
                'is_active' => 1, 'created_by' => 1,
            ],
            // Aksesoris HP (kelompok 3, kategori 8)
            [
                'id_sekolah' => 1, 'barcode' => 'ELK001', 'nama' => 'Screen Protector Universal', 'icon' => $this->dummyImage(14),
                'id_kategori' => 8, 'id_kelompok_kategori' => 3, 'id_supplier' => 3,
                'satuan' => 'pcs', 'harga_beli' => 5000, 'harga_jual' => 15000, 'stok' => 40,
                'is_active' => 1, 'created_by' => 1,
            ],
            // Kabel & Charger (kelompok 3, kategori 9)
            [
                'id_sekolah' => 1, 'barcode' => 'ELK002', 'nama' => 'Kabel Data Type-C 1m', 'icon' => $this->dummyImage(15),
                'id_kategori' => 9, 'id_kelompok_kategori' => 3, 'id_supplier' => 3,
                'satuan' => 'pcs', 'harga_beli' => 10000, 'harga_jual' => 20000, 'stok' => 25,
                'is_active' => 1, 'created_by' => 1,
            ],
            // Kebersihan (kelompok 4, kategori 10)
            [
                'id_sekolah' => 1, 'barcode' => 'PRL001', 'nama' => 'Sabun Mandi Lifebuoy 90gr', 'icon' => $this->dummyImage(16),
                'id_kategori' => 10, 'id_kelompok_kategori' => 4, 'id_supplier' => 1,
                'satuan' => 'pcs', 'harga_beli' => 3000, 'harga_jual' => 5000, 'stok' => 50,
                'is_active' => 1, 'created_by' => 1,
            ],
            [
                'id_sekolah' => 1, 'barcode' => 'PRL002', 'nama' => 'Tissue Facial Softex 100s', 'icon' => $this->dummyImage(17),
                'id_kategori' => 10, 'id_kelompok_kategori' => 4, 'id_supplier' => 1,
                'satuan' => 'pak', 'harga_beli' => 7000, 'harga_jual' => 12000, 'stok' => 4,
                'is_active' => 1, 'created_by' => 1,
            ],
        ];

        foreach ($barang as $data) {
            DB::table('tb_barang')->insert($data);
        }

    }
}

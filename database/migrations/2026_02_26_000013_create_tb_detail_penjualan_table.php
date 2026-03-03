<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tb_detail_penjualan', function (Blueprint $table) {
            $table->unsignedInteger('id_penjualan');
            $table->unsignedInteger('id_barang');
            $table->integer('jumlah_barang');
            $table->decimal('harga_beli', 12, 2);
            $table->decimal('harga_jual', 12, 2);
            $table->enum('diskon_tipe', ['persen', 'nominal'])->nullable()->default('nominal');
            $table->decimal('diskon_nilai', 12, 2)->nullable()->default(0.00);
            $table->decimal('diskon_nominal', 12, 2)->nullable()->default(0.00);
            $table->decimal('subtotal', 14, 2);

            $table->primary(['id_penjualan', 'id_barang']);

            $table->foreign('id_penjualan', 'tb_detail_penjualan_ibfk_1')->references('id_penjualan')->on('tb_penjualan');
            $table->foreign('id_barang', 'tb_detail_penjualan_ibfk_2')->references('id_barang')->on('tb_barang');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tb_detail_penjualan');
    }
};

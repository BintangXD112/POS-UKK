<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tb_detail_pembelian', function (Blueprint $table) {
            $table->increments('id_detail_pembelian');
            $table->unsignedInteger('id_pembelian');
            $table->unsignedInteger('id_barang');
            $table->string('satuan', 20);
            $table->integer('jumlah');
            $table->decimal('harga_beli', 12, 2);
            $table->decimal('subtotal', 14, 2);

            $table->foreign('id_pembelian', 'tb_detail_pembelian_ibfk_1')->references('id_pembelian')->on('tb_pembelian');
            $table->foreign('id_barang', 'tb_detail_pembelian_ibfk_2')->references('id_barang')->on('tb_barang');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tb_detail_pembelian');
    }
};

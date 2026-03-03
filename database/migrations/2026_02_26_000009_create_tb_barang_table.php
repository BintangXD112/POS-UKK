<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tb_barang', function (Blueprint $table) {
            $table->increments('id_barang');
            $table->unsignedInteger('id_sekolah');
            $table->string('barcode', 50);
            $table->string('nama', 150);
            $table->unsignedInteger('id_kategori');
            $table->unsignedInteger('id_kelompok_kategori');
            $table->unsignedInteger('id_supplier');
            $table->string('satuan', 20);
            $table->decimal('harga_beli', 12, 2);
            $table->decimal('harga_jual', 12, 2);
            $table->integer('stok')->default(0);
            $table->tinyInteger('is_active')->nullable()->default(1);
            $table->timestamp('created_at')->useCurrent();
            $table->unsignedInteger('created_by')->nullable();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
            $table->unsignedInteger('updated_by')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedInteger('deleted_by')->nullable();
            $table->tinyInteger('is_delete')->nullable()->default(0);

            $table->unique(['barcode', 'id_sekolah'], 'barcode_per_sekolah');

            $table->foreign('id_sekolah', 'tb_barang_ibfk_sekolah')->references('id_sekolah')->on('tb_sekolah');
            $table->foreign('id_kategori', 'tb_barang_ibfk_1')->references('id_kategori')->on('tb_kategori');
            $table->foreign('id_supplier', 'tb_barang_ibfk_2')->references('id_supplier')->on('tb_supplier');
            $table->foreign('id_kelompok_kategori', 'tb_barang_ibfk_kelompok_kategori')->references('id_kelompok')->on('tb_kelompok_kategori');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tb_barang');
    }
};

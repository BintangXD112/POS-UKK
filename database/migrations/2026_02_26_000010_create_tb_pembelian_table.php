<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tb_pembelian', function (Blueprint $table) {
            $table->increments('id_pembelian');
            $table->unsignedInteger('id_sekolah');
            $table->unsignedInteger('id_supplier');
            $table->unsignedInteger('id_user');
            $table->string('nomor_faktur', 50);
            $table->dateTime('tanggal_faktur')->useCurrent();
            $table->decimal('total_bayar', 14, 2);
            $table->enum('status_pembelian', ['draft', 'selesai'])->default('draft');
            $table->enum('jenis_transaksi', ['tunai', 'kredit'])->default('tunai');
            $table->string('cara_bayar', 50)->nullable()->comment('Cash, Transfer, QRIS dll..');
            $table->text('note')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->unsignedInteger('created_by')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedInteger('deleted_by')->nullable();
            $table->tinyInteger('is_delete')->default(0);

            $table->unique(['nomor_faktur', 'id_sekolah'], 'faktur_per_sekolah');

            $table->foreign('id_sekolah', 'tb_pembelian_ibfk_sekolah')->references('id_sekolah')->on('tb_sekolah');
            $table->foreign('id_supplier', 'tb_pembelian_ibfk_spl')->references('id_supplier')->on('tb_supplier');
            $table->foreign('id_user', 'tb_pembelian_ibfk_usr')->references('id_user')->on('tb_user');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tb_pembelian');
    }
};

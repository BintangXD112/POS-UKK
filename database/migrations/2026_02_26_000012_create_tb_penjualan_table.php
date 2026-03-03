<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tb_penjualan', function (Blueprint $table) {
            $table->increments('id_penjualan');
            $table->unsignedInteger('id_sekolah');
            $table->unsignedInteger('id_user');
            $table->unsignedInteger('id_pelanggan')->nullable();
            $table->dateTime('tanggal_penjualan')->useCurrent();
            $table->decimal('total_faktur', 14, 2);
            $table->decimal('total_bayar', 14, 2);
            $table->decimal('kembalian', 14, 2)->default(0.00);
            $table->enum('status_pembayaran', ['sudah bayar', 'belum bayar'])->default('belum bayar');
            $table->enum('jenis_transaksi', ['tunai', 'kredit'])->nullable();
            $table->string('cara_bayar', 50)->nullable()->comment('Cash, Transfer, QRis, dll...');
            $table->text('note')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->unsignedInteger('created_by')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedInteger('deleted_by')->nullable();
            $table->tinyInteger('is_delete')->default(0);

            $table->foreign('id_sekolah', 'tb_penjualan_ibfk_sekolah')->references('id_sekolah')->on('tb_sekolah');
            $table->foreign('id_user', 'tb_penjualan_ibfk_1')->references('id_user')->on('tb_user');
            $table->foreign('id_pelanggan', 'tb_penjualan_ibfk_2')->references('id_pelanggan')->on('tb_pelanggan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tb_penjualan');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE tb_penjualan MODIFY COLUMN status_pembayaran ENUM('sudah bayar', 'belum bayar', 'hutang') DEFAULT 'belum bayar'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE tb_penjualan MODIFY COLUMN status_pembayaran ENUM('sudah bayar', 'belum bayar') DEFAULT 'belum bayar'");
    }
};

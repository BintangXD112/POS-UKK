<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tb_barang', function (Blueprint $table) {
            // Change icon column to store image path (longer string)
            $table->string('icon', 500)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('tb_barang', function (Blueprint $table) {
            $table->string('icon', 100)->nullable()->change();
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tb_kelompok_kategori', function (Blueprint $table) {
            $table->increments('id_kelompok');
            $table->unsignedInteger('id_sekolah');
            $table->string('nama_kelompok', 100);
            $table->timestamp('created_at')->useCurrent();
            $table->unsignedInteger('created_by')->nullable();

            $table->foreign('id_sekolah', 'tb_kelompok_kategori_ibfk_1')->references('id_sekolah')->on('tb_sekolah');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tb_kelompok_kategori');
    }
};

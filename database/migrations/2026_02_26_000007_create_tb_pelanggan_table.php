<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tb_pelanggan', function (Blueprint $table) {
            $table->increments('id_pelanggan');
            $table->unsignedInteger('id_kelompok_pelanggan');
            $table->string('nama_pelanggan', 150);
            $table->string('telepon', 20)->nullable();
            $table->text('alamat')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->unsignedInteger('created_by')->nullable();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
            $table->unsignedInteger('updated_by')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedInteger('deleted_by')->nullable();
            $table->tinyInteger('is_delete')->default(0);

            $table->foreign('id_kelompok_pelanggan', 'tb_pelanggan_ibfk_1')->references('id_kelompok_pelanggan')->on('tb_kelompok_pelanggan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tb_pelanggan');
    }
};

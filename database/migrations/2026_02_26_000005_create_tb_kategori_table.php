<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tb_kategori', function (Blueprint $table) {
            $table->increments('id_kategori');
            $table->unsignedInteger('id_kelompok');
            $table->string('nama', 100);
            $table->timestamp('created_at')->useCurrent();
            $table->unsignedInteger('created_by')->nullable();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
            $table->unsignedInteger('updated_by')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedInteger('deleted_by')->nullable();
            $table->tinyInteger('is_delete')->default(0);

            $table->foreign('id_kelompok', 'tb_kategori_ibfk_1')->references('id_kelompok')->on('tb_kelompok_kategori');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tb_kategori');
    }
};

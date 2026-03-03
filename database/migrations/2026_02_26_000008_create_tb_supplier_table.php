<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tb_supplier', function (Blueprint $table) {
            $table->increments('id_supplier');
            $table->unsignedInteger('id_sekolah');
            $table->string('nama', 100);
            $table->string('no_telepon', 20)->nullable();
            $table->text('alamat_supplier')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->unsignedInteger('created_by')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedInteger('deleted_by')->nullable();
            $table->tinyInteger('is_delete')->default(0);

            $table->foreign('id_sekolah', 'tb_supplier_ibfk_1')->references('id_sekolah')->on('tb_sekolah');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tb_supplier');
    }
};

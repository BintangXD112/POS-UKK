<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tb_user', function (Blueprint $table) {
            // 1. Hapus unique constraint username_per_sekolah
            $table->dropUnique('username_per_sekolah');

            // 2. Hapus foreign key ke tb_sekolah
            $table->dropForeign('tb_user_ibfk_2');

            // 3. Ubah kolom id_sekolah menjadi nullable
            $table->unsignedInteger('id_sekolah')->nullable()->change();

            // 4. Tambahkan kembali FK (nullable FK bisa null = superadmin)
            $table->foreign('id_sekolah', 'tb_user_ibfk_2')
                ->references('id_sekolah')->on('tb_sekolah')
                ->nullOnDelete();

            // 5. Unique hanya pada username (bukan per sekolah)
            $table->unique('username');
        });
    }

    public function down(): void
    {
        Schema::table('tb_user', function (Blueprint $table) {
            $table->dropUnique(['username']);
            $table->dropForeign('tb_user_ibfk_2');
            $table->unsignedInteger('id_sekolah')->nullable(false)->change();
            $table->foreign('id_sekolah', 'tb_user_ibfk_2')
                ->references('id_sekolah')->on('tb_sekolah');
            $table->unique(['username', 'id_sekolah'], 'username_per_sekolah');
        });
    }
};

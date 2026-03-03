<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tb_user', function (Blueprint $table) {
            $table->increments('id_user');
            $table->unsignedInteger('id_sekolah');
            $table->unsignedInteger('id_role');
            $table->string('username', 50);
            $table->string('password', 255);
            $table->string('nama_lengkap', 100);
            $table->tinyInteger('is_active')->default(1);
            $table->timestamp('created_at')->useCurrent();
            $table->unsignedInteger('created_by')->nullable();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
            $table->unsignedInteger('updated_by')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedInteger('deleted_by')->nullable();

            $table->rememberToken();
            $table->unique(['username', 'id_sekolah'], 'username_per_sekolah');

            $table->foreign('id_role', 'tb_user_ibfk_1')->references('id_role')->on('roles');
            $table->foreign('id_sekolah', 'tb_user_ibfk_2')->references('id_sekolah')->on('tb_sekolah');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tb_user');
    }
};

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sekolah extends Model
{
    protected $table = 'tb_sekolah';

    protected $primaryKey = 'id_sekolah';

    public $timestamps = false;

    protected $fillable = [
        'kode_sekolah', 'nama_sekolah', 'alamat_sekolah', 'website', 'is_active',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(TbUser::class, 'id_sekolah', 'id_sekolah');
    }

    public function kelompokKategori(): HasMany
    {
        return $this->hasMany(KelompokKategori::class, 'id_sekolah', 'id_sekolah');
    }

    public function kelompokPelanggan(): HasMany
    {
        return $this->hasMany(KelompokPelanggan::class, 'id_sekolah', 'id_sekolah');
    }

    public function supplier(): HasMany
    {
        return $this->hasMany(Supplier::class, 'id_sekolah', 'id_sekolah');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KelompokKategori extends Model
{
    protected $table = 'tb_kelompok_kategori';

    protected $primaryKey = 'id_kelompok';

    public $timestamps = false;

    protected $fillable = ['id_sekolah', 'nama_kelompok', 'created_by'];

    protected $dates = ['created_at'];

    public function sekolah(): BelongsTo
    {
        return $this->belongsTo(Sekolah::class, 'id_sekolah', 'id_sekolah');
    }

    public function kategori(): HasMany
    {
        return $this->hasMany(Kategori::class, 'id_kelompok', 'id_kelompok');
    }
}

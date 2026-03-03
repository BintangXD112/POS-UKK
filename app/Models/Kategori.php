<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kategori extends Model
{
    use SoftDeletes;

    protected $table = 'tb_kategori';
    protected $primaryKey = 'id_kategori';

    // timestamps dikelola manual sesuai schema
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';
    public $timestamps = true;

    protected $fillable = ['id_kelompok', 'nama', 'created_by', 'updated_by', 'deleted_by', 'is_delete'];

    protected $dates = ['created_at', 'updated_at', 'deleted_at'];

    public function kelompok(): BelongsTo
    {
        return $this->belongsTo(KelompokKategori::class, 'id_kelompok', 'id_kelompok');
    }

    public function barang(): HasMany
    {
        return $this->hasMany(Barang::class, 'id_kategori', 'id_kategori');
    }
}

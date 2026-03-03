<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    use SoftDeletes;

    protected $table = 'tb_supplier';
    protected $primaryKey = 'id_supplier';
    public $timestamps = false;

    protected $fillable = [
        'id_sekolah', 'nama', 'no_telepon', 'alamat_supplier',
        'created_by', 'deleted_by', 'is_delete',
    ];

    protected $dates = ['created_at', 'deleted_at'];

    public function sekolah(): BelongsTo
    {
        return $this->belongsTo(Sekolah::class, 'id_sekolah', 'id_sekolah');
    }

    public function barang(): HasMany
    {
        return $this->hasMany(Barang::class, 'id_supplier', 'id_supplier');
    }

    public function pembelian(): HasMany
    {
        return $this->hasMany(Pembelian::class, 'id_supplier', 'id_supplier');
    }
}

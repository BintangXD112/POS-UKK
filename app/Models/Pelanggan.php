<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pelanggan extends Model
{
    use SoftDeletes;

    protected $table = 'tb_pelanggan';

    protected $primaryKey = 'id_pelanggan';

    public $timestamps = true;

    const CREATED_AT = 'created_at';

    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'id_kelompok_pelanggan', 'nama_pelanggan', 'telepon', 'alamat',
        'created_by', 'updated_by', 'deleted_by', 'is_delete',
    ];

    protected $dates = ['created_at', 'updated_at', 'deleted_at'];

    public function kelompok(): BelongsTo
    {
        return $this->belongsTo(KelompokPelanggan::class, 'id_kelompok_pelanggan', 'id_kelompok_pelanggan');
    }

    public function penjualan(): HasMany
    {
        return $this->hasMany(Penjualan::class, 'id_pelanggan', 'id_pelanggan');
    }
}

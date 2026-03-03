<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pembelian extends Model
{
    use SoftDeletes;

    protected $table = 'tb_pembelian';
    protected $primaryKey = 'id_pembelian';
    public $timestamps = false;

    protected $fillable = [
        'id_sekolah', 'id_supplier', 'id_user', 'nomor_faktur',
        'tanggal_faktur', 'total_bayar', 'status_pembelian',
        'jenis_transaksi', 'cara_bayar', 'note',
        'created_by', 'deleted_by', 'is_delete',
    ];

    protected $casts = [
        'total_bayar'    => 'decimal:2',
        'tanggal_faktur' => 'datetime',
    ];

    protected $dates = ['created_at', 'tanggal_faktur', 'deleted_at'];

    public function sekolah(): BelongsTo
    {
        return $this->belongsTo(Sekolah::class, 'id_sekolah', 'id_sekolah');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'id_supplier', 'id_supplier');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(TbUser::class, 'id_user', 'id_user');
    }

    public function detail(): HasMany
    {
        return $this->hasMany(DetailPembelian::class, 'id_pembelian', 'id_pembelian');
    }
}

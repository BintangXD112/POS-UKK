<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Penjualan extends Model
{
    use SoftDeletes;

    protected $table = 'tb_penjualan';
    protected $primaryKey = 'id_penjualan';
    public $timestamps = false;

    protected $fillable = [
        'id_sekolah', 'id_user', 'id_pelanggan',
        'tanggal_penjualan', 'total_faktur', 'total_bayar', 'kembalian',
        'status_pembayaran', 'jenis_transaksi', 'cara_bayar', 'note',
        'created_by', 'deleted_by', 'is_delete',
    ];

    protected $casts = [
        'total_faktur'     => 'decimal:2',
        'total_bayar'      => 'decimal:2',
        'kembalian'        => 'decimal:2',
        'tanggal_penjualan'=> 'datetime',
    ];

    protected $dates = ['created_at', 'tanggal_penjualan', 'deleted_at'];

    public function sekolah(): BelongsTo
    {
        return $this->belongsTo(Sekolah::class, 'id_sekolah', 'id_sekolah');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(TbUser::class, 'id_user', 'id_user');
    }

    public function pelanggan(): BelongsTo
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan', 'id_pelanggan');
    }

    public function detail(): HasMany
    {
        return $this->hasMany(DetailPenjualan::class, 'id_penjualan', 'id_penjualan');
    }
}

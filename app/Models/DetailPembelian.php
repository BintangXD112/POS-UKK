<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailPembelian extends Model
{
    protected $table = 'tb_detail_pembelian';

    protected $primaryKey = 'id_detail_pembelian';

    public $timestamps = false;

    protected $fillable = [
        'id_pembelian', 'id_barang', 'satuan', 'jumlah', 'harga_beli', 'subtotal',
    ];

    protected $casts = [
        'harga_beli' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function pembelian(): BelongsTo
    {
        return $this->belongsTo(Pembelian::class, 'id_pembelian', 'id_pembelian');
    }

    public function barang(): BelongsTo
    {
        return $this->belongsTo(Barang::class, 'id_barang', 'id_barang');
    }
}

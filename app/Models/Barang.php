<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Barang extends Model
{
    use SoftDeletes;

    protected $table = 'tb_barang';
    protected $primaryKey = 'id_barang';
    public $timestamps = true;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'id_sekolah', 'barcode', 'nama', 'id_kategori', 'id_kelompok_kategori',
        'id_supplier', 'satuan', 'harga_beli', 'harga_jual', 'stok',
        'is_active', 'created_by', 'updated_by', 'deleted_by', 'is_delete',
    ];

    protected $casts = [
        'harga_beli' => 'decimal:2',
        'harga_jual' => 'decimal:2',
        'is_active'  => 'boolean',
    ];

    protected $dates = ['created_at', 'updated_at', 'deleted_at'];

    public function sekolah(): BelongsTo
    {
        return $this->belongsTo(Sekolah::class, 'id_sekolah', 'id_sekolah');
    }

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class, 'id_kategori', 'id_kategori');
    }

    public function kelompokKategori(): BelongsTo
    {
        return $this->belongsTo(KelompokKategori::class, 'id_kelompok_kategori', 'id_kelompok');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'id_supplier', 'id_supplier');
    }

    public function detailPembelian(): HasMany
    {
        return $this->hasMany(DetailPembelian::class, 'id_barang', 'id_barang');
    }

    public function detailPenjualan(): HasMany
    {
        return $this->hasMany(DetailPenjualan::class, 'id_barang', 'id_barang');
    }
}

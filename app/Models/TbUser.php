<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class TbUser extends Authenticatable
{
    use Notifiable, SoftDeletes;

    protected $table = 'tb_user';

    protected $primaryKey = 'id_user';

    public $timestamps = false;

    protected $fillable = [
        'id_sekolah', 'id_role', 'username', 'password',
        'nama_lengkap', 'is_active', 'remember_token',
    ];

    /**
     * Relasi yang selalu di-eager-load.
     * Penting agar CheckRole middleware bisa cek $user->role tanpa query tambahan.
     */
    protected $with = ['role'];

    protected $hidden = ['password', 'remember_token'];

    // SoftDeletes menggunakan deleted_at
    protected $dates = ['deleted_at', 'created_at', 'updated_at'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'id_role', 'id_role');
    }

    public function sekolah(): BelongsTo
    {
        return $this->belongsTo(Sekolah::class, 'id_sekolah', 'id_sekolah');
    }

    public function penjualan(): HasMany
    {
        return $this->hasMany(Penjualan::class, 'id_user', 'id_user');
    }

    public function pembelian(): HasMany
    {
        return $this->hasMany(Pembelian::class, 'id_user', 'id_user');
    }

    /**
     * Cek apakah user punya role tertentu
     */
    public function hasRole(string|array $role): bool
    {
        if (is_array($role)) {
            return in_array($this->role?->nama_role, $role);
        }

        return $this->role?->nama_role === $role;
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super admin');
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isKasir(): bool
    {
        return $this->hasRole('kasir');
    }
}

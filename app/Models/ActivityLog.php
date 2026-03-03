<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $table = 'activity_logs';
    public $timestamps = false;

    protected $fillable = [
        'user_id', 'user_name', 'action', 'module', 'description', 'ip_address', 'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(TbUser::class, 'user_id', 'id_user');
    }
}

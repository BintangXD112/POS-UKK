<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    /**
     * Catat aktivitas ke tabel activity_logs.
     *
     * @param  'login'|'logout'|'create'|'update'|'delete'  $action
     */
    public static function log(string $action, string $module, string $description, ?int $userId = null, ?string $userName = null): void
    {
        try {
            $user = Auth::user();

            ActivityLog::create([
                'user_id'    => $userId   ?? $user?->id_user,
                'user_name'  => $userName ?? $user?->nama_lengkap,
                'action'     => $action,
                'module'     => $module,
                'description'=> $description,
                'ip_address' => Request::ip(),
                'created_at' => now(),
            ]);
        } catch (\Throwable) {
            // Jangan biarkan logging error menghentikan request utama
        }
    }
}

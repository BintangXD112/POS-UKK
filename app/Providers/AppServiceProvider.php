<?php

namespace App\Providers;

use App\Services\ActivityLogger;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        $this->configureDefaults();
        $this->registerAuthListeners();
    }

    protected function registerAuthListeners(): void
    {
        Event::listen(Login::class, function (Login $event) {
            $user = $event->user;
            ActivityLogger::log(
                'login',
                'Auth',
                "User \"{$user->nama_lengkap}\" ({$user->username}) login.",
                $user->id_user,
                $user->nama_lengkap,
            );
        });

        Event::listen(Logout::class, function (Logout $event) {
            $user = $event->user;
            if ($user) {
                ActivityLogger::log(
                    'logout',
                    'Auth',
                    "User \"{$user->nama_lengkap}\" ({$user->username}) logout.",
                    $user->id_user,
                    $user->nama_lengkap,
                );
            }
        });
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}

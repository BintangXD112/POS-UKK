<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\PembelianController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\SekolahController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// ── Halaman utama ──────────────────────────────────────────────────────────────
Route::get('/', fn () => redirect()->route('dashboard'))->name('home');

// ── Auth route dikelola Fortify (login/logout) ─────────────────────────────────

// ── Semua route terproteksi ────────────────────────────────────────────────────
Route::middleware(['auth'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ── Super Admin only ────────────────────────────────────────────────────────
    Route::middleware(['role:super admin'])->prefix('sekolah')->name('sekolah.')->group(function () {
        Route::get('/', [SekolahController::class, 'index'])->name('index');
        Route::post('/', [SekolahController::class, 'store'])->name('store');
        Route::put('/{sekolah}', [SekolahController::class, 'update'])->name('update');
        Route::delete('/{sekolah}', [SekolahController::class, 'destroy'])->name('destroy');
    });

    // Activity Log (super admin only)
    Route::middleware(['role:super admin'])
        ->get('/activity-log', [ActivityLogController::class, 'index'])
        ->name('activity-log.index');

    // ── Super Admin + Admin ────────────────────────────────────────────────────
    Route::middleware(['role:super admin,admin'])->group(function () {

        // Users
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::put('/{user}', [UserController::class, 'update'])->name('update');
            Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
        });

        // Kategori & Kelompok Kategori
        Route::prefix('kategori')->name('kategori.')->group(function () {
            Route::get('/', [KategoriController::class, 'index'])->name('index');
            // Kelompok
            Route::post('/kelompok', [KategoriController::class, 'storeKelompok'])->name('kelompok.store');
            Route::put('/kelompok/{kelompok}', [KategoriController::class, 'updateKelompok'])->name('kelompok.update');
            Route::delete('/kelompok/{kelompok}', [KategoriController::class, 'destroyKelompok'])->name('kelompok.destroy');
            // Kategori
            Route::post('/', [KategoriController::class, 'store'])->name('store');
            Route::put('/{kategori}', [KategoriController::class, 'update'])->name('update');
            Route::delete('/{kategori}', [KategoriController::class, 'destroy'])->name('destroy');
        });

        // Pelanggan & Kelompok Pelanggan
        Route::prefix('pelanggan')->name('pelanggan.')->group(function () {
            Route::get('/', [PelangganController::class, 'index'])->name('index');
            // Kelompok
            Route::post('/kelompok', [PelangganController::class, 'storeKelompok'])->name('kelompok.store');
            Route::put('/kelompok/{kelompok}', [PelangganController::class, 'updateKelompok'])->name('kelompok.update');
            Route::delete('/kelompok/{kelompok}', [PelangganController::class, 'destroyKelompok'])->name('kelompok.destroy');
            // Pelanggan
            Route::post('/', [PelangganController::class, 'store'])->name('store');
            Route::put('/{pelanggan}', [PelangganController::class, 'update'])->name('update');
            Route::delete('/{pelanggan}', [PelangganController::class, 'destroy'])->name('destroy');
        });

        // Supplier
        Route::prefix('supplier')->name('supplier.')->group(function () {
            Route::get('/', [SupplierController::class, 'index'])->name('index');
            Route::post('/', [SupplierController::class, 'store'])->name('store');
            Route::put('/{supplier}', [SupplierController::class, 'update'])->name('update');
            Route::delete('/{supplier}', [SupplierController::class, 'destroy'])->name('destroy');
        });

        // Barang
        Route::prefix('barang')->name('barang.')->group(function () {
            Route::get('/', [BarangController::class, 'index'])->name('index');
            Route::post('/', [BarangController::class, 'store'])->name('store');
            Route::put('/{barang}', [BarangController::class, 'update'])->name('update');
            Route::delete('/{barang}', [BarangController::class, 'destroy'])->name('destroy');
        });

        // Pembelian
        Route::prefix('pembelian')->name('pembelian.')->group(function () {
            Route::get('/', [PembelianController::class, 'index'])->name('index');
            Route::get('/{pembelian}', [PembelianController::class, 'show'])->name('show');
            Route::post('/', [PembelianController::class, 'store'])->name('store');
            Route::delete('/{pembelian}', [PembelianController::class, 'destroy'])->name('destroy');
        });

        // Laporan
        Route::prefix('laporan')->name('laporan.')->group(function () {
            Route::get('/penjualan', [LaporanController::class, 'penjualan'])->name('penjualan');
            Route::get('/pembelian', [LaporanController::class, 'pembelian'])->name('pembelian');
        });

        // Penjualan — list (Admin bisa lihat)
        Route::get('/penjualan', [PenjualanController::class, 'index'])->name('penjualan.index');
        Route::delete('/penjualan/{penjualan}', [PenjualanController::class, 'destroy'])->name('penjualan.destroy');
    });

    // ── Super Admin + Kasir (POS) ──────────────────────────────────────────────
    Route::middleware(['role:super admin,kasir'])->group(function () {
        Route::get('/pos', [PenjualanController::class, 'pos'])->name('pos.index');
        Route::post('/pos', [PenjualanController::class, 'store'])->name('pos.store');
        Route::get('/pos/struk/{penjualan}', [PenjualanController::class, 'show'])->name('pos.struk');
    });
});

require __DIR__.'/settings.php';

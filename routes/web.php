<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\RestoreDataController;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\PembelianController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\SekolahController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// ── Halaman utama ──────────────────────────────────────────────────────────────
Route::get('/', fn () => redirect()->route('dashboard'))->name('home');

Route::middleware(['auth'])->group(function () {

    // ── Dashboard — semua role ─────────────────────────────────────────────────
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ── Super Admin only: Sekolah (full CRUD) & Activity Log ──────────────────
    Route::middleware(['role:super admin'])->group(function () {
        Route::prefix('sekolah')->name('sekolah.')->group(function () {
            Route::get('/', [SekolahController::class, 'index'])->name('index');
            Route::post('/', [SekolahController::class, 'store'])->name('store');
            Route::put('/{sekolah}', [SekolahController::class, 'update'])->name('update');
            Route::delete('/{sekolah}', [SekolahController::class, 'destroy'])->name('destroy');
        });
        Route::get('/activity-log', [ActivityLogController::class, 'index'])->name('activity-log.index');
    });

    // ── Super Admin + Admin: Manajemen User (keduanya full CRUD) ──────────────
    Route::middleware(['role:super admin,admin'])->prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
    });

    // ── Super Admin + Admin: halaman operasional ──────────────────────────────
    // GET routes — semua bisa lihat. Controller menentukan isReadOnly berdasar role.
    Route::middleware(['role:super admin,admin'])->group(function () {

        // Kategori
        Route::get('/kategori', [KategoriController::class, 'index'])->name('kategori.index');

        // Pelanggan
        Route::get('/pelanggan', [PelangganController::class, 'index'])->name('pelanggan.index');

        // Supplier
        Route::get('/supplier', [SupplierController::class, 'index'])->name('supplier.index');

        // Barang
        Route::get('/barang', [BarangController::class, 'index'])->name('barang.index');

        // Pembelian
        Route::get('/pembelian', [PembelianController::class, 'index'])->name('pembelian.index');
        Route::get('/pembelian/{pembelian}', [PembelianController::class, 'show'])->name('pembelian.show');

        // Laporan
        Route::get('/laporan/penjualan', [LaporanController::class, 'penjualan'])->name('laporan.penjualan');
        Route::get('/laporan/pembelian', [LaporanController::class, 'pembelian'])->name('laporan.pembelian');

        // Restore Data
        Route::get('/restore-data', [RestoreDataController::class, 'index'])->name('restore-data.index');
        Route::post('/restore-data/{type}/{id}/restore', [RestoreDataController::class, 'restore'])->name('restore-data.restore');
        Route::delete('/restore-data/{type}/{id}/force-delete', [RestoreDataController::class, 'forceDelete'])->name('restore-data.force-delete');
    });

    // ── Rekap Transaksi & Struk — Super Admin, Admin, dan Kasir bisa lihat ─────
    Route::middleware(['role:super admin,admin,kasir'])->group(function () {
        Route::get('/penjualan', [PenjualanController::class, 'index'])->name('penjualan.index');
        Route::get('/pos/struk/{penjualan}', [PenjualanController::class, 'show'])->name('pos.struk');
    });

    // ── Kasir & Admin: Lunasi hutang ──────────────────────────────────────────
    Route::middleware(['role:admin,kasir'])->group(function () {
        Route::post('/penjualan/{penjualan}/lunasi', [PenjualanController::class, 'lunasi'])->name('penjualan.lunasi');
    });

    // ── Admin only: semua aksi TULIS (POST/PUT/DELETE) operasional ────────────
    Route::middleware(['role:admin'])->group(function () {

        // Kategori & Kelompok
        Route::prefix('kategori')->name('kategori.')->group(function () {
            Route::post('/kelompok', [KategoriController::class, 'storeKelompok'])->name('kelompok.store');
            Route::put('/kelompok/{kelompok}', [KategoriController::class, 'updateKelompok'])->name('kelompok.update');
            Route::delete('/kelompok/{kelompok}', [KategoriController::class, 'destroyKelompok'])->name('kelompok.destroy');
            Route::post('/', [KategoriController::class, 'store'])->name('store');
            Route::put('/{kategori}', [KategoriController::class, 'update'])->name('update');
            Route::delete('/{kategori}', [KategoriController::class, 'destroy'])->name('destroy');
        });

        // Pelanggan & Kelompok
        Route::prefix('pelanggan')->name('pelanggan.')->group(function () {
            Route::post('/kelompok', [PelangganController::class, 'storeKelompok'])->name('kelompok.store');
            Route::put('/kelompok/{kelompok}', [PelangganController::class, 'updateKelompok'])->name('kelompok.update');
            Route::delete('/kelompok/{kelompok}', [PelangganController::class, 'destroyKelompok'])->name('kelompok.destroy');
            Route::post('/', [PelangganController::class, 'store'])->name('store');
            Route::put('/{pelanggan}', [PelangganController::class, 'update'])->name('update');
            Route::delete('/{pelanggan}', [PelangganController::class, 'destroy'])->name('destroy');
        });

        // Supplier
        Route::prefix('supplier')->name('supplier.')->group(function () {
            Route::post('/', [SupplierController::class, 'store'])->name('store');
            Route::put('/{supplier}', [SupplierController::class, 'update'])->name('update');
            Route::delete('/{supplier}', [SupplierController::class, 'destroy'])->name('destroy');
        });

        // Barang
        Route::prefix('barang')->name('barang.')->group(function () {
            Route::post('/', [BarangController::class, 'store'])->name('store');
            Route::put('/{barang}', [BarangController::class, 'update'])->name('update');
            Route::delete('/{barang}', [BarangController::class, 'destroy'])->name('destroy');
        });

        // Pembelian
        Route::prefix('pembelian')->name('pembelian.')->group(function () {
            Route::post('/', [PembelianController::class, 'store'])->name('store');
            Route::delete('/{pembelian}', [PembelianController::class, 'destroy'])->name('destroy');
        });

        // Penjualan delete
        Route::delete('/penjualan/{penjualan}', [PenjualanController::class, 'destroy'])->name('penjualan.destroy');
    });

    // ── Kasir only: POS (transaksi baru) ─────────────────────────────────────
    Route::middleware(['role:kasir'])->group(function () {
        Route::get('/pos', [PenjualanController::class, 'pos'])->name('pos.index');
        Route::post('/pos', [PenjualanController::class, 'store'])->name('pos.store');
    });
});

require __DIR__.'/settings.php';

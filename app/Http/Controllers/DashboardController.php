<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Pelanggan;
use App\Models\Pembelian;
use App\Models\Penjualan;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $sekolahId = $user->id_sekolah; // null = SuperAdmin → semua sekolah

        // Helper: terapkan filter sekolah hanya jika bukan SuperAdmin
        $scopeSekolah = fn ($q) => $sekolahId ? $q->where('id_sekolah', $sekolahId) : $q;

        $stats = [
            'total_barang' => $scopeSekolah(Barang::query())->count(),
            'stok_menipis' => $scopeSekolah(Barang::query())->where('stok', '<=', 5)->count(),
            'penjualan_hari_ini' => $scopeSekolah(Penjualan::query())
                ->whereDate('tanggal_penjualan', today())
                ->sum('total_bayar'),
            'penjualan_bulan_ini' => $scopeSekolah(Penjualan::query())
                ->whereMonth('tanggal_penjualan', now()->month)
                ->whereYear('tanggal_penjualan', now()->year)
                ->sum('total_bayar'),
            'pembelian_bulan_ini' => $scopeSekolah(Pembelian::query())
                ->whereMonth('tanggal_faktur', now()->month)
                ->whereYear('tanggal_faktur', now()->year)
                ->sum('total_bayar'),
            'total_pelanggan' => Pelanggan::whereHas(
                'kelompok',
                fn ($q) => $sekolahId ? $q->where('id_sekolah', $sekolahId) : $q
            )->count(),
            'total_supplier' => $scopeSekolah(Supplier::query())->count(),
        ];

        $recent_penjualan = $scopeSekolah(Penjualan::with(['user', 'pelanggan']))
            ->orderByDesc('tanggal_penjualan')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recent_penjualan' => $recent_penjualan,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Pelanggan;
use App\Models\Pembelian;
use App\Models\Penjualan;
use App\Models\Supplier;
use App\Models\Kategori;
use App\Models\DetailPenjualan;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        // Redirect kasir langsung ke POS
        if ($user->role && $user->role->nama_role === 'kasir') {
            return redirect()->route('pos.index');
        }

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

        // --- Data Chart ---

        // 1. Sales Trend (Harian di bulan ini)
        $daysInMonth = now()->daysInMonth;
        $salesTrend = [];
        for ($i = 1; $i <= $daysInMonth; $i++) {
            $date = now()->setDay($i)->format('Y-m-d');
            $total = $scopeSekolah(Penjualan::query())
                ->whereDate('tanggal_penjualan', $date)
                ->sum('total_bayar');
            $salesTrend[] = [
                'day' => $i,
                'total' => (int) $total,
                'formatted_total' => 'Rp ' . number_format($total, 0, ',', '.'),
            ];
        }

        // 2. Income vs Expense (6 Bulan Terakhir)
        $incomeExpense = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $income = $scopeSekolah(Penjualan::query())
                ->whereMonth('tanggal_penjualan', $month->month)
                ->whereYear('tanggal_penjualan', $month->year)
                ->sum('total_bayar');
            $expense = $scopeSekolah(Pembelian::query())
                ->whereMonth('tanggal_faktur', $month->month)
                ->whereYear('tanggal_faktur', $month->year)
                ->sum('total_bayar');

            $incomeExpense[] = [
                'month' => $month->translatedFormat('F'),
                'penjualan' => (int) $income,
                'pembelian' => (int) $expense,
            ];
        }

        // 3. Top Categories (Berdasarkan jumlah terjual)
        $topCategoriesQuery = Kategori::query()
            ->select('tb_kategori.nama', \DB::raw('SUM(tb_detail_penjualan.jumlah_barang) as total_terjual'))
            ->join('tb_barang', 'tb_barang.id_kategori', '=', 'tb_kategori.id_kategori')
            ->join('tb_detail_penjualan', 'tb_detail_penjualan.id_barang', '=', 'tb_barang.id_barang')
            ->join('tb_penjualan', 'tb_penjualan.id_penjualan', '=', 'tb_detail_penjualan.id_penjualan')
            ->groupBy('tb_kategori.id_kategori', 'tb_kategori.nama')
            ->orderByDesc('total_terjual')
            ->limit(5);

        if ($sekolahId) {
            $topCategoriesQuery->where('tb_penjualan.id_sekolah', $sekolahId);
        }

        $topCategories = $topCategoriesQuery->get()->map(fn($item) => [
            'name' => $item->nama,
            'value' => (int) $item->total_terjual,
        ]);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recent_penjualan' => $recent_penjualan,
            'charts' => [
                'sales_trend' => $salesTrend,
                'income_expense' => $incomeExpense,
                'top_categories' => $topCategories,
            ],
        ]);
    }
}

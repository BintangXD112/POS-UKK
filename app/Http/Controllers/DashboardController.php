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

        return Inertia::render('dashboard', [
            'stats' => $this->getStats($sekolahId),
            'recent_penjualan' => $this->getRecentPenjualan($sekolahId),
            'charts' => [
                'sales_trend' => $this->getSalesTrend($sekolahId),
                'income_expense' => $this->getIncomeExpense($sekolahId),
                'top_categories' => $this->getTopCategories($sekolahId),
            ],
        ]);
    }

    /**
     * Apply sekolah scope filter (null = SuperAdmin, sees all).
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int|null  $sekolahId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    private function scopeSekolah($query, ?int $sekolahId)
    {
        return $sekolahId ? $query->where('id_sekolah', $sekolahId) : $query;
    }

    /** @return array<string, mixed> */
    private function getStats(?int $sekolahId): array
    {
        return [
            'total_barang' => $this->scopeSekolah(Barang::query(), $sekolahId)->count(),
            'stok_menipis' => $this->scopeSekolah(Barang::query(), $sekolahId)->where('stok', '<=', 5)->count(),
            'penjualan_hari_ini' => $this->scopeSekolah(Penjualan::query(), $sekolahId)
                ->whereDate('tanggal_penjualan', today())
                ->sum('total_bayar'),
            'penjualan_bulan_ini' => $this->scopeSekolah(Penjualan::query(), $sekolahId)
                ->whereMonth('tanggal_penjualan', now()->month)
                ->whereYear('tanggal_penjualan', now()->year)
                ->sum('total_bayar'),
            'pembelian_bulan_ini' => $this->scopeSekolah(Pembelian::query(), $sekolahId)
                ->whereMonth('tanggal_faktur', now()->month)
                ->whereYear('tanggal_faktur', now()->year)
                ->sum('total_bayar'),
            'total_pelanggan' => Pelanggan::whereHas(
                'kelompok',
                fn ($q) => $sekolahId ? $q->where('id_sekolah', $sekolahId) : $q
            )->count(),
            'total_supplier' => $this->scopeSekolah(Supplier::query(), $sekolahId)->count(),
        ];
    }

    /** @return \Illuminate\Database\Eloquent\Collection */
    private function getRecentPenjualan(?int $sekolahId)
    {
        return $this->scopeSekolah(Penjualan::with(['user', 'pelanggan']), $sekolahId)
            ->orderByDesc('tanggal_penjualan')
            ->limit(5)
            ->get();
    }

    /** @return array<int, array{day: int, total: int, formatted_total: string}> */
    private function getSalesTrend(?int $sekolahId): array
    {
        $daysInMonth = now()->daysInMonth;
        $salesTrend = [];

        for ($i = 1; $i <= $daysInMonth; $i++) {
            $date = now()->setDay($i)->format('Y-m-d');
            $total = $this->scopeSekolah(Penjualan::query(), $sekolahId)
                ->whereDate('tanggal_penjualan', $date)
                ->sum('total_bayar');
            $salesTrend[] = [
                'day' => $i,
                'total' => (int) $total,
                'formatted_total' => 'Rp ' . number_format($total, 0, ',', '.'),
            ];
        }

        return $salesTrend;
    }

    /** @return array<int, array{month: string, penjualan: int, pembelian: int}> */
    private function getIncomeExpense(?int $sekolahId): array
    {
        $incomeExpense = [];

        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $income = $this->scopeSekolah(Penjualan::query(), $sekolahId)
                ->whereMonth('tanggal_penjualan', $month->month)
                ->whereYear('tanggal_penjualan', $month->year)
                ->sum('total_bayar');
            $expense = $this->scopeSekolah(Pembelian::query(), $sekolahId)
                ->whereMonth('tanggal_faktur', $month->month)
                ->whereYear('tanggal_faktur', $month->year)
                ->sum('total_bayar');

            $incomeExpense[] = [
                'month' => $month->translatedFormat('F'),
                'penjualan' => (int) $income,
                'pembelian' => (int) $expense,
            ];
        }

        return $incomeExpense;
    }

    /** @return \Illuminate\Support\Collection */
    private function getTopCategories(?int $sekolahId)
    {
        $query = Kategori::query()
            ->select('tb_kategori.nama', \DB::raw('SUM(tb_detail_penjualan.jumlah_barang) as total_terjual'))
            ->join('tb_barang', 'tb_barang.id_kategori', '=', 'tb_kategori.id_kategori')
            ->join('tb_detail_penjualan', 'tb_detail_penjualan.id_barang', '=', 'tb_barang.id_barang')
            ->join('tb_penjualan', 'tb_penjualan.id_penjualan', '=', 'tb_detail_penjualan.id_penjualan')
            ->groupBy('tb_kategori.id_kategori', 'tb_kategori.nama')
            ->orderByDesc('total_terjual')
            ->limit(5);

        if ($sekolahId) {
            $query->where('tb_penjualan.id_sekolah', $sekolahId);
        }

        return $query->get()->map(fn ($item) => [
            'name' => $item->nama,
            'value' => (int) $item->total_terjual,
        ]);
    }
}

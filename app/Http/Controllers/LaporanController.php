<?php

namespace App\Http\Controllers;

use App\Models\Pembelian;
use App\Models\Penjualan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    public function penjualan(Request $request): Response
    {
        $sekolahId = $request->user()->id_sekolah;
        $dateFrom = $request->input('date_from', now()->startOfMonth()->format('Y-m-d'));
        $dateTo = $request->input('date_to', now()->format('Y-m-d'));

        $penjualan = Penjualan::with(['user', 'pelanggan', 'detail.barang'])
            ->when($sekolahId, fn ($q) => $q->where('id_sekolah', $sekolahId))
            ->whereBetween('tanggal_penjualan', [$dateFrom.' 00:00:00', $dateTo.' 23:59:59'])
            ->orderByDesc('tanggal_penjualan')
            ->get();

        return Inertia::render('laporan/penjualan', [
            'penjualan' => $penjualan,
            'total' => $penjualan->sum('total_bayar'),
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
        ]);
    }

    public function pembelian(Request $request): Response
    {
        $sekolahId = $request->user()->id_sekolah;
        $dateFrom = $request->input('date_from', now()->startOfMonth()->format('Y-m-d'));
        $dateTo = $request->input('date_to', now()->format('Y-m-d'));

        $pembelian = Pembelian::with(['supplier', 'user', 'detail.barang'])
            ->when($sekolahId, fn ($q) => $q->where('id_sekolah', $sekolahId))
            ->whereBetween('tanggal_faktur', [$dateFrom.' 00:00:00', $dateTo.' 23:59:59'])
            ->orderByDesc('tanggal_faktur')
            ->get();

        return Inertia::render('laporan/pembelian', [
            'pembelian' => $pembelian,
            'total' => $pembelian->sum('total_bayar'),
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
        ]);
    }
}

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Penjualan } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart2, FileDown, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Laporan Penjualan', href: '/laporan/penjualan' }];
const fmtRp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

interface Props { penjualan: Penjualan[]; total: number; date_from: string; date_to: string }

export default function LaporanPenjualan({ penjualan, total, date_from, date_to }: Props) {
    const [from, setFrom] = useState(date_from);
    const [to, setTo] = useState(date_to);

    const handleFilter = () => {
        router.get('/laporan/penjualan', { date_from: from, date_to: to }, { preserveState: true });
    };

    const handlePrint = () => {
        document.title = `Laporan Penjualan ${from} s/d ${to}`;
        window.print();
        setTimeout(() => { document.title = 'Laporan Penjualan'; }, 1000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Penjualan" />
            <FlashMessage />
            <div className="p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Laporan Penjualan</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">Rekap transaksi penjualan berdasarkan periode</p>
                    </div>
                    <Button onClick={handlePrint} variant="outline" className="gap-2 print:hidden">
                        <FileDown className="h-4 w-4" />
                        Export PDF
                    </Button>
                </div>

                {/* Print-only header */}
                <div className="hidden print:block text-center mb-4">
                    <h2 className="text-lg font-bold">Laporan Penjualan</h2>
                    <p className="text-sm text-neutral-500">Periode: {from} s/d {to}</p>
                </div>

                {/* Filter */}
                <div className="flex flex-wrap items-end gap-3 bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-4 shadow-sm print:hidden">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Dari Tanggal</Label>
                        <Input type="date" value={from} onChange={e => setFrom(e.target.value)} className="h-8" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Sampai Tanggal</Label>
                        <Input type="date" value={to} onChange={e => setTo(e.target.value)} className="h-8" />
                    </div>
                    <Button onClick={handleFilter} size="sm" className="gap-2">
                        <BarChart2 className="h-4 w-4" /> Tampilkan
                    </Button>
                </div>

                {/* Summary Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 p-5 shadow-sm">
                        <div className="inline-flex h-10 w-10 rounded-xl bg-emerald-500 items-center justify-center mb-3">
                            <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-2xl font-bold">{fmtRp(total)}</p>
                        <p className="text-sm text-neutral-500 mt-0.5">Total Penjualan</p>
                    </div>
                    <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 p-5 shadow-sm">
                        <p className="text-2xl font-bold">{penjualan.length}</p>
                        <p className="text-sm text-neutral-500 mt-1">Total Transaksi</p>
                    </div>
                    <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 p-5 shadow-sm">
                        <p className="text-2xl font-bold">{penjualan.length > 0 ? fmtRp(total / penjualan.length) : 'Rp 0'}</p>
                        <p className="text-sm text-neutral-500 mt-1">Rata-rata per Transaksi</p>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                            <tr className="text-left text-xs text-neutral-500">
                                <th className="px-5 py-3.5 font-medium">Tanggal</th>
                                <th className="px-5 py-3.5 font-medium">Kasir</th>
                                <th className="px-5 py-3.5 font-medium">Pelanggan</th>
                                <th className="px-5 py-3.5 font-medium">Jenis Bayar</th>
                                <th className="px-5 py-3.5 font-medium text-right">Total</th>
                                <th className="px-5 py-3.5 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {penjualan.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-neutral-400">Tidak ada transaksi pada periode ini</td></tr>
                            ) : penjualan.map(p => (
                                <tr key={p.id_penjualan} className="border-b last:border-0 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                                    <td className="px-5 py-3 text-neutral-500">{new Date(p.tanggal_penjualan).toLocaleDateString('id-ID')}</td>
                                    <td className="px-5 py-3">{p.user?.nama_lengkap}</td>
                                    <td className="px-5 py-3">{p.pelanggan?.nama_pelanggan ?? <span className="text-neutral-400 text-xs">Umum</span>}</td>
                                    <td className="px-5 py-3 text-xs capitalize text-neutral-500">{p.cara_bayar || p.jenis_transaksi}</td>
                                    <td className="px-5 py-3 font-semibold text-right">{fmtRp(p.total_bayar)}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.status_pembayaran === 'sudah bayar' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {p.status_pembayaran}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                            <tr>
                                <td colSpan={4} className="px-5 py-3 text-sm font-semibold text-right">Total:</td>
                                <td className="px-5 py-3 font-bold text-right text-emerald-600">{fmtRp(total)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

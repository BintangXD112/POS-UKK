import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Pembelian } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart2, FileDown, TrendingDown } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Laporan Pembelian', href: '/laporan/pembelian' }];
const fmtRp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

interface Props { pembelian: Pembelian[]; total: number; date_from: string; date_to: string }

export default function LaporanPembelian({ pembelian, total, date_from, date_to }: Props) {
    const [from, setFrom] = useState(date_from);
    const [to, setTo] = useState(date_to);

    const handleFilter = () => {
        router.get('/laporan/pembelian', { date_from: from, date_to: to }, { preserveState: true });
    };

    const handlePrint = () => {
        document.title = `Laporan Pembelian ${from} s/d ${to}`;
        window.print();
        setTimeout(() => { document.title = 'Laporan Pembelian'; }, 1000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Pembelian" />
            <FlashMessage />
            <div className="p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Laporan Pembelian</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">Rekap transaksi pembelian berdasarkan periode</p>
                    </div>
                    <Button onClick={handlePrint} variant="outline" className="gap-2 print:hidden">
                        <FileDown className="h-4 w-4" />
                        Export PDF
                    </Button>
                </div>

                {/* Print-only header */}
                <div className="hidden print:block text-center mb-4">
                    <h2 className="text-lg font-bold">Laporan Pembelian</h2>
                    <p className="text-sm text-neutral-500">Periode: {from} s/d {to}</p>
                </div>

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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 p-5 shadow-sm">
                        <div className="inline-flex h-10 w-10 rounded-xl bg-orange-500 items-center justify-center mb-3">
                            <TrendingDown className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-2xl font-bold">{fmtRp(total)}</p>
                        <p className="text-sm text-neutral-500 mt-0.5">Total Pembelian</p>
                    </div>
                    <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 p-5 shadow-sm">
                        <p className="text-2xl font-bold">{pembelian.length}</p>
                        <p className="text-sm text-neutral-500 mt-1">Total Faktur</p>
                    </div>
                    <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 p-5 shadow-sm">
                        <p className="text-2xl font-bold">{pembelian.length > 0 ? fmtRp(total / pembelian.length) : 'Rp 0'}</p>
                        <p className="text-sm text-neutral-500 mt-1">Rata-rata per Faktur</p>
                    </div>
                </div>

                <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                            <tr className="text-left text-xs text-neutral-500">
                                <th className="px-5 py-3.5 font-medium">No. Faktur</th>
                                <th className="px-5 py-3.5 font-medium">Tanggal</th>
                                <th className="px-5 py-3.5 font-medium">Supplier</th>
                                <th className="px-5 py-3.5 font-medium">Petugas</th>
                                <th className="px-5 py-3.5 font-medium">Jenis</th>
                                <th className="px-5 py-3.5 font-medium text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pembelian.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-neutral-400">Tidak ada data pembelian pada periode ini</td></tr>
                            ) : pembelian.map(p => (
                                <tr key={p.id_pembelian} className="border-b last:border-0 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-medium text-blue-600">{p.nomor_faktur}</td>
                                    <td className="px-5 py-3 text-neutral-500">{new Date(p.tanggal_faktur).toLocaleDateString('id-ID')}</td>
                                    <td className="px-5 py-3">{p.supplier?.nama}</td>
                                    <td className="px-5 py-3 text-neutral-500">{p.user?.nama_lengkap}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.jenis_transaksi === 'tunai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {p.jenis_transaksi}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 font-semibold text-right">{fmtRp(p.total_bayar)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                            <tr>
                                <td colSpan={5} className="px-5 py-3 text-sm font-semibold text-right">Total:</td>
                                <td className="px-5 py-3 font-bold text-right text-orange-600">{fmtRp(total)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

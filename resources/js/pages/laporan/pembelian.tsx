import { useState, useEffect, Fragment } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Pembelian } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart2, FileDown, TrendingDown, Receipt, Calculator, ChevronDown } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Laporan Pembelian', href: '/laporan/pembelian' }];
const fmtRp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

interface Props { pembelian: Pembelian[]; total: number; date_from: string; date_to: string }

export default function LaporanPembelian({ pembelian, total, date_from, date_to }: Props) {
    const [from, setFrom] = useState(date_from);
    const [to, setTo] = useState(date_to);

    const [localPembelian, setLocalPembelian] = useState(pembelian);
    const [localTotal, setLocalTotal] = useState(total);
    const [loading, setLoading] = useState(false);
    const page = usePage();

    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const toggleExpand = (id: number) => {
        setExpanded(prev => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    };
    useEffect(() => {
        setLocalPembelian(pembelian);
        setLocalTotal(total);
    }, [pembelian, total]);

    const handleFilter = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/laporan/pembelian', {
                params: { date_from: from, date_to: to },
                headers: {
                    'X-Inertia': 'true',
                    'X-Inertia-Version': page.version,
                    'X-Inertia-Partial-Data': 'pembelian,total,date_from,date_to',
                    'X-Inertia-Partial-Component': 'laporan/pembelian'
                }
            });
            setLocalPembelian(res.data.props.pembelian);
            setLocalTotal(res.data.props.total);
            window.history.replaceState({}, '', `/laporan/pembelian?date_from=${from}&date_to=${to}`);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
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
            <div className="p-4 md:p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20">
                            <Receipt className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Laporan Pembelian</h1>
                            <p className="text-sm text-muted-foreground">Rekap transaksi pembelian berdasarkan periode</p>
                        </div>
                    </div>
                    <Button onClick={handlePrint} variant="outline" className="gap-2 rounded-xl print:hidden">
                        <FileDown className="h-4 w-4" /> Export PDF
                    </Button>
                </div>

                {/* Print header */}
                <div className="hidden print:block text-center mb-4">
                    <h2 className="text-lg font-bold">Laporan Pembelian</h2>
                    <p className="text-sm text-muted-foreground">Periode: {from} s/d {to}</p>
                </div>

                {/* Filter */}
                <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm print:hidden">
                    <div className="space-y-1.5 flex-1 max-w-xs">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Dari Tanggal</Label>
                        <Input type="date" value={from} onChange={e => setFrom(e.target.value)} className="h-10 rounded-xl" />
                    </div>
                    <div className="space-y-1.5 flex-1 max-w-xs">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sampai Tanggal</Label>
                        <Input type="date" value={to} onChange={e => setTo(e.target.value)} className="h-10 rounded-xl" />
                    </div>
                    <Button onClick={handleFilter} disabled={loading} className="h-10 gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors">
                        <BarChart2 className="h-4 w-4" /> {loading ? 'Memuat...' : 'Tampilkan'}
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="relative overflow-hidden rounded-2xl bg-teal-600 p-5 text-white shadow-lg shadow-teal-500/20">
                        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 mb-3">
                            <TrendingDown className="h-5 w-5" />
                        </div>
                        <p className="text-2xl font-bold">{fmtRp(localTotal)}</p>
                        <p className="text-sm text-teal-100 mt-0.5">Total Pembelian</p>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl bg-card border border-border/60 p-5 shadow-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 mb-3">
                            <Receipt className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <p className="text-2xl font-bold">{localPembelian.length}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">Total Faktur</p>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl bg-card border border-border/60 p-5 shadow-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 mb-3">
                            <Calculator className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <p className="text-2xl font-bold">{localPembelian.length > 0 ? fmtRp(localTotal / localPembelian.length) : 'Rp 0'}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">Rata-rata per Faktur</p>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
                    <div className="h-[2px] bg-gradient-to-r from-teal-500/70 to-cyan-500/40" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left bg-muted/30">
                                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">No. Faktur</th>
                                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tanggal</th>
                                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Supplier</th>
                                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Petugas</th>
                                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Jenis</th>
                                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">Total</th>
                                    <th className="px-3 py-3.5 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {localPembelian.length === 0 ? (
                                    <tr><td colSpan={7}>
                                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted"><Receipt className="h-6 w-6" /></div>
                                            <p className="text-sm font-medium">Tidak ada data pembelian pada periode ini</p>
                                        </div>
                                    </td></tr>
                                ) : localPembelian.map(p => (
                                    <Fragment key={p.id_pembelian}>
                                        <tr onClick={() => toggleExpand(p.id_pembelian)} className="cursor-pointer hover:bg-muted/40 transition-colors duration-100">
                                            <td className="px-5 py-3.5 font-mono text-xs font-semibold text-teal-600 dark:text-teal-400">{p.nomor_faktur}</td>
                                            <td className="px-5 py-3.5 text-muted-foreground text-xs">{new Date(p.tanggal_faktur).toLocaleDateString('id-ID')}</td>
                                            <td className="px-5 py-3.5 font-medium">{p.supplier?.nama}</td>
                                            <td className="px-5 py-3.5 text-muted-foreground">{p.user?.nama_lengkap}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${p.jenis_transaksi === 'tunai' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                                    {p.jenis_transaksi}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 font-semibold text-right text-teal-700 dark:text-teal-400">{fmtRp(p.total_bayar)}</td>
                                            <td className="px-3 py-3.5"><ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded.has(p.id_pembelian) ? 'rotate-180' : ''}`} /></td>
                                        </tr>
                                        {expanded.has(p.id_pembelian) && (
                                            <tr className="bg-muted/10">
                                                <td colSpan={7} className="p-0 border-b">
                                                    <div className="px-5 py-4 pl-12 border-l-4 border-teal-500">
                                                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Detail Barang Dipesan</h4>
                                                        <div className="space-y-2 max-w-lg">
                                                            {p.detail?.map(d => (
                                                                <div key={d.id_detail_pembelian} className="flex justify-between items-center text-sm border-b border-border/40 pb-2 last:border-0 last:pb-0">
                                                                    <div>
                                                                        <p className="font-medium text-foreground">{d.barang?.nama}</p>
                                                                        <p className="text-xs text-muted-foreground mt-0.5">{d.jumlah} {d.satuan} x {fmtRp(d.harga_beli)}</p>
                                                                    </div>
                                                                    <div className="font-semibold text-teal-700 dark:text-teal-400">
                                                                        {fmtRp(d.subtotal)}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))}
                            </tbody>
                            {localPembelian.length > 0 && (
                                <tfoot className="border-t bg-muted/10">
                                    <tr>
                                        <td colSpan={6} className="px-5 py-4 text-sm font-semibold text-right text-muted-foreground uppercase tracking-wide">Total Keseluruhan:</td>
                                        <td className="px-5 py-4 font-bold text-right text-teal-700 dark:text-teal-400 text-base">{fmtRp(localTotal)}</td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

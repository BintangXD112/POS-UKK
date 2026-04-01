import { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Penjualan } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { DeleteConfirm } from '@/components/delete-confirm';
import { SchoolFilter } from '@/components/school-filter';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Eye, FileDown, Receipt, Store, Wallet, CheckCircle2 } from 'lucide-react';
import type { SharedProps } from '@/types/auth';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Rekap Transaksi', href: '/penjualan' }];
const fmtRp = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n));

interface Props {
    penjualan: Penjualan[];
    isReadOnly: boolean;
    sekolahList: { id_sekolah: number; nama_sekolah: string }[];
    selectedSekolahId: number | null;
}

export default function PenjualanIndex({ penjualan, isReadOnly, sekolahList, selectedSekolahId }: Props) {
    const [sekolahFilter, setSekolahFilter] = useState<number | null>(selectedSekolahId);
    const [lunasiData, setLunasiData] = useState<number | null>(null);
    const [processingLunasi, setProcessingLunasi] = useState(false);
    
    const { auth } = usePage<SharedProps>().props;
    const isKasir = auth?.user?.role?.nama_role === 'kasir';
    const isSuperAdmin = auth?.user?.role?.nama_role === 'super admin';

    const handlePrint = () => {
        document.title = 'Rekap Transaksi Penjualan';
        window.print();
        setTimeout(() => { document.title = 'Transaksi Penjualan'; }, 1000);
    };

    const filteredPenjualan = penjualan.filter(p => sekolahFilter === null || p.id_sekolah === sekolahFilter);
    const totalRevenue = filteredPenjualan.reduce((sum, p) => sum + Number(p.total_bayar), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekap Transaksi" />
            <FlashMessage />

            <div className="p-4 md:p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20">
                            <Receipt className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Rekap Transaksi</h1>
                            <p className="text-sm text-muted-foreground">Riwayat semua transaksi penjualan</p>
                        </div>
                    </div>
                    <div className="flex gap-2 print:hidden items-center">
                        {/* Filter sekolah untuk super admin */}
                        {isReadOnly && !isKasir && (
                            <SchoolFilter
                                sekolahList={sekolahList ?? []}
                                selectedSekolahId={sekolahFilter}
                                baseUrl="/penjualan"
                                onClientFilter={setSekolahFilter}
                            />
                        )}
                        <Button onClick={handlePrint} variant="outline" className="gap-2 rounded-xl">
                            <FileDown className="h-4 w-4" /> Export PDF
                        </Button>
                        {/* Kasir: tombol balik ke POS */}
                        {isKasir && (
                            <Button asChild className="gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20 hover:-translate-y-0.5 transition-all">
                                <Link href="/pos"><Store className="h-4 w-4" /> Buka Kasir</Link>


                            </Button>
                        )}
                    </div>
                </div>

                {/* Summary bar */}
                {filteredPenjualan.length > 0 && (
                    <div className="flex items-center gap-6 rounded-2xl border bg-teal-500/5 border-teal-200/40 dark:border-teal-800/30 px-6 py-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Transaksi</p>
                            <p className="text-2xl font-bold text-teal-700 dark:text-teal-400">{filteredPenjualan.length}</p>
                        </div>
                        <div className="h-10 w-px bg-border" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Revenue</p>
                            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{fmtRp(totalRevenue)}</p>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
                    <div className="h-[2px] bg-gradient-to-r from-teal-500/70 to-cyan-500/40" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left bg-muted/30">
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tanggal</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pelanggan</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Faktur</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Bayar</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kembalian / Hutang</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Jenis</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                                    <th className="px-5 py-3 w-24" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {filteredPenjualan.length === 0 ? (
                                    <tr><td colSpan={8}>
                                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted"><Receipt className="h-6 w-6" /></div>
                                            <p className="text-sm font-medium">Belum ada transaksi penjualan</p>
                                        </div>
                                    </td></tr>
                                ) : filteredPenjualan.map((p) => (
                                    <tr key={p.id_penjualan} className="hover:bg-muted/40 transition-colors duration-100">
                                        <td className="px-5 py-3.5 text-muted-foreground text-xs">
                                            {new Date(p.tanggal_penjualan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {p.pelanggan?.nama_pelanggan ?? (
                                                <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">Umum</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 font-semibold">{fmtRp(p.total_faktur)}</td>
                                        <td className="px-5 py-3.5 font-semibold text-teal-600 dark:text-teal-400">{fmtRp(p.total_bayar)}</td>
                                        <td className="px-5 py-3.5 font-semibold">
                                            {Number(p.kembalian) < 0 ? (
                                                <span className="text-red-500">{fmtRp(p.kembalian)}</span>
                                            ) : (
                                                <span className="text-emerald-600 dark:text-emerald-400">{fmtRp(p.kembalian)}</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                p.jenis_transaksi === 'tunai'
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                                {p.jenis_transaksi ?? '-'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                                                p.status_pembayaran === 'sudah bayar'
                                                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                                                    : p.status_pembayaran === 'hutang'
                                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                                {p.status_pembayaran}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1">
                                                {/* Tombol Lunasi Hutang */}
                                                {!isSuperAdmin && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-8 w-8 p-0 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 disabled:opacity-30 disabled:pointer-events-none" 
                                                        disabled={p.status_pembayaran !== 'hutang'}
                                                        title={p.status_pembayaran === 'hutang' ? "Lunasi Hutang" : ""}
                                                        onClick={() => setLunasiData(p.id_penjualan)}
                                                    >
                                                        <Wallet className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}

                                                {/* Tombol lihat struk — selalu boleh dilihat */}
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600" asChild>
                                                    <Link href={`/pos/struk/${p.id_penjualan}`}><Eye className="h-3.5 w-3.5" /></Link>
                                                </Button>
                                                {/* Hapus hanya untuk admin */}
                                                {!isReadOnly && (
                                                    <DeleteConfirm url={`/penjualan/${p.id_penjualan}`} name={`transaksi #${p.id_penjualan}`} />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Lunasi Hutang */}
            <AlertDialog open={lunasiData !== null} onOpenChange={(open) => !open && !processingLunasi && setLunasiData(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-emerald-600">
                            <CheckCircle2 className="h-5 w-5" />
                            Konfirmasi Pelunasan Hutang
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                            Apakah Anda yakin hutang pada transaksi <strong>#{lunasiData}</strong> ini sudah dilunasi secara tunai oleh pelanggan?
                            <br /><br />
                            Aksi ini akan mengubah status tagihan menjadi <strong>LUNAS</strong> dan tidak dapat dikembalikan ke status hutang lagi.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel disabled={processingLunasi}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                if (!lunasiData) return;
                                setProcessingLunasi(true);
                                router.post(`/penjualan/${lunasiData}/lunasi`, {}, {
                                    preserveScroll: true,
                                    onFinish: () => {
                                        setProcessingLunasi(false);
                                        setLunasiData(null);
                                    }
                                });
                            }}
                            disabled={processingLunasi}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {processingLunasi ? 'Memproses...' : 'Ya, Bayar Lunas'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

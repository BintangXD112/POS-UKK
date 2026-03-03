import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Penjualan } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { DeleteConfirm } from '@/components/delete-confirm';
import { Button } from '@/components/ui/button';
import { Eye, CreditCard, FileDown } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Transaksi Penjualan', href: '/penjualan' }];
const fmtRp = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n));

interface Props {
    penjualan: Penjualan[];
}

export default function PenjualanIndex({ penjualan }: Props) {
    const handlePrint = () => {
        document.title = 'Rekap Transaksi Penjualan';
        window.print();
        setTimeout(() => { document.title = 'Transaksi Penjualan'; }, 1000);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi Penjualan" />
            <FlashMessage />

            <div className="p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Transaksi Penjualan</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">Riwayat semua transaksi penjualan</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handlePrint} variant="outline" className="gap-2 print:hidden">
                            <FileDown className="h-4 w-4" />
                            Export PDF
                        </Button>
                        <Button asChild className="gap-2 bg-violet-600 hover:bg-violet-700 print:hidden">
                            <Link href="/pos">
                                <CreditCard className="h-4 w-4" />
                                Buka Kasir
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                            <tr className="text-left text-xs text-neutral-500">
                                <th className="px-5 py-3.5 font-medium">Tanggal</th>
                                <th className="px-5 py-3.5 font-medium">Pelanggan</th>
                                <th className="px-5 py-3.5 font-medium">Total Faktur</th>
                                <th className="px-5 py-3.5 font-medium">Total Bayar</th>
                                <th className="px-5 py-3.5 font-medium">Jenis</th>
                                <th className="px-5 py-3.5 font-medium">Status</th>
                                <th className="px-5 py-3.5 font-medium w-24"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {penjualan.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-neutral-400">
                                        Belum ada data transaksi penjualan
                                    </td>
                                </tr>
                            ) : (
                                penjualan.map((p) => (
                                    <tr
                                        key={p.id_penjualan}
                                        className="border-b last:border-0 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                                    >
                                        <td className="px-5 py-3 text-neutral-500">
                                            {new Date(p.tanggal_penjualan).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-5 py-3">
                                            {p.pelanggan?.nama_pelanggan ?? (
                                                <span className="text-neutral-400 italic text-xs">Umum</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3 font-semibold">{fmtRp(p.total_faktur)}</td>
                                        <td className="px-5 py-3">{fmtRp(p.total_bayar)}</td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.jenis_transaksi === 'tunai'
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                    }`}
                                            >
                                                {p.jenis_transaksi ?? '-'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.status_pembayaran === 'sudah bayar'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}
                                            >
                                                {p.status_pembayaran}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                                                    <Link href={`/pos/struk/${p.id_penjualan}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <DeleteConfirm
                                                    url={`/penjualan/${p.id_penjualan}`}
                                                    name={`transaksi #${p.id_penjualan}`}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

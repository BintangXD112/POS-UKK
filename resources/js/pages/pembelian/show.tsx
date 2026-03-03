import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Pembelian } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileDown } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pembelian', href: '/pembelian' },
    { title: 'Detail', href: '#' },
];

const fmtRp = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n));

interface Props {
    pembelian: Pembelian;
}

export default function PembelianShow({ pembelian }: Props) {
    const handlePrint = () => {
        document.title = `Faktur Pembelian ${pembelian.nomor_faktur}`;
        window.print();
        setTimeout(() => { document.title = 'Detail Pembelian'; }, 1000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pembelian ${pembelian.nomor_faktur}`} />

            <div className="p-4 md:p-6 space-y-4">
                {/* Action bar */}
                <div className="flex items-center gap-3 print:hidden">
                    <Button variant="outline" asChild className="gap-2">
                        <Link href="/pembelian">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                    <Button onClick={handlePrint} variant="outline" className="gap-2">
                        <FileDown className="h-4 w-4" />
                        Export PDF
                    </Button>
                </div>

                {/* Header card */}
                <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm overflow-hidden">
                    <div className="bg-orange-500 text-white px-6 py-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-orange-200 uppercase tracking-wider font-medium">No. Faktur</p>
                                <p className="text-2xl font-bold font-mono mt-1">{pembelian.nomor_faktur}</p>
                            </div>
                            <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-white/20 text-white capitalize">
                                {pembelian.status_pembelian}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 text-sm">
                        <div>
                            <p className="text-xs text-neutral-400 mb-1">Tanggal</p>
                            <p className="font-medium">
                                {new Date(pembelian.tanggal_faktur).toLocaleDateString('id-ID', {
                                    day: '2-digit', month: 'long', year: 'numeric',
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400 mb-1">Supplier</p>
                            <p className="font-medium">{pembelian.supplier?.nama ?? '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400 mb-1">Petugas</p>
                            <p className="font-medium">{pembelian.user?.nama_lengkap ?? '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400 mb-1">Jenis Bayar</p>
                            <p className="font-medium capitalize">
                                {pembelian.jenis_transaksi}
                                {pembelian.cara_bayar ? ` · ${pembelian.cara_bayar}` : ''}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Detail items */}
                <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 overflow-hidden shadow-sm">
                    <div className="px-5 py-3.5 border-b dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                        <h2 className="text-sm font-semibold">Daftar Barang</h2>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-neutral-500 border-b dark:border-neutral-800">
                                <th className="px-5 py-3 font-medium">Barang</th>
                                <th className="px-5 py-3 font-medium">Satuan</th>
                                <th className="px-5 py-3 font-medium text-right">Jumlah</th>
                                <th className="px-5 py-3 font-medium text-right">Harga Beli</th>
                                <th className="px-5 py-3 font-medium text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(pembelian.detail ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-neutral-400">
                                        Tidak ada detail barang
                                    </td>
                                </tr>
                            ) : (pembelian.detail ?? []).map((d, i) => (
                                <tr key={i} className="border-b last:border-0 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-5 py-3 font-medium">{d.barang?.nama ?? `Barang #${d.id_barang}`}</td>
                                    <td className="px-5 py-3 text-neutral-500">{d.satuan}</td>
                                    <td className="px-5 py-3 text-right">{d.jumlah}</td>
                                    <td className="px-5 py-3 text-right">{fmtRp(d.harga_beli)}</td>
                                    <td className="px-5 py-3 text-right font-semibold">{fmtRp(d.subtotal)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                            <tr>
                                <td colSpan={4} className="px-5 py-3.5 text-sm font-semibold text-right">Total Pembelian:</td>
                                <td className="px-5 py-3.5 font-bold text-right text-orange-600 text-base">
                                    {fmtRp(pembelian.total_bayar)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Note */}
                {pembelian.note && (
                    <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 p-5 shadow-sm">
                        <p className="text-xs text-neutral-400 mb-1.5">Catatan</p>
                        <p className="text-sm">{pembelian.note}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

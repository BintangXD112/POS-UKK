import { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Penjualan } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Transaksi Penjualan', href: '/penjualan' },
    { title: 'Struk', href: '#' },
];

const fmtRp = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n));

interface Props {
    penjualan: Penjualan;
}

export default function PosStruk({ penjualan }: Props) {
    const handlePrint = () => window.print();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('print') === 'true') {
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Struk #${penjualan.id_penjualan}`} />

            <div className="p-4 md:p-6">
                {/* Action buttons — hidden on print */}
                <div className="flex items-center gap-3 mb-6 print:hidden">
                    <Button variant="outline" asChild className="gap-2">
                        <Link href="/penjualan">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                    <Button onClick={handlePrint} className="gap-2 bg-teal-600 hover:bg-teal-700">
                        <Printer className="h-4 w-4" />
                        Cetak Struk
                    </Button>
                </div>

                {/* Receipt card */}
                <div className="max-w-sm mx-auto bg-white dark:bg-neutral-900 rounded-2xl border dark:border-neutral-800 shadow-sm overflow-hidden print:shadow-none print:border-none print:max-w-full">
                    {/* Header */}
                    <div className="bg-teal-600 text-white p-6 text-center">
                        <h1 className="text-lg font-bold tracking-wide">
                            {penjualan.sekolah?.nama_sekolah ?? 'POS Koperasi'}
                        </h1>
                        {penjualan.sekolah?.alamat_sekolah && (
                            <p className="text-xs text-teal-200 mt-1">{penjualan.sekolah.alamat_sekolah}</p>
                        )}
                        <p className="text-xs text-teal-200 mt-3 font-mono">
                            #{String(penjualan.id_penjualan).padStart(6, '0')}
                        </p>
                        <p className="text-xs text-teal-200 mt-0.5">
                        {new Date(penjualan.tanggal_penjualan).toLocaleString('id-ID', {
                            timeZone: 'Asia/Jakarta',
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                        </p>
                    </div>

                    <div className="p-5 space-y-4">
                        {/* Info transaksi */}
                        <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Kasir</span>
                                <span className="font-medium">{penjualan.user?.nama_lengkap ?? '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Pelanggan</span>
                                <span className="font-medium">
                                    {penjualan.pelanggan?.nama_pelanggan ?? 'Umum'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Pembayaran</span>
                                <span className="font-medium capitalize">
                                    {penjualan.jenis_transaksi ?? '-'}
                                    {penjualan.cara_bayar ? ` · ${penjualan.cara_bayar}` : ''}
                                </span>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-neutral-500">Status</span>
                                <span className={`font-bold uppercase ${
                                    penjualan.status_pembayaran === 'sudah bayar' ? 'text-emerald-600' : 'text-orange-600'
                                }`}>
                                    {penjualan.status_pembayaran === 'sudah bayar' ? 'LUNAS' : penjualan.status_pembayaran}
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-dashed dark:border-neutral-700" />

                        {/* Items */}
                        <div className="space-y-2">
                            {(penjualan.detail ?? []).map((d, i) => (
                                <div key={i} className="text-sm">
                                    <div className="font-medium">{d.barang?.nama ?? `Barang #${d.id_barang}`}</div>
                                    <div className="flex justify-between text-neutral-500 text-xs mt-0.5">
                                        <span>
                                            {d.jumlah_barang} × {fmtRp(d.harga_jual)}
                                        </span>
                                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                                            {fmtRp(d.subtotal)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-dashed dark:border-neutral-700" />

                        {/* Total section */}
                        <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Subtotal</span>
                                <span>{fmtRp(penjualan.total_faktur)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Dibayar</span>
                                <span>{fmtRp(penjualan.total_bayar)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-base pt-1 border-t dark:border-neutral-700">
                                <span>{Number(penjualan.kembalian) < 0 ? 'Hutang' : 'Kembalian'}</span>
                                <span className={Number(penjualan.kembalian) < 0 ? 'text-red-500' : 'text-emerald-600'}>
                                    {Number(penjualan.kembalian) < 0 ? fmtRp(Math.abs(Number(penjualan.kembalian))) : fmtRp(penjualan.kembalian)}
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-xs text-neutral-400 pt-2 border-t border-dashed dark:border-neutral-700">
                            Terima kasih atas kunjungan Anda 🙏
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

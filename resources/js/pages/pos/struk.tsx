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
            <Head title={`Struk #${penjualan.id_penjualan}`}>
                <style>{`
                    @media print {
                        @page { margin: 0; size: 58mm auto; }
                        body { padding: 0mm; margin: 0 auto; width: 58mm; color: black; background: white; }
                        /* Ensure background colors print correctly */
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    }
                `}</style>
            </Head>

            <div className="p-4 md:p-6 print:p-0 print:m-0">
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
                <div className="max-w-sm mx-auto bg-white dark:bg-neutral-900 rounded-2xl border dark:border-neutral-800 shadow-sm overflow-hidden print:shadow-none print:border-none print:text-black print:rounded-none print:max-w-full print:w-full print:mx-0">
                    {/* Header */}
                    <div className="bg-teal-600 text-white p-6 text-center">
                        <h1 className="text-lg font-bold tracking-wide">
                            {penjualan.sekolah?.nama_sekolah ?? 'POS UKK'}
                        </h1>
                        {penjualan.sekolah?.alamat_sekolah && (
                            <p className="text-xs text-teal-200 mt-1">{penjualan.sekolah.alamat_sekolah}</p>
                        )}
                        <p className="text-xs text-teal-200 mt-3 font-mono">
                            #{String(penjualan.id_penjualan).padStart(6, '0')}
                        </p>
                        <p className="text-xs text-teal-200 mt-0.5 print:text-teal-100">
                        {new Date(penjualan.tanggal_penjualan).toLocaleString('id-ID', {
                            timeZone: 'Asia/Jakarta',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                        </p>
                    </div>

                    <div className="p-3 md:p-5 space-y-3 print:p-2">
                        {/* Info transaksi */}
                        <div className="space-y-1 text-xs md:text-sm">
                            <div className="flex justify-between items-center text-[10px] md:text-xs text-neutral-500 print:text-black">
                                <span>Kasir: {penjualan.user?.nama_lengkap ?? '-'}</span>
                                <span>Pembeli: {penjualan.pelanggan?.nama_pelanggan ?? 'Umum'}</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-dashed dark:border-neutral-700 print:border-neutral-400" />

                        {/* Items */}
                        <div className="space-y-1.5">
                            {(penjualan.detail ?? []).map((d, i) => (
                                <div key={i} className="text-[11px] md:text-sm print:leading-tight">
                                    <div className="font-medium print:text-[10px]">{d.barang?.nama ?? `Barang #${d.id_barang}`}</div>
                                    <div className="flex justify-between text-neutral-500 print:text-black mt-0.5">
                                        <span className="print:text-[10px]">
                                            {d.jumlah_barang} × {fmtRp(d.harga_jual)}
                                        </span>
                                        <span className="font-semibold text-neutral-700 dark:text-neutral-300 print:text-black print:text-[11px]">
                                            {fmtRp(d.subtotal)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-dashed dark:border-neutral-700 print:border-neutral-400" />

                        {/* Total section */}
                        <div className="space-y-1 text-xs md:text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-500 print:text-black">Subtotal</span>
                                <span className="print:font-semibold print:text-[11px]">{fmtRp(penjualan.total_faktur)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500 print:text-black">Dibayar</span>
                                <span className="print:font-semibold print:text-[11px]">{fmtRp(penjualan.total_bayar)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-sm md:text-base pt-1 border-t dark:border-neutral-700 print:border-neutral-400">
                                <span>{Number(penjualan.kembalian) < 0 ? 'Hutang' : 'Kembalian'}</span>
                                <span className={Number(penjualan.kembalian) < 0 ? 'text-red-500 print:text-black' : 'text-emerald-600 print:text-black'}>
                                    {Number(penjualan.kembalian) < 0 ? fmtRp(Math.abs(Number(penjualan.kembalian))) : fmtRp(penjualan.kembalian)}
                                </span>
                            </div>
                            
                            <div className="flex justify-between text-[11px] pt-1">
                                <span className="text-neutral-500 print:text-black">Metode</span>
                                <span className="font-medium capitalize print:text-black print:text-[10px]">{penjualan.jenis_transaksi} {penjualan.cara_bayar ? `(${penjualan.cara_bayar})` : ''}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-[10px] md:text-xs text-neutral-400 print:text-black pt-2 border-t border-dashed dark:border-neutral-700 print:border-neutral-400">
                            Terima kasih atas kunjungan Anda 🙏
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

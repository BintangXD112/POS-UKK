import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { DashboardStats, Penjualan } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import {
    Package, TrendingUp, TrendingDown, Users, Truck,
    ShoppingBag, AlertTriangle,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

interface Props {
    stats: DashboardStats;
    recent_penjualan: Penjualan[];
}

function StatCard({
    label, value, icon: Icon, color, sub,
}: { label: string; value: string | number; icon: any; color: string; sub?: string }) {
    return (
        <div className="relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:bg-neutral-900 dark:border-neutral-800">
            <div className={`absolute -top-4 -right-4 h-20 w-20 rounded-full opacity-10 ${color}`} />
            <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl ${color} mb-3`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{label}</p>
            {sub && <p className="text-xs text-neutral-400 mt-1">{sub}</p>}
        </div>
    );
}

export default function Dashboard({ stats, recent_penjualan }: Props) {
    const fmt = (n: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <FlashMessage />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Total Barang" value={stats.total_barang} icon={Package} color="bg-violet-500" />
                    <StatCard label="Penjualan Hari Ini" value={fmt(stats.penjualan_hari_ini)} icon={TrendingUp} color="bg-emerald-500" />
                    <StatCard label="Penjualan Bulan Ini" value={fmt(stats.penjualan_bulan_ini)} icon={ShoppingBag} color="bg-blue-500" />
                    <StatCard label="Pembelian Bulan Ini" value={fmt(stats.pembelian_bulan_ini)} icon={TrendingDown} color="bg-orange-500" />
                    <StatCard label="Total Pelanggan" value={stats.total_pelanggan} icon={Users} color="bg-pink-500" />
                    <StatCard label="Total Supplier" value={stats.total_supplier} icon={Truck} color="bg-indigo-500" />
                    {stats.stok_menipis > 0 && (
                        <StatCard
                            label="Stok Menipis"
                            value={stats.stok_menipis}
                            icon={AlertTriangle}
                            color="bg-amber-500"
                            sub="Barang dengan stok ≤ 5"
                        />
                    )}
                </div>

                {/* Transaksi Terakhir */}
                <div className="rounded-2xl border bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
                    <div className="flex items-center justify-between px-5 py-4 border-b dark:border-neutral-800">
                        <h2 className="font-semibold text-sm">Transaksi Penjualan Terbaru</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b dark:border-neutral-800 text-left text-xs text-neutral-500">
                                    <th className="px-5 py-3 font-medium">Tanggal</th>
                                    <th className="px-5 py-3 font-medium">Kasir</th>
                                    <th className="px-5 py-3 font-medium">Pelanggan</th>
                                    <th className="px-5 py-3 font-medium text-right">Total</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_penjualan.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 text-neutral-400">
                                            Belum ada transaksi
                                        </td>
                                    </tr>
                                ) : (
                                    recent_penjualan.map((p) => (
                                        <tr key={p.id_penjualan} className="border-b last:border-0 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                            <td className="px-5 py-3 text-neutral-600 dark:text-neutral-400">
                                                {new Date(p.tanggal_penjualan).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-5 py-3">{p.user?.nama_lengkap}</td>
                                            <td className="px-5 py-3">{p.pelanggan?.nama_pelanggan ?? <span className="text-neutral-400">Umum</span>}</td>
                                            <td className="px-5 py-3 text-right font-medium">{fmt(p.total_bayar)}</td>
                                            <td className="px-5 py-3">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${p.status_pembayaran === 'sudah bayar'
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                    }`}>
                                                    {p.status_pembayaran}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

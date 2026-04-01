import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { DashboardStats, Penjualan } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import {
    Package, TrendingUp, TrendingDown, Users, Truck,
    ShoppingBag, AlertTriangle, ArrowRight, Clock,
    Activity,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

interface Props {
    stats: DashboardStats;
    recent_penjualan: Penjualan[];
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: any;
    sub?: string;
    variant?: 'default' | 'success' | 'danger';
}

function StatCard({ label, value, icon: Icon, sub, variant = 'default' }: StatCardProps) {
    const iconBg = {
        default: 'bg-teal-500/10 dark:bg-teal-400/10',
        success: 'bg-emerald-500/10 dark:bg-emerald-400/10',
        danger: 'bg-red-500/10 dark:bg-red-400/10',
    }[variant];

    const iconColor = {
        default: 'text-teal-600 dark:text-teal-400',
        success: 'text-emerald-600 dark:text-emerald-400',
        danger: 'text-red-600 dark:text-red-400',
    }[variant];

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            {/* Subtle top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500/60 via-cyan-500/60 to-transparent rounded-t-2xl" />

            <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
            </div>

            <div className="mt-3 space-y-0.5">
                <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                {sub && <p className="text-xs text-muted-foreground/70 mt-1">{sub}</p>}
            </div>
        </div>
    );
}

export default function Dashboard({ stats, recent_penjualan }: Props) {
    const fmt = (n: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

    const cards: StatCardProps[] = [
        {
            label: 'Total Barang',
            value: stats.total_barang,
            icon: Package,
            variant: 'default',
        },
        {
            label: 'Penjualan Hari Ini',
            value: fmt(stats.penjualan_hari_ini),
            icon: TrendingUp,
            variant: 'success',
        },
        {
            label: 'Penjualan Bulan Ini',
            value: fmt(stats.penjualan_bulan_ini),
            icon: ShoppingBag,
            variant: 'default',
        },
        {
            label: 'Pembelian Bulan Ini',
            value: fmt(stats.pembelian_bulan_ini),
            icon: TrendingDown,
            variant: 'default',
        },
        {
            label: 'Total Pelanggan',
            value: stats.total_pelanggan,
            icon: Users,
            variant: 'default',
        },
        {
            label: 'Total Supplier',
            value: stats.total_supplier,
            icon: Truck,
            variant: 'default',
        },
    ];

    if (stats.stok_menipis > 0) {
        cards.push({
            label: 'Stok Menipis',
            value: stats.stok_menipis,
            icon: AlertTriangle,
            variant: 'danger',
            sub: 'Barang dengan stok ≤ 5',
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <FlashMessage />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Ringkasan kinerja koperasi
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-teal-500" />
                        <span className="font-medium">
                            {new Date().toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {cards.map((card) => (
                        <StatCard key={card.label} {...card} />
                    ))}
                </div>

                {/* Transaksi Terakhir */}
                <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
                    {/* Card header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10">
                                <Activity className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <h2 className="font-semibold text-sm text-foreground">Transaksi Penjualan Terbaru</h2>
                        </div>
                        <Link
                            href="/penjualan"
                            className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-medium hover:underline underline-offset-2"
                        >
                            Lihat semua <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>

                    {recent_penjualan.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-medium">Belum ada transaksi</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50 text-left bg-muted/30">
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tanggal</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kasir</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pelanggan</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">Total</th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {recent_penjualan.map((p) => (
                                        <tr
                                            key={p.id_penjualan}
                                            className="hover:bg-muted/40 transition-colors duration-100"
                                        >
                                            <td className="px-5 py-3.5 text-muted-foreground text-xs">
                                                {new Date(p.tanggal_penjualan).toLocaleDateString('id-ID', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-5 py-3.5 font-medium text-foreground">{p.user?.nama_lengkap}</td>
                                            <td className="px-5 py-3.5">
                                                {p.pelanggan?.nama_pelanggan ?? (
                                                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground font-medium">
                                                        Umum
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <span className="font-semibold text-teal-600 dark:text-teal-400">
                                                    {fmt(p.total_bayar)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                    p.status_pembayaran === 'sudah bayar'
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-400'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/25 dark:text-amber-400'
                                                }`}>
                                                    {p.status_pembayaran}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

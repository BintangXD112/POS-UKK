import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { DashboardStats, Penjualan, DashboardCharts } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import {
    Package, TrendingUp, TrendingDown, Users, Truck,
    ShoppingBag, AlertTriangle, ArrowRight, Clock,
    Activity, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie, Legend, AreaChart, Area
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

interface Props {
    stats: DashboardStats;
    recent_penjualan: Penjualan[];
    charts: DashboardCharts;
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

const COLORS = ['#0d9488', '#0891b2', '#0284c7', '#4f46e5', '#7c3aed'];

export default function Dashboard({ stats, recent_penjualan, charts }: Props) {
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    {cards.map((card) => (
                        <StatCard key={card.label} {...card} />
                    ))}
                    <div className="hidden xl:block">
                        <StatCard
                           label="Pelanggan"
                           value={stats.total_pelanggan}
                           icon={Users}
                        />
                    </div>
                </div>

                {/* Charts Row 1: Trend & Category */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Sales Trend Chart */}
                    <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10">
                                <LineChartIcon className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <h3 className="font-semibold text-sm">Tren Penjualan Harian (Bulan Ini)</h3>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                <AreaChart data={charts.sales_trend}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <YAxis
                                        hide
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            borderColor: 'hsl(var(--border))',
                                            borderRadius: '12px',
                                            fontSize: '12px'
                                        }}
                                        formatter={((value: any) => [fmt(Number(value || 0)), 'Penjualan']) as any}
                                        labelFormatter={(label) => `Tanggal ${label}`}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#0d9488"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Chart */}
                    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10">
                                <PieChartIcon className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <h3 className="font-semibold text-sm">Top 5 Kategori (Terlaris)</h3>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                <PieChart>
                                    <Pie
                                        data={charts.top_categories}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {charts.top_categories.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            borderColor: 'hsl(var(--border))',
                                            borderRadius: '12px',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        align="center"
                                        layout="horizontal"
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Row 2: Income vs Expense & Recent Transactions */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Income vs Expense Bar Chart */}
                    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10">
                                <BarChart3 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <h3 className="font-semibold text-sm">Penjualan vs Pembelian (6 Bln Terakhir)</h3>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                <BarChart data={charts.income_expense}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <YAxis
                                        hide
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            borderColor: 'hsl(var(--border))',
                                            borderRadius: '12px',
                                            fontSize: '12px'
                                        }}
                                        formatter={((value: any) => fmt(Number(value || 0))) as any}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                        align="right"
                                        layout="horizontal"
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: '11px', paddingBottom: '20px' }}
                                    />
                                    <Bar dataKey="penjualan" name="Penjualan" fill="#0d9488" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="pembelian" name="Pembelian" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Transaksi Terakhir */}
                    <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden flex flex-col">
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

                        <div className="flex-1 overflow-auto">
                            {recent_penjualan.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                                        <ShoppingBag className="h-6 w-6" />
                                    </div>
                                    <p className="text-sm font-medium">Belum ada transaksi</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto min-w-full">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border/50 text-left bg-muted/30">
                                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">Tanggal</th>
                                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kasir</th>
                                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pelanggan</th>
                                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right whitespace-nowrap">Total</th>
                                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/40">
                                            {recent_penjualan.map((p) => (
                                                <tr
                                                    key={p.id_penjualan}
                                                    className="hover:bg-muted/40 transition-colors duration-100"
                                                >
                                                    <td className="px-5 py-3.5 text-muted-foreground text-xs whitespace-nowrap">
                                                        {new Date(p.tanggal_penjualan).toLocaleDateString('id-ID', {
                                                            day: '2-digit', month: 'short', year: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-5 py-3.5 font-medium text-foreground whitespace-nowrap">{p.user?.nama_lengkap}</td>
                                                    <td className="px-5 py-3.5">
                                                        {p.pelanggan?.nama_pelanggan ?? (
                                                            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground font-medium whitespace-nowrap">
                                                                Umum
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                                        <span className="font-semibold text-teal-600 dark:text-teal-400">
                                                            {fmt(p.total_bayar)}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5 whitespace-nowrap">
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
                </div>
            </div>
        </AppLayout>
    );
}

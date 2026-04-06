import { Link } from '@inertiajs/react';
import { ShoppingCart, TrendingUp, Shield, Zap } from 'lucide-react';
import type { AuthLayoutProps } from '@/types';
import { home } from '@/routes';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const features = [
        { icon: Zap, text: 'Transaksi Cepat & Akurat' },
        { icon: TrendingUp, text: 'Laporan Real-time' },
        { icon: Shield, text: 'Data Aman & Terkelola' },
    ];

    return (
        <div className="flex min-h-screen">
            {/* ── Left Panel — Dark Navy Branding ── */}
            <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] shrink-0 relative flex-col justify-between p-10 overflow-hidden bg-mesh">
                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)`,
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 shadow-lg shadow-teal-500/25">
                        <ShoppingCart className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-base font-bold text-white tracking-tight leading-none">POS UKK</p>
                        <p className="text-xs text-teal-400 font-medium mt-0.5">Manajemen Koperasi Sekolah</p>
                    </div>
                </div>

                {/* Center content */}
                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                            <span className="text-xs font-semibold text-teal-400 tracking-wide">Point of Sale System</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            Kelola Koperasi<br />
                            <span className="text-gradient-teal">Lebih Mudah</span>
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Sistem kasir modern untuk koperasi SMK. Catat transaksi, kelola stok, dan pantau laporan keuangan dalam satu platform terpadu.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                        {features.map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/12 border border-teal-500/20">
                                    <Icon className="h-4 w-4 text-teal-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-300">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div className="relative z-10">
                    <p className="text-xs text-slate-600">© {new Date().getFullYear()} POS UKK. All rights reserved.</p>
                </div>
            </div>

            {/* ── Right Panel — Form ── */}
            <div className="flex flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 sm:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
                        <Link href={home()} className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 shadow">
                                <ShoppingCart className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="text-lg font-bold text-slate-800 dark:text-white">POS UKK</span>
                        </Link>
                    </div>

                    {/* Form Card */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60">
                        {/* Top teal stripe */}
                        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-teal-500 to-cyan-500" />

                        <div className="mb-7 space-y-1">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
                        </div>
                        {children}
                    </div>

                    <p className="mt-5 text-center text-xs text-slate-400">
                        Sistem manajemen koperasi SMK terpadu
                    </p>
                </div>
            </div>
        </div>
    );
}

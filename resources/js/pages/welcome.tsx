import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import {
    ShoppingCart, TrendingUp, Package, Users, Shield, Zap,
    BarChart2, ArrowRight, CheckCircle2,
} from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props as any;

    const features = [
        {
            icon: ShoppingCart,
            title: 'POS Kasir',
            desc: 'Transaksi cepat dengan tampilan kasir yang intuitif dan mendukung barcode scanner.',
        },
        {
            icon: Package,
            title: 'Manajemen Stok',
            desc: 'Pantau stok barang secara real-time dengan notifikasi otomatis saat stok menipis.',
        },
        {
            icon: BarChart2,
            title: 'Laporan Keuangan',
            desc: 'Laporan penjualan dan pembelian yang lengkap dan dapat diekspor ke PDF.',
        },
        {
            icon: Users,
            title: 'Multi Role',
            desc: 'Dukungan role Super Admin, Admin, dan Kasir dengan hak akses yang berbeda.',
        },
        {
            icon: TrendingUp,
            title: 'Dashboard Analitik',
            desc: 'Ringkasan kinerja koperasi dalam satu tampilan dashboard yang informatif.',
        },
        {
            icon: Shield,
            title: 'Data Aman',
            desc: 'Sistem autentikasi yang aman dengan manajemen sesi dan activity log.',
        },
    ];

    const highlights = [
        'Transaksi tanpa batas & cepat',
        'Laporan otomatis harian/bulanan',
        'Multi kasir dalam satu sistem',
        'Backup data terjadwal',
    ];

    return (
        <>
            <Head title="POS Koperasi SMK">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700,800"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-mesh text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {/* ── Grid pattern ── */}
                <div
                    className="fixed inset-0 pointer-events-none opacity-[0.025]"
                    style={{
                        backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* ── Navbar ── */}
                <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 shadow-lg shadow-teal-500/30">
                            <ShoppingCart className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                            <span className="text-base font-bold text-white block leading-none">POS Koperasi</span>
                            <span className="text-[10px] text-teal-400 font-medium">SMK Management</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 px-4 py-2 text-sm font-semibold text-white transition-colors shadow-lg shadow-teal-500/25"
                            >
                                Dashboard <ArrowRight className="h-4 w-4" />
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 px-4 py-2 text-sm font-semibold text-white transition-colors shadow-lg shadow-teal-500/25"
                            >
                                Masuk ke Sistem <ArrowRight className="h-4 w-4" />
                            </Link>
                        )}
                    </div>
                </nav>

                {/* ── Hero ── */}
                <section className="relative z-10 px-6 pt-16 pb-24 max-w-6xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 mb-8">
                        <Zap className="h-3.5 w-3.5 text-teal-400" />
                        <span className="text-xs font-semibold text-teal-400 tracking-wide uppercase">Point of Sale System</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                        Sistem Kasir Modern<br />
                        untuk <span className="text-gradient-teal">Koperasi SMK</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
                        Kelola transaksi, stok barang, data pelanggan, dan laporan keuangan koperasi sekolah Anda dalam satu platform yang terintegrasi.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href={auth?.user ? dashboard() : login()}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 px-7 py-3.5 text-base font-semibold text-white transition-all shadow-xl shadow-teal-500/30 hover:shadow-teal-500/40 hover:-translate-y-0.5"
                        >
                            {auth?.user ? 'Buka Dashboard' : 'Mulai Sekarang'}
                            <ArrowRight className="h-4.5 w-4.5" />
                        </Link>
                    </div>

                    {/* Highlight list */}
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8">
                        {highlights.map((h) => (
                            <div key={h} className="flex items-center gap-1.5 text-sm text-slate-400">
                                <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" />
                                <span>{h}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Features Grid ── */}
                <section className="relative z-10 px-6 pb-24 max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-3">Fitur Lengkap</h2>
                        <p className="text-slate-400">Semua yang Anda butuhkan untuk mengelola koperasi sekolah</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map(({ icon: Icon, title, desc }) => (
                            <div
                                key={title}
                                className="group rounded-2xl border border-white/8 bg-white/4 hover:bg-white/7 p-6 transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/15 border border-teal-500/20 mb-4 group-hover:scale-105 transition-transform">
                                    <Icon className="h-5 w-5 text-teal-400" />
                                </div>
                                <h3 className="font-bold text-white mb-2">{title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="relative z-10 px-6 pb-20 max-w-6xl mx-auto">
                    <div className="rounded-2xl border border-teal-500/20 bg-teal-500/8 p-10 text-center">
                        <h2 className="text-3xl font-bold text-white mb-3">Siap Memulai?</h2>
                        <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                            Masuk ke sistem dan mulai kelola koperasi sekolah Anda dengan lebih efisien.
                        </p>
                        <Link
                            href={auth?.user ? dashboard() : login()}
                            className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 px-7 py-3.5 text-base font-semibold text-white transition-all shadow-lg shadow-teal-500/25 hover:-translate-y-0.5"
                        >
                            {auth?.user ? 'Buka Dashboard' : 'Masuk ke Sistem'}
                            <ArrowRight className="h-4.5 w-4.5" />
                        </Link>
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer className="relative z-10 border-t border-white/8 px-6 py-6 max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-600">
                    <span>© {new Date().getFullYear()} POS Koperasi SMK. All rights reserved.</span>
                    <span>Sistem Manajemen Koperasi Sekolah</span>
                </footer>
            </div>
        </>
    );
}

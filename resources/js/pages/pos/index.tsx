import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Barang, Pelanggan, CartItem } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Package, Store, BadgeCheck, AlertTriangle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'POS Kasir', href: '/pos' }];
const fmtRp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

interface Props { barang: Barang[]; pelanggan: Pelanggan[] }

const itemColors = [
    'from-teal-500/20 to-cyan-500/20',
    'from-violet-500/20 to-purple-500/20',
    'from-orange-500/20 to-amber-500/20',
    'from-pink-500/20 to-rose-500/20',
    'from-blue-500/20 to-indigo-500/20',
    'from-emerald-500/20 to-green-500/20',
];

const iconColors = [
    'text-teal-500', 'text-violet-500', 'text-orange-500',
    'text-pink-500', 'text-blue-500', 'text-emerald-500',
];

/** Gambar barang dengan fallback icon jika URL gagal */
function BarangImg({ src, alt, colorIdx }: { src: string; alt: string; colorIdx: number }) {
    const [err, setErr] = useState(false);
    if (err) return <Package className={`h-5 w-5 ${iconColors[colorIdx % iconColors.length]}`} />;
    return (
        <img
            src={src}
            alt={alt}
            onError={() => setErr(true)}
            className="h-10 w-10 object-cover rounded-xl"
        />
    );
}

export default function PosIndex({ barang, pelanggan }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [selectedPelanggan, setSelectedPelanggan] = useState('');
    const [jenis, setJenis] = useState<'tunai' | 'kredit'>('tunai');
    const [caraBayar, setCaraBayar] = useState('');
    const [bayar, setBayar] = useState('');
    const [processing, setProcessing] = useState(false);
    const [showDebtDialog, setShowDebtDialog] = useState(false);

    const filteredBarang = barang.filter(b =>
        b.nama.toLowerCase().includes(search.toLowerCase()) ||
        b.barcode.toLowerCase().includes(search.toLowerCase())
    );

    const addToCart = (b: Barang) => {
        setCart(prev => {
            const existing = prev.find(c => c.id_barang === b.id_barang);
            if (existing) {
                if (existing.jumlah_barang >= b.stok) return prev;
                return prev.map(c => c.id_barang === b.id_barang
                    ? { ...c, jumlah_barang: c.jumlah_barang + 1, subtotal: (c.jumlah_barang + 1) * c.harga_jual }
                    : c
                );
            }
            const hargaJual = Number(b.harga_jual);
            const hargaBeli = Number(b.harga_beli);
            const stok = Number(b.stok);
            return [...prev, {
                id_barang: b.id_barang, nama: b.nama, satuan: b.satuan,
                harga_jual: hargaJual, harga_beli: hargaBeli,
                jumlah_barang: 1, diskon_tipe: 'nominal', diskon_nilai: 0, diskon_nominal: 0,
                subtotal: hargaJual, stok: stok,
            }];
        });
    };

    const updateQty = (id: number, delta: number) => {
        setCart(prev => prev.map(c => {
            if (c.id_barang !== id) return c;
            const newQty = Math.max(1, Math.min(c.stok, c.jumlah_barang + delta));
            return { ...c, jumlah_barang: newQty, subtotal: newQty * c.harga_jual };
        }));
    };

    const setExactQty = (id: number, val: string) => {
        setCart(prev => prev.map(c => {
            if (c.id_barang !== id) return c;
            let newQty = parseInt(val);
            if (isNaN(newQty)) newQty = 1; // Fallback jika dihapus kosong
            newQty = Math.max(1, Math.min(c.stok, newQty));
            return { ...c, jumlah_barang: newQty, subtotal: newQty * c.harga_jual };
        }));
    };

    const removeFromCart = (id: number) => setCart(prev => prev.filter(c => c.id_barang !== id));

    const totalFaktur = cart.reduce((s, c) => s + c.subtotal, 0);
    const parsedBayar = bayar !== '' ? Number(bayar) : totalFaktur;
    const kembalian = parsedBayar - totalFaktur;

    const handleCheckout = () => {
        if (cart.length === 0) return;

        if (kembalian < 0) {
            setShowDebtDialog(true);
            return;
        }

        processCheckout();
    };

    const processCheckout = () => {
        setProcessing(true);
        setShowDebtDialog(false);
        router.post('/pos', {
            id_pelanggan: selectedPelanggan || null,
            total_bayar: bayar ? Number(bayar) : totalFaktur,
            jenis_transaksi: jenis,
            cara_bayar: caraBayar,
            items: cart as any,
        }, {
            onSuccess: (page) => {
                setCart([]);
                setBayar('');
                setSelectedPelanggan('');
                setProcessing(false);
                const printId = (page.props.flash as any)?.print_id;
                if (printId) window.open(`/pos/struk/${printId}?print=true`, '_blank');
            },
            onError: () => setProcessing(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="POS Kasir" />
            <FlashMessage />

            <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
                {/* ── Katalog Barang ───────────────────────────────────── */}
                <div className="flex-1 flex flex-col overflow-hidden bg-background">
                    {/* Search bar */}
                    <div className="p-4 border-b bg-card/60 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 shadow-sm">
                                    <Store className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-semibold text-sm hidden sm:block">Katalog Produk</span>
                            </div>
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-9 rounded-xl h-9 bg-background"
                                    placeholder="Cari produk atau barcode…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            {filteredBarang.length > 0 && (
                                <span className="text-xs text-muted-foreground shrink-0">{filteredBarang.length} produk</span>
                            )}
                        </div>
                    </div>

                    {/* Product grid */}
                    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                        {filteredBarang.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                                    <Package className="h-7 w-7" />
                                </div>
                                <p className="text-sm font-medium">Tidak ada produk ditemukan</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                {filteredBarang.map((b, i) => {
                                    const inCart = cart.find(c => c.id_barang === b.id_barang);
                                    return (
                                        <button
                                            key={b.id_barang}
                                            onClick={() => addToCart(b)}
                                            disabled={b.stok === 0}
                                            className="relative group rounded-2xl border bg-card p-3 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none hover:border-teal-400/50 dark:hover:border-teal-500/50"
                                        >
                                            {/* Product image / icon */}
                                            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${itemColors[i % itemColors.length]} flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 overflow-hidden`}>
                                                {b.icon ? (
                                                    <BarangImg src={b.icon} alt={b.nama} colorIdx={i} />
                                                ) : (
                                                    <Package className={`h-5 w-5 ${iconColors[i % iconColors.length]}`} />
                                                )}
                                            </div>
                                            <p className="text-xs font-semibold line-clamp-2 leading-tight mb-1.5">
                                                {b.nama}
                                            </p>
                                            <p className={`text-xs font-bold ${iconColors[i % iconColors.length]}`}>
                                                {fmtRp(b.harga_jual)}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                                Stok: {b.stok} {b.satuan}
                                            </p>

                                            {/* Habis badge */}
                                            {b.stok === 0 && (
                                                <span className="absolute top-2 right-2 rounded bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
                                                    Habis
                                                </span>
                                            )}
                                            {/* In cart indicator */}
                                            {inCart && (
                                                <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-white text-[10px] font-bold shadow">
                                                    {inCart.jumlah_barang}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Cart Sidebar ────────────────────────────────────── */}
                <div className="w-80 xl:w-96 flex flex-col border-l bg-card overflow-hidden shadow-xl shadow-black/10">
                    {/* Cart header */}
                    <div className="flex items-center justify-between px-4 py-3.5 border-b bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            <span className="font-bold text-sm">Keranjang</span>
                        </div>
                        {cart.length > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-teal-600 text-[11px] font-bold">
                                {cart.length}
                            </span>
                        )}
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground py-12">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                                    <ShoppingCart className="h-6 w-6" />
                                </div>
                                <p className="text-sm font-medium">Keranjang kosong</p>
                                <p className="text-xs text-muted-foreground/70 text-center max-w-[160px]">
                                    Klik produk di katalog untuk menambahkan
                                </p>
                            </div>
                        ) : cart.map(item => (
                            <div key={item.id_barang} className="group rounded-xl border bg-background p-3 transition-all hover:border-teal-400/40">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <p className="text-xs font-semibold leading-tight flex-1 line-clamp-2">{item.nama}</p>
                                    <button
                                        onClick={() => removeFromCart(item.id_barang)}
                                        className="text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-lg transition-colors shrink-0"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    {/* Qty controls */}
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => updateQty(item.id_barang, -1)}
                                            className="h-7 w-7 rounded-lg border border-teal-200 dark:border-teal-800 flex items-center justify-center hover:bg-teal-50 dark:hover:bg-teal-900/20 active:scale-95 transition-all text-teal-600"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <input
                                            type="number"
                                            className="h-7 w-12 rounded-lg border border-teal-200 dark:border-teal-800 text-center text-sm font-bold tabular-nums focus:outline-none focus:ring-1 focus:ring-teal-500 bg-transparent transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            value={item.jumlah_barang}
                                            onChange={(e) => setExactQty(item.id_barang, e.target.value)}
                                            onFocus={(e) => e.target.select()}
                                            min={1}
                                            max={item.stok}
                                        />
                                        <button
                                            onClick={() => updateQty(item.id_barang, 1)}
                                            className="h-7 w-7 rounded-lg border border-teal-200 dark:border-teal-800 flex items-center justify-center hover:bg-teal-50 dark:hover:bg-teal-900/20 active:scale-95 transition-all text-teal-600"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <span className="text-sm font-bold text-teal-700 dark:text-teal-400">{fmtRp(item.subtotal)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Checkout Panel */}
                    <div className="border-t bg-card p-4 space-y-3">
                        {/* Pelanggan */}
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Pelanggan</Label>
                            <select
                                value={selectedPelanggan || '_umum'}
                                onChange={(e) => setSelectedPelanggan(e.target.value === '_umum' ? '' : e.target.value)}
                                className="h-9 w-full rounded-xl border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                            >
                                <option value="_umum">Pelanggan: Umum</option>
                                {pelanggan.map(p => (
                                    <option key={p.id_pelanggan} value={String(p.id_pelanggan)}>
                                        {p.nama_pelanggan}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Jenis & Cara Bayar */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Jenis</Label>
                                <select
                                    value={jenis}
                                    onChange={(e) => setJenis(e.target.value as 'tunai' | 'kredit')}
                                    className="h-9 w-full rounded-xl border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                                >
                                    <option value="tunai">Tunai</option>
                                    <option value="kredit">Kredit / Utang</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Cara Bayar</Label>
                                <Input className="h-9 rounded-xl text-xs" value={caraBayar} onChange={e => setCaraBayar(e.target.value)} placeholder="Cash, QRIS..." />
                            </div>
                        </div>


                        {/* Total + Bayar */}
                        <div className="rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border border-teal-200/60 dark:border-teal-800/40 p-3 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total</span>
                                <span className="text-lg font-extrabold text-teal-700 dark:text-teal-400 tabular-nums">{fmtRp(totalFaktur)}</span>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Jumlah Bayar</Label>
                                <Input
                                    type="number"
                                    className="h-10 rounded-xl text-base font-bold text-center tabular-nums border-teal-200 dark:border-teal-800 focus-visible:ring-teal-500"
                                    value={bayar}
                                    onChange={e => setBayar(e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            {cart.length > 0 && Number(bayar) > 0 && (
                                <div className="flex justify-between items-center pt-1 border-t border-teal-200/60 dark:border-teal-800/40">
                                    <span className="text-xs font-semibold text-muted-foreground">Kembalian</span>
                                    <span className={`text-sm font-bold tabular-nums ${kembalian < 0 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                        {kembalian < 0 ? `Kurang ${fmtRp(Math.abs(kembalian))}` : fmtRp(kembalian)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Checkout button */}
                        <Button
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || processing}
                            className="w-full h-12 gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-base shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Memproses...
                                </span>
                            ) : (
                                <>
                                    <CreditCard className="h-5 w-5" />
                                    Proses Transaksi
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal Validasi Hutang */}
            <AlertDialog open={showDebtDialog} onOpenChange={setShowDebtDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-500">
                            <AlertTriangle className="h-5 w-5" />
                            Pembayaran Kurang (Hutang)
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                            Jumlah pembayaran yang Anda masukkan kurang <strong>{fmtRp(Math.abs(kembalian))}</strong> dari total tagihan.
                            <br /><br />
                            Transaksi ini akan otomatis dicatat dengan status <strong>HUTANG</strong>.
                            Apakah Anda yakin ingin melanjutkan transaksi ini?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel disabled={processing}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                processCheckout();
                            }}
                            disabled={processing}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                            {processing ? 'Memproses...' : 'Ya, Lanjutkan Transaksi'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

import { useState, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Barang, Pelanggan, CartItem } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Package } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'POS Kasir', href: '/pos' }];
const fmtRp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

interface Props { barang: Barang[]; pelanggan: Pelanggan[] }

export default function PosIndex({ barang, pelanggan }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [selectedPelanggan, setSelectedPelanggan] = useState('');
    const [jenis, setJenis] = useState<'tunai' | 'kredit'>('tunai');
    const [caraBayar, setCaraBayar] = useState('');
    const [bayar, setBayar] = useState('');
    const [processing, setProcessing] = useState(false);

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

    const removeFromCart = (id: number) => setCart(prev => prev.filter(c => c.id_barang !== id));

    const totalFaktur = cart.reduce((s, c) => s + c.subtotal, 0);
    const kembalian = Number(bayar) - totalFaktur;

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setProcessing(true);
        router.post('/pos', {
            id_pelanggan: selectedPelanggan || null,
            total_bayar: totalFaktur,
            jenis_transaksi: jenis,
            cara_bayar: caraBayar,
            items: cart as any,
        }, {
            onSuccess: () => {
                setCart([]);
                setBayar('');
                setSelectedPelanggan('');
                setProcessing(false);
            },
            onError: () => setProcessing(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="POS Kasir" />
            <FlashMessage />

            <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
                {/* Katalog Barang */}
                <div className="flex-1 flex flex-col border-r dark:border-neutral-800 overflow-hidden">
                    <div className="p-4 border-b dark:border-neutral-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <Input className="pl-9" placeholder="Cari nama atau barcode…" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {filteredBarang.map(b => (
                                <button
                                    key={b.id_barang}
                                    onClick={() => addToCart(b)}
                                    disabled={b.stok === 0}
                                    className="relative group rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 p-3 text-left hover:border-violet-400 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-2">
                                        <Package className="h-5 w-5 text-violet-500" />
                                    </div>
                                    <p className="text-xs font-semibold line-clamp-2 leading-tight mb-1">{b.nama}</p>
                                    <p className="text-xs font-bold text-violet-600 dark:text-violet-400">{fmtRp(b.harga_jual)}</p>
                                    <p className="text-xs text-neutral-400 mt-0.5">Stok: {b.stok} {b.satuan}</p>
                                    {b.stok === 0 && (
                                        <span className="absolute top-2 right-2 text-[10px] bg-red-100 text-red-600 rounded px-1">Habis</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cart Sidebar */}
                <div className="w-80 flex flex-col bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3.5 border-b dark:border-neutral-800 bg-white dark:bg-neutral-900">
                        <ShoppingCart className="h-4 w-4 text-violet-500" />
                        <span className="font-semibold text-sm">Keranjang ({cart.length})</span>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-neutral-400 gap-2">
                                <ShoppingCart className="h-8 w-8" />
                                <p className="text-sm">Keranjang kosong</p>
                            </div>
                        ) : cart.map(item => (
                            <div key={item.id_barang} className="rounded-xl bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-3">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <p className="text-xs font-medium leading-tight flex-1">{item.nama}</p>
                                    <button onClick={() => removeFromCart(item.id_barang)} className="text-neutral-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors active:scale-90 shrink-0">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => updateQty(item.id_barang, -1)} className="h-6 w-6 rounded border flex items-center justify-center hover:bg-neutral-100 hover:border-neutral-300 active:scale-95 transition-all dark:hover:bg-neutral-800">
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="text-sm font-semibold w-6 text-center tabular-nums">{item.jumlah_barang}</span>
                                        <button onClick={() => updateQty(item.id_barang, 1)} className="h-6 w-6 rounded border flex items-center justify-center hover:bg-neutral-100 hover:border-neutral-300 active:scale-95 transition-all dark:hover:bg-neutral-800">
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <span className="text-sm font-bold text-violet-600">{fmtRp(item.subtotal)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Checkout Panel */}
                    <div className="border-t dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 space-y-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Pelanggan</Label>
                            <Select value={selectedPelanggan || '_umum'} onValueChange={v => setSelectedPelanggan(v === '_umum' ? '' : v)}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Umum (tanpa anggota)" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="_umum">Umum</SelectItem>
                                    {pelanggan.map(p => <SelectItem key={p.id_pelanggan} value={String(p.id_pelanggan)}>{p.nama_pelanggan}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs">Jenis</Label>
                                <Select value={jenis} onValueChange={v => setJenis(v as any)}>
                                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tunai">Tunai</SelectItem>
                                        <SelectItem value="kredit">Kredit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Cara Bayar</Label>
                                <Input className="h-8 text-xs" value={caraBayar} onChange={e => setCaraBayar(e.target.value)} placeholder="Cash, QRIS..." />
                            </div>
                        </div>

                        <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-3 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Total</span>
                                <span className="font-bold">{fmtRp(totalFaktur)}</span>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Bayar</Label>
                                <Input type="number" className="h-8 text-sm font-semibold" value={bayar} onChange={e => setBayar(e.target.value)} placeholder="0" />
                            </div>
                            {cart.length > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500">Kembalian</span>
                                    <span className={`font-bold ${kembalian < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                        {kembalian < 0 ? `Kurang ${fmtRp(Math.abs(kembalian))}` : fmtRp(kembalian)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || processing}
                            className="w-full h-11 gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 active:scale-[0.98] transition-all"
                        >
                            <CreditCard className="h-4 w-4" />
                            {processing ? 'Memproses...' : 'Proses Transaksi'}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

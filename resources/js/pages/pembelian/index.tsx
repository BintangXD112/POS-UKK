import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Pembelian, Supplier, Barang } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { DeleteConfirm } from '@/components/delete-confirm';
import { SchoolFilter } from '@/components/school-filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Eye, ShoppingCart, Minus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pembelian', href: '/pembelian' }];
const fmtRp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

interface CartItemBeli { id_barang: number; nama: string; satuan: string; harga_beli: number; jumlah: number }
interface Props {
    pembelian: Pembelian[];
    suppliers: Supplier[];
    barang: Barang[];
    isReadOnly: boolean;
    sekolahList: { id_sekolah: number; nama_sekolah: string }[];
    selectedSekolahId: number | null;
    nextNomorFaktur: string | null;
}

export default function PembelianIndex({ pembelian, suppliers, barang, isReadOnly, sekolahList, selectedSekolahId, nextNomorFaktur }: Props) {
    const [sekolahFilter, setSekolahFilter] = useState<number | null>(selectedSekolahId);
    const { errors } = usePage<{ errors: Record<string, string> }>().props;
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<CartItemBeli[]>([]);
    const today = new Date().toISOString().slice(0, 10);
    const [form, setForm] = useState({ id_supplier: '', tanggal_faktur: today, jenis_transaksi: 'tunai', cara_bayar: '', note: '' });
    const [processing, setProcessing] = useState(false);

    const addItem = () => setItems(prev => [...prev, { id_barang: 0, nama: '', satuan: 'pcs', harga_beli: 0, jumlah: 1 }]);
    const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));
    const updateItem = (idx: number, field: keyof CartItemBeli, value: any) => {
        setItems(prev => {
            const updated = [...prev];
            if (field === 'id_barang') {
                const found = barang.find(b => b.id_barang === Number(value));
                if (found) updated[idx] = {
                    ...updated[idx],
                    id_barang: found.id_barang,
                    nama: found.nama,
                    satuan: found.satuan,
                    harga_beli: Number(found.harga_beli), 
                };
            } else {
                (updated[idx] as any)[field] = value;
            }
            return updated;
        });
    };

    const totalBeli = items.reduce((s, i) => s + (i.jumlah * Number(i.harga_beli)), 0);
    const isItemsValid = items.length > 0 && items.every(i => i.id_barang > 0 && i.jumlah >= 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        // nomor_faktur di-generate di server, tidak perlu dikirim
        router.post('/pembelian', { ...form, items: items as any }, {
            onSuccess: () => { setOpen(false); setItems([]); setProcessing(false); },
            onError: () => setProcessing(false),
        });
    };

    const filteredPembelian = pembelian.filter(p => sekolahFilter === null || p.id_sekolah === sekolahFilter);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pembelian" />
            <FlashMessage />
            <div className="p-4 md:p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20">
                            <ShoppingCart className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight">Transaksi Pembelian</h1>
                                {isReadOnly && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 dark:bg-teal-900/30 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide">
                                        <Eye className="h-2.5 w-2.5" /> Lihat Saja
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">Catat faktur masuk dari supplier</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isReadOnly && (
                            <SchoolFilter
                                sekolahList={sekolahList ?? []}
                                selectedSekolahId={sekolahFilter}
                                baseUrl="/pembelian"
                                onClientFilter={setSekolahFilter}
                            />
                        )}
                        {!isReadOnly && (
                            <Button onClick={() => { setItems([]); setOpen(true); }} className="gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20 hover:shadow-teal-500/30 transition-all duration-200 hover:-translate-y-0.5">
                                <Plus className="h-4 w-4" /> Pembelian Baru
                            </Button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
                    <div className="h-[2px] bg-gradient-to-r from-teal-500/70 to-cyan-500/40" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left bg-muted/30">
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">No. Faktur</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tanggal</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Supplier</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Jenis</th>
                                    <th className="px-5 py-3 w-20" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {filteredPembelian.length === 0 ? (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted"><ShoppingCart className="h-6 w-6" /></div>
                                                <p className="text-sm font-medium">Belum ada data pembelian</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredPembelian.map(p => (
                                    <tr key={p.id_pembelian} className="hover:bg-muted/40 transition-colors duration-100">
                                        <td className="px-5 py-3.5">
                                            <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-md">
                                                {p.nomor_faktur}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-muted-foreground text-xs">{new Date(p.tanggal_faktur).toLocaleDateString('id-ID')}</td>
                                        <td className="px-5 py-3.5 font-medium">{p.supplier?.nama}</td>
                                        <td className="px-5 py-3.5 font-semibold text-teal-700 dark:text-teal-400">{fmtRp(p.total_bayar)}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${p.jenis_transaksi === 'tunai' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                                {p.jenis_transaksi}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600" asChild>
                                                    <Link href={`/pembelian/${p.id_pembelian}`}><Eye className="h-4 w-4" /></Link>
                                                </Button>
                                                {!isReadOnly && (
                                                    <DeleteConfirm url={`/pembelian/${p.id_pembelian}`} name={`faktur ${p.nomor_faktur}`} />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Dialog Form Pembelian (hanya admin) */}
            {!isReadOnly && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                                    <Plus className="h-3.5 w-3.5" />
                                </div>
                                Pembelian Baru
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-5 mt-2">

                            {/* No. Faktur — otomatis, read-only */}
                            <div className="flex items-center gap-3 rounded-xl border border-teal-200 dark:border-teal-800/60 bg-teal-50/60 dark:bg-teal-900/10 px-4 py-3">
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">No. Faktur (Otomatis)</p>
                                    <p className="font-mono font-bold text-teal-700 dark:text-teal-400 text-sm tracking-wide">
                                        {nextNomorFaktur ?? '—'}
                                    </p>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900/40 px-2 py-0.5 text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                                    Auto
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 col-span-2">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Supplier</Label>
                                    <Select value={form.id_supplier} onValueChange={v => setForm(f => ({ ...f, id_supplier: v }))}>
                                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih supplier" /></SelectTrigger>
                                        <SelectContent>{suppliers.map(s => <SelectItem key={s.id_supplier} value={String(s.id_supplier)}>{s.nama}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tanggal Faktur</Label>
                                    <Input type="date" value={form.tanggal_faktur} onChange={e => setForm(f => ({ ...f, tanggal_faktur: e.target.value }))} className="rounded-xl" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Jenis Transaksi</Label>
                                    <Select value={form.jenis_transaksi} onValueChange={v => setForm(f => ({ ...f, jenis_transaksi: v }))}>
                                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="tunai">Tunai</SelectItem>
                                            <SelectItem value="kredit">Kredit</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Daftar Barang</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1.5 rounded-lg hover:bg-teal-50 hover:text-teal-600 border-teal-200 dark:border-teal-800">
                                        <Plus className="h-3.5 w-3.5" /> Tambah Baris
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {items.map((item, idx) => (
                                        <div key={idx} className="grid grid-cols-12 gap-2 items-end p-3 rounded-xl border border-border/60 bg-muted/20">
                                            <div className="col-span-4 space-y-1">
                                                <Label className="text-[10px] text-muted-foreground uppercase">Barang</Label>
                                                <Select value={String(item.id_barang || '')} onValueChange={v => updateItem(idx, 'id_barang', v)}>
                                                    <SelectTrigger className="h-8 text-xs rounded-lg"><SelectValue placeholder="Pilih barang" /></SelectTrigger>
                                                    <SelectContent>{barang.map(b => <SelectItem key={b.id_barang} value={String(b.id_barang)}>{b.nama}</SelectItem>)}</SelectContent>
                                                </Select>
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <Label className="text-[10px] text-muted-foreground uppercase">Satuan</Label>
                                                <Input className="h-8 text-xs rounded-lg bg-background" value={item.satuan} onChange={e => updateItem(idx, 'satuan', e.target.value)} />
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <Label className="text-[10px] text-muted-foreground uppercase">Jumlah</Label>
                                                <Input type="number" className="h-8 text-xs rounded-lg bg-background" value={item.jumlah} onChange={e => updateItem(idx, 'jumlah', Number(e.target.value))} min="1" />
                                            </div>
                                            <div className="col-span-3 space-y-1">
                                                <Label className="text-[10px] text-muted-foreground uppercase">Harga Beli</Label>
                                                <Input type="number" className="h-8 text-xs rounded-lg bg-muted/50 cursor-not-allowed focus-visible:ring-0" value={item.harga_beli} readOnly tabIndex={-1} />
                                            </div>
                                            <div className="col-span-1 flex justify-end pb-1">
                                                <button type="button" onClick={() => removeItem(idx)} className="h-7 w-7 flex items-center justify-center rounded-md bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {items.length === 0 && (
                                        <div className="text-center py-6 text-xs text-muted-foreground border border-dashed rounded-xl">
                                            Belum ada barang yang ditambahkan
                                        </div>
                                    )}
                                    {items.length > 0 && (
                                        <div className="flex justify-end bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/30 rounded-xl px-4 py-3 mt-2">
                                            <span className="text-sm font-bold text-teal-700 dark:text-teal-400">Total: {fmtRp(totalBeli)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <DialogFooter className="pt-4 border-t border-border/40">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Batal</Button>
                                <Button type="submit" className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors" disabled={processing || !isItemsValid}>
                                    {processing ? 'Menyimpan...' : 'Simpan Pembelian'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </AppLayout>
    );
}

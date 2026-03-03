import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Pembelian, Supplier, Barang } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { DeleteConfirm } from '@/components/delete-confirm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Eye, ShoppingCart, Minus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pembelian', href: '/pembelian' }];
const fmtRp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

interface CartItemBeli { id_barang: number; nama: string; satuan: string; harga_beli: number; jumlah: number }
interface Props { pembelian: Pembelian[]; suppliers: Supplier[]; barang: Barang[] }

export default function PembelianIndex({ pembelian, suppliers, barang }: Props) {
    const { errors } = usePage<{ errors: Record<string, string> }>().props;
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<CartItemBeli[]>([]);
    const today = new Date().toISOString().slice(0, 10);
    const [form, setForm] = useState({ id_supplier: '', nomor_faktur: '', tanggal_faktur: today, jenis_transaksi: 'tunai', cara_bayar: '', note: '' });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (errors?.nomor_faktur) setOpen(true);
    }, [errors]);

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
        router.post('/pembelian', { ...form, items: items as any }, {
            onSuccess: () => { setOpen(false); setItems([]); setProcessing(false); },
            onError: () => setProcessing(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pembelian" />
            <FlashMessage />
            <div className="p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Transaksi Pembelian</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">Catat pembelian stok dari supplier</p>
                    </div>
                    <Button onClick={() => { setItems([]); setOpen(true); }} className="gap-2"><Plus className="h-4 w-4" /> Pembelian Baru</Button>
                </div>

                <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                            <tr className="text-left text-xs text-neutral-500">
                                <th className="px-5 py-3.5 font-medium">No. Faktur</th>
                                <th className="px-5 py-3.5 font-medium">Tanggal</th>
                                <th className="px-5 py-3.5 font-medium">Supplier</th>
                                <th className="px-5 py-3.5 font-medium">Total</th>
                                <th className="px-5 py-3.5 font-medium">Jenis</th>
                                <th className="px-5 py-3.5 font-medium w-20"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {pembelian.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-neutral-400">Belum ada data pembelian</td></tr>
                            ) : pembelian.map(p => (
                                <tr key={p.id_pembelian} className="border-b last:border-0 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-medium text-blue-600">{p.nomor_faktur}</td>
                                    <td className="px-5 py-3 text-neutral-500">{new Date(p.tanggal_faktur).toLocaleDateString('id-ID')}</td>
                                    <td className="px-5 py-3">{p.supplier?.nama}</td>
                                    <td className="px-5 py-3 font-semibold">{fmtRp(p.total_bayar)}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.jenis_transaksi === 'tunai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {p.jenis_transaksi}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                                                <Link href={`/pembelian/${p.id_pembelian}`}><Eye className="h-4 w-4" /></Link>
                                            </Button>
                                            <DeleteConfirm url={`/pembelian/${p.id_pembelian}`} name={`faktur ${p.nomor_faktur}`} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Dialog Form Pembelian */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Pembelian Baru</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label>Supplier</Label>
                                <Select value={form.id_supplier} onValueChange={v => setForm(f => ({ ...f, id_supplier: v }))}>
                                    <SelectTrigger><SelectValue placeholder="Pilih supplier" /></SelectTrigger>
                                    <SelectContent>{suppliers.map(s => <SelectItem key={s.id_supplier} value={String(s.id_supplier)}>{s.nama}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>No. Faktur</Label>
                                <Input
                                    value={form.nomor_faktur}
                                    onChange={e => setForm(f => ({ ...f, nomor_faktur: e.target.value }))}
                                    placeholder="INV-001"
                                    className={errors?.nomor_faktur ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                />
                                {errors?.nomor_faktur && (
                                    <p className="text-xs text-red-500">{errors.nomor_faktur}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Tanggal Faktur</Label>
                                <Input type="date" value={form.tanggal_faktur} onChange={e => setForm(f => ({ ...f, tanggal_faktur: e.target.value }))} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Jenis Transaksi</Label>
                                <Select value={form.jenis_transaksi} onValueChange={v => setForm(f => ({ ...f, jenis_transaksi: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tunai">Tunai</SelectItem>
                                        <SelectItem value="kredit">Kredit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Daftar Barang</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1.5">
                                    <Plus className="h-3.5 w-3.5" /> Tambah Baris
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {items.map((item, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-2 items-end p-3 rounded-xl border dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                                        <div className="col-span-4 space-y-1">
                                            <Label className="text-xs">Barang</Label>
                                            <Select value={String(item.id_barang || '')} onValueChange={v => updateItem(idx, 'id_barang', v)}>
                                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Pilih barang" /></SelectTrigger>
                                                <SelectContent>{barang.map(b => <SelectItem key={b.id_barang} value={String(b.id_barang)}>{b.nama}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-xs">Satuan</Label>
                                            <Input className="h-8 text-xs" value={item.satuan} onChange={e => updateItem(idx, 'satuan', e.target.value)} />
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-xs">Jumlah</Label>
                                            <Input type="number" className="h-8 text-xs" value={item.jumlah} onChange={e => updateItem(idx, 'jumlah', Number(e.target.value))} min="1" />
                                        </div>
                                        <div className="col-span-3 space-y-1">
                                            <Label className="text-xs">Harga Beli</Label>
                                            <Input type="number" className="h-8 text-xs" value={item.harga_beli} onChange={e => updateItem(idx, 'harga_beli', Number(e.target.value))} min="0" />
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                            <button type="button" onClick={() => removeItem(idx)} className="h-8 w-8 flex items-center justify-center text-red-400 hover:text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {items.length > 0 && (
                                    <div className="flex justify-end bg-violet-50 dark:bg-violet-900/20 rounded-xl px-4 py-2.5">
                                        <span className="text-sm font-bold">Total: {fmtRp(totalBeli)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing || !isItemsValid}>
                                {processing ? 'Menyimpan...' : 'Simpan Pembelian'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

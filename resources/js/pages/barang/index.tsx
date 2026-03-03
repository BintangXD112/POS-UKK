import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Barang, Kategori, KelompokKategori, Supplier } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { DeleteConfirm } from '@/components/delete-confirm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pencil, Plus, Search, Package, AlertTriangle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Barang', href: '/barang' }];

interface Props { barang: Barang[]; kategori: Kategori[]; kelompok: KelompokKategori[]; suppliers: Supplier[] }

const fmtRp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function BarangIndex({ barang, kategori, kelompok, suppliers }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Barang | null>(null);
    const [search, setSearch] = useState('');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        barcode: '', nama: '', id_kategori: '', id_kelompok_kategori: '', id_supplier: '',
        satuan: 'pcs', harga_beli: '', harga_jual: '', stok: '', is_active: true,
    });

    const openCreate = () => { reset(); setEditing(null); setOpen(true); };
    const openEdit = (b: Barang) => {
        setData({
            barcode: b.barcode, nama: b.nama, id_kategori: String(b.id_kategori),
            id_kelompok_kategori: String(b.id_kelompok_kategori), id_supplier: String(b.id_supplier),
            satuan: b.satuan, harga_beli: String(b.harga_beli), harga_jual: String(b.harga_jual),
            stok: String(b.stok), is_active: Boolean(b.is_active),
        });
        setEditing(b); setOpen(true);
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) put(`/barang/${editing.id_barang}`, { onSuccess: () => { setOpen(false); reset(); } });
        else post('/barang', { onSuccess: () => { setOpen(false); reset(); } });
    };

    const filtered = barang.filter(b =>
        b.nama.toLowerCase().includes(search.toLowerCase()) ||
        b.barcode.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Barang" />
            <FlashMessage />
            <div className="p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Data Barang</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">Kelola stok dan harga produk</p>
                    </div>
                    <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Tambah Barang</Button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input className="pl-9" placeholder="Cari nama atau barcode…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                            <tr className="text-left text-xs text-neutral-500">
                                <th className="px-5 py-3.5 font-medium">Barcode</th>
                                <th className="px-5 py-3.5 font-medium">Nama</th>
                                <th className="px-5 py-3.5 font-medium">Kategori</th>
                                <th className="px-5 py-3.5 font-medium">Harga Beli</th>
                                <th className="px-5 py-3.5 font-medium">Harga Jual</th>
                                <th className="px-5 py-3.5 font-medium">Stok</th>
                                <th className="px-5 py-3.5 font-medium w-20"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-12 text-neutral-400">Tidak ada data barang</td></tr>
                            ) : filtered.map(b => (
                                <tr key={b.id_barang} className="border-b last:border-0 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs text-neutral-500">{b.barcode}</td>
                                    <td className="px-5 py-3 font-medium">{b.nama}</td>
                                    <td className="px-5 py-3 text-xs text-neutral-500">{b.kategori?.nama}</td>
                                    <td className="px-5 py-3 text-neutral-600">{fmtRp(b.harga_beli)}</td>
                                    <td className="px-5 py-3 font-semibold text-emerald-600">{fmtRp(b.harga_jual)}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex items-center gap-1 font-semibold text-sm ${b.stok <= 5 ? 'text-red-500' : b.stok <= 20 ? 'text-amber-500' : 'text-neutral-700 dark:text-neutral-300'}`}>
                                            {b.stok <= 5 && <AlertTriangle className="h-3.5 w-3.5" />}
                                            {b.stok} {b.satuan}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(b)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <DeleteConfirm url={`/barang/${b.id_barang}`} name={b.nama} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader><DialogTitle>{editing ? 'Edit Barang' : 'Tambah Barang'}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label>Barcode</Label>
                                <Input value={data.barcode} onChange={e => setData('barcode', e.target.value)} placeholder="123456789" />
                                {errors.barcode && <p className="text-xs text-red-500">{errors.barcode}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Satuan</Label>
                                <Input value={data.satuan} onChange={e => setData('satuan', e.target.value)} placeholder="pcs, liter, kg" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Nama Barang</Label>
                            <Input value={data.nama} onChange={e => setData('nama', e.target.value)} placeholder="Nama produk..." />
                            {errors.nama && <p className="text-xs text-red-500">{errors.nama}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label>Kelompok Kategori</Label>
                                <Select value={String(data.id_kelompok_kategori)} onValueChange={v => setData('id_kelompok_kategori', v)}>
                                    <SelectTrigger><SelectValue placeholder="Kelompok" /></SelectTrigger>
                                    <SelectContent>{kelompok.map(k => <SelectItem key={k.id_kelompok} value={String(k.id_kelompok)}>{k.nama_kelompok}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Kategori</Label>
                                <Select value={String(data.id_kategori)} onValueChange={v => setData('id_kategori', v)}>
                                    <SelectTrigger><SelectValue placeholder="Kategori" /></SelectTrigger>
                                    <SelectContent>{kategori.map(k => <SelectItem key={k.id_kategori} value={String(k.id_kategori)}>{k.nama}</SelectItem>)}</SelectContent>
                                </Select>
                                {errors.id_kategori && <p className="text-xs text-red-500">{errors.id_kategori}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Supplier</Label>
                            <Select value={String(data.id_supplier)} onValueChange={v => setData('id_supplier', v)}>
                                <SelectTrigger><SelectValue placeholder="Pilih supplier" /></SelectTrigger>
                                <SelectContent>{suppliers.map(s => <SelectItem key={s.id_supplier} value={String(s.id_supplier)}>{s.nama}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label>Harga Beli</Label>
                                <Input type="number" value={data.harga_beli} onChange={e => setData('harga_beli', e.target.value)} min="0" />
                                {errors.harga_beli && <p className="text-xs text-red-500">{errors.harga_beli}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Harga Jual</Label>
                                <Input type="number" value={data.harga_jual} onChange={e => setData('harga_jual', e.target.value)} min="0" />
                                {errors.harga_jual && <p className="text-xs text-red-500">{errors.harga_jual}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Stok Awal</Label>
                                <Input type="number" value={data.stok} onChange={e => setData('stok', e.target.value)} min="0" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

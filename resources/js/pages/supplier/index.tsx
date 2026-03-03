import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Supplier } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { DeleteConfirm } from '@/components/delete-confirm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Pencil, Plus, Search, Truck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Supplier', href: '/supplier' }];
interface Props { suppliers: Supplier[] }

export default function SupplierIndex({ suppliers }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Supplier | null>(null);
    const [search, setSearch] = useState('');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama: '', no_telepon: '', alamat_supplier: '',
    });

    const openCreate = () => { reset(); setEditing(null); setOpen(true); };
    const openEdit = (s: Supplier) => {
        setData({ nama: s.nama, no_telepon: s.no_telepon ?? '', alamat_supplier: s.alamat_supplier ?? '' });
        setEditing(s); setOpen(true);
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) put(`/supplier/${editing.id_supplier}`, { onSuccess: () => { setOpen(false); reset(); } });
        else post('/supplier', { onSuccess: () => { setOpen(false); reset(); } });
    };

    const filtered = suppliers.filter(s =>
        s.nama.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Supplier" />
            <FlashMessage />
            <div className="p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Data Supplier</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">Kelola informasi pemasok barang</p>
                    </div>
                    <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Tambah</Button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input className="pl-9" placeholder="Cari nama supplier…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                            <tr className="text-left text-xs text-neutral-500">
                                <th className="px-5 py-3.5 font-medium">Nama</th>
                                <th className="px-5 py-3.5 font-medium">No. Telepon</th>
                                <th className="px-5 py-3.5 font-medium">Alamat</th>
                                <th className="px-5 py-3.5 font-medium w-20"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-12 text-neutral-400">Tidak ada data supplier</td></tr>
                            ) : filtered.map(s => (
                                <tr key={s.id_supplier} className="border-b last:border-0 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                                    <td className="px-5 py-3 font-medium">{s.nama}</td>
                                    <td className="px-5 py-3 text-neutral-500">{s.no_telepon ?? '—'}</td>
                                    <td className="px-5 py-3 text-neutral-500 text-xs max-w-xs truncate">{s.alamat_supplier ?? '—'}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(s)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <DeleteConfirm url={`/supplier/${s.id_supplier}`} name={s.nama} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>{editing ? 'Edit Supplier' : 'Tambah Supplier'}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label>Nama Supplier</Label>
                            <Input value={data.nama} onChange={e => setData('nama', e.target.value)} placeholder="PT. ..." />
                            {errors.nama && <p className="text-xs text-red-500">{errors.nama}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>No. Telepon</Label>
                            <Input value={data.no_telepon} onChange={e => setData('no_telepon', e.target.value)} placeholder="0812..." />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Alamat</Label>
                            <Input value={data.alamat_supplier} onChange={e => setData('alamat_supplier', e.target.value)} placeholder="Jl. ..." />
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

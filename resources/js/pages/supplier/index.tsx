import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Supplier } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { DeleteConfirm } from '@/components/delete-confirm';
import { SchoolFilter } from '@/components/school-filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Pencil, Plus, Search, Truck, Phone, MapPin, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Supplier', href: '/supplier' }];

interface Props {
    suppliers: Supplier[];
    isReadOnly: boolean;
    sekolahList: { id_sekolah: number; nama_sekolah: string }[];
    selectedSekolahId: number | null;
}

export default function SupplierIndex({ suppliers, isReadOnly, sekolahList, selectedSekolahId }: Props) {
    const [sekolahFilter, setSekolahFilter] = useState<number | null>(selectedSekolahId);
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

    const filtered = suppliers.filter(s => {
        if (sekolahFilter !== null && s.id_sekolah !== sekolahFilter) return false;
        return s.nama.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Supplier" />
            <FlashMessage />
            <div className="p-4 md:p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20">
                            <Truck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight">Data Supplier</h1>
                                {isReadOnly && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 dark:bg-teal-900/30 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide">
                                        <Eye className="h-2.5 w-2.5" /> Lihat Saja
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">Kelola informasi pemasok barang</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isReadOnly && (
                            <SchoolFilter
                                sekolahList={sekolahList ?? []}
                                selectedSekolahId={sekolahFilter}
                                baseUrl="/supplier"
                                onClientFilter={setSekolahFilter}
                            />
                        )}
                        {!isReadOnly && (
                            <Button
                                onClick={openCreate}
                                className="gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20 transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <Plus className="h-4 w-4" /> Tambah Supplier
                            </Button>
                        )}
                    </div>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9 rounded-xl h-10" placeholder="Cari nama supplier…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
                    <div className="h-[2px] bg-gradient-to-r from-teal-500/70 to-cyan-500/40" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left bg-muted/30">
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nama Supplier</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">No. Telepon</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Alamat</th>
                                    {!isReadOnly && <th className="px-5 py-3 w-20" />}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={isReadOnly ? 3 : 4}>
                                            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted"><Truck className="h-6 w-6" /></div>
                                                <p className="text-sm font-medium">Tidak ada data supplier</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filtered.map(s => (
                                    <tr key={s.id_supplier} className="hover:bg-muted/40 transition-colors duration-100">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-600 text-xs font-bold">
                                                    {s.nama[0]?.toUpperCase()}
                                                </div>
                                                <span className="font-semibold">{s.nama}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {s.no_telepon ? (
                                                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                                    <Phone className="h-3.5 w-3.5 text-teal-500" />
                                                    {s.no_telepon}
                                                </span>
                                            ) : <span className="text-muted-foreground/50">—</span>}
                                        </td>
                                        <td className="px-5 py-3.5 max-w-xs truncate text-muted-foreground text-xs">
                                            {s.alamat_supplier ? (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                                                    {s.alamat_supplier}
                                                </span>
                                            ) : <span className="text-muted-foreground/50">—</span>}
                                        </td>
                                        {!isReadOnly && (
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600" onClick={() => openEdit(s)}>
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <DeleteConfirm url={`/supplier/${s.id_supplier}`} name={s.nama} />
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Dialog hanya muncul untuk admin */}
            {!isReadOnly && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="sm:max-w-md rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                                    <Truck className="h-3.5 w-3.5" />
                                </div>
                                {editing ? 'Ubah Supplier' : 'Tambah Supplier Baru'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nama Supplier</Label>
                                <Input value={data.nama} onChange={e => setData('nama', e.target.value)} placeholder="PT. Contoh Sejahtera" className="rounded-xl" />
                                {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">No. Telepon</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                    <Input value={data.no_telepon} onChange={e => setData('no_telepon', e.target.value)} placeholder="0812-xxxx-xxxx" className="pl-9 rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Alamat</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-3.5 w-3.5 text-muted-foreground" />
                                    <Input value={data.alamat_supplier} onChange={e => setData('alamat_supplier', e.target.value)} placeholder="Jl. ..." className="pl-9 rounded-xl" />
                                </div>
                            </div>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Batal</Button>
                                <Button type="submit" disabled={processing} className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors">
                                    {processing ? 'Menyimpan...' : (editing ? 'Simpan Perubahan' : 'Tambah Supplier')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </AppLayout>
    );
}

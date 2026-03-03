import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { KelompokKategori, Kategori } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { DeleteConfirm } from '@/components/delete-confirm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ChevronRight, FolderOpen, Pencil, Plus, Tag } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Kategori', href: '/kategori' }];
interface Props { kelompok: KelompokKategori[] }

export default function KategoriIndex({ kelompok }: Props) {
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [openKelompok, setOpenKelompok] = useState(false);
    const [openKategori, setOpenKategori] = useState(false);
    const [editKelompok, setEditKelompok] = useState<KelompokKategori | null>(null);
    const [editKategori, setEditKategori] = useState<Kategori | null>(null);
    const [selectedKelompok, setSelectedKelompok] = useState<number>(0);

    const formKelompok = useForm({ nama_kelompok: '' });
    const formKategori = useForm({ id_kelompok: '', nama: '' });

    const toggleExpand = (id: number) => {
        setExpanded(prev => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    };

    const openCreateKelompok = () => { formKelompok.reset(); setEditKelompok(null); setOpenKelompok(true); };
    const openEditKelompok = (k: KelompokKategori) => { formKelompok.setData('nama_kelompok', k.nama_kelompok); setEditKelompok(k); setOpenKelompok(true); };
    const openCreateKategori = (kelompokId: number) => { formKategori.setData({ id_kelompok: String(kelompokId), nama: '' }); setEditKategori(null); setOpenKategori(true); };
    const openEditKategori = (k: Kategori) => { formKategori.setData({ id_kelompok: String(k.id_kelompok), nama: k.nama }); setEditKategori(k); setOpenKategori(true); };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori" />
            <FlashMessage />
            <div className="p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Kategori Barang</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">Kelola kelompok dan kategori produk</p>
                    </div>
                    <Button onClick={openCreateKelompok} className="gap-2"><Plus className="h-4 w-4" /> Kelompok Baru</Button>
                </div>

                <div className="space-y-3">
                    {kelompok.length === 0 ? (
                        <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 p-12 text-center text-neutral-400">
                            Belum ada kelompok kategori
                        </div>
                    ) : kelompok.map(k => (
                        <div key={k.id_kelompok} className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 overflow-hidden shadow-sm">
                            {/* Kelompok Header */}
                            <div className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50" onClick={() => toggleExpand(k.id_kelompok)}>
                                <div className="flex items-center gap-2.5">
                                    <ChevronRight className={`h-4 w-4 text-neutral-400 transition-transform ${expanded.has(k.id_kelompok) ? 'rotate-90' : ''}`} />
                                    <FolderOpen className="h-4 w-4 text-amber-500" />
                                    <span className="font-semibold text-sm">{k.nama_kelompok}</span>
                                    <span className="text-xs text-neutral-400">({k.kategori?.length ?? 0} kategori)</span>
                                </div>
                                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                    <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => openCreateKategori(k.id_kelompok)}>
                                        <Plus className="h-3.5 w-3.5" /> Kategori
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEditKelompok(k)}>
                                        <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <DeleteConfirm url={`/kategori/kelompok/${k.id_kelompok}`} name={k.nama_kelompok} />
                                </div>
                            </div>

                            {/* Kategori List */}
                            {expanded.has(k.id_kelompok) && (
                                <div className="border-t dark:border-neutral-800">
                                    {(!k.kategori || k.kategori.length === 0) ? (
                                        <p className="px-8 py-4 text-sm text-neutral-400">Belum ada kategori di kelompok ini</p>
                                    ) : k.kategori.map(kat => (
                                        <div key={kat.id_kategori} className="flex items-center justify-between px-8 py-2.5 border-b last:border-0 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Tag className="h-3.5 w-3.5 text-violet-400" />
                                                <span className="text-sm">{kat.nama}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEditKategori(kat)}>
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <DeleteConfirm url={`/kategori/${kat.id_kategori}`} name={kat.nama} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Dialog Kelompok */}
            <Dialog open={openKelompok} onOpenChange={setOpenKelompok}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader><DialogTitle>{editKelompok ? 'Edit Kelompok' : 'Tambah Kelompok'}</DialogTitle></DialogHeader>
                    <form onSubmit={e => {
                        e.preventDefault();
                        if (editKelompok) formKelompok.put(`/kategori/kelompok/${editKelompok.id_kelompok}`, { onSuccess: () => setOpenKelompok(false) });
                        else formKelompok.post('/kategori/kelompok', { onSuccess: () => setOpenKelompok(false) });
                    }} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label>Nama Kelompok</Label>
                            <Input value={formKelompok.data.nama_kelompok} onChange={e => formKelompok.setData('nama_kelompok', e.target.value)} placeholder="Makanan, Minuman, ..." />
                            {formKelompok.errors.nama_kelompok && <p className="text-xs text-red-500">{formKelompok.errors.nama_kelompok}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpenKelompok(false)}>Batal</Button>
                            <Button type="submit" disabled={formKelompok.processing}>Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Kategori */}
            <Dialog open={openKategori} onOpenChange={setOpenKategori}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader><DialogTitle>{editKategori ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle></DialogHeader>
                    <form onSubmit={e => {
                        e.preventDefault();
                        if (editKategori) formKategori.put(`/kategori/${editKategori.id_kategori}`, { onSuccess: () => setOpenKategori(false) });
                        else formKategori.post('/kategori', { onSuccess: () => setOpenKategori(false) });
                    }} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label>Kelompok</Label>
                            <Select value={String(formKategori.data.id_kelompok)} onValueChange={v => formKategori.setData('id_kelompok', v)}>
                                <SelectTrigger><SelectValue placeholder="Pilih kelompok" /></SelectTrigger>
                                <SelectContent>{kelompok.map(k => <SelectItem key={k.id_kelompok} value={String(k.id_kelompok)}>{k.nama_kelompok}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Nama Kategori</Label>
                            <Input value={formKategori.data.nama} onChange={e => formKategori.setData('nama', e.target.value)} placeholder="Snack, Roti, ..." />
                            {formKategori.errors.nama && <p className="text-xs text-red-500">{formKategori.errors.nama}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpenKategori(false)}>Batal</Button>
                            <Button type="submit" disabled={formKategori.processing}>Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

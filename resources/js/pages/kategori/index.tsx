import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { KelompokKategori, Kategori } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { DeleteConfirm } from '@/components/delete-confirm';
import { SchoolFilter } from '@/components/school-filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ChevronRight, FolderOpen, Pencil, Plus, Tag, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Kategori', href: '/kategori' }];

interface Props {
    kelompok: KelompokKategori[];
    isReadOnly: boolean;
    sekolahList: { id_sekolah: number; nama_sekolah: string }[];
    selectedSekolahId: number | null;
}

export default function KategoriIndex({ kelompok, isReadOnly, sekolahList, selectedSekolahId }: Props) {
    const [sekolahFilter, setSekolahFilter] = useState<number | null>(selectedSekolahId);
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [openKelompok, setOpenKelompok] = useState(false);
    const [openKategori, setOpenKategori] = useState(false);
    const [editKelompok, setEditKelompok] = useState<KelompokKategori | null>(null);
    const [editKategori, setEditKategori] = useState<Kategori | null>(null);

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
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20">
                            <Tag className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight">Kategori Barang</h1>
                                {isReadOnly && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 dark:bg-teal-900/30 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide">
                                        <Eye className="h-2.5 w-2.5" /> Lihat Saja
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">Kelola kelompok dan kategori produk</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isReadOnly && (
                            <SchoolFilter
                                sekolahList={sekolahList ?? []}
                                selectedSekolahId={sekolahFilter}
                                baseUrl="/kategori"
                                onClientFilter={setSekolahFilter}
                            />
                        )}
                        {!isReadOnly && (
                            <Button onClick={openCreateKelompok} className="gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white">
                                <Plus className="h-4 w-4" /> Kelompok Baru
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    {kelompok.filter(k => sekolahFilter === null || k.id_sekolah === sekolahFilter).length === 0 ? (
                        <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground">
                            Belum ada kelompok kategori
                        </div>
                    ) : kelompok.filter(k => sekolahFilter === null || k.id_sekolah === sekolahFilter).map(k => (
                        <div key={k.id_kelompok} className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
                            {/* Kelompok Header */}
                            <div
                                className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-muted/40 transition-colors"
                                onClick={() => toggleExpand(k.id_kelompok)}
                            >
                                <div className="flex items-center gap-2.5">
                                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expanded.has(k.id_kelompok) ? 'rotate-90' : ''}`} />
                                    <FolderOpen className="h-4 w-4 text-teal-500" />
                                    <span className="font-semibold text-sm">{k.nama_kelompok}</span>
                                    <span className="text-xs text-muted-foreground">({k.kategori?.length ?? 0} kategori)</span>
                                </div>
                                {/* Tombol aksi hanya untuk admin */}
                                {!isReadOnly && (
                                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs hover:text-teal-600" onClick={() => openCreateKategori(k.id_kelompok)}>
                                            <Plus className="h-3.5 w-3.5" /> Kategori
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-teal-600" onClick={() => openEditKelompok(k)}>
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <DeleteConfirm url={`/kategori/kelompok/${k.id_kelompok}`} name={k.nama_kelompok} />
                                    </div>
                                )}
                            </div>

                            {/* Kategori List */}
                            {expanded.has(k.id_kelompok) && (
                                <div className="border-t border-border/40">
                                    {(!k.kategori || k.kategori.length === 0) ? (
                                        <p className="px-8 py-4 text-sm text-muted-foreground">Belum ada kategori di kelompok ini</p>
                                    ) : k.kategori.map(kat => (
                                        <div key={kat.id_kategori} className="flex items-center justify-between px-8 py-2.5 border-b last:border-0 border-border/30 hover:bg-muted/30 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Tag className="h-3.5 w-3.5 text-teal-400" />
                                                <span className="text-sm">{kat.nama}</span>
                                            </div>
                                            {/* Aksi hanya untuk admin */}
                                            {!isReadOnly && (
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-teal-600" onClick={() => openEditKategori(kat)}>
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <DeleteConfirm url={`/kategori/${kat.id_kategori}`} name={kat.nama} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Dialog hanya render kalau bukan read-only */}
            {!isReadOnly && (
                <>
                    <Dialog open={openKelompok} onOpenChange={setOpenKelompok}>
                        <DialogContent className="sm:max-w-sm rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                                        <FolderOpen className="h-3.5 w-3.5" />
                                    </div>
                                    {editKelompok ? 'Ubah Kelompok' : 'Tambah Kelompok'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={e => {
                                e.preventDefault();
                                if (editKelompok) formKelompok.put(`/kategori/kelompok/${editKelompok.id_kelompok}`, { onSuccess: () => setOpenKelompok(false) });
                                else formKelompok.post('/kategori/kelompok', { onSuccess: () => setOpenKelompok(false) });
                            }} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nama Kelompok</Label>
                                    <Input value={formKelompok.data.nama_kelompok} onChange={e => formKelompok.setData('nama_kelompok', e.target.value)} placeholder="Makanan, Minuman, ..." className="rounded-xl" />
                                    {formKelompok.errors.nama_kelompok && <p className="text-xs text-destructive">{formKelompok.errors.nama_kelompok}</p>}
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setOpenKelompok(false)} className="rounded-xl">Batal</Button>
                                    <Button type="submit" disabled={formKelompok.processing} className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white">Simpan</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={openKategori} onOpenChange={setOpenKategori}>
                        <DialogContent className="sm:max-w-sm rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                                        <Tag className="h-3.5 w-3.5" />
                                    </div>
                                    {editKategori ? 'Ubah Kategori' : 'Tambah Kategori'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={e => {
                                e.preventDefault();
                                if (editKategori) formKategori.put(`/kategori/${editKategori.id_kategori}`, { onSuccess: () => setOpenKategori(false) });
                                else formKategori.post('/kategori', { onSuccess: () => setOpenKategori(false) });
                            }} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kelompok</Label>
                                    <Select value={String(formKategori.data.id_kelompok)} onValueChange={v => formKategori.setData('id_kelompok', v)}>
                                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih kelompok" /></SelectTrigger>
                                        <SelectContent>{kelompok.map(k => <SelectItem key={k.id_kelompok} value={String(k.id_kelompok)}>{k.nama_kelompok}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nama Kategori</Label>
                                    <Input value={formKategori.data.nama} onChange={e => formKategori.setData('nama', e.target.value)} placeholder="Snack, Roti, ..." className="rounded-xl" />
                                    {formKategori.errors.nama && <p className="text-xs text-destructive">{formKategori.errors.nama}</p>}
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setOpenKategori(false)} className="rounded-xl">Batal</Button>
                                    <Button type="submit" disabled={formKategori.processing} className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white">Simpan</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </AppLayout>
    );
}

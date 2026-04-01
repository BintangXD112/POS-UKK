import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { KelompokPelanggan, Pelanggan } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { DeleteConfirm } from '@/components/delete-confirm';
import { SchoolFilter } from '@/components/school-filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ChevronRight, FolderOpen, Pencil, Plus, UserCheck, Phone, Users, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pelanggan', href: '/pelanggan' }];

interface Props {
    kelompok: KelompokPelanggan[];
    isReadOnly: boolean;
    sekolahList: { id_sekolah: number; nama_sekolah: string }[];
    selectedSekolahId: number | null;
}

export default function PelangganIndex({ kelompok, isReadOnly, sekolahList, selectedSekolahId }: Props) {
    const [sekolahFilter, setSekolahFilter] = useState<number | null>(selectedSekolahId);
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [openKelompok, setOpenKelompok] = useState(false);
    const [openPelanggan, setOpenPelanggan] = useState(false);
    const [editKelompok, setEditKelompok] = useState<KelompokPelanggan | null>(null);
    const [editPelanggan, setEditPelanggan] = useState<Pelanggan | null>(null);

    const formKelompok = useForm({ nama_kelompok: '' });
    const formPelanggan = useForm({ id_kelompok_pelanggan: '', nama_pelanggan: '', telepon: '', alamat: '' });

    const toggleExpand = (id: number) => {
        setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    };

    const openCreateKelompok = () => { formKelompok.reset(); setEditKelompok(null); setOpenKelompok(true); };
    const openEditKelompok = (k: KelompokPelanggan) => { formKelompok.setData('nama_kelompok', k.nama_kelompok); setEditKelompok(k); setOpenKelompok(true); };
    const openCreatePelanggan = (kelompokId: number) => { formPelanggan.setData({ id_kelompok_pelanggan: String(kelompokId), nama_pelanggan: '', telepon: '', alamat: '' }); setEditPelanggan(null); setOpenPelanggan(true); };
    const openEditPelanggan = (p: Pelanggan) => { formPelanggan.setData({ id_kelompok_pelanggan: String(p.id_kelompok_pelanggan), nama_pelanggan: p.nama_pelanggan, telepon: p.telepon ?? '', alamat: p.alamat ?? '' }); setEditPelanggan(p); setOpenPelanggan(true); };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pelanggan" />
            <FlashMessage />
            <div className="p-4 md:p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20">
                            <UserCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight">Data Pelanggan</h1>
                                {isReadOnly && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 dark:bg-teal-900/30 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide">
                                        <Eye className="h-2.5 w-2.5" /> Lihat Saja
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">Kelola kelompok dan daftar pelanggan</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isReadOnly && (
                            <SchoolFilter
                                sekolahList={sekolahList ?? []}
                                selectedSekolahId={sekolahFilter}
                                baseUrl="/pelanggan"
                                onClientFilter={setSekolahFilter}
                            />
                        )}
                        {!isReadOnly && (
                            <Button
                                onClick={openCreateKelompok}
                                className="gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20 transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <Plus className="h-4 w-4" /> Kelompok Baru
                            </Button>
                        )}
                    </div>
                </div>

                {/* Kelompok cards */}
                <div className="space-y-3">
                    {kelompok.filter(k => sekolahFilter === null || k.id_sekolah === sekolahFilter).length === 0 ? (
                        <div className="rounded-2xl border bg-card p-16 text-center">
                            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted"><Users className="h-6 w-6" /></div>
                                <p className="text-sm font-medium">Belum ada kelompok pelanggan</p>
                            </div>
                        </div>
                    ) : kelompok.filter(k => sekolahFilter === null || k.id_sekolah === sekolahFilter).map((k) => (
                        <div key={k.id_kelompok_pelanggan} className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
                            {/* Kelompok header */}
                            <div
                                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/40 transition-colors"
                                onClick={() => toggleExpand(k.id_kelompok_pelanggan)}
                            >
                                <div className="flex items-center gap-3">
                                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${expanded.has(k.id_kelompok_pelanggan) ? 'rotate-90' : ''}`} />
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-600">
                                        <FolderOpen className="h-4 w-4" />
                                    </div>
                                    <span className="font-semibold text-sm">{k.nama_kelompok}</span>
                                    <span className="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900/20 px-2 py-0.5 text-xs font-medium text-teal-700 dark:text-teal-400">
                                        {k.pelanggan?.length ?? 0} anggota
                                    </span>
                                </div>
                                {!isReadOnly && (
                                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs rounded-lg hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-900/20" onClick={() => openCreatePelanggan(k.id_kelompok_pelanggan)}>
                                            <Plus className="h-3.5 w-3.5" /> Tambah
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg hover:text-teal-600" onClick={() => openEditKelompok(k)}>
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <DeleteConfirm url={`/pelanggan/kelompok/${k.id_kelompok_pelanggan}`} name={k.nama_kelompok} />
                                    </div>
                                )}
                            </div>

                            {/* Pelanggan list */}
                            {expanded.has(k.id_kelompok_pelanggan) && (
                                <div className="border-t divide-y divide-border/40">
                                    {(!k.pelanggan || k.pelanggan.length === 0) ? (
                                        <p className="px-8 py-5 text-sm text-muted-foreground italic">Belum ada pelanggan di kelompok ini</p>
                                    ) : k.pelanggan.map((p) => (
                                        <div key={p.id_pelanggan} className="flex items-center justify-between px-8 py-3 hover:bg-muted/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-xs font-bold shadow-sm">
                                                    {p.nama_pelanggan[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{p.nama_pelanggan}</p>
                                                    {p.telepon && (
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Phone className="h-3 w-3 text-teal-400" />
                                                            {p.telepon}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {!isReadOnly && (
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg hover:text-teal-600" onClick={() => openEditPelanggan(p)}>
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <DeleteConfirm url={`/pelanggan/${p.id_pelanggan}`} name={p.nama_pelanggan} />
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

            {/* Dialog hanya untuk admin */}
            {!isReadOnly && (
                <>
                    <Dialog open={openKelompok} onOpenChange={setOpenKelompok}>
                        <DialogContent className="sm:max-w-sm rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                                        <FolderOpen className="h-3.5 w-3.5" />
                                    </div>
                                    {editKelompok ? 'Ubah Kelompok' : 'Kelompok Baru'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={e => { e.preventDefault(); if (editKelompok) formKelompok.put(`/pelanggan/kelompok/${editKelompok.id_kelompok_pelanggan}`, { onSuccess: () => setOpenKelompok(false) }); else formKelompok.post('/pelanggan/kelompok', { onSuccess: () => setOpenKelompok(false) }); }} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nama Kelompok</Label>
                                    <Input value={formKelompok.data.nama_kelompok} onChange={e => formKelompok.setData('nama_kelompok', e.target.value)} placeholder="Anggota, Umum, VIP..." className="rounded-xl" />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setOpenKelompok(false)} className="rounded-xl">Batal</Button>
                                    <Button type="submit" disabled={formKelompok.processing} className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white">Simpan</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={openPelanggan} onOpenChange={setOpenPelanggan}>
                        <DialogContent className="sm:max-w-sm rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                                        <UserCheck className="h-3.5 w-3.5" />
                                    </div>
                                    {editPelanggan ? 'Ubah Pelanggan' : 'Tambah Pelanggan'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={e => { e.preventDefault(); if (editPelanggan) formPelanggan.put(`/pelanggan/${editPelanggan.id_pelanggan}`, { onSuccess: () => setOpenPelanggan(false) }); else formPelanggan.post('/pelanggan', { onSuccess: () => setOpenPelanggan(false) }); }} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kelompok</Label>
                                    <Select value={String(formPelanggan.data.id_kelompok_pelanggan)} onValueChange={v => formPelanggan.setData('id_kelompok_pelanggan', v)}>
                                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih kelompok" /></SelectTrigger>
                                        <SelectContent>{kelompok.map(k => <SelectItem key={k.id_kelompok_pelanggan} value={String(k.id_kelompok_pelanggan)}>{k.nama_kelompok}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nama Pelanggan</Label>
                                    <Input value={formPelanggan.data.nama_pelanggan} onChange={e => formPelanggan.setData('nama_pelanggan', e.target.value)} placeholder="Nama lengkap..." className="rounded-xl" />
                                    {formPelanggan.errors.nama_pelanggan && <p className="text-xs text-destructive">{formPelanggan.errors.nama_pelanggan}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Telepon</Label>
                                    <Input value={formPelanggan.data.telepon} onChange={e => formPelanggan.setData('telepon', e.target.value)} placeholder="0812..." className="rounded-xl" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Alamat</Label>
                                    <Input value={formPelanggan.data.alamat} onChange={e => formPelanggan.setData('alamat', e.target.value)} placeholder="Jl. ..." className="rounded-xl" />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setOpenPelanggan(false)} className="rounded-xl">Batal</Button>
                                    <Button type="submit" disabled={formPelanggan.processing} className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white">
                                        {formPelanggan.processing ? 'Menyimpan...' : (editPelanggan ? 'Simpan Perubahan' : 'Tambah Pelanggan')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </AppLayout>
    );
}

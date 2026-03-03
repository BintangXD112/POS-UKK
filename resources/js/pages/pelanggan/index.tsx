import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { KelompokPelanggan, Pelanggan } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { DeleteConfirm } from '@/components/delete-confirm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ChevronRight, FolderOpen, Pencil, Plus, UserCheck, Phone } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pelanggan', href: '/pelanggan' }];
interface Props { kelompok: KelompokPelanggan[] }

export default function PelangganIndex({ kelompok }: Props) {
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
            <div className="p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Data Pelanggan</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">Kelola kelompok dan daftar pelanggan</p>
                    </div>
                    <Button onClick={openCreateKelompok} className="gap-2"><Plus className="h-4 w-4" /> Kelompok Baru</Button>
                </div>

                <div className="space-y-3">
                    {kelompok.length === 0 ? (
                        <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 p-12 text-center text-neutral-400">Belum ada kelompok pelanggan</div>
                    ) : kelompok.map(k => (
                        <div key={k.id_kelompok_pelanggan} className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50" onClick={() => toggleExpand(k.id_kelompok_pelanggan)}>
                                <div className="flex items-center gap-2.5">
                                    <ChevronRight className={`h-4 w-4 text-neutral-400 transition-transform ${expanded.has(k.id_kelompok_pelanggan) ? 'rotate-90' : ''}`} />
                                    <FolderOpen className="h-4 w-4 text-blue-500" />
                                    <span className="font-semibold text-sm">{k.nama_kelompok}</span>
                                    <span className="text-xs text-neutral-400">({k.pelanggan?.length ?? 0} pelanggan)</span>
                                </div>
                                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                    <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => openCreatePelanggan(k.id_kelompok_pelanggan)}>
                                        <Plus className="h-3.5 w-3.5" /> Pelanggan
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEditKelompok(k)}>
                                        <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <DeleteConfirm url={`/pelanggan/kelompok/${k.id_kelompok_pelanggan}`} name={k.nama_kelompok} />
                                </div>
                            </div>
                            {expanded.has(k.id_kelompok_pelanggan) && (
                                <div className="border-t dark:border-neutral-800">
                                    {(!k.pelanggan || k.pelanggan.length === 0) ? (
                                        <p className="px-8 py-4 text-sm text-neutral-400">Belum ada pelanggan di kelompok ini</p>
                                    ) : k.pelanggan.map(p => (
                                        <div key={p.id_pelanggan} className="flex items-center justify-between px-8 py-2.5 border-b last:border-0 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                                                    {p.nama_pelanggan[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{p.nama_pelanggan}</p>
                                                    {p.telepon && <p className="text-xs text-neutral-400 flex items-center gap-1"><Phone className="h-3 w-3" /> {p.telepon}</p>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEditPelanggan(p)}>
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <DeleteConfirm url={`/pelanggan/${p.id_pelanggan}`} name={p.nama_pelanggan} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Dialog open={openKelompok} onOpenChange={setOpenKelompok}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader><DialogTitle>{editKelompok ? 'Edit Kelompok' : 'Tambah Kelompok'}</DialogTitle></DialogHeader>
                    <form onSubmit={e => { e.preventDefault(); if (editKelompok) formKelompok.put(`/pelanggan/kelompok/${editKelompok.id_kelompok_pelanggan}`, { onSuccess: () => setOpenKelompok(false) }); else formKelompok.post('/pelanggan/kelompok', { onSuccess: () => setOpenKelompok(false) }); }} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label>Nama Kelompok</Label>
                            <Input value={formKelompok.data.nama_kelompok} onChange={e => formKelompok.setData('nama_kelompok', e.target.value)} placeholder="Anggota, Umum, ..." />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpenKelompok(false)}>Batal</Button>
                            <Button type="submit" disabled={formKelompok.processing}>Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={openPelanggan} onOpenChange={setOpenPelanggan}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader><DialogTitle>{editPelanggan ? 'Edit Pelanggan' : 'Tambah Pelanggan'}</DialogTitle></DialogHeader>
                    <form onSubmit={e => { e.preventDefault(); if (editPelanggan) formPelanggan.put(`/pelanggan/${editPelanggan.id_pelanggan}`, { onSuccess: () => setOpenPelanggan(false) }); else formPelanggan.post('/pelanggan', { onSuccess: () => setOpenPelanggan(false) }); }} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label>Kelompok</Label>
                            <Select value={String(formPelanggan.data.id_kelompok_pelanggan)} onValueChange={v => formPelanggan.setData('id_kelompok_pelanggan', v)}>
                                <SelectTrigger><SelectValue placeholder="Pilih kelompok" /></SelectTrigger>
                                <SelectContent>{kelompok.map(k => <SelectItem key={k.id_kelompok_pelanggan} value={String(k.id_kelompok_pelanggan)}>{k.nama_kelompok}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Nama Pelanggan</Label>
                            <Input value={formPelanggan.data.nama_pelanggan} onChange={e => formPelanggan.setData('nama_pelanggan', e.target.value)} placeholder="Nama lengkap..." />
                            {formPelanggan.errors.nama_pelanggan && <p className="text-xs text-red-500">{formPelanggan.errors.nama_pelanggan}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Telepon</Label>
                            <Input value={formPelanggan.data.telepon} onChange={e => formPelanggan.setData('telepon', e.target.value)} placeholder="0812..." />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Alamat</Label>
                            <Input value={formPelanggan.data.alamat} onChange={e => formPelanggan.setData('alamat', e.target.value)} placeholder="Jl. ..." />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpenPelanggan(false)}>Batal</Button>
                            <Button type="submit" disabled={formPelanggan.processing}>Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

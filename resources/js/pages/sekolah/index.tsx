import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Sekolah } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { DeleteConfirm } from '@/components/delete-confirm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Pencil, Plus, School, Globe } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Data Sekolah', href: '/sekolah' }];

interface Props { sekolah: Sekolah[] }

export default function SekolahIndex({ sekolah }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Sekolah | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        kode_sekolah: '', nama_sekolah: '', alamat_sekolah: '', website: '', is_active: true,
    });

    const openCreate = () => { reset(); setEditing(null); setOpen(true); };
    const openEdit = (s: Sekolah) => {
        setData({ kode_sekolah: s.kode_sekolah, nama_sekolah: s.nama_sekolah, alamat_sekolah: s.alamat_sekolah ?? '', website: s.website ?? '', is_active: Boolean(s.is_active) });
        setEditing(s); setOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            put(`/sekolah/${editing.id_sekolah}`, { onSuccess: () => { setOpen(false); reset(); } });
        } else {
            post('/sekolah', { onSuccess: () => { setOpen(false); reset(); } });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Sekolah" />
            <FlashMessage />

            <div className="p-4 md:p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20">
                            <School className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Data Sekolah</h1>
                            <p className="text-sm text-muted-foreground">Kelola tenant lembaga pendidikan</p>
                        </div>
                    </div>
                    <Button
                        onClick={openCreate}
                        className="gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20 hover:shadow-teal-500/30 transition-all duration-200 hover:-translate-y-0.5"
                    >
                        <Plus className="h-4 w-4" /> Tambah Sekolah
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
                    <div className="h-[2px] bg-gradient-to-r from-teal-500/70 to-cyan-500/40" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left bg-muted/30">
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kode</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nama Sekolah</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Website</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                                    <th className="px-5 py-3 w-20" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {sekolah.length === 0 ? (
                                    <tr>
                                        <td colSpan={5}>
                                            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted"><School className="h-6 w-6" /></div>
                                                <p className="text-sm font-medium">Belum ada data sekolah</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : sekolah.map(s => (
                                    <tr key={s.id_sekolah} className="hover:bg-muted/40 transition-colors duration-100">
                                        <td className="px-5 py-3.5">
                                            <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-md">
                                                {s.kode_sekolah}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 font-semibold">{s.nama_sekolah}</td>
                                        <td className="px-5 py-3.5">
                                            {s.website ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Globe className="h-3.5 w-3.5 text-teal-500" />
                                                    {s.website.replace(/^https?:\/\//, '')}
                                                </span>
                                            ) : <span className="text-muted-foreground/50">—</span>}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                                                s.is_active
                                                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                                                    : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800'
                                            }`}>
                                                {s.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600" onClick={() => openEdit(s)}>
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <DeleteConfirm url={`/sekolah/${s.id_sekolah}`} name={s.nama_sekolah} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                                <School className="h-3.5 w-3.5" />
                            </div>
                            {editing ? 'Ubah Sekolah' : 'Tambah Sekolah Baru'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kode Sekolah</Label>
                            <Input value={data.kode_sekolah} onChange={e => setData('kode_sekolah', e.target.value)} placeholder="SMK-001" className="rounded-xl" />
                            {errors.kode_sekolah && <p className="text-xs text-destructive">{errors.kode_sekolah}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nama Sekolah</Label>
                            <Input value={data.nama_sekolah} onChange={e => setData('nama_sekolah', e.target.value)} placeholder="SMK Negeri 1" className="rounded-xl" />
                            {errors.nama_sekolah && <p className="text-xs text-destructive">{errors.nama_sekolah}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Alamat</Label>
                            <Input value={data.alamat_sekolah} onChange={e => setData('alamat_sekolah', e.target.value)} placeholder="Jl. Raya..." className="rounded-xl" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Website</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input value={data.website} onChange={e => setData('website', e.target.value)} placeholder="https://..." className="pl-9 rounded-xl" />
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Batal</Button>
                            <Button type="submit" disabled={processing} className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors">
                                {processing ? 'Menyimpan...' : (editing ? 'Simpan Perubahan' : 'Tambah Sekolah')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

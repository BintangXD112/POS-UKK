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
import { Pencil, Plus, School } from 'lucide-react';

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

            <div className="p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Data Sekolah / Koperasi</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">Kelola data tenant koperasi sekolah</p>
                    </div>
                    <Button onClick={openCreate} className="gap-2">
                        <Plus className="h-4 w-4" /> Tambah
                    </Button>
                </div>

                <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                            <tr className="text-left text-xs text-neutral-500">
                                <th className="px-5 py-3.5 font-medium">Kode</th>
                                <th className="px-5 py-3.5 font-medium">Nama Sekolah</th>
                                <th className="px-5 py-3.5 font-medium">Website</th>
                                <th className="px-5 py-3.5 font-medium">Status</th>
                                <th className="px-5 py-3.5 font-medium w-20"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sekolah.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-12 text-neutral-400">Belum ada data sekolah</td></tr>
                            ) : sekolah.map(s => (
                                <tr key={s.id_sekolah} className="border-b last:border-0 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs font-medium text-violet-600 dark:text-violet-400">{s.kode_sekolah}</td>
                                    <td className="px-5 py-3 font-medium">{s.nama_sekolah}</td>
                                    <td className="px-5 py-3 text-neutral-500">{s.website ?? '—'}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${s.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-neutral-100 text-neutral-500'}`}>
                                            {s.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(s)}>
                                                <Pencil className="h-4 w-4" />
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

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Sekolah' : 'Tambah Sekolah'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label>Kode Sekolah</Label>
                            <Input value={data.kode_sekolah} onChange={e => setData('kode_sekolah', e.target.value)} placeholder="KOPERASI-001" />
                            {errors.kode_sekolah && <p className="text-xs text-red-500">{errors.kode_sekolah}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Nama Sekolah</Label>
                            <Input value={data.nama_sekolah} onChange={e => setData('nama_sekolah', e.target.value)} placeholder="SMA Negeri ..." />
                            {errors.nama_sekolah && <p className="text-xs text-red-500">{errors.nama_sekolah}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Alamat</Label>
                            <Input value={data.alamat_sekolah} onChange={e => setData('alamat_sekolah', e.target.value)} placeholder="Jl. ..." />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Website</Label>
                            <Input value={data.website} onChange={e => setData('website', e.target.value)} placeholder="https://..." />
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

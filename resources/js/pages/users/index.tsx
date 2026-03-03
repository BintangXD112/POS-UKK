import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { TbUser, Role, Sekolah } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { DeleteConfirm } from '@/components/delete-confirm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Pencil, Plus, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Manajemen User', href: '/users' }];

interface AuthUser { id_sekolah: number | null; role: string; }
interface Props { users: TbUser[]; roles: Role[]; sekolah: Sekolah[]; authUser: AuthUser; }

const roleBadge: Record<string, string> = {
    'super admin': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    'admin': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'kasir': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

export default function UsersIndex({ users, roles, sekolah, authUser }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<TbUser | null>(null);
    const [search, setSearch] = useState('');

    const isAdmin = authUser.role === 'admin';
    const isSuperAdmin = authUser.role === 'super admin';

    const { data, setData, post, put, processing, errors, reset } = useForm({
        id_sekolah: '', id_role: '', username: '', nama_lengkap: '', password: '', is_active: true,
    });

    const openCreate = () => {
        reset();
        // Admin: auto-isi sekolah mereka sendiri
        if (isAdmin && authUser.id_sekolah) {
            setData('id_sekolah', String(authUser.id_sekolah));
        }
        setEditing(null);
        setOpen(true);
    };

    const openEdit = (u: TbUser) => {
        setData({
            id_sekolah: u.id_sekolah ? String(u.id_sekolah) : '',
            id_role: String(u.id_role),
            username: u.username,
            nama_lengkap: u.nama_lengkap,
            password: '',
            is_active: Boolean(u.is_active),
        });
        setEditing(u);
        setOpen(true);
    };

    const filtered = users.filter(u =>
        u.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            put(`/users/${editing.id_user}`, { onSuccess: () => { setOpen(false); reset(); } });
        } else {
            post('/users', { onSuccess: () => { setOpen(false); reset(); } });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen User" />
            <FlashMessage />
            <div className="p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Manajemen User</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">Kelola akun dan hak akses pengguna</p>
                    </div>
                    <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Tambah User</Button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input className="pl-9" placeholder="Cari nama atau username…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                            <tr className="text-left text-xs text-neutral-500">
                                <th className="px-5 py-3.5 font-medium">Nama Lengkap</th>
                                <th className="px-5 py-3.5 font-medium">Username</th>
                                <th className="px-5 py-3.5 font-medium">Role</th>
                                <th className="px-5 py-3.5 font-medium">Sekolah</th>
                                <th className="px-5 py-3.5 font-medium">Status</th>
                                <th className="px-5 py-3.5 font-medium w-20"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-neutral-400">Tidak ada data</td></tr>
                            ) : filtered.map(u => (
                                <tr key={u.id_user} className="border-b last:border-0 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                                    <td className="px-5 py-3 flex items-center gap-2.5">
                                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                            {u.nama_lengkap[0]}
                                        </div>
                                        <span className="font-medium">{u.nama_lengkap}</span>
                                    </td>
                                    <td className="px-5 py-3 font-mono text-xs text-neutral-500">@{u.username}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${roleBadge[u.role?.nama_role ?? ''] ?? ''}`}>
                                            {u.role?.nama_role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-neutral-500 text-xs">
                                        {u.sekolah?.nama_sekolah ?? (
                                            <span className="italic text-neutral-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${u.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'}`}>
                                            {u.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(u)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <DeleteConfirm url={`/users/${u.id_user}`} name={u.nama_lengkap} />
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
                        <DialogTitle>{editing ? 'Edit User' : 'Tambah User'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            {/* Field Sekolah: hanya tampil untuk Super Admin */}
                            {isSuperAdmin && (
                                <div className="space-y-1.5">
                                    <Label>Sekolah <span className="text-xs text-neutral-400">(opsional)</span></Label>
                                    <Select value={String(data.id_sekolah)} onValueChange={v => setData('id_sekolah', v === '_none' ? '' : v)}>
                                        <SelectTrigger><SelectValue placeholder="Tanpa sekolah" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="_none">— Tanpa Sekolah —</SelectItem>
                                            {sekolah.map(s => <SelectItem key={s.id_sekolah} value={String(s.id_sekolah)}>{s.nama_sekolah}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.id_sekolah && <p className="text-xs text-red-500">{errors.id_sekolah}</p>}
                                </div>
                            )}
                            {/* Admin: tampilkan sekolah sebagai info read-only */}
                            {isAdmin && (
                                <div className="space-y-1.5">
                                    <Label>Sekolah</Label>
                                    <div className="h-10 rounded-md border px-3 flex items-center text-sm text-neutral-500 bg-neutral-50 dark:bg-neutral-800">
                                        {sekolah.find(s => s.id_sekolah === authUser.id_sekolah)?.nama_sekolah ?? '—'}
                                    </div>
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <Label>Role</Label>
                                <Select value={String(data.id_role)} onValueChange={v => setData('id_role', v)}>
                                    <SelectTrigger><SelectValue placeholder="Pilih role" /></SelectTrigger>
                                    <SelectContent>
                                        {roles.map(r => <SelectItem key={r.id_role} value={String(r.id_role)}>{r.nama_role}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.id_role && <p className="text-xs text-red-500">{errors.id_role}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Nama Lengkap</Label>
                            <Input value={data.nama_lengkap} onChange={e => setData('nama_lengkap', e.target.value)} placeholder="Ahmad ..." />
                            {errors.nama_lengkap && <p className="text-xs text-red-500">{errors.nama_lengkap}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Username</Label>
                            <Input value={data.username} onChange={e => setData('username', e.target.value)} placeholder="admin" />
                            {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Password {editing && <span className="text-xs text-neutral-400">(kosongkan jika tidak diubah)</span>}</Label>
                            <Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder={editing ? '••••••••' : 'Min. 6 karakter'} />
                            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
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

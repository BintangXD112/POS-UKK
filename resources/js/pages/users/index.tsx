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
import { Pencil, Plus, Search, Users, ShieldCheck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Manajemen User', href: '/users' }];

interface AuthUser { id_sekolah: number | null; role: string; }
interface Props { users: TbUser[]; roles: Role[]; sekolah: Sekolah[]; authUser: AuthUser; }

// Semua role badge menggunakan teal/neutral — tidak ada warna berbeda per role
const roleConfig: Record<string, { label: string; cls: string }> = {
    'super admin': {
        label: 'Super Admin',
        cls: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    },
    'admin': {
        label: 'Admin',
        cls: 'bg-teal-100/70 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400',
    },
    'kasir': {
        label: 'Kasir',
        cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    },
};

export default function UsersIndex({ users, roles, sekolah, authUser }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<TbUser | null>(null);
    const [search, setSearch] = useState('');

    const isAdmin      = authUser.role === 'admin';
    const isSuperAdmin = authUser.role === 'super admin';

    const { data, setData, post, put, processing, errors, reset } = useForm({
        id_sekolah: '', id_role: '', username: '', nama_lengkap: '', password: '', is_active: true,
    });

    const openCreate = () => {
        reset();
        if (isAdmin && authUser.id_sekolah) setData('id_sekolah', String(authUser.id_sekolah));
        setEditing(null); setOpen(true);
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
        setEditing(u); setOpen(true);
    };

    const filtered = users.filter(u =>
        u.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) put(`/users/${editing.id_user}`, { onSuccess: () => { setOpen(false); reset(); } });
        else post('/users', { onSuccess: () => { setOpen(false); reset(); } });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen User" />
            <FlashMessage />
            <div className="p-4 md:p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20">
                            <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Manajemen User</h1>
                            <p className="text-sm text-muted-foreground">Kelola akun dan hak akses pengguna</p>
                        </div>
                    </div>
                    <Button
                        onClick={openCreate}
                        className="gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20 transition-all duration-200 hover:-translate-y-0.5"
                    >
                        <Plus className="h-4 w-4" /> Tambah User
                    </Button>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9 rounded-xl h-10" placeholder="Cari nama atau username…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
                    <div className="h-[2px] bg-gradient-to-r from-teal-500/70 to-cyan-500/40" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left bg-muted/30">
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pengguna</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Username</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sekolah</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                                    <th className="px-5 py-3 w-20" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={6}>
                                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted"><Users className="h-6 w-6" /></div>
                                            <p className="text-sm font-medium">Tidak ada data user</p>
                                        </div>
                                    </td></tr>
                                ) : filtered.map(u => {
                                    const roleName = u.role?.nama_role ?? '';
                                    const rc = roleConfig[roleName];
                                    return (
                                        <tr key={u.id_user} className="hover:bg-muted/40 transition-colors duration-100">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    {/* Avatar — teal gradient untuk semua */}
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-xs font-bold shadow-sm">
                                                        {u.nama_lengkap[0]?.toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold">{u.nama_lengkap}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">@{u.username}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${rc?.cls ?? 'bg-muted text-muted-foreground'}`}>
                                                    <ShieldCheck className="h-3 w-3" />
                                                    {roleName}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-muted-foreground text-xs">{u.sekolah?.nama_sekolah ?? <span className="italic opacity-50">—</span>}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${u.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                                                    {u.is_active ? '● Aktif' : '○ Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600"
                                                        onClick={() => openEdit(u)}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <DeleteConfirm url={`/users/${u.id_user}`} name={u.nama_lengkap} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
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
                                <Users className="h-3.5 w-3.5" />
                            </div>
                            {editing ? 'Ubah User' : 'Tambah User Baru'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            {isSuperAdmin && (
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sekolah <span className="text-muted-foreground/50 normal-case">(opsional)</span></Label>
                                    <Select value={String(data.id_sekolah)} onValueChange={v => setData('id_sekolah', v === '_none' ? '' : v)}>
                                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Tanpa sekolah" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="_none">— Tanpa Sekolah —</SelectItem>
                                            {sekolah.map(s => <SelectItem key={s.id_sekolah} value={String(s.id_sekolah)}>{s.nama_sekolah}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.id_sekolah && <p className="text-xs text-destructive">{errors.id_sekolah}</p>}
                                </div>
                            )}
                            {isAdmin && (
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sekolah</Label>
                                    <div className="h-10 rounded-xl border px-3 flex items-center text-sm text-muted-foreground bg-muted/30">
                                        {sekolah.find(s => s.id_sekolah === authUser.id_sekolah)?.nama_sekolah ?? '—'}
                                    </div>
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Role</Label>
                                <Select value={String(data.id_role)} onValueChange={v => setData('id_role', v)}>
                                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih role" /></SelectTrigger>
                                    <SelectContent>{roles.map(r => <SelectItem key={r.id_role} value={String(r.id_role)}>{r.nama_role}</SelectItem>)}</SelectContent>
                                </Select>
                                {errors.id_role && <p className="text-xs text-destructive">{errors.id_role}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nama Lengkap</Label>
                            <Input value={data.nama_lengkap} onChange={e => setData('nama_lengkap', e.target.value)} placeholder="Ahmad Santoso" className="rounded-xl" />
                            {errors.nama_lengkap && <p className="text-xs text-destructive">{errors.nama_lengkap}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Username</Label>
                            <Input value={data.username} onChange={e => setData('username', e.target.value)} placeholder="admin" className="rounded-xl font-mono" />
                            {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Password {editing && <span className="text-muted-foreground/50 normal-case">(kosongkan jika tidak diubah)</span>}
                            </Label>
                            <Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder={editing ? '••••••••' : 'Min. 6 karakter'} className="rounded-xl" />
                            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Batal</Button>
                            <Button type="submit" disabled={processing} className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors">
                                {processing ? 'Menyimpan...' : 'Simpan User'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

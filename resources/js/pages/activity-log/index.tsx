import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, LogIn, LogOut, Plus, Pencil, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Activity Log', href: '/activity-log' }];

type Action = 'login' | 'logout' | 'create' | 'update' | 'delete';

interface Log {
    id: number;
    user_id: number | null;
    user_name: string | null;
    action: Action;
    module: string;
    description: string;
    ip_address: string | null;
    created_at: string;
}

interface Paginator {
    data: Log[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    logs: Paginator;
    modules: string[];
    filters: { action?: string; module?: string; search?: string; date_from?: string; date_to?: string };
}

const ACTION_CONFIG: Record<Action, { label: string; color: string; icon: React.ReactNode }> = {
    login: { label: 'Login', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: <LogIn className="h-3 w-3" /> },
    logout: { label: 'Logout', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300', icon: <LogOut className="h-3 w-3" /> },
    create: { label: 'Tambah', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', icon: <Plus className="h-3 w-3" /> },
    update: { label: 'Ubah', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', icon: <Pencil className="h-3 w-3" /> },
    delete: { label: 'Hapus', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: <Trash2 className="h-3 w-3" /> },
};

const MODULE_COLORS: Record<string, string> = {
    Auth: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    Barang: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    Supplier: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    Kategori: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    Pelanggan: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    Penjualan: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    Pembelian: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    User: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
};

function fmtDt(s: string) {
    return new Date(s).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function ActivityLogIndex({ logs, modules, filters }: Props) {
    const [form, setForm] = useState({
        action: filters.action || '',
        module: filters.module || '',
        search: filters.search || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const handleFilter = () => {
        const params = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ''));
        router.get('/activity-log', params, { preserveState: true });
    };

    const handleReset = () => {
        setForm({ action: '', module: '', search: '', date_from: '', date_to: '' });
        router.get('/activity-log', {}, { preserveState: false });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Log" />
            <div className="p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Activity Log</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">Audit trail seluruh aktivitas aplikasi</p>
                    </div>
                    <p className="text-sm text-neutral-400">{logs.total.toLocaleString('id-ID')} entri</p>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-end gap-3 bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-4 shadow-sm print:hidden">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Dari Tanggal</Label>
                        <Input type="date" className="h-8 w-36" value={form.date_from} onChange={e => setForm(f => ({ ...f, date_from: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Sampai Tanggal</Label>
                        <Input type="date" className="h-8 w-36" value={form.date_to} onChange={e => setForm(f => ({ ...f, date_to: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Aksi</Label>
                        <Select value={form.action} onValueChange={v => setForm(f => ({ ...f, action: v === 'all' ? '' : v }))}>
                            <SelectTrigger className="h-8 w-28"><SelectValue placeholder="Semua" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="login">Login</SelectItem>
                                <SelectItem value="logout">Logout</SelectItem>
                                <SelectItem value="create">Tambah</SelectItem>
                                <SelectItem value="update">Ubah</SelectItem>
                                <SelectItem value="delete">Hapus</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Modul</Label>
                        <Select value={form.module} onValueChange={v => setForm(f => ({ ...f, module: v === 'all' ? '' : v }))}>
                            <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Semua" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                {modules.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Cari User / Deskripsi</Label>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                            <Input className="h-8 pl-8 w-48" placeholder="Ketik..." value={form.search} onChange={e => setForm(f => ({ ...f, search: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleFilter()} />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={handleFilter} className="gap-1.5 h-8">
                            <Filter className="h-3.5 w-3.5" /> Filter
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleReset} className="h-8">Reset</Button>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="border-b dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                            <tr className="text-left text-xs text-neutral-500">
                                <th className="px-5 py-3.5 font-medium w-44">Waktu</th>
                                <th className="px-5 py-3.5 font-medium">User</th>
                                <th className="px-5 py-3.5 font-medium w-24">Aksi</th>
                                <th className="px-5 py-3.5 font-medium w-28">Modul</th>
                                <th className="px-5 py-3.5 font-medium">Deskripsi</th>
                                <th className="px-5 py-3.5 font-medium w-32">IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-neutral-400">
                                        Tidak ada aktivitas pada filter ini
                                    </td>
                                </tr>
                            ) : logs.data.map(log => {
                                const ac = ACTION_CONFIG[log.action];
                                const mc = MODULE_COLORS[log.module] ?? 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400';
                                return (
                                    <tr key={log.id} className="border-b last:border-0 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-5 py-3 text-xs text-neutral-500 whitespace-nowrap">{fmtDt(log.created_at)}</td>
                                        <td className="px-5 py-3 font-medium">{log.user_name ?? <span className="text-neutral-400 italic text-xs">—</span>}</td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${ac.color}`}>
                                                {ac.icon} {ac.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${mc}`}>
                                                {log.module}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-neutral-600 dark:text-neutral-300">{log.description}</td>
                                        <td className="px-5 py-3 text-xs font-mono text-neutral-400">{log.ip_address ?? '—'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {logs.last_page > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                            <p className="text-xs text-neutral-400">
                                Halaman {logs.current_page} dari {logs.last_page} ({logs.total.toLocaleString('id-ID')} entri)
                            </p>
                            <div className="flex gap-1">
                                {logs.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        className={`px-3 py-1 rounded-lg text-xs transition-colors ${link.active ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

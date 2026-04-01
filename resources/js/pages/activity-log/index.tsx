import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, LogIn, LogOut, Plus, Pencil, Trash2, Activity } from 'lucide-react';

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
    return new Date(s).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function ActivityLogIndex({ logs, modules, filters }: Props) {
    const page = usePage();
    const [localLogs, setLocalLogs] = useState(logs);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLocalLogs(logs);
    }, [logs]);
    const [form, setForm] = useState({
        action: filters.action || '',
        module: filters.module || '',
        search: filters.search || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const handleFilter = async () => {
        const params = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ''));
        fetchData(params);
    };

    const handleReset = () => {
        setForm({ action: '', module: '', search: '', date_from: '', date_to: '' });
        fetchData({});
    };

    const fetchData = async (params: Record<string, string>) => {
        setLoading(true);
        try {
            const res = await axios.get('/activity-log', {
                params,
                headers: {
                    'X-Inertia': 'true',
                    'X-Inertia-Version': page.version,
                    'X-Inertia-Partial-Data': 'logs',
                    'X-Inertia-Partial-Component': 'activity-log/index'
                }
            });
            setLocalLogs(res.data.props.logs);
            const queryString = new URLSearchParams(params).toString();
            window.history.replaceState({}, '', `/activity-log${queryString ? `?${queryString}` : ''}`);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handlePageClick = async (url: string) => {
        if (!url) return;
        const paramsStr = url.split('?')[1] || '';
        const params = Object.fromEntries(new URLSearchParams(paramsStr).entries());
        fetchData(params);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Log" />
            <div className="p-4 md:p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20">
                            <Activity className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight">Activity Log</h1>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">Audit trail seluruh aktivitas aplikasi</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wide">
                            {logs.total.toLocaleString('id-ID')} Entri
                        </span>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm print:hidden">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Dari Tanggal</Label>
                        <Input type="date" className="h-10 w-36 rounded-xl" value={form.date_from} onChange={e => setForm(f => ({ ...f, date_from: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sampai Tanggal</Label>
                        <Input type="date" className="h-10 w-36 rounded-xl" value={form.date_to} onChange={e => setForm(f => ({ ...f, date_to: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Aksi</Label>
                        <Select value={form.action} onValueChange={v => setForm(f => ({ ...f, action: v === 'all' ? '' : v }))}>
                            <SelectTrigger className="h-10 w-32 rounded-xl"><SelectValue placeholder="Semua Aksi" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Aksi</SelectItem>
                                <SelectItem value="login">Login</SelectItem>
                                <SelectItem value="logout">Logout</SelectItem>
                                <SelectItem value="create">Tambah</SelectItem>
                                <SelectItem value="update">Ubah</SelectItem>
                                <SelectItem value="delete">Hapus</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Modul</Label>
                        <Select value={form.module} onValueChange={v => setForm(f => ({ ...f, module: v === 'all' ? '' : v }))}>
                            <SelectTrigger className="h-10 w-36 rounded-xl"><SelectValue placeholder="Semua Modul" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Modul</SelectItem>
                                {modules.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pencarian</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input className="h-10 pl-9 rounded-xl w-full" placeholder="Cari user atau deskripsi..." value={form.search} onChange={e => setForm(f => ({ ...f, search: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleFilter()} />
                        </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        <Button onClick={handleFilter} disabled={loading} className="h-10 gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors flex-1 sm:flex-none">
                            <Filter className="h-4 w-4" /> {loading ? 'Memuat...' : 'Filter'}
                        </Button>
                        <Button variant="outline" onClick={handleReset} disabled={loading} className="h-10 rounded-xl flex-1 sm:flex-none">Reset</Button>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
                    <div className="h-[2px] bg-gradient-to-r from-teal-500/70 to-cyan-500/40" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left bg-muted/30">
                                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-44">Waktu</th>
                                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">User</th>
                                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-24">Aksi</th>
                                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-28">Modul</th>
                                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Deskripsi</th>
                                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-32">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {localLogs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted"><Activity className="h-6 w-6" /></div>
                                                <p className="text-sm font-medium">Tidak ada aktivitas pada filter ini</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : localLogs.data.map(log => {
                                    const ac = ACTION_CONFIG[log.action];
                                    const mc = MODULE_COLORS[log.module] ?? 'bg-muted text-muted-foreground';
                                    return (
                                        <tr key={log.id} className={`hover:bg-muted/40 transition-colors duration-100 ${loading ? 'opacity-50' : ''}`}>
                                            <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{fmtDt(log.created_at)}</td>
                                            <td className="px-5 py-3.5 font-medium">{log.user_name ?? <span className="text-muted-foreground/50 italic text-xs">—</span>}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${ac.color}`}>
                                                    {ac.icon} {ac.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${mc}`}>
                                                    {log.module}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-foreground/80 text-xs">{log.description}</td>
                                            <td className="px-5 py-3.5 text-[11px] font-mono text-muted-foreground">{log.ip_address ?? '—'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {localLogs.last_page > 1 && (
                        <div className="flex items-center justify-between px-5 py-4 border-t border-border/40 bg-muted/10">
                            <p className="text-xs font-medium text-muted-foreground">
                                Halaman <span className="text-foreground">{localLogs.current_page}</span> dari <span className="text-foreground">{localLogs.last_page}</span> ({localLogs.total.toLocaleString('id-ID')} entri)
                            </p>
                            <div className="flex gap-1">
                                {localLogs.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && handlePageClick(link.url)}
                                        className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-xl text-xs font-medium transition-colors ${link.active ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/20' : 'hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border/60'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
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

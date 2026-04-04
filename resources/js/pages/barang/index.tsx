import { useRef, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Barang, Kategori, KelompokKategori, Supplier } from '@/types/pos';
import { FlashMessage } from '@/components/flash-message';
import { DeleteConfirm } from '@/components/delete-confirm';
import { SchoolFilter } from '@/components/school-filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Pencil, Plus, Search, Package, AlertTriangle, Eye, ImagePlus, X } from 'lucide-react';
import type { SharedProps } from '@/types/auth';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Barang', href: '/barang' }];

interface Props {
    barang: Barang[];
    kategori: Kategori[];
    kelompok: KelompokKategori[];
    suppliers: Supplier[];
    isReadOnly: boolean;
    sekolahList: { id_sekolah: number; nama_sekolah: string }[];
    selectedSekolahId: number | null;
}

const fmtRp = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

function StokBadge({ stok, satuan }: { stok: number; satuan: string }) {
    if (stok <= 5) return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-xs font-semibold text-red-700 dark:text-red-400">
            <AlertTriangle className="h-3 w-3" />{stok} {satuan}
        </span>
    );
    if (stok <= 20) return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
            {stok} {satuan}
        </span>
    );
    return (
        <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {stok} {satuan}
        </span>
    );
}

/** Tampilkan gambar barang di tabel dengan fallback ke icon Package */
function BarangImage({ src, nama }: { src?: string | null; nama: string }) {
    const [error, setError] = useState(false);
    if (!src || error) {
        return (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/30">
                <Package className="h-5 w-5 text-teal-400/60" />
            </div>
        );
    }
    return (
        <img
            src={src}
            alt={nama}
            onError={() => setError(true)}
            className="h-10 w-10 rounded-lg object-cover border border-border/40 shadow-sm"
        />
    );
}

export default function BarangIndex({ barang, kategori, kelompok, suppliers, isReadOnly, sekolahList, selectedSekolahId }: Props) {
    const [sekolahFilter, setSekolahFilter] = useState<number | null>(selectedSekolahId);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Barang | null>(null);
    const [search, setSearch] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState({
        barcode: '', nama: '',
        id_kategori: '', id_kelompok_kategori: '', id_supplier: '',
        satuan: 'pcs', harga_beli: '', harga_jual: '', stok: '', is_active: true,
    });
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [existingIcon, setExistingIcon] = useState<string | null>(null);

    const reset = () => {
        setFormData({ barcode: '', nama: '', id_kategori: '', id_kelompok_kategori: '', id_supplier: '', satuan: 'pcs', harga_beli: '', harga_jual: '', stok: '', is_active: true });
        setIconFile(null);
        setIconPreview(null);
        setExistingIcon(null);
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const openCreate = () => { reset(); setEditing(null); setOpen(true); };
    const openEdit = (b: Barang) => {
        setFormData({
            barcode: b.barcode, nama: b.nama,
            id_kategori: String(b.id_kategori),
            id_kelompok_kategori: String(b.id_kelompok_kategori),
            id_supplier: String(b.id_supplier),
            satuan: b.satuan, harga_beli: String(b.harga_beli),
            harga_jual: String(b.harga_jual), stok: String(b.stok),
            is_active: Boolean(b.is_active),
        });
        setIconFile(null);
        setIconPreview(null);
        setExistingIcon(b.icon ?? null);
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = '';
        setEditing(b); setOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIconFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setIconPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setIconFile(null);
        setIconPreview(null);
        if (!editing) setExistingIcon(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const url = editing ? `/barang/${editing.id_barang}` : '/barang';
        
        const payload: Record<string, any> = {
            ...formData,
        };
        
        // Ensure boolean is true/false integer if preferred, though Inertia handles natively
        payload.is_active = formData.is_active ? 1 : 0;

        if (iconFile) {
            payload.icon = iconFile;
        }

        if (editing) {
            payload._method = 'PUT';
        }

        router.post(url, payload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => { setOpen(false); reset(); setProcessing(false); },
            onError: (errs) => { setErrors(errs); setProcessing(false); },
            onFinish: () => setProcessing(false),
        });
    };

    const filtered = barang.filter(b => {
        if (sekolahFilter !== null && b.id_sekolah !== sekolahFilter) return false;
        return b.nama.toLowerCase().includes(search.toLowerCase()) || b.barcode.toLowerCase().includes(search.toLowerCase());
    });

    const currentPreview = iconPreview ?? (iconFile ? URL.createObjectURL(iconFile) : existingIcon);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Barang" />
            <FlashMessage />
            <div className="p-4 md:p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20">
                            <Package className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight">Data Barang</h1>
                                {isReadOnly && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 dark:bg-teal-900/30 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide">
                                        <Eye className="h-2.5 w-2.5" /> Lihat Saja
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {isReadOnly ? 'Mode tampilan — tidak dapat mengubah data' : 'Kelola stok dan harga produk'}
                            </p>
                        </div>
                    </div>
                    {!isReadOnly && (
                        <Button
                            onClick={openCreate}
                            className="gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20 hover:shadow-teal-500/30 transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <Plus className="h-4 w-4" /> Tambah Barang
                        </Button>
                    )}
                    {isReadOnly && (
                        <SchoolFilter
                            sekolahList={sekolahList ?? []}
                            selectedSekolahId={sekolahFilter}
                            baseUrl="/barang"
                            onClientFilter={setSekolahFilter}
                        />
                    )}
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9 rounded-xl h-10 bg-background"
                        placeholder="Cari nama atau barcode…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
                    {/* Top accent line — teal only */}
                    <div className="h-[2px] bg-gradient-to-r from-teal-500/70 to-cyan-500/40" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left bg-muted/30">
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-14">Foto</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Barcode</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nama Barang</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kategori</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Harga Beli</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Harga Jual</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stok</th>
                                    {!isReadOnly && <th className="px-4 py-3 w-20" />}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={isReadOnly ? 7 : 8}>
                                            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                                                    <Package className="h-6 w-6" />
                                                </div>
                                                <p className="text-sm font-medium">Tidak ada data barang</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filtered.map(b => (
                                    <tr key={b.id_barang} className="hover:bg-muted/40 transition-colors duration-100">
                                        {/* Image column */}
                                        <td className="px-4 py-3">
                                            <BarangImage src={b.icon} nama={b.nama} />
                                        </td>
                                        <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">{b.barcode}</td>
                                        <td className="px-4 py-3.5 font-semibold text-foreground">{b.nama}</td>
                                        <td className="px-4 py-3.5">
                                            <span className="inline-flex rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                                {b.kategori?.nama}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-muted-foreground text-xs">{fmtRp(b.harga_beli)}</td>
                                        <td className="px-4 py-3.5 font-semibold text-teal-600 dark:text-teal-400">{fmtRp(b.harga_jual)}</td>
                                        <td className="px-4 py-3.5">
                                            <StokBadge stok={b.stok} satuan={b.satuan} />
                                        </td>
                                        {!isReadOnly && (
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600"
                                                        onClick={() => openEdit(b)}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <DeleteConfirm url={`/barang/${b.id_barang}`} name={b.nama} />
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Dialog Form — hanya muncul jika tidak read-only */}
            {!isReadOnly && (
                <Dialog open={open} onOpenChange={(v) => { if (!v) { setOpen(false); reset(); } else setOpen(true); }}>
                    <DialogContent className="sm:max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                                    {editing ? <Pencil className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                                </div>
                                {editing ? 'Ubah Barang' : 'Tambah Barang Baru'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Foto Barang
                                </Label>
                                <div className="flex items-start gap-4">
                                    {/* Preview */}
                                    <div className="relative flex-shrink-0">
                                        {currentPreview ? (
                                            <div className="relative">
                                                <img
                                                    src={currentPreview}
                                                    alt="Preview"
                                                    className="h-20 w-20 rounded-xl object-cover border-2 border-teal-200 dark:border-teal-700 shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-teal-300 dark:border-teal-700 bg-teal-50/50 dark:bg-teal-900/10">
                                                <Package className="h-8 w-8 text-teal-300 dark:text-teal-700" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Upload button area */}
                                    <div className="flex-1 space-y-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            id="icon-upload"
                                            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <label
                                            htmlFor="icon-upload"
                                            className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-teal-300 dark:border-teal-700 bg-teal-50/50 dark:bg-teal-900/10 px-4 py-3 text-sm text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                                        >
                                            <ImagePlus className="h-4 w-4" />
                                            <span>{iconFile ? iconFile.name : 'Pilih gambar…'}</span>
                                        </label>
                                        <p className="text-[11px] text-muted-foreground">
                                            Format: JPG, PNG, GIF, WebP · Maks 2MB
                                        </p>
                                        {errors.icon && <p className="text-xs text-destructive">{errors.icon}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Barcode</Label>
                                    <Input value={formData.barcode} onChange={e => setFormData(p => ({ ...p, barcode: e.target.value }))} placeholder="123456789" className="rounded-xl" />
                                    {errors.barcode && <p className="text-xs text-destructive">{errors.barcode}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Satuan</Label>
                                    <Input value={formData.satuan} onChange={e => setFormData(p => ({ ...p, satuan: e.target.value }))} placeholder="pcs, liter, kg" className="rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nama Barang</Label>
                                <Input value={formData.nama} onChange={e => setFormData(p => ({ ...p, nama: e.target.value }))} placeholder="Nama produk..." className="rounded-xl" />
                                {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kelompok Kategori</Label>
                                    <Select value={String(formData.id_kelompok_kategori)} onValueChange={v => setFormData(p => ({ ...p, id_kelompok_kategori: v }))}>
                                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Kelompok" /></SelectTrigger>
                                        <SelectContent className="rounded-xl">{kelompok.map(k => <SelectItem key={k.id_kelompok} value={String(k.id_kelompok)}>{k.nama_kelompok}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kategori</Label>
                                    <Select value={String(formData.id_kategori)} onValueChange={v => setFormData(p => ({ ...p, id_kategori: v }))}>
                                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Kategori" /></SelectTrigger>
                                        <SelectContent className="rounded-xl">{kategori.map(k => <SelectItem key={k.id_kategori} value={String(k.id_kategori)}>{k.nama}</SelectItem>)}</SelectContent>
                                    </Select>
                                    {errors.id_kategori && <p className="text-xs text-destructive">{errors.id_kategori}</p>}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Supplier</Label>
                                <Select value={String(formData.id_supplier)} onValueChange={v => setFormData(p => ({ ...p, id_supplier: v }))}>
                                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih supplier" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">{suppliers.map(s => <SelectItem key={s.id_supplier} value={String(s.id_supplier)}>{s.nama}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Harga Beli</Label>
                                    <Input type="number" value={formData.harga_beli} onChange={e => setFormData(p => ({ ...p, harga_beli: e.target.value }))} min="0" className="rounded-xl" />
                                    {errors.harga_beli && <p className="text-xs text-destructive">{errors.harga_beli}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Harga Jual</Label>
                                    <Input type="number" value={formData.harga_jual} onChange={e => setFormData(p => ({ ...p, harga_jual: e.target.value }))} min="0" className="rounded-xl" />
                                    {errors.harga_jual && <p className="text-xs text-destructive">{errors.harga_jual}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Stok Awal</Label>
                                    <Input type="number" value={formData.stok} onChange={e => setFormData(p => ({ ...p, stok: e.target.value }))} min="0" className="rounded-xl" />
                                </div>
                            </div>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => { setOpen(false); reset(); }} className="rounded-xl">Batal</Button>
                                <Button type="submit" disabled={processing} className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors">
                                    {processing ? 'Menyimpan...' : (editing ? 'Simpan Perubahan' : 'Tambah Barang')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </AppLayout>
    );
}

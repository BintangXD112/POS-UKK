import { router } from '@inertiajs/react';
import { Building2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Sekolah {
    id_sekolah: number;
    nama_sekolah: string;
}

interface Props {
    sekolahList: Sekolah[];
    selectedSekolahId: number | null;
    /** URL halaman saat ini untuk redirect, misal '/barang' */
    baseUrl: string;
    /**
     * Daftar prop Inertia yang perlu di-reload (partial reload).
     * Jika diisi, Inertia hanya fetch prop tersebut — tidak ada full page navigation.
     * Contoh: ['barang', 'selectedSekolahId']
     */
    only?: string[];
    /** Callback untuk filtering murni di frontend (tanpa XHR request Inertia) */
    onClientFilter?: (id: number | null) => void;
}

export function SchoolFilter({ sekolahList, selectedSekolahId, baseUrl, only, onClientFilter }: Props) {
    if (!sekolahList || sekolahList.length === 0) return null;

    const handleChange = (value: string) => {
        const val = value === '_all' ? null : Number(value);
        if (onClientFilter) {
            onClientFilter(val);
        } else {
            const params = value === '_all' ? {} : { id_sekolah: value };
            setTimeout(() => {
                router.get(baseUrl, params, {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                    ...(only && only.length > 0 ? { only } : {}),
                });
            }, 100);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 text-teal-500" />
                <span className="font-medium">Filter:</span>
            </div>
            <select
                value={selectedSekolahId ? String(selectedSekolahId) : '_all'}
                onChange={(e) => handleChange(e.target.value)}
                className="flex h-9 w-48 items-center justify-between rounded-xl border bg-card px-3 py-2 text-xs font-medium text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            >
                <option value="_all" className="text-xs">— Semua Sekolah —</option>
                {sekolahList.map(s => (
                    <option key={s.id_sekolah} value={String(s.id_sekolah)} className="text-xs">
                        {s.nama_sekolah}
                    </option>
                ))}
            </select>
        </div>
    );
}

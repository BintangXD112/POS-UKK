import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { FlashMessage } from '@/components/flash-message';
import { SchoolFilter } from '@/components/school-filter';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HardDriveDownload, Database, Trash2, ArrowRightLeft, XCircle, AlertTriangle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Restore Data', href: '/restore-data' }];

interface DeletedRecord {
    id: number | string;
    identifier: string;
    deleted_at: string;
    raw: any;
}

interface Props {
    deletedRecords: DeletedRecord[];
    currentType: string;
    supportedTypes: string[];
    isSuperAdmin: boolean;
    sekolahList: { id_sekolah: number; nama_sekolah: string }[] | null;
    selectedSekolahId: number | null;
}

export default function RestoreDataIndex({ 
    deletedRecords, 
    currentType, 
    supportedTypes, 
    isSuperAdmin, 
    sekolahList, 
    selectedSekolahId 
}: Props) {

    const handleTypeChange = (newType: string) => {
        router.get('/restore-data', { 
            type: newType, 
            id_sekolah: selectedSekolahId || undefined 
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleSekolahChange = (newSchoolId: number | null) => {
        router.get('/restore-data', { 
            type: currentType, 
            id_sekolah: newSchoolId || undefined 
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleRestore = (id: number | string) => {
        router.post(`/restore-data/${currentType}/${id}/restore`, {}, {
            preserveScroll: true,
        });
    };

    const handleForceDelete = (id: number | string) => {
        router.delete(`/restore-data/${currentType}/${id}/force-delete`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Restore Data" />
            <FlashMessage />
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex border-b pb-4 flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
                            <Database className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Restore Data</h1>
                            <p className="text-sm text-muted-foreground">Pulihkan data yang telah terhapus (Soft Delete)</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                        {isSuperAdmin && sekolahList && (
                            <div className="flex bg-card items-center gap-2 p-1.5 rounded-xl border w-full sm:w-auto">
                                <SchoolFilter
                                    sekolahList={sekolahList}
                                    selectedSekolahId={selectedSekolahId}
                                    baseUrl="/restore-data"
                                    onClientFilter={handleSekolahChange}
                                />
                            </div>
                        )}
                        <Select value={currentType} onValueChange={handleTypeChange}>
                            <SelectTrigger className="w-full sm:w-[180px] rounded-xl h-12 bg-white dark:bg-card">
                                <SelectValue placeholder="Pilih Tipe Data" />
                            </SelectTrigger>
                            <SelectContent>
                                {supportedTypes.map(t => (
                                    <SelectItem key={t} value={t} className="capitalize">
                                        {t}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-2xl border border-border shadow-sm bg-card overflow-hidden">
                    <div className="p-4 border-b bg-muted/40">
                        <div className="flex items-center gap-2 text-sm font-semibold capitalize">
                            <Trash2 className="h-4 w-4 text-orange-500" />
                            Riwayat Terhapus: {currentType}
                        </div>
                    </div>
                    {deletedRecords.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center gap-3 text-muted-foreground">
                            <div className="h-14 w-14 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center">
                                <Trash2 className="h-7 w-7 text-orange-400 opacity-50" />
                            </div>
                            <p>Belum ada riwayat data {currentType} yang terhapus.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/30 text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold w-24">ID</th>
                                        <th className="px-6 py-4 font-semibold">Identitas Data</th>
                                        <th className="px-6 py-4 font-semibold">Tanggal Dihapus</th>
                                        <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {deletedRecords.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                                            <td className="px-6 py-3.5 font-medium">{item.id}</td>
                                            <td className="px-6 py-3.5">
                                                <div className="font-semibold text-foreground">{item.identifier}</div>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className="inline-flex items-center gap-1.5 rounded-md bg-orange-100 dark:bg-orange-900/30 px-2 py-1 text-xs font-medium text-orange-800 dark:text-orange-300">
                                                    {item.deleted_at}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-right space-x-2 whitespace-nowrap">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button 
                                                            size="sm" 
                                                            className="rounded-lg gap-1.5 bg-orange-600 hover:bg-orange-700 text-white"
                                                        >
                                                            <ArrowRightLeft className="h-3.5 w-3.5" />
                                                            Restore
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Konfirmasi Restore Data</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Apakah Anda yakin ingin mengembalikan data <strong>"{item.identifier}"</strong>? Data ini akan dipulihkan dan dapat diakses kembali di aplikasi selayaknya sedia kala.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleRestore(item.id)}
                                                                className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white"
                                                            >
                                                                Ya, Kembalikan Data
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button 
                                                            size="sm" 
                                                            variant="destructive"
                                                            className="rounded-lg gap-1.5"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5" />
                                                            Hapus Permanen
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                                                <AlertTriangle className="h-5 w-5" />
                                                                Hapus Permanen Data
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription className="text-foreground">
                                                                Apakah Anda yakin ingin menghapus permanen data <strong>"{item.identifier}"</strong>?
                                                                <br /><br />
                                                                <span className="text-destructive font-semibold">Tindakan ini tidak dapat dibatalkan.</span> Seluruh file atau entri terkait secara fisik akan terhapus bersih dari database.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleForceDelete(item.id)}
                                                                className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                                            >
                                                                Ya, Hapus Permanen
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import type { SharedProps } from '@/types/auth';

// Simple in-memory toast (menggunakan browser alert minimal)
// Untuk production bisa diganti dengan sonner/react-hot-toast
export function useFlash() {
    const { flash } = usePage<SharedProps>().props;
    return flash;
}

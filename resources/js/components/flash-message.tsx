import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import type { SharedProps } from '@/types/auth';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FlashMessage() {
    const { flash } = usePage<SharedProps>().props;
    const [visible, setVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const DURATION = { success: 4000, error: 5500 };

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setMessage({
                type: flash.success ? 'success' : 'error',
                text: (flash.success || flash.error) as string,
            });
            setIsLeaving(false);
            setVisible(true);

            const dur = flash.success ? DURATION.success : DURATION.error;
            const t = setTimeout(() => handleClose(), dur);
            return () => clearTimeout(t);
        }
    }, [flash]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => setVisible(false), 320);
    };

    if (!visible || !message) return null;

    const isSuccess = message.type === 'success';

    return (
        <div
            className={cn(
                'fixed top-5 right-5 z-[9999] w-full max-w-[360px]',
                'rounded-2xl border shadow-2xl overflow-hidden',
                'transition-all duration-300 will-change-transform',
                isLeaving ? 'animate-slide-out-right opacity-0' : 'animate-slide-in-right',
                isSuccess
                    ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800/60'
                    : 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-800/60',
            )}
        >
            {/* Progress bar */}
            <div className="relative h-0.5 overflow-hidden">
                <div
                    className={cn(
                        'h-full rounded-full',
                        isSuccess
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-red-500 to-rose-500',
                    )}
                    style={{
                        animation: `progress-bar ${isSuccess ? DURATION.success : DURATION.error}ms linear forwards`,
                    }}
                />
            </div>

            {/* Content */}
            <div className="flex items-start gap-3 px-4 py-3.5">
                <div className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl mt-0.5',
                    isSuccess
                        ? 'bg-emerald-100 dark:bg-emerald-900/30'
                        : 'bg-red-100 dark:bg-red-900/30',
                )}>
                    {isSuccess
                        ? <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                        : <XCircle className="h-4.5 w-4.5 text-red-600 dark:text-red-400" />
                    }
                </div>
                <div className="flex-1 min-w-0">
                    <p className={cn(
                        'text-xs font-bold uppercase tracking-wide mb-0.5',
                        isSuccess
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-red-700 dark:text-red-400',
                    )}>
                        {isSuccess ? 'Berhasil' : 'Terjadi Kesalahan'}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-snug">
                        {message.text}
                    </p>
                </div>
                <button
                    onClick={handleClose}
                    className="shrink-0 h-6 w-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}

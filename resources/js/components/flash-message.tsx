import React, { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import type { SharedProps } from '@/types/auth';
import { CheckCircle, XCircle, X } from 'lucide-react';

export function FlashMessage() {
    const { flash } = usePage<SharedProps>().props;
    const [visible, setVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setMessage({
                type: flash.success ? 'success' : 'error',
                text: (flash.success || flash.error) as string
            });
            setIsLeaving(false);
            setVisible(true);

            const duration = flash.success ? 4000 : 5000;
            const t = setTimeout(() => handleClose(), duration);
            return () => clearTimeout(t);
        }
    }, [flash]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => setVisible(false), 300); // Wait for exit animation
    };

    if (!visible || !message) return null;

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-xl border text-sm font-medium transition-all duration-300 will-change-transform max-w-sm ${isLeaving ? 'animate-slide-out-right opacity-0' : 'animate-slide-in-right opacity-100'
                } ${message.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300'
                    : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300'
                }`}
        >
            {message.type === 'success'
                ? <CheckCircle className="h-4 w-4 shrink-0" />
                : <XCircle className="h-4 w-4 shrink-0" />
            }
            <span>{message.text}</span>
            <button onClick={handleClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}

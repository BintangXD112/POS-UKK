import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

export function PageTransition({ children }: { children: ReactNode }) {
    const { url } = usePage();

    return (
        <div
            key={url}
            className="w-full flex-1 animate-page-in will-change-transform"
        >
            {children}
        </div>
    );
}

import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

export function PageTransition({ children }: { children: ReactNode }) {
    const { component } = usePage();

    return (
        <div
            key={component}
            className="w-full flex-1 animate-page-in will-change-transform"
        >
            {children}
        </div>
    );
}

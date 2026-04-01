import { ShoppingCart } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md shadow-teal-500/25">
                <ShoppingCart className="size-4 text-white" strokeWidth={2.5} />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-sidebar-foreground tracking-tight text-[13.5px]">
                    POS Koperasi
                </span>
                <span className="truncate text-[10.5px] text-teal-500 dark:text-teal-400 leading-tight font-medium">
                    SMK Management
                </span>
            </div>
        </>
    );
}

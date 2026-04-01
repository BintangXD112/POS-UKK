import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';

type ExtendedNavItem = NavItem & { readOnly?: boolean };

export function NavMain({ items = [] }: { items: ExtendedNavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.12em] text-sidebar-foreground/35 px-2 mb-1.5">
                Menu
            </SidebarGroupLabel>
            <SidebarMenu className="gap-0.5">
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.readOnly ? `${item.title} (Lihat Saja)` : item.title }}
                                className={cn(
                                    'relative rounded-xl h-10 px-3 transition-all duration-200',
                                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                                    active && 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                                )}
                            >
                                <Link href={item.href} prefetch className="flex items-center gap-3 w-full">
                                    {/* Active left border pill */}
                                    {active && (
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-teal-500 dark:bg-teal-400" />
                                    )}

                                    {item.icon && (
                                        <item.icon className={cn(
                                            'h-[17px] w-[17px] shrink-0 transition-colors',
                                            active
                                                ? 'text-teal-600 dark:text-teal-400'
                                                : 'text-sidebar-foreground/50',
                                        )} />
                                    )}

                                    <span className={cn(
                                        'text-[13px] font-medium tracking-normal flex-1 truncate',
                                        active
                                            ? 'text-sidebar-foreground font-semibold'
                                            : 'text-sidebar-foreground/65'
                                    )}>
                                        {item.title}
                                    </span>

                                    {/* Read-only badge */}
                                    {item.readOnly && (
                                        <span className="shrink-0 flex items-center gap-0.5 rounded-md bg-teal-100 dark:bg-teal-900/30 px-1.5 py-0.5 text-[9px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide group-data-[collapsible=icon]:hidden">
                                            <Eye className="h-2.5 w-2.5" />
                                            View
                                        </span>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

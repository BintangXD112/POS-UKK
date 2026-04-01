import { usePage } from '@inertiajs/react';
import { LogOut, Settings, User, ChevronsUpDown } from 'lucide-react';
import { router } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useInitials } from '@/hooks/use-initials';

export function NavUser() {
    const { auth } = usePage().props as any;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const getInitials = useInitials();

    const user = auth?.user;
    const initials = user ? getInitials(user.nama_lengkap || user.name || '') : '??';
    const roleName = user?.role?.nama_role ?? 'User';

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group rounded-xl hover:bg-sidebar-accent/80 transition-all duration-200 data-[state=open]:bg-sidebar-accent"
                            data-test="sidebar-menu-button"
                        >
                            {/* Avatar — teal gradient only */}
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-xs font-bold shadow-md shadow-teal-500/25">
                                {initials}
                            </div>
                            <div className="flex flex-1 flex-col items-start text-left leading-tight min-w-0">
                                <span className="truncate text-[13px] font-semibold text-sidebar-foreground">
                                    {user?.nama_lengkap || user?.name || 'User'}
                                </span>
                                <span className="truncate text-[11px] text-teal-500 dark:text-teal-400 font-medium capitalize">
                                    {roleName}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto h-4 w-4 text-sidebar-foreground/35 group-hover:text-sidebar-foreground/60 transition-colors shrink-0" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-56 rounded-xl border border-border/70 shadow-xl"
                        align="end"
                        side={isMobile ? 'bottom' : state === 'collapsed' ? 'right' : 'top'}
                        sideOffset={8}
                    >
                        <DropdownMenuLabel className="font-normal px-3 py-2">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-xs font-bold">
                                    {initials}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <p className="text-sm font-semibold truncate">{user?.nama_lengkap || user?.name}</p>
                                    <p className="text-xs text-muted-foreground capitalize truncate">{roleName}</p>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => router.visit('/settings/profile')}
                            className="cursor-pointer gap-2.5 rounded-lg mx-1 px-2.5"
                        >
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>Profil Saya</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => router.visit('/settings')}
                            className="cursor-pointer gap-2.5 rounded-lg mx-1 px-2.5"
                        >
                            <Settings className="h-4 w-4 text-muted-foreground" />
                            <span>Pengaturan</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => router.post('/logout')}
                            className="cursor-pointer gap-2.5 rounded-lg mx-1 px-2.5 mb-1 text-destructive focus:text-destructive focus:bg-destructive/8"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Keluar</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

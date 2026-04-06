import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import type { BreadcrumbItem } from '@/types';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import { dashboard } from '@/routes';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props as any;
    const getInitials = useInitials();

    const userInitials = getInitials(auth?.user?.nama_lengkap || auth?.user?.name || '');

    return (
        <>
            <div className="border-b border-border/60 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
                <div className="mx-auto flex h-14 items-center gap-3 px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-xl"
                                >
                                    <Menu className="h-4.5 w-4.5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex h-full w-64 flex-col bg-sidebar p-0"
                            >
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="px-4 py-3 border-b border-sidebar-border/60">
                                    <Link href={dashboard()} className="flex items-center gap-2">
                                        <AppLogoIcon className="h-6 w-6 fill-current text-teal-500" />
                                        <span className="font-bold text-sm text-sidebar-foreground">POS UKK</span>
                                    </Link>
                                </SheetHeader>
                                <div className="flex-1 p-3">
                                    <p className="text-xs text-muted-foreground px-2">Gunakan sidebar untuk navigasi</p>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Logo */}
                    <Link
                        href={dashboard()}
                        prefetch
                        className="hidden lg:flex items-center gap-2"
                    >
                        <AppLogo />
                    </Link>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Right side: User avatar */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-9 w-9 rounded-full p-0 ring-2 ring-transparent hover:ring-teal-500/30 transition-all"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-xs font-bold">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 rounded-xl" align="end">
                            <UserMenuContent user={auth?.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-border/50 bg-background/80">
                    <div className="mx-auto flex h-10 w-full items-center px-4 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}

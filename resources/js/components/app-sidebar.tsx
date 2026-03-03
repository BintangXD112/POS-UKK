import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid, Store, Users, Tag, UserCheck, Truck,
    Package, ShoppingCart, CreditCard, BarChart2, School,
    Receipt, ClipboardList,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar, SidebarContent, SidebarFooter,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import type { SharedProps } from '@/types/auth';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedProps>().props;
    const role = auth?.user?.role?.nama_role;

    const isSuperAdmin = role === 'super admin';

    const allNavItems: (NavItem & { roles?: string[] })[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        // Super Admin only
        {
            title: 'Data Sekolah',
            href: '/sekolah',
            icon: School,
            roles: ['super admin'],
        },
        // Super Admin + Admin
        {
            title: 'Manajemen User',
            href: '/users',
            icon: Users,
            roles: ['super admin', 'admin'],
        },
        {
            title: 'Kategori',
            href: '/kategori',
            icon: Tag,
            roles: ['super admin', 'admin'],
        },
        {
            title: 'Pelanggan',
            href: '/pelanggan',
            icon: UserCheck,
            roles: ['super admin', 'admin'],
        },
        {
            title: 'Supplier',
            href: '/supplier',
            icon: Truck,
            roles: ['super admin', 'admin'],
        },
        {
            title: 'Barang',
            href: '/barang',
            icon: Package,
            roles: ['super admin', 'admin'],
        },
        {
            title: 'Pembelian',
            href: '/pembelian',
            icon: ShoppingCart,
            roles: ['super admin', 'admin'],
        },
        // Super Admin + Kasir
        {
            title: 'POS Kasir',
            href: '/pos',
            icon: Store,
            roles: ['super admin', 'kasir'],
        },
        // Super Admin + Admin
        {
            title: 'Laporan Penjualan',
            href: '/laporan/penjualan',
            icon: BarChart2,
            roles: ['super admin', 'admin'],
        },
        {
            title: 'Laporan Pembelian',
            href: '/laporan/pembelian',
            icon: Receipt,
            roles: ['super admin', 'admin'],
        },
        {
            title: 'Rekap Transaksi',
            href: '/penjualan',
            icon: CreditCard,
            roles: ['super admin', 'admin'],
        },
    ];

    const navItems = allNavItems.filter(item => {
        if (!item.roles) return true;
        return Boolean(role && item.roles.includes(role));
    });

    // Activity Log — khusus super admin, ditampilkan paling bawah
    const activityLogItems: NavItem[] = isSuperAdmin
        ? [{ title: 'Activity Log', href: '/activity-log', icon: ClipboardList }]
        : [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
                {activityLogItems.length > 0 && (
                    <div className="mt-auto">
                        <NavMain items={activityLogItems} />
                    </div>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

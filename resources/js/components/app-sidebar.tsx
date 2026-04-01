import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid, Store, Users, Tag, UserCheck, Truck,
    Package, ShoppingCart, BarChart2, School,
    Receipt, CreditCard, ClipboardList, Eye,
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

import type { NavGroup } from '@/components/nav-main';

type ExtendedNavItem = NavItem & { readOnly?: boolean };

export function AppSidebar() {
    const { auth } = usePage<SharedProps>().props;
    const role = auth?.user?.role?.nama_role;

    const isSuperAdmin = role === 'super admin';
    const isAdmin      = role === 'admin';
    const isKasir      = role === 'kasir';

    // ── Super Admin Nav ──────────────────────────────────────────────────────
    const superAdminNav: NavGroup[] = [
        {
            title: 'Beranda',
            items: [
                { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
                { title: 'Activity Log', href: '/activity-log', icon: ClipboardList },
            ]
        },
        {
            title: 'Data Master',
            items: [
                { title: 'Data Sekolah', href: '/sekolah', icon: School },
                { title: 'Kategori', href: '/kategori', icon: Tag, readOnly: true },
                { title: 'Barang', href: '/barang', icon: Package, readOnly: true },
                { title: 'Pelanggan', href: '/pelanggan', icon: UserCheck, readOnly: true },
                { title: 'Supplier', href: '/supplier', icon: Truck, readOnly: true },
            ]
        },
        {
            title: 'Transaksi & Laporan',
            items: [
                { title: 'Pembelian', href: '/pembelian', icon: ShoppingCart, readOnly: true },
                { title: 'Rekap Transaksi', href: '/penjualan', icon: CreditCard, readOnly: true },
                { title: 'Laporan Penjualan', href: '/laporan/penjualan', icon: BarChart2, readOnly: true },
                { title: 'Laporan Pembelian', href: '/laporan/pembelian', icon: Receipt, readOnly: true },
            ]
        },
        {
            title: 'Pengaturan',
            items: [
                { title: 'Manajemen User', href: '/users', icon: Users },
            ]
        }
    ];

    // ── Admin Nav ────────────────────────────────────────────────────────────
    const adminNav: NavGroup[] = [
        {
            title: 'Beranda',
            items: [
                { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
            ]
        },
        {
            title: 'Data Master',
            items: [
                { title: 'Kategori', href: '/kategori', icon: Tag },
                { title: 'Barang', href: '/barang', icon: Package },
                { title: 'Pelanggan', href: '/pelanggan', icon: UserCheck },
                { title: 'Supplier', href: '/supplier', icon: Truck },
            ]
        },
        {
            title: 'Transaksi & Laporan',
            items: [
                { title: 'Pembelian', href: '/pembelian', icon: ShoppingCart },
                { title: 'Rekap Transaksi', href: '/penjualan', icon: CreditCard },
                { title: 'Laporan Penjualan', href: '/laporan/penjualan', icon: BarChart2 },
                { title: 'Laporan Pembelian', href: '/laporan/pembelian', icon: Receipt },
            ]
        },
        {
            title: 'Pengaturan',
            items: [
                { title: 'Manajemen User', href: '/users', icon: Users },
            ]
        }
    ];

    // ── Kasir Nav ────────────────────────────────────────────────────────────
    const kasirNav: NavGroup[] = [
        {
            title: 'Beranda',
            items: [
                { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
            ]
        },
        {
            title: 'Transaksi',
            items: [
                { title: 'POS Kasir', href: '/pos', icon: Store },
                { title: 'Riwayat Transaksi', href: '/penjualan', icon: Receipt, readOnly: true },
            ]
        }
    ];

    const navGroups: NavGroup[] = isSuperAdmin
        ? superAdminNav
        : isAdmin
        ? adminNav
        : isKasir
        ? kasirNav
        : [{ title: 'Beranda', items: [{ title: 'Dashboard', href: '/dashboard', icon: LayoutGrid }] }];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-b border-sidebar-border/60 pb-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent/60 transition-colors">
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="scrollbar-thin">
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/60 pt-2">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

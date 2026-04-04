# Project Context: POS-UKK Koperasi Sekolah

This document serves as a comprehensive overview of the **POS-UKK** application, designed for both human developers and AI coding agents to quickly understand the system's architecture, business logic, and technical stack.

## 1. Project Overview
**POS-UKK (Point of Sale Koperasi Sekolah)** is a web-based retail management system specifically tailored for school cooperatives. It handles inventory management, supplier relations, customer tracking, and multi-mode transactions (Sales & Purchases).

### Core Mission:
Provide a streamlined, school-scoped POS system where a central authority (Superadmin) can manage multiple school outlets, while individual school staff (Admin/Kasir) handle daily operations.

---

## 2. Technical Stack
The application is built on a modern, high-performance web stack:

- **Backend**: [Laravel 12+](https://laravel.com/) (PHP)
- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Adapter**: [Inertia.js](https://inertiajs.com/) (Server-side routing with Client-side feel)
- **Authentication**: [Laravel Fortify](https://laravel.com/docs/fortify) (Headless authentication)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) with [Radix UI](https://www.radix-ui.com/) components
- **Visualization**: [Recharts](https://recharts.org/) for data analysis
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build System**: [Vite](https://vitejs.dev/) + [pnpm](https://pnpm.io/)

---

## 3. User Roles & Redirection Logic
Access is governed by a `role`-based middleware and a centralized `id_sekolah` scoping.

| Role | Access Scope | Login Landing Page |
|---|---|---|
| **Superadmin** | Global (all schools) | `/dashboard` |
| **Admin** | Specific School | `/dashboard` |
| **Kasir** | Specific School | `/pos` |

> [!NOTE]
> The **Dashboard** is intelligently tailored. It hides from Kasir (direct redirection to POS) and displays visual charts for Admins/Superadmins.

---

## 4. Feature Modules

### 🛒 Point of Sale (POS)
- Dedicated interface for the **Kasir** role.
- Real-time cart management with discount logic (Percent/Nominal).
- Payment statuses: `sudah bayar`, `belum bayar`, and `hutang`.
- Quick stock verification before checkout.

### 📦 Inventory & Master Data
- **Barang**: Main product database with barcode, buy/sell price, and image tracking.
- **Kategori**: Multilevel categorization (Kelompok -> Kategori).
- **Supplier & Pelanggan**: Contact management for procurement and sales.

### 💰 Transactions
- **Penjualan (Sales)**: Customer-facing transactions with receipt generation.
- **Pembelian (Purchases)**: Restocking from suppliers with faktur tracking.
- **Laporan (Reporting)**: Financial summaries for sales and purchases.

---

## 5. Architectural Guide for AI Agents

### Database Convention
Most system tables use the `tb_` prefix (e.g., `tb_barang`, `tb_penjualan`). Models are mapped to these names in `app/Models`.

### Multi-tenancy (School Scoping)
- The global variable `id_sekolah` on the `User` model determines the data scope.
- `id_sekolah = null` signifies a **Superadmin** who see data across all schools.
- Controllers use a `$scopeSekolah` helper to filter queries based on the authenticated user's school ID.

### Frontend Patterns
- **Pages**: Located in `resources/js/pages`. Uses Inertia's `usePage` to access shared state.
- **Components**: UI primitives in `resources/js/components` follow a Shadcn-inspired pattern.
- **State management**: Primarily handled via Inertia props and local React state (for POS cart).

### Critical Layout Files:
- `resources/js/layouts/app-layout.tsx`: Root layout.
- `resources/js/components/app-sidebar.tsx`: Dynamic navigation based on roles.
- `resources/js/types/pos.ts`: Core TypeScript interfaces.

---

## 6. Recent Roadmap & Updates
Recent engineering efforts focused on:
1.  **Aesthetic Dashboard**: Implementation of `recharts` (Daily Sales Trend, Category Pie, Bar Chart comparison).
2.  **Workflow Optimization**: Direct POS redirect for Kasir roles to speed up school-hour operations.
3.  **Stability**: Resolved build-time dependency issues (Axios/Vite configuration).

---
*Created on: 2026-04-04*

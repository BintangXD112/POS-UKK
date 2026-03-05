<div align="center">

<img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/laravel.svg" width="80" alt="POS-UKK Logo" />

# POS-UKK

### Point of Sale — Koperasi Sekolah

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-v2-9553E9?style=flat-square&logo=inertia&logoColor=white)](https://inertiajs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/Lisensi-UKK-gray?style=flat-square)](./LICENSE)

<br/>

Aplikasi **Point of Sale** berbasis web untuk koperasi sekolah.  
Mendukung **multi-sekolah** dengan manajemen role bertingkat: Super Admin, Admin, dan Kasir.

[Demo](#) · [Instalasi](#-instalasi) · [Dokumentasi](#-fitur-utama) · [Laporan Bug](#)

</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Tech Stack](#-tech-stack)
- [Fitur Utama](#-fitur-utama)
- [Sistem Role](#-sistem-role--akses)
- [Instalasi](#-instalasi)
- [Akun Default](#-akun-default-seeder)
- [Struktur Direktori](#-struktur-direktori)
- [Skema Database](#-skema-database)
- [Route Utama](#-route-utama)
- [Perintah Berguna](#-perintah-berguna)
- [Keamanan](#-keamanan)

---

## 🏪 Tentang Proyek

**POS-UKK** adalah aplikasi kasir (Point of Sale) yang dibangun khusus untuk **koperasi sekolah**. Dengan satu instalasi, aplikasi ini mampu melayani banyak sekolah sekaligus (*multi-tenant*), masing-masing dengan data yang terisolasi.

Proyek ini dikembangkan menggunakan stack modern:  
**Laravel 12** di sisi backend, **React 19 + TypeScript** di sisi frontend, dihubungkan secara mulus oleh **Inertia.js** sebagai jembatan SPA tanpa API terpisah.

> 💡 Proyek ini dibuat sebagai bahan **Uji Kompetensi Keahlian (UKK)**.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| 🔧 Backend | Laravel 12 (PHP 8.2+) |
| ⚛️ Frontend | React 19 + TypeScript |
| 🔗 Routing (SPA) | Inertia.js v2 |
| 🔐 Auth | Laravel Fortify |
| 🎨 Styling | Tailwind CSS v4 |
| 🧩 UI Components | Radix UI + shadcn/ui |
| 🎯 Icons | Lucide React |
| ⚡ Build Tool | Vite 7 |
| 🗄️ Database | MySQL / MariaDB |

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🏫 **Multi-Sekolah** | Satu instalasi untuk banyak koperasi sekolah, data terisolasi per sekolah |
| 🛒 **POS Kasir** | Antarmuka kasir real-time dengan katalog produk, keranjang, & kalkulasi kembalian |
| 📦 **Manajemen Barang** | CRUD barang lengkap dengan kategori, kelompok, dan supplier |
| 🧾 **Transaksi Penjualan** | Proses checkout, cetak struk, dan riwayat transaksi |
| 🚚 **Pembelian / Restok** | Catat pembelian dari supplier, stok otomatis bertambah |
| 👥 **Manajemen Pelanggan** | Kelompok pelanggan: Siswa, Guru, Umum, dll |
| 🏭 **Manajemen Supplier** | Data supplier per sekolah |
| 📊 **Laporan** | Laporan penjualan & pembelian dengan filter rentang tanggal + export PDF |
| 📋 **Activity Log** | Audit trail semua aksi pengguna (khusus Super Admin) |
| 🌙 **Dark Mode** | Dukungan tema light & dark |

---

## 👤 Sistem Role & Akses

| Fitur | Super Admin | Admin | Kasir |
|---|:---:|:---:|:---:|
| Manajemen Sekolah | ✅ | ❌ | ❌ |
| Manajemen User | ✅ Semua | ✅ Sekolahnya | ❌ |
| Assign role Super Admin | ✅ | ❌ | ❌ |
| Activity Log | ✅ | ❌ | ❌ |
| Dashboard | ✅ Semua | ✅ Sekolahnya | ✅ Sekolahnya |
| Master Data (Barang, Kategori, dll) | ✅ Semua | ✅ Sekolahnya | ❌ |
| Pembelian / Restok | ✅ | ✅ | ❌ |
| Laporan | ✅ Semua | ✅ Sekolahnya | ❌ |
| POS Kasir | ✅ | ❌ | ✅ |

> **Super Admin** tidak terikat pada sekolah manapun dan dapat melihat serta mengelola seluruh data lintas sekolah.

---

## 🚀 Instalasi

### Prasyarat

Pastikan sudah terinstal:

- **PHP 8.2+** dengan ekstensi: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`
- **Composer** 2.x
- **Node.js** 18+ dan **npm**
- **MySQL** / **MariaDB** (atau Laragon / XAMPP)

### Langkah-Langkah

**1. Clone repository**
```bash
git clone <repository-url> pos-ukk
cd pos-ukk
```

**2. Install dependensi PHP**
```bash
composer install
```

**3. Salin file environment**
```bash
cp .env.example .env
```
> Jika tidak ada `.env.example`, buat file `.env` baru secara manual.

**4. Generate application key**
```bash
php artisan key:generate
```

**5. Konfigurasi database di `.env`**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pos_ukk
DB_USERNAME=root
DB_PASSWORD=
```

**6. Jalankan migration & seeder**
```bash
php artisan migrate:fresh --seed
```

**7. Install dependensi Node.js**
```bash
npm install
```

**8. Compile assets**
```bash
# Development
npm run dev

# Production build
npm run build
```

**9. Jalankan server**
```bash
php artisan serve
```

🌐 Akses aplikasi di: **http://localhost:8000**

---

## 🔑 Akun Default (Seeder)

| Username | Password | Role | Sekolah |
|---|---|---|---|
| `superadmin` | `admin123` | Super Admin | — (semua sekolah) |
| `admin.smknusa` | `admin123` | Admin | SMK Nusa Harapan |
| `admin.smkn2` | `admin123` | Admin | SMKN 2 Tasikmalaya |
| `kasir.nusa1` | `kasir123` | Kasir | SMK Nusa Harapan |
| `kasir.smkn2` | `kasir123` | Kasir | SMKN 2 Tasikmalaya |

> ⚠️ Segera ganti password default setelah login pertama di lingkungan produksi.

---

## 📁 Struktur Direktori

```
pos-ukk/
├── app/
│   ├── Http/
│   │   ├── Controllers/            # Controller utama (Barang, Penjualan, dll)
│   │   └── Middleware/
│   │       ├── CheckRole.php       # Middleware role-based access control
│   │       └── HandleInertiaRequests.php
│   ├── Models/
│   │   ├── TbUser.php              # Model user (hasRole, isSuperAdmin, dll)
│   │   ├── Barang.php
│   │   ├── Penjualan.php
│   │   └── ...
│   └── Services/
│       └── ActivityLogger.php      # Service audit trail
├── database/
│   ├── migrations/                 # Semua migration tabel
│   └── seeders/                    # Seeder data awal
├── resources/
│   └── js/
│       ├── layouts/                # AppLayout, AppSidebar
│       ├── pages/
│       │   ├── dashboard/
│       │   ├── pos/                # Halaman kasir & cetak struk
│       │   ├── barang/
│       │   ├── penjualan/
│       │   ├── pembelian/
│       │   ├── kategori/
│       │   ├── pelanggan/
│       │   ├── supplier/
│       │   ├── laporan/
│       │   ├── sekolah/
│       │   ├── users/
│       │   └── activity-log/
│       └── types/
│           └── pos.ts              # TypeScript type definitions
└── routes/
    └── web.php                     # Semua route dengan role middleware
```

---

## 🗄️ Skema Database

| Tabel | Keterangan |
|---|---|
| `roles` | Daftar role: super admin, admin, kasir |
| `tb_sekolah` | Data sekolah / koperasi |
| `tb_user` | User dengan relasi ke role & sekolah |
| `tb_kelompok_kategori` | Kelompok kategori barang |
| `tb_kategori` | Kategori barang |
| `tb_kelompok_pelanggan` | Kelompok pelanggan |
| `tb_pelanggan` | Data pelanggan |
| `tb_supplier` | Data supplier per sekolah |
| `tb_barang` | Data barang beserta stok |
| `tb_pembelian` | Header transaksi pembelian |
| `tb_detail_pembelian` | Detail item pembelian |
| `tb_penjualan` | Header transaksi penjualan |
| `tb_detail_penjualan` | Detail item penjualan |
| `activity_logs` | Log aktivitas seluruh pengguna |

---

## 🌐 Route Utama

| Method | URL | Akses | Keterangan |
|---|---|---|---|
| `GET` | `/dashboard` | Semua | Dashboard statistik |
| `GET` | `/pos` | Super Admin, Kasir | Halaman kasir POS |
| `POST` | `/pos` | Super Admin, Kasir | Proses transaksi |
| `GET` | `/pos/struk/{id}` | Super Admin, Kasir | Cetak struk |
| `GET` | `/penjualan` | Super Admin, Admin | Riwayat penjualan |
| `GET` | `/pembelian` | Super Admin, Admin | Riwayat pembelian |
| `GET` | `/barang` | Super Admin, Admin | Manajemen barang |
| `GET` | `/kategori` | Super Admin, Admin | Manajemen kategori |
| `GET` | `/pelanggan` | Super Admin, Admin | Manajemen pelanggan |
| `GET` | `/supplier` | Super Admin, Admin | Manajemen supplier |
| `GET` | `/laporan/penjualan` | Super Admin, Admin | Laporan penjualan |
| `GET` | `/laporan/pembelian` | Super Admin, Admin | Laporan pembelian |
| `GET` | `/users` | Super Admin, Admin | Manajemen user |
| `GET` | `/sekolah` | Super Admin | Manajemen sekolah |
| `GET` | `/activity-log` | Super Admin | Log aktivitas |

---

## ⚡ Perintah Berguna

```bash
# Jalankan dev server (backend + frontend sekaligus)
composer run dev

# Reset database & isi ulang data seeder
php artisan migrate:fresh --seed

# Bersihkan semua cache
php artisan optimize:clear

# Format kode PHP
composer run lint

# Format kode JavaScript/TypeScript
npm run format

# TypeScript type check
npm run types
```

---

## 🔒 Keamanan

- 🔐 Autentikasi menggunakan **Laravel Fortify** (session-based)
- 🛡️ Role-based access control melalui middleware `CheckRole`
- 🏫 Admin hanya dapat mengelola data **sekolahnya sendiri**
- 🚫 Admin tidak dapat membuat atau mengassign role **Super Admin**
- 📋 Semua aksi sensitif tercatat di **Activity Log**
- 🔑 Password di-hash menggunakan **bcrypt**
- 🗑️ **SoftDeletes** pada tabel user — data tidak benar-benar dihapus dari database

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan **UKK (Uji Kompetensi Keahlian)** dan tidak memiliki lisensi komersial terbuka.

---
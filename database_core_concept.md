# Inti dan Konsep Dasar Database POS-UKK

Dokumen ini menjelaskan rancangan dasar, arsitektur, dan konsep inti di balik struktur database aplikasi **POS-UKK** (Point of Sale Koperasi Sekolah).

---

## 1. Konsep Multi-Tenancy (Banyak Sekolah dalam 1 Database)
Aplikasi ini dirancang untuk dapat melayani **lebih dari satu sekolah** dalam satu kali instalasi (skema _Multi-tenant_). 
Oleh karena itu, **hampir seluruh tabel** di dalam database ini terikat dengan kolom `id_sekolah`.

- **`tb_sekolah`** bertindak sebagai "Pusat Data / Tenant". 
- Data seperti Barang, Kategori, Supplier, Pelanggan, Transaksi Penjualan, hingga Pembelian akan secara ketat disaring (di-filter) menggunakan `id_sekolah` ini.
- Dengan skema ini, **Sekolah A** tidak akan pernah bisa melihat atau memengaruhi data transaksi dan barang dari **Sekolah B**.

## 2. Hak Akses (Role-Based Access)
Pengguna/User (`tb_user`) dikendalikan oleh hierarki melalui tabel `roles`.
- **Super Admin**: Memiliki kemampuan untuk lintas sekolah. (*Pada modifikasi terbaru, id_sekolah pada tb_user di-set nullable agar super admin tidak terikat pada satu sekolah spesifik jika diperlukan, atau bisa masuk ke semua sekolah*).
- **Admin**: Staf tingkat manajerial di satu sekolah. Mereka terikat pada satu `id_sekolah`.
- **Kasir**: Operator kasir yang murni hanya menangani penjualan (transaksi tunai harian di kasir). Terikat pada satu `id_sekolah`.

**Aturan Penamaan ("Uniqueness")**
Username tidak dijaga keunikannya secara global, melainkan secara **per-sekolah**. Oleh sebab itu, di `tb_user`, constraint *unique* yang dibuat adalah penggabungan: `['username', 'id_sekolah']`. Misalnya, bisa ada kasir ber-username `kasir` di Sekolah A dan username `kasir` di Sekolah B. Hal ini juga diimplementasikan pada pendaftaran `barcode` barang yang bersifat *unique per sekolah*.

---

## 3. Pilar Data Pendukung (Master Data)
Master Data dalam koperasi sekolah terdiri atas 2 kelompok utama:

### A. Alur Barang & Inventaris
Data barang (`tb_barang`) menggunakan skema hirarki dua tingkat:
1. **Kelompok Kategori** (`tb_kelompok_kategori`) - *Misalnya: "Makanan", "Minuman", "Alat Tulis".*
2. **Kategori Utama** (`tb_kategori`) - *Berelasi ke Kelompok. Misalnya "Minuman Dingin", "Minuman Panas", "Buku Tulis".*
3. **Barang** (`tb_barang`) - *Merupakan entitas akhir yang dijual. Memiliki barcode unik, satuan, harga beli, harga jual, dan riwayat stok. Setiap barang juga di-link kepada Supplier penyuplainya.*

### B. Mitra Transaksi
Agar koperasi dapat melacak keluar-masuk barang, diperlukan mitra transaksi:
- **Pelanggan (`tb_pelanggan`)**: Pihak pembeli barang. Dikelompokkan via `tb_kelompok_pelanggan` (Misal: "Siswa", "Guru", "Umum"). Pelanggan ini di-referensikan saat Kasir melakukan penjualan (opsional).
- **Supplier (`tb_supplier`)**: Penyuplai barang. Digunakan sebagai sumber ketika melakukan restok pembelian barang.

---

## 4. Sistem Transaksi & Finansial
Kegiatan finansial dipecah menjadi 2 pintu besar:

### 📥 Uang Keluar / Barang Masuk (Pembelian)
Diproses di tabel `tb_pembelian` (Header/Induk) dan `tb_detail_pembelian` (Rincian Item).
- Melibatkan **Supplier**.
- Menggunakan `nomor_faktur` unik dari supplier (unik per sekolah).
- Memiliki status seperti `draft` atau `selesai`, dan dapat ditandai dengan jenis bayar `tunai` atau `kredit`.

### 📤 Uang Masuk / Barang Keluar (Penjualan)
Diproses di `tb_penjualan` (Header/Induk) dan `tb_detail_penjualan` (Rincian Item).
- Transaksi dilakukan oleh seorang Kasir (`id_user`).
- Sangat fleksibel: mencatat struk, total belanja (`total_faktur`), berapa uang dibayar (`total_bayar`), dan `kembalian`.
- **Status Pembayaran**: Menjadi pusat validasi piutang. Terdiri atas: `sudah bayar`, `belum bayar`, dan `hutang`.

---

## 5. Audit & Keamanan Internal
Aplikasi ini melacak aktivitas para stafnya (terutama dalam urusan pergerakan kas dan barang). Semua tabel krusial memiliki kolom standar **Audit Trail** (Jejak Rekam):
- `created_by` & `created_at`: mencatat siapa dan kapan pembuatan data.
- `updated_by` & `updated_at`: mencatat siapa dan kapan modifikasi terakhir.
- `deleted_by`, `deleted_at`, & `is_delete`: Mendukung konsep **Soft Delete**. Data yang dihapus tidak secara fisik dibuang dari database mysql, tapi hanya disembunyikan menggunakan _flag_, mencegah kekacauan data transaksi masa lalu.

Selain soft delete, sistem juga menggunakan tabel `activity_logs` mandiri yang akan mencatat aksi-aksi penting sistem seperti "login", "buat barang baru", "update penjualan", dll.

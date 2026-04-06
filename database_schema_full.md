# Penjelasan Lengkap Skema Database (Full Schema)

Dokumen ini membedah tabel-tabel secara teknis dan mendetail dari ujung ke ujung berdasarkan kumpulan file *Migration* terbaru pada project POS-UKK.

---

### 1. `roles`
Tabel master untuk level akses otorisasi global.
- **`id_role`**: Primary Key (Increments).
- **`nama_role`**: ENUM (`'super admin'`, `'admin'`, `'kasir'`). Unique (tidak boleh kembar).

### 2. `tb_sekolah`
Tabel tenant utama. Seluruh cabang klien/koperasi menggunakan tabel ini sebagai induk entitasnya.
- **`id_sekolah`**: Primary Key (Increments).
- **`kode_sekolah`**: STRING(20), Unique. Kodifikasi sekolah.
- **`nama_sekolah`**: STRING(150).
- **`alamat_sekolah`**: TEXT (nullable).
- **`website`**: STRING(200) (nullable).
- **`is_active`**: TINYINT, default `1`. Penentu status layanan sekolah.
- **`created_at`**: Timestamp awal dibuat.

### 3. `tb_user`
Data pengguna pengelola aplikasi (Admin/Kasir).
- **`id_user`**: Primary Key (Increments).
- **`id_sekolah`**: Unsigned Int (bisa nullable dari migrasi update). FK ke `tb_sekolah`. 
- **`id_role`**: Unsigned Int. FK ke `roles`.
- **`username`**: STRING(50).
- **`password`**: STRING(255).
- **`nama_lengkap`**: STRING(100).
- **`is_active`**: TINYINT, default `1`.
- Constraint **Unique**: `['username', 'id_sekolah']`. Artinya username yang sama boleh digunakan di sekolah berbeda, tapi dilarang duplikat di satu sekolah.
- *Memiliki kolom Audit Lengkap*: `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`.

---

### 4. `tb_kelompok_kategori`
Hierarki level 1 untuk barang jual. Misal: Makanan, Alat Tulis.
- **`id_kelompok`**: Primary Key.
- **`id_sekolah`**: FK ke `tb_sekolah`.
- **`nama_kelompok`**: STRING(100).
- *Audit*: `created_at`, `created_by`.

### 5. `tb_kategori`
Hierarki level 2. Anak dari kelompok kategori. Misal: Makanan Ringan, Makanan Basah.
- **`id_kategori`**: Primary Key.
- **`id_kelompok`**: FK ke `tb_kelompok_kategori`.
- **`nama`**: STRING(100).
- *Audit Terpadu*: memiliki time tracking dan log user, ditambah kolom toggle `is_delete` (default 0).

### 6. `tb_kelompok_pelanggan`
Pengkategorian warga sekolah / pembeli.
- **`id_kelompok_pelanggan`**: Primary Key.
- **`id_sekolah`**: FK ke `tb_sekolah`.
- **`nama_kelompok`**: STRING(50).

### 7. `tb_pelanggan`
Data Master Customer/Anggota.
- **`id_pelanggan`**: Primary Key.
- **`id_kelompok_pelanggan`**: FK ke `tb_kelompok_pelanggan`.
- **`nama_pelanggan`**: STRING(150).
- **`telepon`**: STRING(20) (nullable).
- **`alamat`**: TEXT (nullable).
- *Audit Terpadu*: `created_by`, updated, deleted dan `is_delete`.

### 8. `tb_supplier`
Data Vendor pihak penyedia barang ke koperasi.
- **`id_supplier`**: Primary Key.
- **`id_sekolah`**: FK ke `tb_sekolah`.
- **`nama`**: STRING(100).
- **`no_telepon`**: STRING(20) (nullable).
- **`alamat_supplier`**: TEXT (nullable).
- *Audit Lengkap & is_delete*.

---

### 9. `tb_barang`
Tabel sentral dari sistem POS, memuat entitas barang.
- **`id_barang`**: Primary Key.
- **`id_sekolah`**: FK ke `tb_sekolah`.
- **`barcode`**: STRING(50).
- **`nama`**: STRING(150).
- **`id_kategori`**: FK ke `tb_kategori`.
- **`id_kelompok_kategori`**: FK ke `tb_kelompok_kategori`.
- **`id_supplier`**: FK ke `tb_supplier`. (Sumber utama barang).
- **`satuan`**: STRING(20). (*Misal: PCS, DUS, BOX*).
- **`harga_beli`**: DECIMAL(12,2). Harga pokok / modal beli.
- **`harga_jual`**: DECIMAL(12,2). Harga toko / etalase.
- **`stok`**: INTEGER, default `0`. 
- **`is_active`**: TINYINT, default `1`.
- **`icon`**: STRING(500) nullable *(Diperbarui lewat migrasi `2026_04_01_000001_change_icon_to_image_path_in_tb_barang` yang mengubah tipe/panjang karakter untuk mensupport path gambar)*.
- Constraint **Unique**: `['barcode', 'id_sekolah']`. Sama seperti sistem user, barcode dilarang kembar kecuali berbeda sekolah.
- *Audit Lengkap & is_delete*.

---

### 10. `tb_pembelian` (Header Restok)
Menyimpan rangkuman transaksi restok / uang keluar.
- **`id_pembelian`**: Primary Key.
- **`id_sekolah`**: FK ke `tb_sekolah`.
- **`id_supplier`**: FK ke `tb_supplier`.
- **`id_user`**: FK ke `tb_user`. Siapa staf yang menginput.
- **`nomor_faktur`**: STRING(50). Nomor struk / nota aslinya.
- **`tanggal_faktur`**: DATETIME (default saat ini).
- **`total_bayar`**: DECIMAL(14,2). Besaran rupiah yang direstok.
- **`status_pembelian`**: ENUM(`'draft'`, `'selesai'`), default `'draft'`.
- **`jenis_transaksi`**: ENUM(`'tunai'`, `'kredit'`), default `'tunai'`.
- **`cara_bayar`**: STRING(50), nullable (Catatan metode tf/cash).
- **`note`**: TEXT (nullable).
- Constraint **Unique**: `['nomor_faktur', 'id_sekolah']`.
- *Audit & is_delete*.

### 11. `tb_detail_pembelian` (Item Restok)
Rincian barang apa saja yang direstok per-nota pembelian.
- **`id_detail_pembelian`**: Primary Key.
- **`id_pembelian`**: FK ke header `tb_pembelian`.
- **`id_barang`**: FK ke `tb_barang`.
- **`satuan`**: STRING(20). (Untuk merekam saat pencatatan, jaga-jaga jika master barang diubah satuannya).
- **`jumlah`**: INTEGER.
- **`harga_beli`**: DECIMAL(12,2). Modal saat direstok hari tersebut.
- **`subtotal`**: DECIMAL(14,2). Kalkulasi -> jumlah x harga_beli.

---

### 12. `tb_penjualan` (Header POS)
Menyimpan rangkuman uang masuk dari sisi kasir.
- **`id_penjualan`**: Primary Key.
- **`id_sekolah`**: FK ke `tb_sekolah`.
- **`id_user`**: FK ke `tb_user`. Siapa kasirnya.
- **`id_pelanggan`**: Unsigned Int (nullable). FK ke `tb_pelanggan` jika spesifik ke member tertentu.
- **`tanggal_penjualan`**: DATETIME (default saat diinput).
- **`total_faktur`**: DECIMAL(14,2). Total tagihan keranjang.
- **`total_bayar`**: DECIMAL(14,2). Nominal uang riil dari customer.
- **`kembalian`**: DECIMAL(14,2), default `0.00`.
- **`status_pembayaran`**: ENUM(`'sudah bayar'`, `'belum bayar'`, `'hutang'`). Default `'belum bayar'`. *(Kolom utang ditambahkan di migrasi `2026_04_01_125609_add_hutang_to...)*.
- **`jenis_transaksi`**: ENUM(`'tunai'`, `'kredit'`), nullable.
- **`cara_bayar`**: STRING(50) (nullable).
- **`note`**: TEXT (nullable).
- *Audit & is_delete*.

### 13. `tb_detail_penjualan` (Item POS)
Keranjang transaksi penjualan. Spesial, **tabel ini menggunakan Composite Primary Key**.
- **`id_penjualan`**: FK ke `tb_penjualan`.
- **`id_barang`**: FK ke `tb_barang`.
- **Composite Primary Key**: `['id_penjualan', 'id_barang']`. (Satu faktur tidak boleh memasukkan ID Barang yang sama 2x secara terpisah rownya; kasir harus menambah angkanya dalam `jumlah_barang`).
- **`jumlah_barang`**: INTEGER.
- **`harga_beli`**: DECIMAL(12,2). Mengikat modal (HPP) pada saat detik barang dijual (untuk proteksi laporan untung rugi).
- **`harga_jual`**: DECIMAL(12,2). Mengikat harga yang disetujui (dijual).
- **`diskon_tipe`**: ENUM(`'persen'`, `'nominal'`), nullable default `'nominal'`.
- **`diskon_nilai`**: DECIMAL(12,2), default `0.00`. Besaran nilai asli (misal 10% atau RP5000).
- **`diskon_nominal`**: DECIMAL(12,2), default `0.00`. Besaran hasil potongannya murni (rupiahnya).
- **`subtotal`**: DECIMAL(14,2). Jumlah barang dikali harga dikurang diskon.

---

### 14. `activity_logs`
Sistem pelacakan log universal untuk memonitor gerak-gerik di aplikasi.
- **`id`**: Primary Key (BigIncrements).
- **`user_id`**: Unsigned Int (nullable). Siapa yg memicu action. (Tidak langsung di FK agar tidak terganggu saat user dihapus permanen).
- **`user_name`**: STRING(100), snapshot record nama user saat itu.
- **`action`**: ENUM(`'login'`, `'logout'`, `'create'`, `'update'`, `'delete'`). Index ditambahkan ke mari agar query filtering log lebih gesit!
- **`module`**: STRING(50). Index. (Menandakan module/menu apa yang diubah misal: "Penjualan", "Auth", "Barang").
- **`description`**: TEXT. Kronologi deskripsi mentahnya.
- **`ip_address`**: STRING(45) (nullable).
- **`created_at`**: Timestamp.
- Composite Index: `['user_id', 'created_at']` (Membuat load riwayat log per user menjadi secepat kilat).

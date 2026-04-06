// Types untuk aplikasi POS UKK

export interface Role {
    id_role: number;
    nama_role: 'super admin' | 'admin' | 'kasir';
}

export interface Sekolah {
    id_sekolah: number;
    kode_sekolah: string;
    nama_sekolah: string;
    alamat_sekolah: string | null;
    website: string | null;
    is_active: number;
    created_at: string;
}

export interface TbUser {
    id_user: number;
    id_sekolah: number;
    id_role: number;
    username: string;
    nama_lengkap: string;
    is_active: boolean;
    created_at: string;
    role?: Role;
    sekolah?: Sekolah;
}

export interface KelompokKategori {
    id_kelompok: number;
    id_sekolah: number;
    nama_kelompok: string;
    kategori?: Kategori[];
}

export interface Kategori {
    id_kategori: number;
    id_kelompok: number;
    nama: string;
    kelompok?: KelompokKategori;
}

export interface KelompokPelanggan {
    id_kelompok_pelanggan: number;
    id_sekolah: number;
    nama_kelompok: string;
    pelanggan?: Pelanggan[];
}

export interface Pelanggan {
    id_pelanggan: number;
    id_kelompok_pelanggan: number;
    nama_pelanggan: string;
    telepon: string | null;
    alamat: string | null;
    kelompok?: KelompokPelanggan;
}

export interface Supplier {
    id_supplier: number;
    id_sekolah: number;
    nama: string;
    no_telepon: string | null;
    alamat_supplier: string | null;
}

export interface Barang {
    id_barang: number;
    id_sekolah: number;
    barcode: string;
    nama: string;
    icon: string | null;
    id_kategori: number;
    id_kelompok_kategori: number;
    id_supplier: number;
    satuan: string;
    harga_beli: number;
    harga_jual: number;
    stok: number;
    is_active: boolean;
    kategori?: Kategori;
    supplier?: Supplier;
}

export interface DetailPembelian {
    id_detail_pembelian: number;
    id_pembelian: number;
    id_barang: number;
    satuan: string;
    jumlah: number;
    harga_beli: number;
    subtotal: number;
    barang?: Barang;
}

export interface Pembelian {
    id_pembelian: number;
    id_sekolah: number;
    id_supplier: number;
    id_user: number;
    nomor_faktur: string;
    tanggal_faktur: string;
    total_bayar: number;
    status_pembelian: 'draft' | 'selesai';
    jenis_transaksi: 'tunai' | 'kredit';
    cara_bayar: string | null;
    note: string | null;
    supplier?: Supplier;
    user?: TbUser;
    detail?: DetailPembelian[];
}

export interface DetailPenjualan {
    id_penjualan: number;
    id_barang: number;
    jumlah_barang: number;
    harga_beli: number;
    harga_jual: number;
    diskon_tipe: 'persen' | 'nominal';
    diskon_nilai: number;
    diskon_nominal: number;
    subtotal: number;
    barang?: Barang;
}

export interface Penjualan {
    id_penjualan: number;
    id_sekolah: number;
    id_user: number;
    id_pelanggan: number | null;
    tanggal_penjualan: string;
    total_faktur: number;
    total_bayar: number;
    kembalian: number;
    status_pembayaran: 'sudah bayar' | 'belum bayar' | 'hutang';
    jenis_transaksi: 'tunai' | 'kredit' | null;
    cara_bayar: string | null;
    note: string | null;
    user?: TbUser;
    pelanggan?: Pelanggan;
    sekolah?: Sekolah;
    detail?: DetailPenjualan[];
}

export interface DashboardStats {
    total_barang: number;
    stok_menipis: number;
    penjualan_hari_ini: number;
    penjualan_bulan_ini: number;
    pembelian_bulan_ini: number;
    total_pelanggan: number;
    total_supplier: number;
}

export interface SalesTrend {
    day: number;
    total: number;
    formatted_total: string;
}

export interface IncomeExpense {
    month: string;
    penjualan: number;
    pembelian: number;
}

export interface CategoryChart {
    name: string;
    value: number;
}

export interface DashboardCharts {
    sales_trend: SalesTrend[];
    income_expense: IncomeExpense[];
    top_categories: CategoryChart[];
}

// Cart item untuk POS
export interface CartItem {
    id_barang: number;
    nama: string;
    satuan: string;
    harga_jual: number;
    harga_beli: number;
    jumlah_barang: number;
    diskon_tipe: 'persen' | 'nominal';
    diskon_nilai: number;
    diskon_nominal: number;
    subtotal: number;
    stok: number;
}

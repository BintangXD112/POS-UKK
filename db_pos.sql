-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               12.1.2-MariaDB - MariaDB Server
-- Server OS:                    Win64
-- HeidiSQL Version:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table db_pos.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id_role` int(11) NOT NULL AUTO_INCREMENT,
  `nama_role` enum('super admin','admin','kasir') NOT NULL,
  PRIMARY KEY (`id_role`),
  UNIQUE KEY `nama_role` (`nama_role`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_pos.roles: ~3 rows (approximately)
DELETE FROM `roles`;
INSERT INTO `roles` (`id_role`, `nama_role`) VALUES
	(1, 'super admin'),
	(2, 'admin'),
	(3, 'kasir');

-- Dumping structure for table db_pos.tb_barang
CREATE TABLE IF NOT EXISTS `tb_barang` (
  `id_barang` int(11) NOT NULL AUTO_INCREMENT,
  `id_sekolah` int(11) NOT NULL,
  `barcode` varchar(50) NOT NULL,
  `nama` varchar(150) NOT NULL,
  `id_kategori` int(11) NOT NULL,
  `id_kelompok_kategori` int(11) NOT NULL,
  `id_supplier` int(11) NOT NULL,
  `satuan` varchar(20) NOT NULL,
  `harga_beli` decimal(12,2) NOT NULL,
  `harga_jual` decimal(12,2) NOT NULL,
  `stok` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  `is_delete` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_barang`),
  UNIQUE KEY `barcode_per_sekolah` (`barcode`,`id_sekolah`),
  KEY `tb_barang_ibfk_sekolah` (`id_sekolah`),
  KEY `tb_barang_ibfk_1` (`id_kategori`),
  KEY `tb_barang_ibfk_2` (`id_supplier`),
  KEY `id_kelompok_kategori` (`id_kelompok_kategori`),
  CONSTRAINT `tb_barang_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `tb_kategori` (`id_kategori`),
  CONSTRAINT `tb_barang_ibfk_2` FOREIGN KEY (`id_supplier`) REFERENCES `tb_supplier` (`id_supplier`),
  CONSTRAINT `tb_barang_ibfk_kelompok_kategori` FOREIGN KEY (`id_kelompok_kategori`) REFERENCES `tb_kelompok_kategori` (`id_kelompok`),
  CONSTRAINT `tb_barang_ibfk_sekolah` FOREIGN KEY (`id_sekolah`) REFERENCES `tb_sekolah` (`id_sekolah`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_pos.tb_barang: ~0 rows (approximately)
DELETE FROM `tb_barang`;

-- Dumping structure for table db_pos.tb_detail_pembelian
CREATE TABLE IF NOT EXISTS `tb_detail_pembelian` (
  `id_detail_pembelian` int(11) NOT NULL AUTO_INCREMENT,
  `id_pembelian` int(11) NOT NULL,
  `id_barang` int(11) NOT NULL,
  `satuan` varchar(20) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `harga_beli` decimal(12,2) NOT NULL,
  `subtotal` decimal(14,2) NOT NULL,
  PRIMARY KEY (`id_detail_pembelian`),
  KEY `tb_detail_pembelian_ibfk_1` (`id_pembelian`),
  KEY `tb_detail_pembelian_ibfk_2` (`id_barang`),
  CONSTRAINT `tb_detail_pembelian_ibfk_1` FOREIGN KEY (`id_pembelian`) REFERENCES `tb_pembelian` (`id_pembelian`),
  CONSTRAINT `tb_detail_pembelian_ibfk_2` FOREIGN KEY (`id_barang`) REFERENCES `tb_barang` (`id_barang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_pos.tb_detail_pembelian: ~0 rows (approximately)
DELETE FROM `tb_detail_pembelian`;

-- Dumping structure for table db_pos.tb_detail_penjualan
CREATE TABLE IF NOT EXISTS `tb_detail_penjualan` (
  `id_penjualan` int(11) NOT NULL,
  `id_barang` int(11) NOT NULL,
  `jumlah_barang` int(11) NOT NULL,
  `harga_beli` decimal(12,2) NOT NULL,
  `harga_jual` decimal(12,2) NOT NULL,
  `diskon_tipe` enum('persen','nominal') DEFAULT 'nominal',
  `diskon_nilai` decimal(12,2) DEFAULT 0.00,
  `diskon_nominal` decimal(12,2) DEFAULT 0.00,
  `subtotal` decimal(14,2) NOT NULL,
  PRIMARY KEY (`id_penjualan`,`id_barang`),
  KEY `tb_detail_penjualan_ibfk_2` (`id_barang`),
  CONSTRAINT `tb_detail_penjualan_ibfk_1` FOREIGN KEY (`id_penjualan`) REFERENCES `tb_penjualan` (`id_penjualan`),
  CONSTRAINT `tb_detail_penjualan_ibfk_2` FOREIGN KEY (`id_barang`) REFERENCES `tb_barang` (`id_barang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_pos.tb_detail_penjualan: ~0 rows (approximately)
DELETE FROM `tb_detail_penjualan`;

-- Dumping structure for table db_pos.tb_kategori
CREATE TABLE IF NOT EXISTS `tb_kategori` (
  `id_kategori` int(11) NOT NULL AUTO_INCREMENT,
  `id_kelompok` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  `is_delete` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_kategori`),
  KEY `tb_kategori_ibfk_1` (`id_kelompok`),
  CONSTRAINT `tb_kategori_ibfk_1` FOREIGN KEY (`id_kelompok`) REFERENCES `tb_kelompok_kategori` (`id_kelompok`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_pos.tb_kategori: ~0 rows (approximately)
DELETE FROM `tb_kategori`;

-- Dumping structure for table db_pos.tb_kelompok_kategori
CREATE TABLE IF NOT EXISTS `tb_kelompok_kategori` (
  `id_kelompok` int(11) NOT NULL AUTO_INCREMENT,
  `id_sekolah` int(11) NOT NULL,
  `nama_kelompok` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_kelompok`),
  KEY `id_sekolah` (`id_sekolah`),
  CONSTRAINT `tb_kelompok_kategori_ibfk_1` FOREIGN KEY (`id_sekolah`) REFERENCES `tb_sekolah` (`id_sekolah`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_pos.tb_kelompok_kategori: ~0 rows (approximately)
DELETE FROM `tb_kelompok_kategori`;

-- Dumping structure for table db_pos.tb_kelompok_pelanggan
CREATE TABLE IF NOT EXISTS `tb_kelompok_pelanggan` (
  `id_kelompok_pelanggan` int(11) NOT NULL AUTO_INCREMENT,
  `id_sekolah` int(11) NOT NULL,
  `nama_kelompok` varchar(50) NOT NULL,
  PRIMARY KEY (`id_kelompok_pelanggan`),
  KEY `tb_kelompok_pelanggan_ibfk_1` (`id_sekolah`),
  CONSTRAINT `tb_kelompok_pelanggan_ibfk_1` FOREIGN KEY (`id_sekolah`) REFERENCES `tb_sekolah` (`id_sekolah`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_pos.tb_kelompok_pelanggan: ~0 rows (approximately)
DELETE FROM `tb_kelompok_pelanggan`;

-- Dumping structure for table db_pos.tb_pelanggan
CREATE TABLE IF NOT EXISTS `tb_pelanggan` (
  `id_pelanggan` int(11) NOT NULL AUTO_INCREMENT,
  `id_kelompok_pelanggan` int(11) NOT NULL,
  `nama_pelanggan` varchar(150) NOT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  `is_delete` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_pelanggan`),
  KEY `tb_pelanggan_ibfk_1` (`id_kelompok_pelanggan`),
  CONSTRAINT `tb_pelanggan_ibfk_1` FOREIGN KEY (`id_kelompok_pelanggan`) REFERENCES `tb_kelompok_pelanggan` (`id_kelompok_pelanggan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_pos.tb_pelanggan: ~0 rows (approximately)
DELETE FROM `tb_pelanggan`;

-- Dumping structure for table db_pos.tb_pembelian
CREATE TABLE IF NOT EXISTS `tb_pembelian` (
  `id_pembelian` int(11) NOT NULL AUTO_INCREMENT,
  `id_sekolah` int(11) NOT NULL,
  `id_supplier` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `nomor_faktur` varchar(50) NOT NULL,
  `tanggal_faktur` datetime DEFAULT current_timestamp(),
  `total_bayar` decimal(14,2) NOT NULL,
  `status_pembelian` enum('draft','selesai') DEFAULT 'draft',
  `jenis_transaksi` enum('tunai','kredit') DEFAULT 'tunai',
  `cara_bayar` varchar(50) DEFAULT NULL COMMENT 'Cash, Transfer, QRIS dll..',
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  `is_delete` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_pembelian`),
  UNIQUE KEY `faktur_per_sekolah` (`nomor_faktur`,`id_sekolah`),
  KEY `tb_pembelian_ibfk_sekolah` (`id_sekolah`),
  KEY `tb_pembelian_ibfk_spl` (`id_supplier`),
  KEY `tb_pembelian_ibfk_usr` (`id_user`),
  CONSTRAINT `tb_pembelian_ibfk_sekolah` FOREIGN KEY (`id_sekolah`) REFERENCES `tb_sekolah` (`id_sekolah`),
  CONSTRAINT `tb_pembelian_ibfk_spl` FOREIGN KEY (`id_supplier`) REFERENCES `tb_supplier` (`id_supplier`),
  CONSTRAINT `tb_pembelian_ibfk_usr` FOREIGN KEY (`id_user`) REFERENCES `tb_user` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_pos.tb_pembelian: ~0 rows (approximately)
DELETE FROM `tb_pembelian`;

-- Dumping structure for table db_pos.tb_penjualan
CREATE TABLE IF NOT EXISTS `tb_penjualan` (
  `id_penjualan` int(11) NOT NULL AUTO_INCREMENT,
  `id_sekolah` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_pelanggan` int(11) DEFAULT NULL,
  `tanggal_penjualan` datetime DEFAULT current_timestamp(),
  `total_faktur` decimal(14,2) NOT NULL,
  `total_bayar` decimal(14,2) NOT NULL,
  `kembalian` decimal(14,2) DEFAULT 0.00,
  `status_pembayaran` enum('sudah bayar','belum bayar') DEFAULT 'belum bayar',
  `jenis_transaksi` enum('tunai','kredit') DEFAULT NULL,
  `cara_bayar` varchar(50) DEFAULT NULL COMMENT 'Cash, Transfer, QRis, dll...',
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  `is_delete` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_penjualan`),
  KEY `tb_penjualan_ibfk_sekolah` (`id_sekolah`),
  KEY `tb_penjualan_ibfk_1` (`id_user`),
  KEY `tb_penjualan_ibfk_2` (`id_pelanggan`),
  CONSTRAINT `tb_penjualan_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `tb_user` (`id_user`),
  CONSTRAINT `tb_penjualan_ibfk_2` FOREIGN KEY (`id_pelanggan`) REFERENCES `tb_pelanggan` (`id_pelanggan`),
  CONSTRAINT `tb_penjualan_ibfk_sekolah` FOREIGN KEY (`id_sekolah`) REFERENCES `tb_sekolah` (`id_sekolah`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_pos.tb_penjualan: ~0 rows (approximately)
DELETE FROM `tb_penjualan`;

-- Dumping structure for table db_pos.tb_sekolah
CREATE TABLE IF NOT EXISTS `tb_sekolah` (
  `id_sekolah` int(11) NOT NULL AUTO_INCREMENT,
  `kode_sekolah` varchar(20) NOT NULL,
  `nama_sekolah` varchar(150) NOT NULL,
  `alamat_sekolah` text DEFAULT NULL,
  `website` varchar(200) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_sekolah`),
  UNIQUE KEY `kode_sekolah` (`kode_sekolah`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_pos.tb_sekolah: ~1 rows (approximately)
DELETE FROM `tb_sekolah`;
INSERT INTO `tb_sekolah` (`id_sekolah`, `kode_sekolah`, `nama_sekolah`, `alamat_sekolah`, `website`, `is_active`, `created_at`) VALUES
	(1, 'KOPERASI-001', 'Sekolah Percontohan', NULL, NULL, 1, '2026-02-11 06:24:15');

-- Dumping structure for table db_pos.tb_supplier
CREATE TABLE IF NOT EXISTS `tb_supplier` (
  `id_supplier` int(11) NOT NULL AUTO_INCREMENT,
  `id_sekolah` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `no_telepon` varchar(20) DEFAULT NULL,
  `alamat_supplier` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  `is_delete` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_supplier`),
  KEY `tb_supplier_ibfk_1` (`id_sekolah`),
  CONSTRAINT `tb_supplier_ibfk_1` FOREIGN KEY (`id_sekolah`) REFERENCES `tb_sekolah` (`id_sekolah`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_pos.tb_supplier: ~0 rows (approximately)
DELETE FROM `tb_supplier`;

-- Dumping structure for table db_pos.tb_user
CREATE TABLE IF NOT EXISTS `tb_user` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `id_sekolah` int(11) NOT NULL,
  `id_role` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `username_per_sekolah` (`username`,`id_sekolah`),
  KEY `id_role` (`id_role`),
  KEY `id_sekolah` (`id_sekolah`),
  CONSTRAINT `tb_user_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id_role`),
  CONSTRAINT `tb_user_ibfk_2` FOREIGN KEY (`id_sekolah`) REFERENCES `tb_sekolah` (`id_sekolah`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_pos.tb_user: ~0 rows (approximately)
DELETE FROM `tb_user`;
INSERT INTO `tb_user` (`id_user`, `id_sekolah`, `id_role`, `username`, `password`, `nama_lengkap`, `is_active`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
	(1, 1, 1, 'admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Super Admin', 1, '2026-02-11 06:24:15', NULL, NULL, NULL, NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

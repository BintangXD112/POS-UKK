-- ============================================================
--  pos-ukk — Database Schema
--  Generated from Laravel migrations
--  Date: 2026-03-02
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET NAMES utf8mb4;

-- ------------------------------------------------------------
-- 1. users  (Laravel default auth table)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `id`                        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name`                      VARCHAR(255)    NOT NULL,
    `email`                     VARCHAR(255)    NOT NULL,
    `email_verified_at`         TIMESTAMP       NULL     DEFAULT NULL,
    `password`                  VARCHAR(255)    NOT NULL,
    `two_factor_secret`         TEXT            NULL     DEFAULT NULL,
    `two_factor_recovery_codes` TEXT            NULL     DEFAULT NULL,
    `two_factor_confirmed_at`   TIMESTAMP       NULL     DEFAULT NULL,
    `remember_token`            VARCHAR(100)    NULL     DEFAULT NULL,
    `created_at`                TIMESTAMP       NULL     DEFAULT NULL,
    `updated_at`                TIMESTAMP       NULL     DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. password_reset_tokens
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
    `email`      VARCHAR(255) NOT NULL,
    `token`      VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP    NULL DEFAULT NULL,
    PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. sessions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sessions` (
    `id`            VARCHAR(255)    NOT NULL,
    `user_id`       BIGINT UNSIGNED NULL     DEFAULT NULL,
    `ip_address`    VARCHAR(45)     NULL     DEFAULT NULL,
    `user_agent`    TEXT            NULL,
    `payload`       LONGTEXT        NOT NULL,
    `last_activity` INT             NOT NULL,
    PRIMARY KEY (`id`),
    KEY `sessions_user_id_index` (`user_id`),
    KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. cache
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cache` (
    `key`        VARCHAR(255) NOT NULL,
    `value`      MEDIUMTEXT   NOT NULL,
    `expiration` INT          NOT NULL,
    PRIMARY KEY (`key`),
    KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. cache_locks
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cache_locks` (
    `key`        VARCHAR(255) NOT NULL,
    `owner`      VARCHAR(255) NOT NULL,
    `expiration` INT          NOT NULL,
    PRIMARY KEY (`key`),
    KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. jobs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobs` (
    `id`           BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    `queue`        VARCHAR(255)     NOT NULL,
    `payload`      LONGTEXT         NOT NULL,
    `attempts`     TINYINT UNSIGNED NOT NULL,
    `reserved_at`  INT UNSIGNED     NULL     DEFAULT NULL,
    `available_at` INT UNSIGNED     NOT NULL,
    `created_at`   INT UNSIGNED     NOT NULL,
    PRIMARY KEY (`id`),
    KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. job_batches
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `job_batches` (
    `id`             VARCHAR(255) NOT NULL,
    `name`           VARCHAR(255) NOT NULL,
    `total_jobs`     INT          NOT NULL,
    `pending_jobs`   INT          NOT NULL,
    `failed_jobs`    INT          NOT NULL,
    `failed_job_ids` LONGTEXT     NOT NULL,
    `options`        MEDIUMTEXT   NULL DEFAULT NULL,
    `cancelled_at`   INT          NULL DEFAULT NULL,
    `created_at`     INT          NOT NULL,
    `finished_at`    INT          NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. failed_jobs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `failed_jobs` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid`       VARCHAR(255)    NOT NULL,
    `connection` TEXT            NOT NULL,
    `queue`      TEXT            NOT NULL,
    `payload`    LONGTEXT        NOT NULL,
    `exception`  LONGTEXT        NOT NULL,
    `failed_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  APPLICATION TABLES
-- ============================================================

-- ------------------------------------------------------------
-- 9. roles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
    `id_role`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama_role` ENUM('super admin','admin','kasir') NOT NULL,
    PRIMARY KEY (`id_role`),
    UNIQUE KEY `roles_nama_role_unique` (`nama_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 10. tb_sekolah
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_sekolah` (
    `id_sekolah`    INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `kode_sekolah`  VARCHAR(20)  NOT NULL,
    `nama_sekolah`  VARCHAR(150) NOT NULL,
    `alamat_sekolah` TEXT        NULL DEFAULT NULL,
    `website`       VARCHAR(200) NULL DEFAULT NULL,
    `is_active`     TINYINT      NOT NULL DEFAULT 1,
    `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_sekolah`),
    UNIQUE KEY `tb_sekolah_kode_sekolah_unique` (`kode_sekolah`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 11. tb_user
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_user` (
    `id_user`       INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_sekolah`    INT UNSIGNED NOT NULL,
    `id_role`       INT UNSIGNED NOT NULL,
    `username`      VARCHAR(50)  NOT NULL,
    `password`      VARCHAR(255) NOT NULL,
    `nama_lengkap`  VARCHAR(100) NOT NULL,
    `is_active`     TINYINT      NOT NULL DEFAULT 1,
    `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by`    INT UNSIGNED NULL DEFAULT NULL,
    `updated_at`    TIMESTAMP    NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    `updated_by`    INT UNSIGNED NULL DEFAULT NULL,
    `deleted_at`    TIMESTAMP    NULL DEFAULT NULL,
    `deleted_by`    INT UNSIGNED NULL DEFAULT NULL,
    `remember_token` VARCHAR(100) NULL DEFAULT NULL,
    PRIMARY KEY (`id_user`),
    UNIQUE KEY `username_per_sekolah` (`username`, `id_sekolah`),
    CONSTRAINT `tb_user_ibfk_1` FOREIGN KEY (`id_role`)    REFERENCES `roles`     (`id_role`),
    CONSTRAINT `tb_user_ibfk_2` FOREIGN KEY (`id_sekolah`) REFERENCES `tb_sekolah` (`id_sekolah`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 12. tb_kelompok_kategori
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_kelompok_kategori` (
    `id_kelompok`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_sekolah`    INT UNSIGNED NOT NULL,
    `nama_kelompok` VARCHAR(100) NOT NULL,
    `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by`    INT UNSIGNED NULL DEFAULT NULL,
    PRIMARY KEY (`id_kelompok`),
    CONSTRAINT `tb_kelompok_kategori_ibfk_1` FOREIGN KEY (`id_sekolah`) REFERENCES `tb_sekolah` (`id_sekolah`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 13. tb_kategori
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_kategori` (
    `id_kategori` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_kelompok` INT UNSIGNED NOT NULL,
    `nama`        VARCHAR(100) NOT NULL,
    `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by`  INT UNSIGNED NULL DEFAULT NULL,
    `updated_at`  TIMESTAMP    NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    `updated_by`  INT UNSIGNED NULL DEFAULT NULL,
    `deleted_at`  TIMESTAMP    NULL DEFAULT NULL,
    `deleted_by`  INT UNSIGNED NULL DEFAULT NULL,
    `is_delete`   TINYINT      NOT NULL DEFAULT 0,
    PRIMARY KEY (`id_kategori`),
    CONSTRAINT `tb_kategori_ibfk_1` FOREIGN KEY (`id_kelompok`) REFERENCES `tb_kelompok_kategori` (`id_kelompok`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 14. tb_kelompok_pelanggan
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_kelompok_pelanggan` (
    `id_kelompok_pelanggan` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_sekolah`            INT UNSIGNED NOT NULL,
    `nama_kelompok`         VARCHAR(50)  NOT NULL,
    PRIMARY KEY (`id_kelompok_pelanggan`),
    CONSTRAINT `tb_kelompok_pelanggan_ibfk_1` FOREIGN KEY (`id_sekolah`) REFERENCES `tb_sekolah` (`id_sekolah`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 15. tb_pelanggan
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_pelanggan` (
    `id_pelanggan`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_kelompok_pelanggan` INT UNSIGNED NOT NULL,
    `nama_pelanggan`        VARCHAR(150) NOT NULL,
    `telepon`               VARCHAR(20)  NULL DEFAULT NULL,
    `alamat`                TEXT         NULL DEFAULT NULL,
    `created_at`            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by`            INT UNSIGNED NULL DEFAULT NULL,
    `updated_at`            TIMESTAMP    NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    `updated_by`            INT UNSIGNED NULL DEFAULT NULL,
    `deleted_at`            TIMESTAMP    NULL DEFAULT NULL,
    `deleted_by`            INT UNSIGNED NULL DEFAULT NULL,
    `is_delete`             TINYINT      NOT NULL DEFAULT 0,
    PRIMARY KEY (`id_pelanggan`),
    CONSTRAINT `tb_pelanggan_ibfk_1` FOREIGN KEY (`id_kelompok_pelanggan`) REFERENCES `tb_kelompok_pelanggan` (`id_kelompok_pelanggan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 16. tb_supplier
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_supplier` (
    `id_supplier`    INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_sekolah`     INT UNSIGNED NOT NULL,
    `nama`           VARCHAR(100) NOT NULL,
    `no_telepon`     VARCHAR(20)  NULL DEFAULT NULL,
    `alamat_supplier` TEXT        NULL DEFAULT NULL,
    `created_at`     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by`     INT UNSIGNED NULL DEFAULT NULL,
    `deleted_at`     TIMESTAMP    NULL DEFAULT NULL,
    `deleted_by`     INT UNSIGNED NULL DEFAULT NULL,
    `is_delete`      TINYINT      NOT NULL DEFAULT 0,
    PRIMARY KEY (`id_supplier`),
    CONSTRAINT `tb_supplier_ibfk_1` FOREIGN KEY (`id_sekolah`) REFERENCES `tb_sekolah` (`id_sekolah`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 17. tb_barang
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_barang` (
    `id_barang`            INT UNSIGNED   NOT NULL AUTO_INCREMENT,
    `id_sekolah`           INT UNSIGNED   NOT NULL,
    `barcode`              VARCHAR(50)    NOT NULL,
    `nama`                 VARCHAR(150)   NOT NULL,
    `id_kategori`          INT UNSIGNED   NOT NULL,
    `id_kelompok_kategori` INT UNSIGNED   NOT NULL,
    `id_supplier`          INT UNSIGNED   NOT NULL,
    `satuan`               VARCHAR(20)    NOT NULL,
    `harga_beli`           DECIMAL(12, 2) NOT NULL,
    `harga_jual`           DECIMAL(12, 2) NOT NULL,
    `stok`                 INT            NOT NULL DEFAULT 0,
    `is_active`            TINYINT        NULL     DEFAULT 1,
    `created_at`           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by`           INT UNSIGNED   NULL     DEFAULT NULL,
    `updated_at`           TIMESTAMP      NULL     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    `updated_by`           INT UNSIGNED   NULL     DEFAULT NULL,
    `deleted_at`           TIMESTAMP      NULL     DEFAULT NULL,
    `deleted_by`           INT UNSIGNED   NULL     DEFAULT NULL,
    `is_delete`            TINYINT        NULL     DEFAULT 0,
    PRIMARY KEY (`id_barang`),
    UNIQUE KEY `barcode_per_sekolah` (`barcode`, `id_sekolah`),
    CONSTRAINT `tb_barang_ibfk_sekolah`             FOREIGN KEY (`id_sekolah`)           REFERENCES `tb_sekolah`           (`id_sekolah`),
    CONSTRAINT `tb_barang_ibfk_1`                   FOREIGN KEY (`id_kategori`)           REFERENCES `tb_kategori`           (`id_kategori`),
    CONSTRAINT `tb_barang_ibfk_2`                   FOREIGN KEY (`id_supplier`)           REFERENCES `tb_supplier`           (`id_supplier`),
    CONSTRAINT `tb_barang_ibfk_kelompok_kategori`   FOREIGN KEY (`id_kelompok_kategori`)  REFERENCES `tb_kelompok_kategori`  (`id_kelompok`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 18. tb_pembelian
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_pembelian` (
    `id_pembelian`     INT UNSIGNED   NOT NULL AUTO_INCREMENT,
    `id_sekolah`       INT UNSIGNED   NOT NULL,
    `id_supplier`      INT UNSIGNED   NOT NULL,
    `id_user`          INT UNSIGNED   NOT NULL,
    `nomor_faktur`     VARCHAR(50)    NOT NULL,
    `tanggal_faktur`   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `total_bayar`      DECIMAL(14, 2) NOT NULL,
    `status_pembelian` ENUM('draft','selesai') NOT NULL DEFAULT 'draft',
    `jenis_transaksi`  ENUM('tunai','kredit')  NOT NULL DEFAULT 'tunai',
    `cara_bayar`       VARCHAR(50)    NULL DEFAULT NULL COMMENT 'Cash, Transfer, QRIS dll..',
    `note`             TEXT           NULL DEFAULT NULL,
    `created_at`       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by`       INT UNSIGNED   NULL DEFAULT NULL,
    `deleted_at`       TIMESTAMP      NULL DEFAULT NULL,
    `deleted_by`       INT UNSIGNED   NULL DEFAULT NULL,
    `is_delete`        TINYINT        NOT NULL DEFAULT 0,
    PRIMARY KEY (`id_pembelian`),
    UNIQUE KEY `faktur_per_sekolah` (`nomor_faktur`, `id_sekolah`),
    CONSTRAINT `tb_pembelian_ibfk_sekolah` FOREIGN KEY (`id_sekolah`)  REFERENCES `tb_sekolah` (`id_sekolah`),
    CONSTRAINT `tb_pembelian_ibfk_spl`     FOREIGN KEY (`id_supplier`) REFERENCES `tb_supplier` (`id_supplier`),
    CONSTRAINT `tb_pembelian_ibfk_usr`     FOREIGN KEY (`id_user`)     REFERENCES `tb_user`     (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 19. tb_detail_pembelian
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_detail_pembelian` (
    `id_detail_pembelian` INT UNSIGNED   NOT NULL AUTO_INCREMENT,
    `id_pembelian`        INT UNSIGNED   NOT NULL,
    `id_barang`           INT UNSIGNED   NOT NULL,
    `satuan`              VARCHAR(20)    NOT NULL,
    `jumlah`              INT            NOT NULL,
    `harga_beli`          DECIMAL(12, 2) NOT NULL,
    `subtotal`            DECIMAL(14, 2) NOT NULL,
    PRIMARY KEY (`id_detail_pembelian`),
    CONSTRAINT `tb_detail_pembelian_ibfk_1` FOREIGN KEY (`id_pembelian`) REFERENCES `tb_pembelian` (`id_pembelian`),
    CONSTRAINT `tb_detail_pembelian_ibfk_2` FOREIGN KEY (`id_barang`)    REFERENCES `tb_barang`    (`id_barang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 20. tb_penjualan
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_penjualan` (
    `id_penjualan`      INT UNSIGNED   NOT NULL AUTO_INCREMENT,
    `id_sekolah`        INT UNSIGNED   NOT NULL,
    `id_user`           INT UNSIGNED   NOT NULL,
    `id_pelanggan`      INT UNSIGNED   NULL DEFAULT NULL,
    `tanggal_penjualan` DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `total_faktur`      DECIMAL(14, 2) NOT NULL,
    `total_bayar`       DECIMAL(14, 2) NOT NULL,
    `kembalian`         DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `status_pembayaran` ENUM('sudah bayar','belum bayar') NOT NULL DEFAULT 'belum bayar',
    `jenis_transaksi`   ENUM('tunai','kredit') NULL DEFAULT NULL,
    `cara_bayar`        VARCHAR(50)    NULL DEFAULT NULL COMMENT 'Cash, Transfer, QRis, dll...',
    `note`              TEXT           NULL DEFAULT NULL,
    `created_at`        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by`        INT UNSIGNED   NULL DEFAULT NULL,
    `deleted_at`        TIMESTAMP      NULL DEFAULT NULL,
    `deleted_by`        INT UNSIGNED   NULL DEFAULT NULL,
    `is_delete`         TINYINT        NOT NULL DEFAULT 0,
    PRIMARY KEY (`id_penjualan`),
    CONSTRAINT `tb_penjualan_ibfk_sekolah` FOREIGN KEY (`id_sekolah`)   REFERENCES `tb_sekolah`   (`id_sekolah`),
    CONSTRAINT `tb_penjualan_ibfk_1`       FOREIGN KEY (`id_user`)      REFERENCES `tb_user`       (`id_user`),
    CONSTRAINT `tb_penjualan_ibfk_2`       FOREIGN KEY (`id_pelanggan`) REFERENCES `tb_pelanggan`  (`id_pelanggan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 21. tb_detail_penjualan
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_detail_penjualan` (
    `id_penjualan`   INT UNSIGNED   NOT NULL,
    `id_barang`      INT UNSIGNED   NOT NULL,
    `jumlah_barang`  INT            NOT NULL,
    `harga_beli`     DECIMAL(12, 2) NOT NULL,
    `harga_jual`     DECIMAL(12, 2) NOT NULL,
    `diskon_tipe`    ENUM('persen','nominal') NULL DEFAULT 'nominal',
    `diskon_nilai`   DECIMAL(12, 2) NULL DEFAULT 0.00,
    `diskon_nominal` DECIMAL(12, 2) NULL DEFAULT 0.00,
    `subtotal`       DECIMAL(14, 2) NOT NULL,
    PRIMARY KEY (`id_penjualan`, `id_barang`),
    CONSTRAINT `tb_detail_penjualan_ibfk_1` FOREIGN KEY (`id_penjualan`) REFERENCES `tb_penjualan` (`id_penjualan`),
    CONSTRAINT `tb_detail_penjualan_ibfk_2` FOREIGN KEY (`id_barang`)    REFERENCES `tb_barang`    (`id_barang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 22. activity_logs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `activity_logs` (
    `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id`     INT UNSIGNED    NULL DEFAULT NULL,
    `user_name`   VARCHAR(100)    NULL DEFAULT NULL,
    `action`      ENUM('login','logout','create','update','delete') NOT NULL,
    `module`      VARCHAR(50)     NOT NULL,
    `description` TEXT            NOT NULL,
    `ip_address`  VARCHAR(45)     NULL DEFAULT NULL,
    `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `activity_logs_action_index`      (`action`),
    KEY `activity_logs_module_index`      (`module`),
    KEY `activity_logs_user_created_index` (`user_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

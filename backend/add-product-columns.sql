-- Migration script untuk menambahkan kolom yang hilang ke table products
-- Jalankan script ini jika database Anda sudah pernah dibuat dengan schema lama

-- Tambahkan kolom baru jika belum ada
ALTER TABLE products
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
ADD COLUMN IF NOT EXISTS size VARCHAR(100),
ADD COLUMN IF NOT EXISTS color VARCHAR(100);

-- Tambahkan unique constraint pada name jika belum ada
ALTER TABLE products ADD CONSTRAINT products_name_key UNIQUE(name);

-- Tambahkan index untuk SKU
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

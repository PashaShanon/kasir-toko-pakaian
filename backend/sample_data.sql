-- =========================================
-- SAMPLE DATA FOR TOKO PAKAIAN DATABASE
-- =========================================

-- =========================================
-- INSERT USERS (dengan password yang sudah di-hash)
-- =========================================
-- Password untuk semua user: "password123"
-- Hash dibuat dengan bcrypt rounds=12
INSERT INTO users (name, email, password, role) VALUES
('Admin Toko', 'admin@tokopakaian.com', '$2a$12$ChG6yvs9F2fvcCAWtZMVDOtbtgDwmtx60OHSABp4J639D6Dnf1Oa2', 'admin'),
('Kasir 1', 'kasir1@tokopakaian.com', '$2a$12$ChG6yvs9F2fvcCAWtZMVDOtbtgDwmtx60OHSABp4J639D6Dnf1Oa2', 'kasir'),
('Kasir 2', 'kasir2@tokopakaian.com', '$2a$12$ChG6yvs9F2fvcCAWtZMVDOtbtgDwmtx60OHSABp4J639D6Dnf1Oa2', 'kasir');

-- =========================================
-- INSERT CATEGORIES
-- =========================================
INSERT INTO categories (name, description) VALUES
('Kemeja', 'Berbagai jenis kemeja pria dan wanita'),
('Kaos', 'Kaos casual, kaos polo, dan t-shirt'),
('Celana', 'Celana jeans, celana formal, dan celana casual'),
('Dress', 'Dress untuk berbagai acara'),
('Jaket', 'Jaket dan outer wear'),
('Rok', 'Berbagai model rok'),
('Aksesoris', 'Topi, tas, dan aksesoris fashion lainnya');

-- =========================================
-- INSERT PRODUCTS
-- =========================================
INSERT INTO products (name, description, price, stock, category_id) VALUES
-- Kemeja (category_id = 1)
('Kemeja Pria Formal Putih', 'Kemeja formal lengan panjang warna putih, bahan katun premium', 150000, 25, 1),
('Kemeja Wanita Casual Biru', 'Kemeja casual wanita warna biru muda, cocok untuk santai', 125000, 20, 1),
('Kemeja Flanel Kotak-kotak', 'Kemeja flanel dengan motif kotak-kotak, hangat dan stylish', 175000, 15, 1),

-- Kaos (category_id = 2)
('Kaos Polo Pria Navy', 'Kaos polo pria warna navy, bahan cotton combed', 85000, 30, 2),
('T-Shirt Wanita Pink', 'T-shirt wanita warna pink dengan sablon lucu', 65000, 40, 2),
('Kaos Oblong Putih Basic', 'Kaos oblong polos putih, bahan katun premium', 45000, 50, 2),
('Kaos Lengan Panjang Hitam', 'Kaos lengan panjang warna hitam, nyaman dipakai', 75000, 35, 2),

-- Celana (category_id = 3)
('Celana Jeans Pria Slim Fit', 'Celana jeans pria model slim fit, warna dark blue', 250000, 20, 3),
('Celana Formal Wanita', 'Celana formal wanita warna hitam, cocok untuk kerja', 200000, 18, 3),
('Celana Chino Beige', 'Celana chino casual warna beige, versatile dan stylish', 180000, 22, 3),
('Celana Pendek Pria', 'Celana pendek pria untuk santai, bahan katun', 120000, 25, 3),

-- Dress (category_id = 4)
('Dress Maxi Floral', 'Dress maxi dengan motif bunga-bunga, cocok untuk acara formal', 220000, 12, 4),
('Dress Mini Hitam', 'Dress mini warna hitam, simple dan elegant', 180000, 15, 4),
('Dress Kerja Abu-abu', 'Dress untuk kerja warna abu-abu, professional look', 195000, 10, 4),

-- Jaket (category_id = 5)
('Jaket Bomber Hijau', 'Jaket bomber warna hijau army, trendy dan stylish', 275000, 8, 5),
('Jaket Denim', 'Jaket denim klasik, cocok untuk gaya casual', 225000, 12, 5),
('Hoodie Polos Abu-abu', 'Hoodie polos warna abu-abu, hangat dan nyaman', 150000, 20, 5),

-- Rok (category_id = 6)
('Rok Plisket Hitam', 'Rok plisket panjang warna hitam, elegant dan feminine', 140000, 15, 6),
('Rok Jeans Mini', 'Rok jeans mini, casual dan trendy', 120000, 18, 6),
('Rok A-Line Coklat', 'Rok A-line warna coklat, cocok untuk berbagai acara', 160000, 12, 6),

-- Aksesoris (category_id = 7)
('Topi Baseball Hitam', 'Topi baseball warna hitam, adjustable', 50000, 30, 7),
('Tas Selempang Kulit', 'Tas selempang kulit sintetis, praktis dan stylish', 180000, 15, 7),
('Ikat Pinggang Kulit', 'Ikat pinggang kulit genuine, warna coklat', 85000, 25, 7),
('Syal Wol Abu-abu', 'Syal wol lembut warna abu-abu, hangat untuk musim dingin', 75000, 20, 7);

-- =========================================
-- INSERT SAMPLE TRANSACTIONS
-- =========================================
-- Transaksi sample (user_id = 2 adalah kasir1)
INSERT INTO transactions (transaction_code, user_id, total_amount, payment_method, status) VALUES
('TRX-20240114-000001', 2, 235000, 'cash', 'completed'),
('TRX-20240114-000002', 2, 150000, 'debit', 'completed'),
('TRX-20240114-000003', 3, 320000, 'cash', 'completed');

-- =========================================
-- INSERT SAMPLE TRANSACTION ITEMS
-- =========================================
-- Items untuk transaksi pertama (id=1)
INSERT INTO transaction_items (transaction_id, product_id, quantity, price, subtotal) VALUES
(1, 1, 1, 150000, 150000),  -- Kemeja Pria Formal Putih
(1, 4, 1, 85000, 85000);    -- Kaos Polo Pria Navy

-- Items untuk transaksi kedua (id=2)
INSERT INTO transaction_items (transaction_id, product_id, quantity, price, subtotal) VALUES
(2, 1, 1, 150000, 150000);  -- Kemeja Pria Formal Putih

-- Items untuk transaksi ketiga (id=3)
INSERT INTO transaction_items (transaction_id, product_id, quantity, price, subtotal) VALUES
(3, 8, 1, 250000, 250000),  -- Celana Jeans Pria Slim Fit
(3, 18, 1, 50000, 50000),   -- Topi Baseball Hitam
(3, 20, 1, 85000, 85000);   -- Ikat Pinggang Kulit

-- Update stock berdasarkan transaksi yang sudah terjadi
UPDATE products SET stock = stock - 2 WHERE id = 1;  -- Kemeja Pria Formal dijual 2 pcs
UPDATE products SET stock = stock - 1 WHERE id = 4;  -- Kaos Polo Pria dijual 1 pcs
UPDATE products SET stock = stock - 1 WHERE id = 8;  -- Celana Jeans dijual 1 pcs
UPDATE products SET stock = stock - 1 WHERE id = 18; -- Topi Baseball dijual 1 pcs
UPDATE products SET stock = stock - 1 WHERE id = 20; -- Ikat Pinggang dijual 1 pcs

-- =========================================
-- VERIFY DATA
-- =========================================
-- Uncomment these lines to verify data after insertion
-- SELECT 'Users:' as info; SELECT id, name, email, role FROM users;
-- SELECT 'Categories:' as info; SELECT * FROM categories;
-- SELECT 'Products:' as info; SELECT id, name, price, stock, category_id FROM products LIMIT 10;
-- SELECT 'Transactions:' as info; SELECT * FROM transactions;
-- SELECT 'Transaction Items:' as info; SELECT * FROM transaction_items;
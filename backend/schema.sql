-- =============================================
-- Toko Pakaian API Database Schema
-- =============================================

-- =============================================
-- 1. USERS TABLE
-- =============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'kasir')) DEFAULT 'kasir',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk optimasi query
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- =============================================
-- 2. REFRESH TOKENS TABLE
-- =============================================
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk optimasi query
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- =============================================
-- 3. CATEGORIES TABLE
-- =============================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk optimasi query
CREATE INDEX idx_categories_name ON categories(name);

-- =============================================
-- 4. PRODUCTS TABLE
-- =============================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    category_id INTEGER REFERENCES categories(id) ON DELETE RESTRICT,
    image TEXT,
    sku VARCHAR(100),
    size VARCHAR(100),
    color VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk optimasi query
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_products_sku ON products(sku);

-- =============================================
-- 5. TRANSACTIONS TABLE
-- =============================================
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    transaction_code VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE RESTRICT,
    total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'debit', 'credit', 'qris')),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk optimasi query
CREATE INDEX idx_transactions_code ON transactions(transaction_code);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- =============================================
-- 6. TRANSACTION ITEMS TABLE
-- =============================================
CREATE TABLE transaction_items (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
    subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk optimasi query
CREATE INDEX idx_transaction_items_transaction_id ON transaction_items(transaction_id);
CREATE INDEX idx_transaction_items_product_id ON transaction_items(product_id);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables that need updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA (OPTIONAL)
-- =============================================

-- Insert admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Demo Admin', 'admin@demo.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj56qx.PmUhG', 'admin'),
('Demo Kasir', 'kasir@demo.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj56qx.PmUhG', 'kasir');

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Kemeja', 'Berbagai jenis kemeja pria dan wanita'),
('Celana', 'Koleksi celana panjang dan pendek'),
('Jaket', 'Jaket dan outerwear'),
('Dress', 'Dress dan gaun wanita'),
('Aksesoris', 'Aksesoris fashion');

-- Insert sample products
INSERT INTO products (name, description, price, stock, category_id) VALUES
('Kemeja Formal Putih', 'Kemeja formal berkualitas tinggi warna putih', 150000, 25, 1),
('Kemeja Casual Biru', 'Kemeja casual warna biru untuk sehari-hari', 120000, 30, 1),
('Celana Jeans Hitam', 'Celana jeans hitam model slim fit', 200000, 20, 2),
('Celana Chino Khaki', 'Celana chino warna khaki', 180000, 15, 2),
('Jaket Denim', 'Jaket denim casual', 250000, 12, 3),
('Jaket Bomber', 'Jaket bomber style modern', 300000, 8, 3),
('Dress Floral', 'Dress dengan motif floral', 180000, 18, 4),
('Dress Hitam Elegant', 'Dress hitam untuk acara formal', 220000, 10, 4),
('Tas Ransel', 'Tas ransel untuk sehari-hari', 150000, 25, 5),
('Ikat Pinggang Kulit', 'Ikat pinggang kulit asli', 75000, 40, 5);

-- Insert sample transaction
INSERT INTO transactions (transaction_code, user_id, total_amount, payment_method, status) VALUES
('TRX-' || EXTRACT(EPOCH FROM NOW())::bigint, 2, 350000, 'cash', 'completed');

-- Insert sample transaction items (assuming transaction_id = 1)
INSERT INTO transaction_items (transaction_id, product_id, quantity, price, subtotal) VALUES
(1, 1, 2, 150000, 300000),
(1, 10, 1, 75000, 75000);

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- View for products with category information
CREATE VIEW v_products_with_category AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.stock,
    p.category_id,
    c.name as category_name,
    p.created_at,
    p.updated_at
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- View for transactions with user information
CREATE VIEW v_transactions_with_user AS
SELECT 
    t.id,
    t.transaction_code,
    t.user_id,
    u.name as cashier_name,
    t.total_amount,
    t.payment_method,
    t.status,
    t.created_at,
    t.updated_at
FROM transactions t
LEFT JOIN users u ON t.user_id = u.id;

-- View for transaction items with product information
CREATE VIEW v_transaction_items_detailed AS
SELECT 
    ti.id,
    ti.transaction_id,
    ti.product_id,
    p.name as product_name,
    ti.quantity,
    ti.price,
    ti.subtotal,
    ti.created_at
FROM transaction_items ti
LEFT JOIN products p ON ti.product_id = p.id;
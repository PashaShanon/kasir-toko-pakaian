require('dotenv').config();
const pool = require('./database/pool');
const bcrypt = require('bcryptjs');

async function setupDemoData() {
  const client = await pool.connect();
  try {
    console.log('🔄 Setting up demo data...\n');

    // Hash password "admin123" menggunakan bcryptjs dengan rounds yang sama seperti di app
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // 1. Insert Users
    console.log('📝 Inserting users...');
    await client.query(
      `INSERT INTO users (name, email, password, role, is_active) 
       VALUES 
       ($1, $2, $3, $4, $5),
       ($6, $7, $8, $9, $10)
       ON CONFLICT (email) DO NOTHING`,
      [
        'Admin Toko',
        'admin@demo.com',
        hashedPassword,
        'admin',
        true,
        'Kasir Demo',
        'kasir@demo.com',
        hashedPassword,
        'kasir',
        true
      ]
    );
    console.log('✅ Users inserted\n');

    // 2. Insert Categories
    console.log('📝 Inserting categories...');
    const categories = [
      { name: 'Kemeja', desc: 'Berbagai jenis kemeja' },
      { name: 'Kaos', desc: 'Kaos casual dan t-shirt' },
      { name: 'Celana', desc: 'Celana jeans, formal, casual' },
      { name: 'Dress', desc: 'Dress untuk berbagai acara' },
      { name: 'Jaket', desc: 'Jaket dan outer wear' }
    ];

    for (const cat of categories) {
      try {
        await client.query(
          `INSERT INTO categories (name, description) VALUES ($1, $2)`,
          [cat.name, cat.desc]
        );
      } catch (err) {
        // Ignore duplicate key errors
        if (err.code !== '23505') throw err;
      }
    }
    console.log('✅ Categories inserted\n');

    // 3. Get category IDs
    const categoriesResult = await client.query(
      `SELECT id, name FROM categories`
    );
    const categoryMap = {};
    categoriesResult.rows.forEach(row => {
      categoryMap[row.name] = row.id;
    });

    // 4. Insert Products
    console.log('📝 Inserting products...');
    const products = [
      { name: 'Kemeja Formal Putih', desc: 'Kemeja formal lengan panjang', price: 150000, stock: 25, cat: 'Kemeja' },
      { name: 'Kaos Polo Navy', desc: 'Kaos polo warna navy', price: 85000, stock: 30, cat: 'Kaos' },
      { name: 'Celana Jeans Slim Fit', desc: 'Celana jeans model slim', price: 250000, stock: 20, cat: 'Celana' },
      { name: 'Dress Maxi Floral', desc: 'Dress maxi dengan motif bunga', price: 220000, stock: 12, cat: 'Dress' },
      { name: 'Jaket Denim', desc: 'Jaket denim kasual', price: 280000, stock: 15, cat: 'Jaket' },
      { name: 'T-Shirt Wanita Pink', desc: 'T-shirt wanita warna pink', price: 65000, stock: 40, cat: 'Kaos' },
      { name: 'Celana Chino Beige', desc: 'Celana chino casual', price: 180000, stock: 22, cat: 'Celana' }
    ];

    for (const product of products) {
      try {
        await client.query(
          `INSERT INTO products (name, description, price, stock, category_id) 
           VALUES ($1, $2, $3, $4, $5)`,
          [
            product.name,
            product.desc,
            product.price,
            product.stock,
            categoryMap[product.cat]
          ]
        );
      } catch (err) {
        // Ignore duplicate key errors
        if (err.code !== '23505') throw err;
      }
    }
    console.log('✅ Products inserted\n');

    console.log('🎉 Demo data setup complete!\n');
    console.log('📋 Demo Accounts:');
    console.log('   Admin: admin@demo.com / admin123');
    console.log('   Kasir: kasir@demo.com / admin123\n');

  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Database connection failed. Make sure Supabase is reachable.');
    }
  } finally {
    client.release();
    await pool.end();
    process.exit(0);
  }
}

setupDemoData();

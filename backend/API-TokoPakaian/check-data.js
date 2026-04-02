const pool = require('./database/pool');

async function checkData() {
  try {
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const productCount = await pool.query('SELECT COUNT(*) FROM products');
    console.log(`Users: ${userCount.rows[0].count}`);
    console.log(`Products: ${productCount.rows[0].count}`);
    process.exit(0);
  } catch (err) {
    console.error('Error checking data:', err.message);
    process.exit(1);
  }
}

checkData();

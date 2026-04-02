require("dotenv").config();
const { Pool } = require("pg");

const dbConfig = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "toko_online",
  password: process.env.DB_PASSWORD || "postgres",
  port: parseInt(process.env.DB_PORT) || 5432,
  ssl: false,
};

console.log("🔗 Testing Local PostgreSQL Connection...");
console.log("Connection Details:");
console.log("  Host:", dbConfig.host);
console.log("  Port:", dbConfig.port);
console.log("  User:", dbConfig.user);
console.log("  Database:", dbConfig.database);
console.log("");

const pool = new Pool(dbConfig);

pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("❌ Connection Failed:");
    console.error("Error:", err.message);
    console.error("Code:", err.code);
    process.exit(1);
  } else {
    console.log("✅ Connection Successful!");
    console.log("Server Time:", result.rows[0].now);

    // Check if tables exist
    pool.query(
      `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema='public'
      ORDER BY table_name
    `,
      (err, result) => {
        if (!err && result.rows.length > 0) {
          console.log("\n📊 Tables Found:");
          result.rows.forEach((row) => {
            console.log("  ✓", row.table_name);
          });
        } else if (!err) {
          console.log(
            "\n⚠️  No tables found. Run schema.sql to initialize database.",
          );
        }

        pool.end();
        process.exit(0);
      },
    );
  }
});

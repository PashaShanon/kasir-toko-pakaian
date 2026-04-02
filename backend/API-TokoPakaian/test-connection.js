require("dotenv").config();
const { Pool } = require("pg");

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

console.log("🔗 Testing Supabase Connection...");
console.log(
  "Connection URL:",
  process.env.DATABASE_URL ? "✓ Configured" : "✗ Not configured",
);
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

    // Test query to get database info
    pool.query("SELECT version()", (err, result) => {
      if (!err) {
        console.log(
          "Database:",
          result.rows[0].version.substring(0, 50) + "...",
        );
      }

      // List tables
      pool.query(
        `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema='public'
      `,
        (err, result) => {
          if (!err && result.rows.length > 0) {
            console.log("\nTables Found:");
            result.rows.forEach((row) => {
              console.log("  -", row.table_name);
            });
          }
          pool.end();
          process.exit(0);
        },
      );
    });
  }
});

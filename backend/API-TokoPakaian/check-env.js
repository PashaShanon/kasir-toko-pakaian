require("dotenv").config();

console.log("📋 Environment Variables Check:");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✓ Set" : "✗ Not set");
console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "✓ Set" : "✗ Not set");
console.log(
  "SUPABASE_ANON_KEY:",
  process.env.SUPABASE_ANON_KEY ? "✓ Set" : "✗ Not set",
);
console.log("");

if (process.env.DATABASE_URL) {
  console.log("DATABASE_URL Value:");
  console.log(process.env.DATABASE_URL);
  console.log("");

  // Parse connection string
  const url = new URL(
    "postgresql://" + process.env.DATABASE_URL.split("postgresql://")[1],
  );
  console.log("Connection Details:");
  console.log("  Host:", url.hostname);
  console.log("  Port:", url.port);
  console.log("  Database:", url.pathname.replace("/", ""));
  console.log("  User:", url.username);
}

if (process.env.SUPABASE_URL) {
  console.log("\nSupabase URL:", process.env.SUPABASE_URL);
}

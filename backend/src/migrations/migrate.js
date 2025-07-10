import { pool } from "../config/database.js";
import fs from "fs";
import path from "path";

// Create migrations table if it doesn't exist
async function createMigrationsTable() {
  const q = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;
  await pool.query(q);
}

// Executed migrations
async function getExecutedMigrations() {
  const result = await pool.query(
    "SELECT filename FROM migrations ORDER BY id"
  );
  return result.rows.map((row) => row.filename);
}

// Run migrations
async function runMigrations() {
  try {
    await createMigrationsTable();

    const dirname = import.meta.dirname;

    const migrationsDir = path.join(dirname, "files");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    const executedMigrations = await getExecutedMigrations();

    for (const file of migrationFiles) {
      if (!executedMigrations.includes(file)) {
        console.log(`Running migration: ${file}`);
        const migrationSQL = fs.readFileSync(
          path.join(migrationsDir, file),
          "utf8"
        );

        await pool.query("BEGIN");
        try {
          await pool.query(migrationSQL);
          await pool.query("INSERT INTO migrations (filename) VALUES ($1)", [
            file,
          ]);
          await pool.query("COMMIT");
          console.log(`✓ Migration ${file} completed`);
        } catch (error) {
          await pool.query("ROLLBACK");
          throw error;
        }
      } else {
        console.log(`Migration already executed: ${file}`);
      }
    }

    console.log("All migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigrations().then(() => {
  console.log("Migration process finished");
  process.exit(0);
});

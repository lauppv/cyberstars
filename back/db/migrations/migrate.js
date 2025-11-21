import fs from "fs";
import path from "path";
import pool from "../db.js"; 

const migrationsDir = path.join(process.cwd(), "back/db/migrations");

async function runMigrations() {
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql"));

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    console.log(`Running migration: ${file}`);
    await pool.query(sql);
  }

  console.log("All migrations applied.");
  pool.end();
}

runMigrations().catch(err => console.error(err));

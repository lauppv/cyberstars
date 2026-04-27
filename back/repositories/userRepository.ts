import pool from "../db/db.js";
import type { User } from "../types/auth.js";

export async function findByEmail(email: string): Promise<User | null> {
  const result = await pool.query<User>(
    "SELECT id, name, email, password FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] ?? null;
}

export async function findById(id: number): Promise<Omit<User, "password"> | null> {
  const result = await pool.query<Omit<User, "password">>(
    "SELECT id, name, email FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] ?? null;
}

export async function create(name: string, email: string, hashedPassword: string): Promise<number> {
  const result = await pool.query<{ id: number }>(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
    [name, email, hashedPassword]
  );
  return result.rows[0].id;
}

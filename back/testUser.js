
import pool from "./db/db.js"; 

async function main() {
  try {
  
    const insertResult = await pool.query(
      `INSERT INTO users (name, email, password) 
       VALUES ($1, $2, $3) RETURNING *`,
      ["Test User", "test@example.com", "parola123"]
    );
    console.log("User created:", insertResult.rows[0]);

    
    const allUsersResult = await pool.query(`SELECT * FROM users`);
    console.log("All users:", allUsersResult.rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end(); 
  }
}

main();

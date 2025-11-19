import { spawn } from "child_process";
import express from "express";
import pool from "./db/db.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();


// porneste build-erul
const reactProcess = spawn("node", ["src/react.js"], { stdio: "inherit" });

reactProcess.on("close", (code) => {
  console.log(`React process exited with code ${code}`);
});



const app = express();
app.use(cors());    
const PORT = process.env.EXPRESS_PORT;
app.use(express.json());


const result = await pool.query("SELECT NOW()");
console.log(result.rows);



app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));

import pg from "pg";
import { config } from "../config.js";

const { Pool } = pg;

const pool = new Pool(config.db);

export default pool;

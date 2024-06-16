import pg from "pg";
import { initDotEnv } from "./utils.js";

const { Pool } = pg;

// get access to env variables
initDotEnv();

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

export default pool;

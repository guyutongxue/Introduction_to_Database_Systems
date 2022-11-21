import dotenv from "dotenv";
import { env } from "node:process";
import PG from "pg"; // An CJS module, use default-export here

dotenv.config();

const pool = new PG.Pool({
  host: "guoyi.work",
  user: "gy",
  password: env.POSTGRES_PASSWORD,
  database: "order"
});

export async function query(text: string, param: string[] = []) {
  return pool.query(text, param);
} 


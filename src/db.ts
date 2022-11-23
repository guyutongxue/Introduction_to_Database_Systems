import { env } from "node:process";
import * as dotenv from "dotenv";
import PG from "pg"; // A CJS-only package, no named export

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


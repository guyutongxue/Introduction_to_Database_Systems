import { env } from "node:process";
import * as dotenv from "dotenv";
import PG, { QueryResultRow } from "pg"; // A CJS-only package, no named export

dotenv.config();

const pool = new PG.Pool({
  host: env.POSTGRES_HOST,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
});

export async function query<R extends QueryResultRow = Record<string, unknown>>(
  text: string,
  param: string[] = []
) {
  return pool.query<R>(text, param);
}

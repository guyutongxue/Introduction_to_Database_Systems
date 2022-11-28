import { env } from "node:process";
import PG, { QueryResultRow } from "pg"; // A CJS-only package, no named export

const pool = new PG.Pool({
  host: env.POSTGRES_HOST,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
});

export async function query<R extends QueryResultRow = Record<string, unknown>>(
  text: string,
  param: unknown[] = []
) {
  return pool.query<R>(text, param);
}

export async function transaction(op: (client: PG.PoolClient) => Promise<void>) {
  const client = await pool.connect();
  await client.query("BEGIN;");
  try {
    await op(client);
  } finally {
    await client.query("COMMIT;");
  }
}


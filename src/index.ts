import { env } from "node:process";
import Fastify from "fastify";
import { query } from "./db";

const PORT = Number(env.PORT ?? 3000);
const HOST = env.HOST ?? "0.0.0.0";

const fastify = Fastify({
  logger: true
});

fastify.get('/', async () => {
  const { rows } = await query(`SELECT NOW()`);
  return rows;
});

await fastify.listen({
  host: HOST,
  port: PORT
});

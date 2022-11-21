import Fastify from "fastify";
import { query } from "./db";
import { env } from "node:process";

const PORT = Number(env.PORT ?? 3000);

const fastify = Fastify({
  logger: true
});

fastify.get('/', async (req) => {
  const { rows } = await query(`SELECT NOW()`);
  return rows;
})

await fastify.listen({ port: PORT });

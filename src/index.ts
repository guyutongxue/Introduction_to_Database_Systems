import { env } from "node:process";
import Fastify from "fastify";
import { query } from "./db";
import auth from "./auth";
import user from "./user";

const PORT = Number(env.PORT ?? 3000);
const HOST = env.HOST ?? "0.0.0.0";

const fastify = Fastify({
  logger: true,
});

await fastify.register(auth);
await fastify.register(user);
fastify.post(
  "/secure",
  {
    onRequest: [fastify.verifyJwt],
  },
  (req) => {
    return req.user;
  }
);

fastify.get("/", async () => {
  const { rows } = await query(`SELECT * FROM customer`);
  return rows;
});

await fastify.listen({
  host: HOST,
  port: PORT,
});

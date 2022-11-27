import "./dotenv";
import { env } from "node:process";
import Fastify from "fastify";
import auth from "./auth";
import user from "./user";
import customer from "./customer";
import frontend from "./frontend";

const PORT = Number(env.PORT ?? 3000);
const HOST = env.HOST ?? "0.0.0.0";

const fastify = Fastify({
  logger: true,
});

await fastify.register(auth);
await fastify.register(user);
await fastify.register(customer);
await fastify.register(frontend);

await fastify.listen({
  host: HOST,
  port: PORT,
});

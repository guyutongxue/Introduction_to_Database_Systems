import { env } from "node:process";
import Fastify from "fastify";
import auth from "./auth";
import user from "./user";

const PORT = Number(env.PORT ?? 3000);
const HOST = env.HOST ?? "0.0.0.0";

const fastify = Fastify({
  logger: true,
});

await fastify.register(auth);
await fastify.register(user);

fastify.get("/", async (req, rep) => {
  rep
    .header("Content-Type", "text/html")
    .send(
      "<!DOCTYPE html><title>GY的外卖平台管理系统</title><h1>你好，数据库！</h1>"
    );
});

await fastify.listen({
  host: HOST,
  port: PORT,
});

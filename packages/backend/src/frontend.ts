import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "node:url";
import fp from "fastify-plugin";

const frontendDist = new URL("../../frontend/dist", import.meta.url);

export default fp(async function (fastify) {
  fastify.register(fastifyStatic, {
    root: fileURLToPath(frontendDist),
  });
});

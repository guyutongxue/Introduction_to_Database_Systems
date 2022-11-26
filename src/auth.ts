import { env } from "node:process";
import { FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

async function verifyJwt(req: FastifyRequest) {
  await req.jwtVerify();
}

export default fp(async function (fastify) {
  fastify.decorate("verifyJwt", verifyJwt);
  fastify.decorate("signJwt", (phone: string) => {
    return fastify.jwt.sign({ phone });
  });
  await fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET ?? "",
  });
});

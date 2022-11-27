import { env } from "node:process";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type { Role } from "./fastify-jwt";

async function verifyJwt(req: FastifyRequest, rep: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch (err) {
    rep.code(400).send(err);
  }
}

export default fp(async function (fastify) {
  fastify.decorate("verifyJwt", verifyJwt);
  fastify.decorate("signJwt", (phone: string, role: Role) => {
    return fastify.jwt.sign({ phone, role });
  });
  await fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET ?? "",
  });
});

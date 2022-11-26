import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      phone: string
    }; // payload type is used for signing and verifying
    user: {
      phone: string;
    }; // user type is return type of `request.user` object
  }
}
declare module 'fastify' {
  interface FastifyInstance {
    verifyJwt: (req: FastifyRequest) => void,
    signJwt: (phone: string) => string,
  }
}

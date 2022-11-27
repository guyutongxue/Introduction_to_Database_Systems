import "@fastify/jwt";

type Role = "admin" | "customer" | "shop" | "courier";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      phone: string;
      role: Role;
    }; // payload type is used for signing and verifying
    user: {
      phone: string;
      role: Role;
    }; // user type is return type of `request.user` object
  }
}
declare module 'fastify' {
  interface FastifyInstance {
    verifyJwt: (req: FastifyRequest) => void,
    signJwt: (phone: string, role: Role) => string,
  }
}

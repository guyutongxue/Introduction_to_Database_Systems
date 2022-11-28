import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fp from "fastify-plugin";
import { query } from "./db";
import { SCHEMA_ORDER_LIST } from "./schema_def";
import { sql2Reply, SqlOrder } from "./sql_type";

export default fp(async (inst) => {
  const fastify = inst.withTypeProvider<JsonSchemaToTsProvider>();
  fastify.get(
    "/orders/free",
    {
      schema: SCHEMA_ORDER_LIST,
      preHandler: [fastify.verifyJwt],
    },
    async (req, rep) => {
      const { role } = req.user;
      if (role !== "courier") {
        return rep.code(401).send({
          message: "Only couriers can view free orders.",
        });
      }
      const { rows } = await query<SqlOrder>(
        `SELECT * FROM orders WHERE cour_id IS NULL`
      );
      return rows.map(sql2Reply);
    }
  );
});

import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fp from "fastify-plugin";
import { query } from "./db";
import { SCHEMA_ORDER_LIST } from "./schema_def";
import { sql2Reply, SqlOrderDetailed } from "./sql_type";

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
      const { rows } = await query<SqlOrderDetailed>(
        `
SELECT order_id, cust_id, cust_name, shop_id, shop_name, cour_id, order_begin_time, order_state
    FROM shop NATURAL JOIN orders NATURAL JOIN customer
    WHERE cour_id IS NULL
    ORDER BY order_begin_time DESC`
      );
      return rows.map(sql2Reply);
    }
  );
});

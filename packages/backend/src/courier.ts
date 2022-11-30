import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fp from "fastify-plugin";
import { query } from "./db";
import { createSchema } from "./schema";
import { J_SCHEMA_SUCCESS, SCHEMA_ORDER_LIST } from "./schema_def";
import { sql2Reply, SqlOrderDetailed } from "./sql_type";

const SCHEMA_HEALTH = createSchema({
  body: {
    type: "object",
    properties: {
      cour_temperature: { type: "number" },
      cour_covid: { type: "string" },
    },
    additionalProperties: false,
    required: ["cour_temperature", "cour_covid"],
  },
  response: J_SCHEMA_SUCCESS,
} as const);

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
        return rep.code(403).send({
          message: "Only couriers can view free orders.",
        });
      }
      const { rows } = await query<SqlOrderDetailed>(
        `
SELECT order_id, cust_id, cust_name, shop_id, shop_name, shop_location, cour_id, order_value, order_begin_time, order_destination, order_state
    FROM shop NATURAL JOIN orders NATURAL JOIN customer
    WHERE order_state = 0
    ORDER BY order_begin_time DESC`
      );
      return rows.map(sql2Reply);
    }
  );
  fastify.post(
    "/courier/health",
    {
      schema: SCHEMA_HEALTH,
      preHandler: [fastify.verifyJwt],
    },
    async (req, rep) => {
      const { id, role } = req.user;
      const { cour_temperature, cour_covid } = req.body;
      if (role !== "courier") {
        return rep.code(403).send({
          message: "Only couriers can update health info.",
        });
      }
      const { rowCount } = await query(
        `
UPDATE courier
    SET (cour_temperature, cour_covid) = ($1, $2)
    WHERE cour_id = $3
    RETURNING *;`,
        [cour_temperature, cour_covid, id]
      );
      if (!rowCount) {
        return rep.code(404).send({
          message: "No such courier id.",
        });
      }
      return {
        success: true as const,
      };
    }
  );
});

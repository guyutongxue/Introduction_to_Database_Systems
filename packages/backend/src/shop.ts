import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fp from "fastify-plugin";
import { query } from "./db";
import { createSchema } from "./schema";
import { J_SCHEMA_DISH, J_SCHEMA_SHOP, SCHEMA_DISH_LIST } from "./schema_def";
import { sql2Reply, SqlDish, SqlShop } from "./sql_type";

const SCHEMA_SHOP_LIST = createSchema({
  response: {
    type: "array",
    items: J_SCHEMA_SHOP,
  },
} as const);

const SCHEMA_SHOP_GET = createSchema({
  params: {
    id: {
      type: "number",
    },
  },
  response: J_SCHEMA_SHOP,
} as const);

export default fp(async (inst) => {
  const fastify = inst.withTypeProvider<JsonSchemaToTsProvider>();

  fastify.get(
    "/shops",
    {
      schema: SCHEMA_SHOP_LIST,
      preHandler: [fastify.verifyJwt],
    },
    async () => {
      const { rows } = await query<SqlShop>(`
SELECT *
    FROM shop
    WHERE business_status = 1`);
      return rows.map(sql2Reply);
    }
  );
  fastify.get(
    "/shop/:id",
    {
      schema: SCHEMA_SHOP_GET,
      preHandler: [fastify.verifyJwt],
    },
    async (req, rep) => {
      const { id } = req.params;
      const { rows, rowCount } = await query<SqlShop>(
        `SELECT * FROM shop WHERE shop_id = $1`,
        [id]
      );
      if (!rowCount) {
        rep.code(404).send({
          message: "No shop found for that ID.",
        });
      }
      return sql2Reply(rows[0]);
    }
  );
  fastify.get(
    "/shop/:id/dishes",
    {
      schema: SCHEMA_DISH_LIST,
      preHandler: [fastify.verifyJwt],
    },
    async (req) => {
      const { id } = req.params;
      const { rows } = await query<SqlDish>(
        `SELECT * FROM dish WHERE shop_id = $1`,
        [id]
      );
      return rows.map(sql2Reply);
    }
  );
});

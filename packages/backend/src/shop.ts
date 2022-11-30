import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fp from "fastify-plugin";
import { query } from "./db";
import { createSchema } from "./schema";
import {
  J_SCHEMA_DISH,
  J_SCHEMA_SHOP,
  J_SCHEMA_SUCCESS,
  SCHEMA_DISH_LIST,
} from "./schema_def";
import { sql2Reply, SqlDish, SqlShop } from "./sql_type";
import _ from "lodash-es";

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

const SCHEMA_DISH_POST = createSchema({
  body: {
    type: "object",
    properties: {
      dish_name: {
        type: "string",
      },
      dish_value: {
        type: "number",
      },
    },
    required: ["dish_name", "dish_value"],
    additionalProperties: false,
  },
  response: J_SCHEMA_SUCCESS,
} as const);

const SCHEMA_DISH_PUT = createSchema({
  params: {
    id: { type: "number" },
  },
  body: {
    type: "object",
    properties: {
      dish_name: {
        type: "string",
      },
      dish_value: {
        type: "number",
      },
    },
    additionalProperties: false,
  },
  response: J_SCHEMA_SUCCESS,
} as const);

const SCHEMA_DISH_DELETE = createSchema({
  params: {
    id: { type: "number" },
  },
  response: J_SCHEMA_SUCCESS,
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
    WHERE business_status = 1 AND shop_location IS NOT NULL`);
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
  fastify.post(
    "/shop/dish",
    {
      schema: SCHEMA_DISH_POST,
      preHandler: [fastify.verifyJwt],
    },
    async (req, rep) => {
      const { id: shop_id, role } = req.user;
      const { dish_name, dish_value } = req.body;
      if (role !== "shop") {
        return rep.code(403).send({
          message: "Only shop can add dishes.",
        });
      }
      await query(
        `
INSERT INTO dish (shop_id, dish_name, dish_value)
    VALUES ($1, $2, $3);`,
        [shop_id, dish_name, dish_value]
      );
      return {
        success: true as const,
      };
    }
  );
  fastify.put(
    "/shop/dish/:id",
    {
      schema: SCHEMA_DISH_PUT,
      preHandler: [fastify.verifyJwt],
    },
    async (req, rep) => {
      const { id: dish_id } = req.params;
      const { id: shop_id, role } = req.user;
      const { dish_name, dish_value } = req.body;
      if (role !== "shop") {
        return rep.code(403).send({
          message: "Only shop can modify dishes.",
        });
      }
      const updatedCols: string[] = [];
      const args: unknown[] = [];
      if (dish_name !== undefined) {
        updatedCols.push("dish_name");
        args.push(dish_name);
      }
      if (dish_value !== undefined) {
        updatedCols.push("dish_value");
        args.push(dish_value);
      }
      let sql = `
UPDATE dish
    SET (${updatedCols.join(", ")}) = (${_.range(updatedCols.length)
        .map((i) => `$${i + 1}`)
        .join(", ")})
`;
      args.push(shop_id, dish_id);
      sql += `    WHERE shop_id = $${args.length - 1} AND dish_id = $${
        args.length
      }\n`;
      sql += `    RETURNING dish_id`;
      console.log({ sql, args });
      const { rowCount } = await query(sql, args);
      if (!rowCount) {
        return rep.code(400).send({
          message: "No dishes were updated. Maybe the dish_id is wrong.",
        });
      }
      return {
        success: true as const,
      };
    }
  );
  fastify.delete(
    "/shop/dish/:id",
    {
      schema: SCHEMA_DISH_DELETE,
      preHandler: [fastify.verifyJwt],
    },
    async (req, rep) => {
      const { id: dish_id } = req.params;
      const { id: shop_id, role } = req.user;
      if (role !== "shop") {
        return rep.code(403).send({
          message: "Only shop can delete dishes.",
        });
      }
      // Move dish to dummy shop No. 0
      // prevent cascade-deletion problems
      await query(
        `
UPDATE dish
    SET shop_id = 0
    WHERE shop_id = $1 AND dish_id = $2`,
        [shop_id, dish_id]
      );
      return {
        success: true as const,
      };
    }
  );
});

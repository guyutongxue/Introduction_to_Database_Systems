import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fp from "fastify-plugin";
import { FromSchema } from "json-schema-to-ts";
import { query, transaction } from "./db";
import { createSchema } from "./schema";
import { J_SCHEMA_SUCCESS } from "./schema_def";

const SCHEMA_SC_GET = createSchema({
  response: {
    type: "array",
    items: {
      type: "object",
      properties: {
        dish_id: { type: "number" },
        dish_name: { type: "string" },
        shop_id: { type: "number" },
        shop_name: { type: "string" },
        car_num: { type: "number" },
        dish_value: { type: "number" },
      },
      required: [
        "dish_id",
        "dish_name",
        "shop_id",
        "shop_name",
        "car_num",
        "dish_value",
      ],
      additionalProperties: false,
    },
  },
} as const);
type SqlScGet = FromSchema<typeof SCHEMA_SC_GET.response.default.items>;

const SCHEMA_SC_POST = createSchema({
  body: {
    type: "object",
    properties: {
      dish_id: {
        type: "number",
      },
      car_num: {
        type: "number",
      },
    },
    required: ["dish_id"],
    additionalProperties: false,
  },
  response: J_SCHEMA_SUCCESS,
} as const);

export default fp(async function (ins) {
  const fastify = ins.withTypeProvider<JsonSchemaToTsProvider>();
  fastify.post(
    "/customer/car/insert",
    {
      schema: SCHEMA_SC_POST,
      preHandler: [fastify.verifyJwt],
    },
    async (req, rep) => {
      const { id, role } = req.user;
      const { dish_id, car_num = 1 } = req.body;
      if (role !== "customer") {
        return rep.code(401).send({
          message: "Only customer can set shopping car.",
        });
      }
      const { rowCount } = await query(
        `
SELECT car_num
    FROM shopping_car
    WHERE cust_id = $1 AND dish_id = $2`,
        [id, dish_id]
      );
      if (!rowCount) {
        await query(
          `
INSERT INTO shopping_car (cust_id, dish_id, car_num)
    VALUES ($1, $2, $3);`,
          [id, dish_id, car_num]
        );
      } else {
        await query(
          `
UPDATE shopping_car
    SET car_num = car_num + $3
    WHERE cust_id = $1 AND dish_id = $2;`,
          [id, dish_id, car_num]
        );
      }
      return {
        success: true as const,
      };
    }
  );
  fastify.post(
    "/customer/car/delete",
    {
      schema: SCHEMA_SC_POST,
      preHandler: [fastify.verifyJwt],
    },
    async (req, rep) => {
      const { id, role } = req.user;
      const { dish_id, car_num = 1 } = req.body;
      if (role !== "customer") {
        return rep.code(401).send({
          message: "Only customer can set shopping car.",
        });
      }
      const { rows: oldRows, rowCount } = await query<{ car_num: number }>(
        `
SELECT car_num
  FROM shopping_car
  WHERE cust_id = $1 AND dish_id = $2`,
        [id, dish_id]
      );
      if (!rowCount) {
        return rep.code(404).send({
          message: "No such dish found in your shopping cart.",
        });
      }
      const old_car_num = oldRows[0].car_num;
      const new_car_num = old_car_num - car_num;
      if (new_car_num <= 0) {
        await query(
          `
DELETE FROM shopping_car
    WHERE cust_id = $1 AND dish_id = $2;`,
          [id, dish_id]
        );
      } else {
        await query(
          `
UPDATE shopping_car
  SET car_num = $3
  WHERE cust_id = $1 AND dish_id = $2;`,
          [id, dish_id, new_car_num]
        );
      }

      return {
        success: true as const,
      };
    }
  );
  fastify.get(
    "/customer/car",
    {
      schema: SCHEMA_SC_GET,
      preHandler: [fastify.verifyJwt],
    },
    async (req, rep) => {
      const { id, role } = req.user;
      if (role !== "customer") {
        return rep.code(401).send({
          message: "Only customer can get shopping car.",
        });
      }
      const { rows } = await query<SqlScGet>(
        `
SELECT dish_id, dish_name, shop_id, shop_name, dish_value, car_num
    FROM shop NATURAL JOIN dish NATURAL JOIN (
        SELECT dish_id, car_num
            FROM shopping_car 
            WHERE cust_id = $1
    ) AS s`,
        [id]
      );
      return rows;
    }
  );
});

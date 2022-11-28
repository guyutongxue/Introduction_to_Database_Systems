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

const SCHEMA_SC_SET = createSchema({
  body: {
    type: "array",
    items: {
      type: "object",
      properties: {
        dish_id: {
          type: "number",
        },
        car_num: {
          type: "number",
        },
      },
      required: ["dish_id", "car_num"],
      additionalProperties: false,
    },
  },
  response: J_SCHEMA_SUCCESS,
} as const);

export default fp(async function (ins) {
  const fastify = ins.withTypeProvider<JsonSchemaToTsProvider>();
  fastify.post(
    "/customer/car",
    {
      schema: SCHEMA_SC_SET,
      preHandler: [fastify.verifyJwt],
    },
    async (req, rep) => {
      const { id, role } = req.user;
      const list = req.body;
      if (role !== "customer") {
        return rep.code(401).send({
          message: "Only customer can set shopping car.",
        });
      }
      await transaction(async (client) => {
        await client.query(`DELETE FROM shopping_car WHERE cust_id = $1;`, [
          id,
        ]);
        await client.query(
          `
INSERT INTO shopping_car (dish_id, cust_id, car_num)
    SELECT * FROM UNNEST (
        $1::INTEGER[], 
        $2::INTEGER[], 
        $3::INTEGER[]
    ) AS t;`,
          [
            list.map((i) => i.dish_id),
            Array(list.length).fill(id),
            list.map((i) => i.car_num),
          ]
        );
      });
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

import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fp from "fastify-plugin";
import { FromSchema } from "json-schema-to-ts";
import { query } from "./db";
import { createSchema } from "./schema";
import { J_SCHEMA_DISH, J_SCHEMA_ORDER, J_SCHEMA_SHOP, J_SCHEMA_SUCCESS, SCHEMA_DISH_LIST } from "./schema_def";
import { SqlDish, SqlShop } from "./sql_type";

const SCHEMA_SHOP_LIST = createSchema({
  response: {
    type: "array",
    items: J_SCHEMA_SHOP,
  },
} as const);
const SQL_SHOP_LIST = `SELECT * FROM shop`;

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
type SqlScGet = FromSchema<(typeof SCHEMA_SC_GET.response.default.items)>;

const SQL_SHOP_DISH_LIST = `SELECT * FROM dish WHERE shop_id = $1`;

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

const SCHEMA_SUBMIT = createSchema({
  response: J_SCHEMA_ORDER
} as const);

export default fp(async function (ins) {
  const fastify = ins.withTypeProvider<JsonSchemaToTsProvider>();
  fastify.get(
    "/customer/shops",
    {
      schema: SCHEMA_SHOP_LIST,
      preHandler: [fastify.verifyJwt],
    },
    async () => {
      const { rows } = await query<SqlShop>(SQL_SHOP_LIST);
      return rows.map(
        ({
          shop_id,
          shop_name,
          shop_phone,
          shop_location,
          business_status,
          delivery_range,
        }) => ({
          shop_id,
          shop_name,
          shop_phone,
          shop_location: shop_location ?? undefined,
          business_status,
          delivery_range: delivery_range ?? undefined,
        })
      );
    }
  );
  fastify.get(
    "/shop/:id/dishes",
    {
      schema: SCHEMA_DISH_LIST,
    },
    async (req) => {
      const { id } = req.params;
      const { rows } = await query<SqlDish>(SQL_SHOP_DISH_LIST, [id]);
      return rows.map(
        ({
          dish_id,
          dish_name,
          dish_sales,
          dish_score,
          dish_value,
          shop_id,
        }) => ({
          shop_id,
          dish_id,
          dish_name,
          dish_sales,
          dish_value,
          dish_score: dish_score ?? undefined,
        })
      );
    }
  );
  fastify.post(
    "/customer/car",
    {
      schema: SCHEMA_SC_SET,
      preHandler: [fastify.verifyJwt],
    },
    async (req, rep) => {
      const { phone, role } = req.user;
      const list = req.body;
      if (role !== "customer") {
        rep.code(401).send({
          message: "Only customer can set shopping car.",
        });
        return;
      }
      const { rows } = await query(
        `SELECT cust_id FROM customer WHERE cust_phone = $1`,
        [phone]
      );
      const cust_id = rows[0].cust_id;
      console.log(cust_id);
      await query(`BEGIN;`);
      await query(`DELETE FROM shopping_car WHERE cust_id = $1;`, [cust_id]);
      await query(
        `INSERT INTO shopping_car (dish_id, cust_id, car_num)
    SELECT * FROM UNNEST (
        $1::INTEGER[], 
        $2::INTEGER[], 
        $3::INTEGER[]
    ) AS t;`,
        [
          list.map((i) => i.dish_id),
          Array(list.length).fill(cust_id),
          list.map((i) => i.car_num),
        ]
      );
      await query("COMMIT;");
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
      const { phone, role } = req.user;
      if (role !== "customer") {
        rep.code(401).send({
          message: "Only customer can get shopping car.",
        });
        return;
      }
      const { rows } = await query<SqlScGet>(
        `SELECT dish_id, dish_name, shop_id, shop_name, dish_value, car_num
    FROM dish NATURAL JOIN shop NATURAL JOIN (
        SELECT dish_id, car_num
            FROM shopping_car 
            WHERE cust_id = (
                SELECT cust_id FROM customer WHERE cust_phone = $1
            )
    ) AS s`,
        [phone]
      );
      return rows;
    }
  );
  fastify.post("/customer/order", {
    schema: SCHEMA_SUBMIT,
    preHandler: [fastify.verifyJwt],
  }, (req, rep) => {
    const { phone, role } = req.user;
    if (role !== "customer") {
      rep.code(401).send({
        message: "Only customer can submit an order.",
      });
      return;
    }
  });
});

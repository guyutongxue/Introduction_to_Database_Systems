import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fp from "fastify-plugin";
import _ from "lodash-es";
import { QueryResult } from "pg";
import { query, transaction } from "./db";
import { createSchema } from "./schema";
import { SCHEMA_DISH_LIST, SCHEMA_ORDER_LIST } from "./schema_def";
import { sql2Reply, SqlDish, SqlOrderDetailed } from "./sql_type";

const SCHEMA_SUBMIT = createSchema({
  body: {
    type:"object",
    properties: {
      order_destination: { type: "string"}
    },
    required: ["order_destination"],
    additionalProperties: false
  },
  response: {
    type: "array",
    items: {
      type: "number",
    },
  },
} as const);

export default fp(async (inst) => {
  const fastify = inst.withTypeProvider<JsonSchemaToTsProvider>();
  fastify.post(
    "/order",
    {
      schema: SCHEMA_SUBMIT,
      preHandler: [fastify.verifyJwt],
    },
    async (req, rep) => {
      const { id, role } = req.user;
      const { order_destination } = req.body;
      if (role !== "customer") {
        return rep.code(401).send({
          message: "Only customer can submit an order.",
        });
      }
      let result: QueryResult | undefined;
      await transaction(async (client) => {
        // Create a table storing each dish's shop
        await client.query(
          `
CREATE TEMPORARY TABLE t
    AS SELECT dish_id, dish_value, car_num, shop_id
        FROM shopping_car NATURAL JOIN dish
        WHERE cust_id = $1;`,
          [id]
        );

        // Add sales
        await client.query(`
UPDATE dish AS d
    SET dish_sales = dish_sales + (
        SELECT car_num
            FROM t
            WHERE dish_id = d.dish_id
    )
    WHERE dish_id IN (
        SELECT dish_id FROM t
    );
`);

        // Clear the shopping car
        await client.query(
          `
DELETE FROM shopping_car
    WHERE cust_id = $1;`,
          [id]
        );

        // Create orders and contain relations
        result = await client.query(
          `
WITH o AS (
    INSERT INTO orders (cust_id, shop_id, order_destination, order_value)
        SELECT DISTINCT $1::INTEGER, shop_id, $2::TEXT, SUM(dish_value * car_num) as order_value
            FROM t
            GROUP BY shop_id
        RETURNING order_id, shop_id
)
INSERT INTO contain (dish_id, order_id, contain_num)
    SELECT dish_id, order_id, car_num
        FROM t NATURAL JOIN o
    RETURNING order_id`,
          [id, order_destination]
        );
      });
      if (!result || !result.rowCount) {
        return rep.code(400).send({
          message: "Shopping car is empty.",
        });
      }
      return _.uniq(result.rows.map((r) => r.order_id));
    }
  );

  fastify.get(
    "/orders",
    {
      schema: SCHEMA_ORDER_LIST,
      preHandler: [fastify.verifyJwt],
    },
    async (req) => {
      const { id, role } = req.user;
      const idCol = role.substring(0, 4) + "_id";
      const { rows } = await query<SqlOrderDetailed>(
        `
SELECT order_id, cust_id, cust_name, shop_id, shop_name, shop_location, cour_id, order_value, order_begin_time, order_destination, order_state
    FROM shop NATURAL JOIN orders NATURAL JOIN customer
    WHERE ${idCol} = $1
    ORDER BY order_begin_time DESC`,
        [id]
      );
      return rows.map(sql2Reply);
    }
  );

  fastify.get(
    "/order/:id/dishes",
    {
      schema: SCHEMA_DISH_LIST,
      preHandler: [fastify.verifyJwt],
    },
    async (req) => {
      const { id } = req.params;
      const { id: userId, role } = req.user;
      let sql = `
SELECT dish_id, shop_id, dish_name, dish_value, dish_sales
    FROM orders NATURAL JOIN contain NATURAL JOIN dish
    WHERE order_id = $1`;
      const args = [id, userId];
      if (role === "courier") {
        sql += ` AND cour_id = $2`;
      } else if (role === "customer") {
        sql += ` AND cust_id = $2`;
      } else if (role === "shop") {
        sql += ` AND shop_id = $2`;
      } else {
        args.pop();
      }
      const { rows } = await query<SqlDish>(sql, args);
      return rows.map(sql2Reply);
    }
  );
});

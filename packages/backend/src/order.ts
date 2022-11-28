import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fp from "fastify-plugin";
import _ from "lodash-es";
import { QueryResult } from "pg";
import { query, transaction } from "./db";
import { createSchema } from "./schema";
import { J_SCHEMA_COURIER, J_SCHEMA_DISH, J_SCHEMA_ORDER, J_SCHEMA_SHOP, SCHEMA_DISH_LIST, SCHEMA_ORDER_LIST } from "./schema_def";
import { sql2Reply, SqlDish, SqlOrder, SqlShop } from "./sql_type";

const SCHEMA_SUBMIT = createSchema({
  response: {
    type: "array",
    items: {
      type: "number",
    },
  },
} as const);

const SCHEMA_ORDER_SHOP = createSchema({
  params: {
    id: {
      type: "number"
    }
  },
  response: J_SCHEMA_SHOP
} as const);

const SCHEMA_ORDER_COUR = createSchema({
  params: {
    id: {
      type: "number"
    }
  },
  response: J_SCHEMA_COURIER
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

        // Clear the shopping car
        await client.query(
          `
DELETE FROM shopping_car
    WHERE cust_id = $1;`,
          [id]
        );

        // Create orders and contain relations
        (result = await client.query(
          `
WITH o AS (
    INSERT INTO orders (cust_id, shop_id)
        SELECT DISTINCT ${id}, shop_id FROM t
        RETURNING order_id, shop_id)
INSERT INTO contain (dish_id, order_id, contain_num)
    SELECT dish_id, order_id, car_num
        FROM t NATURAL JOIN o
    RETURNING order_id`));
      });
      if (!result || !result.rowCount) {
        return rep.code(400).send({
          message: "Shopping car is empty."
        });
      }
      return _.uniq(result.rows.map((r) => r.order_id));
    }
  );

  fastify.get("/orders", {
    schema: SCHEMA_ORDER_LIST,
    preHandler: [fastify.verifyJwt]
  }, async (req) => {
    const { id, role } = req.user;
    if (role === "customer") {
      const { rows } = await query<SqlOrder>(`SELECT * FROM orders WHERE cust_id = $1`, [id]);
      return rows.map(sql2Reply);
    }
    throw new Error("not impl");
  });

  fastify.get("/order/:id/dishes", {
    schema: SCHEMA_DISH_LIST,
    preHandler: [fastify.verifyJwt]
  }, async (req) => {
    const { id } = req.params;
    const { id: userId, role } = req.user;
    let sql = `
SELECT dish_id, shop_id, dish_name, dish_value, dish_score, dish_sales
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
  });
});

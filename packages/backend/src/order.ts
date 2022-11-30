import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fp from "fastify-plugin";
import _ from "lodash-es";
import dayjs from "dayjs";
import { QueryResult } from "pg";
import { query, transaction } from "./db";
import { createSchema } from "./schema";
import {
  J_SCHEMA_SUCCESS,
  SCHEMA_DISH_LIST,
  SCHEMA_ORDER_LIST,
} from "./schema_def";
import {
  sql2Reply,
  SqlCourier,
  SqlDish,
  SqlOrder,
  SqlOrderDetailed,
} from "./sql_type";

const SCHEMA_SUBMIT = createSchema({
  body: {
    type: "object",
    properties: {
      order_destination: { type: "string" },
    },
    required: ["order_destination"],
    additionalProperties: false,
  },
  response: {
    type: "array",
    items: {
      type: "number",
    },
  },
} as const);

const SCHEMA_CONTAIN = createSchema({
  params: {
    id: {
      type: "number",
    },
  },
  response: {
    type: "array",
    items: {
      type: "object",
      properties: {
        dish_id: { type: "number" },
        dish_name: { type: "string" },
        dish_value: { type: "number" },
        contain_num: { type: "number" },
      },
      required: ["dish_id", "dish_name", "dish_value", "contain_num"],
      additionalProperties: false,
    },
  },
} as const);

const SCHEMA_NEXT = createSchema({
  params: {
    id: {
      type: "number",
    },
  },
  response: J_SCHEMA_SUCCESS,
});

const ORDER_STATE = {
  WAITING: 0,
  ACCEPTED: 1,
  COURIER_RECEIVED: 2,
  COURIER_DELIVERING: 3,
  COURIER_ARRIVED: 4,
  COMPLETED: 5,
  CANCELED: 6,
} as const;

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
        return rep.code(403).send({
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
      schema: SCHEMA_CONTAIN,
      preHandler: [fastify.verifyJwt],
    },
    async (req) => {
      const { id } = req.params;
      const { id: userId, role } = req.user;
      let sql = `
SELECT dish_id, dish_name, dish_value, contain_num
    FROM orders NATURAL JOIN contain NATURAL JOIN dish
    WHERE order_id = $1`;
      const args = [id, userId];
      if (role === "courier") {
        sql += ` AND cour_id = $2 OR cour_id IS NULL`;
      } else if (role === "customer") {
        sql += ` AND cust_id = $2`;
      } else if (role === "shop") {
        sql += ` AND shop_id = $2`;
      } else {
        args.pop();
      }
      const { rows } = await query<{
        dish_id: number;
        dish_name: string;
        dish_value: number;
        contain_num: number;
      }>(sql, args);
      return rows;
    }
  );
  fastify.post(
    "/order/:id/next",
    {
      schema: SCHEMA_NEXT,
      preHandler: [fastify.verifyJwt],
    },
    async (req, rep) => {
      const { id, role } = req.user;
      const { id: order_id } = req.params;
      const { rows, rowCount } = await query<SqlOrder>(
        `
SELECT * FROM orders WHERE order_id = $1`,
        [order_id]
      );
      if (!rowCount) {
        return rep.code(404).send({
          message: "No such order.",
        });
      }
      const order = rows[0];
      if (role === "customer" && order.cust_id === id) {
        if (order.order_state === ORDER_STATE.WAITING) {
          // cancel
          await query(
            `UPDATE orders SET order_state = 6 WHERE order_id = $1;`,
            [order_id]
          );
        } else if (order.order_state === ORDER_STATE.COURIER_ARRIVED) {
          await query(
            `UPDATE orders SET order_state = 5 WHERE order_id = $1;`,
            [order_id]
          );
        } else {
          return rep.code(409).send({
            message: "The state of this order cannot be modified by you.",
          });
        }
      } else if (role === "courier" && order.cour_id === null) {
        const { rows } = await query<SqlCourier>(
          `SELECT cour_temperature, cour_covid FROM courier WHERE cour_id = $1`,
          [id]
        );
        if (
          rows[0].cour_temperature === null ||
          rows[0].cour_temperature > 37
        ) {
          return rep.code(451).send({
            message: "Temperature is abnormal. You cannot accept new orders.",
          });
        }
        const covidDate = dayjs(rows[0].cour_covid ?? "1970-01-01").add(
          48,
          "h"
        );
        console.log(covidDate.format("YYYY-MM-DD"));
        console.log(dayjs().format("YYYY-MM-DD"));
        if (covidDate.isBefore(dayjs())) {
          return rep.code(451).send({
            message:
              "Your COVID-PCR is outdated. You cannot accept new orders.",
          });
        }
        // accept
        await query(
          `UPDATE orders SET (cour_id, order_state) = ($1::INTEGER, 1) WHERE order_id = $2`,
          [id, order_id]
        );
      } else if (role === "courier" && order.cour_id === id) {
        if (
          (
            [
              ORDER_STATE.ACCEPTED,
              ORDER_STATE.COURIER_RECEIVED,
              ORDER_STATE.COURIER_DELIVERING,
            ] as number[]
          ).includes(order.order_state)
        ) {
          await query(
            `UPDATE orders SET order_state = order_state + 1 WHERE order_id = $1`,
            [order_id]
          );
        } else {
          return rep.code(409).send({
            message: "The state of this order cannot be modified by you.",
          });
        }
      } else {
        return rep.code(403).send({
          message: "Only customers and couriers can update orders.",
        });
      }
      return {
        success: true as const,
      };
    }
  );
});

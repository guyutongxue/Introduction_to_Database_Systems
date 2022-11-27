import { env } from "node:process";
import fp from "fastify-plugin";
import md5 from "md5";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { query } from "./db";
import { createSchema } from "./schema";
import { J_SCHEMA_SHOP, J_SCHEMA_SUCCESS } from "./schema_def";
import { sql2Reply, SqlCourier, SqlCustomer, SqlShop } from "./sql_type";

const SCHEMA_LOGIN = createSchema({
  body: {
    type: "object",
    properties: {
      phone: {
        type: "string",
      },
      password: {
        type: "string",
      },
    },
    required: ["phone", "password"],
    additionalProperties: false,
  },
  response: {
    type: "object",
    properties: {
      token: {
        type: "string",
      },
      role: {
        type: "string",
        enum: ["customer", "courier", "shop", "admin"],
      },
    },
    required: ["token", "role"],
    additionalProperties: false,
  },
} as const);

type SqlSelectUserResult = {
  phone: string;
  password: string;
  role: "customer" | "courier" | "shop";
};

const SCHEMA_INFO = createSchema({
  response: {
    oneOf: [
      {
        type: "object",
        properties: {
          cust_id: {
            type: "number",
          },
          cust_name: {
            type: "string",
          },
          id: {
            type: "string",
          },
          cust_birth: {
            type: "string",
          },
          cust_gender: {
            type: "number",
          },
          cust_phone: {
            type: "string",
          },
          cust_email: {
            type: "string",
          },
          cust_account: {
            type: "string",
          },
        },
        required: ["cust_id", "cust_name", "cust_phone"],
        additionalProperties: false,
      },
      J_SCHEMA_SHOP,
      {
        type: "object",
        properties: {
          cour_id: {
            type: "number",
          },
          cour_name: {
            type: "string",
          },
          cour_phone: {
            type: "string",
          },
          cour_living: {
            type: "string",
          },
          cour_onboarding_time: {
            type: "string",
          },
          cour_temperature: {
            type: "number",
          },
          cour_covid: {
            type: "string",
          },
        },
        required: [
          "cour_id",
          "cour_name",
          "cour_phone",
          "cour_onboarding_time",
        ],
        additionalProperties: false,
      },
      {
        type: "object",
        properties: {
          admin: {
            const: true,
          },
        },
        required: ["admin"],
        additionalProperties: false,
      },
    ],
  },
} as const);

const SCHEMA_UPDATE_INFO = createSchema({
  body: {
    anyOf: [
      {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          cust_birth: {
            type: "string"
          },
          cust_gender: {
            type: "number"
          },
          cust_email: {
            type: "string",
          },
          cust_account: {
            type: "string",
          },
          cust_password: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
      {
        type: "object",
        properties: {
          shop_name: {
            type: "string",
          },
          shop_password: {
            type: "string",
          },
          shop_location: {
            type: "string",
          },
          delivery_range: {
            type: "string",
          },
          business_status: {
            type: "number",
          },
        },
        additionalProperties: false,
      },
      {
        type: "object",
        properties: {
          cour_name: {
            type: "string",
          },
          cour_living: {
            type: "string",
          },
          cour_onboarding_time: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    ],
  },
  response: J_SCHEMA_SUCCESS,
} as const);

export default fp(async function (ins) {
  const fastify = ins.withTypeProvider<JsonSchemaToTsProvider>();
  fastify.post(
    "/user/login",
    {
      schema: SCHEMA_LOGIN,
    },
    async (req, rep) => {
      const { phone, password } = req.body;
      if (phone === env.ADMIN_PHONE) {
        if (password === env.ADMIN_PASSWORD) {
          return {
            token: fastify.signJwt(phone, "admin"),
            role: "admin" as const,
          };
        } else {
          rep.code(401).send({
            message: "Wrong password.",
          });
          return;
        }
      }
      const { rows, rowCount } = await query<SqlSelectUserResult>(
        `SELECT * FROM
    (
        (SELECT cust_phone AS phone, cust_password AS password, 'customer' AS role FROM customer)
        UNION
        (SELECT cour_phone AS phone, cour_password AS password, 'courier' AS role FROM courier)
        UNION
        (SELECT shop_phone AS phone, shop_password AS password, 'shop' AS role FROM shop)
    ) AS users
    WHERE phone = $1`,
        [phone]
      );
      if (!rowCount) {
        rep.code(401).send({
          message: "Account not exists.",
        });
        return;
      }
      if (md5(password) !== rows[0].password) {
        rep.code(401).send({
          message: "Wrong password.",
        });
        return;
      }
      const role = rows[0].role;
      return {
        token: fastify.signJwt(phone, role),
        role,
      };
    }
  );
  fastify.get(
    "/user/info",
    {
      schema: SCHEMA_INFO,
      preHandler: [fastify.verifyJwt],
    },
    async (req, rep) => {
      const { phone, role } = req.user;
      if (role === "customer") {
        const { rows, rowCount } = await query<SqlCustomer>(
          `SELECT cust_id, cust_name, id, cust_birth, cust_gender, cust_phone, cust_email, cust_account
    FROM customer
    WHERE cust_phone = $1`,
          [phone]
        );
        if (!rowCount) {
          rep.code(404).send({
            message: "User not found.",
          });
          return;
        }
        return sql2Reply(rows[0]);
      } else if (role === "shop") {
        const { rows, rowCount } = await query<SqlShop>(
          `SELECT shop_id, shop_name, shop_location, shop_phone, delivery_range, business_status
    FROM shop
    WHERE shop_phone = $1`,
          [phone]
        );
        if (!rowCount) {
          rep.code(404).send({
            message: "User not found.",
          });
          return;
        }
        return sql2Reply(rows[0]);
      } else if (role === "courier") {
        const { rows, rowCount } = await query<SqlCourier>(
          `SELECT cour_id, cour_name, cour_phone, cour_living, cour_temperature, cour_covid
    FROM courier
    WHERE cour_phone = $1`,
          [phone]
        );
        if (!rowCount) {
          rep.code(404).send({
            message: "User not found.",
          });
          return;
        }
        return sql2Reply(rows[0]);
      } else {
        return {
          admin: true as const,
        };
      }
    }
  );
  fastify.post(
    "/user/info",
    {
      schema: SCHEMA_UPDATE_INFO,
      preHandler: [fastify.verifyJwt],
    },
    async (req, rep) => {
      const { phone, role } = req.user;
      const phoneCol = role.substring(0, 4) + "_phone";
      const passwordCol = role.substring(0, 4) + "_password";
      let sql = `UPDATE ${role}\n`;
      let argIndex = 1;
      const args = [];
      for (const [k, v] of Object.entries(req.body)) {
        if (!v) continue;
        if (role === "customer" && ["cust_name", "id", "cust_birth", "cust_gender"].includes(k)) {
          sql += `    SET ${k} = COALESCE(${k}, $${argIndex++})\n`;
        } else {
          sql += `    SET ${k} = $${argIndex++}`;
        }
        if (k === passwordCol) {
          args.push(md5(v as string));
        } else {
          args.push(v);
        }
      }
      if (args.length === 0) {
        return rep.code(401).send({
          message: "No updated field."
        });
      }
      sql += `    WHERE ${phoneCol} = $${argIndex++}`;
      args.push(phone);
      console.log(sql);
      await query(sql, args);
      return {
        success: true as const
      };
    }
  );
});

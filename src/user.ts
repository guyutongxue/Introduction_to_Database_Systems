import { env } from "node:process";
import fp from "fastify-plugin";
import md5 from "md5";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { query } from "./db";
import { JSONSchema } from "json-schema-to-ts";

type Schema = {
  body: JSONSchema,
  response: {
    [key in string | number]: JSONSchema
  }
};

function createSchema<T extends Schema>(schema: T) {
  return schema;
}

const LOGIN_SCHEMA = createSchema({
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
  },
  response: {
    "2xx": {
      type: "object",
      properties: {
        token: {
          type: "string",
        },
        role: {
          type: "string",
          enum: ["customer", "courier", "shop", "admin"]
        }
      },
      required: ["token", "role"],
      additionalProperties: false
    },
    "4xx": {
      type: "object",
      properties: {
        message: {
          type: "string"
        }
      },
      required: ["message"],
      additionalProperties: false
    }
  }
} as const);

const SQL_SELECT_USER = `SELECT * FROM
    (
        (SELECT cust_phone AS phone, cust_password AS password, 'customer' AS role FROM customer)
        UNION
        (SELECT cour_phone AS phone, cour_password AS password, 'courier' AS role FROM courier)
        UNION
        (SELECT shop_phone AS phone, shop_password AS password, 'shop' AS role FROM shop)
    ) AS users
    WHERE phone = $1`;
type SqlSelectUserResult = {
  phone: string,
  password: string,
  role: "customer" | "courier" | "shop",
};

export default fp(async function (ins) {
  const fastify = ins.withTypeProvider<JsonSchemaToTsProvider>();
  fastify.post(
    "/login",
    {
      schema: LOGIN_SCHEMA,
    },
    async (req, rep) => {
      const { phone, password } = req.body;
      if (phone === env.ADMIN_PHONE) {
        if (password === env.ADMIN_PASSWORD) {
          return {
            token: fastify.signJwt(phone),
            role: "admin" as const,
          };
        } else {
          rep.code(401).send({
            message: "Wrong password.",
          });
          return;
        }
      }
      const { rows } = await query<SqlSelectUserResult>(SQL_SELECT_USER, [phone]);
      if (rows.length === 0) {
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
      return {
        token: fastify.signJwt(phone),
        role: rows[0].role,
      };
    }
  );
});

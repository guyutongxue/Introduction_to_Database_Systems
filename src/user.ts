import { env } from "node:process";
import fp from "fastify-plugin";
import md5 from "md5";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { query } from "./db";
import { createSchema } from "./schema";
import { J_SCHEMA_SHOP } from "./schema_def";
import { SqlCourier, SqlCustomer, SqlShop } from "./sql_type";

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
  phone: string;
  password: string;
  role: "customer" | "courier" | "shop";
};

const SCHEMA_INFO = createSchema({
  params: {
    role: {
      type: "string",
      enum: ["customer", "shop", "courier", "admin"],
    },
  },
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
const SQL_SELECT_CUST = `SELECT * FROM
    customer
    WHERE cust_phone = $1`;
const SQL_SELECT_SHOP = `SELECT * FROM
    shop
    WHERE shop_phone = $1`;
const SQL_SELECT_COUR = `SELECT * FROM
    courier
    WHERE cour_phone = $1`;

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
        SQL_SELECT_USER,
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
    "/user/info/:role",
    {
      schema: SCHEMA_INFO,
      preHandler: [fastify.verifyJwt],
    },
    async (req, rep) => {
      const { role } = req.params;
      const { phone } = req.user;
      if (role === "customer") {
        const { rows, rowCount } = await query<SqlCustomer>(
          SQL_SELECT_CUST,
          [phone]
        );
        if (!rowCount) {
          rep.code(404).send({
            message: "User not found.",
          });
          return;
        }
        const {
          cust_id,
          cust_name,
          id,
          cust_birth,
          cust_gender,
          cust_phone,
          cust_email,
          cust_account,
        } = rows[0];
        return {
          cust_id,
          cust_name,
          id: id ?? undefined,
          cust_birth: cust_birth?.toISOString() ?? undefined,
          cust_gender: cust_gender ?? undefined,
          cust_phone,
          cust_account: cust_account ?? undefined,
          cust_email: cust_email ?? undefined,
        };
      } else if (role === "shop") {
        const { rows, rowCount } = await query<SqlShop>(
          SQL_SELECT_SHOP,
          [phone]
        );
        if (!rowCount) {
          rep.code(404).send({
            message: "User not found.",
          });
          return;
        }
        const {
          shop_id,
          shop_name,
          shop_location,
          shop_phone,
          delivery_range,
          business_status,
        } = rows[0];
        return {
          shop_id,
          shop_name,
          shop_location: shop_location ?? undefined,
          shop_phone,
          delivery_range: delivery_range ?? undefined,
          business_status,
        };
      } else if (role === "courier") {
        const { rows, rowCount } = await query<SqlCourier>(SQL_SELECT_COUR, [
          phone,
        ]);
        if (!rowCount) {
          rep.code(404).send({
            message: "User not found.",
          });
          return;
        }
        const {
          cour_id,
          cour_name,
          cour_phone,
          cour_living,
          cour_onboarding_time,
          cour_temperature,
          cour_covid,
        } = rows[0];
        return {
          cour_id,
          cour_name,
          cour_phone,
          cour_living: cour_living ?? undefined,
          cour_onboarding_time: cour_onboarding_time.toISOString(),
          cour_temperature: cour_temperature ?? undefined,
          cour_covid: cour_covid?.toISOString() ?? undefined,
        };
      } else {
        return {
          admin: true as const,
        };
      }
    }
  );
});

import { createSchema } from "./schema";

export const J_SCHEMA_SHOP = {
  type: "object",
  properties: {
    shop_id: {
      type: "number",
    },
    shop_name: {
      type: "string",
    },
    shop_location: {
      type: "string",
    },
    shop_phone: {
      type: "string",
    },
    delivery_range: {
      type: "string",
    },
    business_status: {
      type: "number",
    },
  },
  required: ["shop_id", "shop_name", "shop_phone", "business_status"],
  additionalProperties: false,
} as const;

export const J_SCHEMA_COURIER = {
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
  required: ["cour_id", "cour_name", "cour_phone", "cour_onboarding_time"],
  additionalProperties: false,
} as const;

export const J_SCHEMA_DISH = {
  type: "object",
  properties: {
    dish_id: {
      type: "number",
    },
    shop_id: {
      type: "number",
    },
    dish_name: {
      type: "string",
    },
    dish_value: {
      type: "number",
    },
    dish_sales: {
      type: "number",
    },
  },
  required: ["dish_id", "shop_id", "dish_name", "dish_value", "dish_sales"],
  additionalProperties: false,
} as const;

export const J_SCHEMA_SUCCESS = {
  type: "object",
  properties: {
    success: {
      const: true,
    },
  },
  required: ["success"],
  additionalProperties: false,
} as const;

export const J_SCHEMA_ORDER_DETAILED = {
  type: "object",
  properties: {
    order_id: { type: "number" },
    cust_id: { type: "number" },
    cust_name: { type: "string" },
    shop_id: { type: "number" },
    shop_name: { type: "string" },
    cour_id: { type: "number" },
    order_begin_time: { type: "string" },
    order_state: { type: "number" },
  },
  required: [
    "order_id",
    "cust_id",
    "shop_id",
    "order_begin_time",
    "order_state",
  ],
  additionalProperties: false,
} as const;

export const SCHEMA_DISH_LIST = createSchema({
  params: {
    id: {
      type: "string",
    },
  },
  response: {
    type: "array",
    items: J_SCHEMA_DISH,
  },
} as const);

export const SCHEMA_ORDER_LIST = createSchema({
  response: {
    type: "array",
    items: J_SCHEMA_ORDER_DETAILED,
  },
} as const);

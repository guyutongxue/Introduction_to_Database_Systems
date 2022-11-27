/* eslint-disable */
import { FastifySchema } from "fastify";
import type { JSONSchema } from "json-schema-to-ts";
import type { Union } from "ts-toolbelt";

interface SchemaInput {
  body?: JSONSchema;
  // querystring?: Record<string, JSONSchema>;
  params?: Record<string, JSONSchema>;
  response?: JSONSchema;
}

export const ERROR_RESPONSE = {
  type: "object",
  properties: {
    message: {
      type: "string",
    },
  },
  required: ["message"],
} as const;

type ToSchema<T extends Record<string, unknown> | undefined> =
  T extends undefined
    ? undefined
    : {
        type: "object";
        properties: T;
        required: Union.ListOf<keyof T>;
      };

interface SchemaOutput<Input extends SchemaInput> extends FastifySchema {
  body: Input["body"];
  params: ToSchema<Input["params"]>;
  response: {
    default: Input["response"];
    "4xx": typeof ERROR_RESPONSE;
    500: typeof ERROR_RESPONSE;
  };
}

export function createSchema<T extends SchemaInput>(input: T): SchemaOutput<T> {
  return {
    body: input.body,
    params: (input.params
      ? {
          type: "object",
          properties: input.params,
          required: Object.keys(input.params),
        }
      : undefined) as any,
    response: {
      default: input.response,
      "4xx": ERROR_RESPONSE,
      500: ERROR_RESPONSE,
    },
  };
}

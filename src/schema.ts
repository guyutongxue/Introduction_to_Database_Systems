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
  additionalProperties: false,
} as const;

interface SchemaOutput<Input extends SchemaInput> extends FastifySchema {
  body: Input["body"];
  params: Input["params"] extends undefined
    ? undefined
    : {
        type: "object";
        properties: Input["params"];
        required: Union.ListOf<keyof Input["params"]>;
      };
  response: {
    default: Input["response"];
    "4xx": typeof ERROR_RESPONSE;
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
    },
  };
}

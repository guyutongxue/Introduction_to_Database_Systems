/* eslint-disable */
import { FastifySchema } from "fastify";
import { JSONSchema } from "json-schema-to-ts";

interface SchemaInput {
  body?: JSONSchema;
  // querystring?: Record<string, JSONSchema>;
  params?: Record<string, JSONSchema>;
  response?: JSONSchema;
}

// https://stackoverflow.com/questions/55127004
// prettier-ignore
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
// prettier-ignore
type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never;
// prettier-ignore
type Push<T extends any[], V> = [...T, V];
// prettier-ignore
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;

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
        required: TuplifyUnion<keyof Input["params"]>;
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

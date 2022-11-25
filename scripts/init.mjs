#!/bin/env node
// @ts-check
import { faker } from "@faker-js/faker/locale/zh_CN";
import { fakeIdCode } from "./fake_id.mjs";
import { pinyin } from "pinyin";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import moment from "moment";
import md5 from "md5";
import { fakeShop } from "./fake_shop.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.join(__dirname, "init.sql");
if (existsSync(OUTPUT_FILE)) {
  unlinkSync(OUTPUT_FILE);
}
async function emit(/** @type {string} */ value) {
  writeFileSync(OUTPUT_FILE, value, { flag: "a" });
}

const SCHEMA_SQL = readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
emit(SCHEMA_SQL);

/**
 *
 * @param {string} table
 * @param {string[]} keys
 * @param {number} size
 * @param {() => Record<string, unknown>} generator
 */
function toSql(table, keys, size, generator) {
  emit(`INSERT INTO ${table} (${keys.join(", ")}) VALUES\n`);
  Array(size)
    .fill(0)
    .forEach((_, i) => {
      const obj = generator();
      let password = "";
      emit("    (");
      emit(
        keys
          .map((k) => {
            const v = obj[k];
            if (v instanceof Date) {
              return moment(v).format("[TIMESTAMP] 'YYYY-MM-DD hh:mm:ss'");
            } else if (typeof v === "number") {
              return v;
            } else if (typeof v === "string") {
              if (k.endsWith("password")) {
                password = v;
                return `'${md5(v)}'`;
              } else {
                return `'${v}'`;
              }
            }
          })
          .join(", ")
      );
      emit(`)${i === size - 1 ? ";" : ","} -- ${password}\n`);
    });
  emit("\n");
}

/**
 * @param name {string}
 * @return {[string, string]}
 */
function nameToAscii(name) {
  const [ln, ...fn] = pinyin(name, { segment: false, style: "normal" });
  return [ln.join(), fn.flat().join("")];
}

function createCustomer() {
  const name = `${faker.name.lastName()}${faker.name.firstName()}`;
  const [ln, fn] = nameToAscii(name);
  const birth = faker.date.birthdate();
  const isFemale = Math.random() > 0.5;
  return {
    cust_name: name,
    id: fakeIdCode({ birth, gender: isFemale ? "F" : "M" }),
    cust_birth: birth,
    cust_gender: Number(isFemale),
    cust_phone: faker.phone.number(),
    cust_email: faker.internet.email(fn, ln),
    cust_account: faker.internet.userName(ln, fn),
    cust_password: faker.internet.password(),
  };
}
const CUSTOMER_KEYS = [
  "cust_name",
  "id",
  "cust_birth",
  "cust_gender",
  "cust_phone",
  "cust_email",
  "cust_account",
  "cust_password",
];
const CUSTOMER_NUM = 50;
toSql("customer", CUSTOMER_KEYS, CUSTOMER_NUM, createCustomer);

function createShop() {
  const city = `${faker.address.state()}${faker.address.city()}`;
  return {
    shop_name: fakeShop(),
    shop_password: faker.internet.password(),
    shop_location: city + faker.address.streetAddress(),
    shop_phone: faker.phone.number(),
    delivery_range: city,
    business_status: Number(Math.random() > 0.1),
  };
}
const SHOP_KEYS = [
  "shop_name",
  "shop_password",
  "shop_location",
  "shop_phone",
  "delivery_range",
  "business_status"
];
const SHOP_NUM = 20;
toSql("shop", SHOP_KEYS, SHOP_NUM, createShop);

function createCourier() {
  return {
    cour_name: `${faker.name.lastName()}${faker.name.firstName()}`,
    cour_password: faker.internet.password(),
    cour_phone: faker.phone.number(),
    cour_living: `${faker.address.state()}${faker.address.city()}${faker.address.streetAddress()}`,
    cour_onboarding_time: faker.date.past(10),
    cour_temperature: faker.datatype.float({
      min: 35.0,
      max: 36.9
    }),
    cour_COVID: faker.date.recent(3)
  };
}
const COURIER_KEYS = [
  "cour_name",
  "cour_password",
  "cour_phone",
  "cour_living",
  "cour_onboarding_time",
  "cour_temperature",
  "cour_COVID"
];
const COURIER_NUM = 20;
toSql("courier", COURIER_KEYS, COURIER_NUM, createCourier);

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
import { fakeDish } from "./fake_dish.mjs";
import _ from "lodash-es";

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
 * @template {readonly string[]} T
 * @param {string} table
 * @param {T} keys
 * @param {number} size
 * @param {() => Record<T[number], unknown>} generator
 */
function toSql(table, keys, size, generator) {
  emit(`INSERT INTO ${table} (${keys.join(", ")}) VALUES\n`);
  _.range(size).forEach((_, i) => {
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
    delivry_range: city,
    business_status: Number(Math.random() > 0.1),
  };
}
const SHOP_KEYS = [
  "shop_name",
  "shop_password",
  "shop_location",
  "shop_phone",
  "delivery_range",
  "business_status",
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
      max: 36.9,
    }),
    cour_COVID: faker.date.recent(3),
  };
}
const COURIER_KEYS = [
  "cour_name",
  "cour_password",
  "cour_phone",
  "cour_living",
  "cour_onboarding_time",
  "cour_temperature",
  "cour_COVID",
];
const COURIER_NUM = 20;
toSql("courier", COURIER_KEYS, COURIER_NUM, createCourier);

const dishShopMap = [0];
function createDish() {
  const shopId = faker.datatype.number({
    min: 1,
    max: SHOP_NUM,
  });
  const sales = faker.datatype.number({
    min: 0,
    max: 1000,
  });
  dishShopMap.push(shopId);
  return {
    shop_id: shopId,
    dish_name: fakeDish(),
    dish_value: faker.datatype.number({
      min: 80,
      max: 5000,
    }),
    dish_score: Math.round(
      sales *
        faker.datatype.float({
          min: 3.0,
          max: 5.0,
        })
    ),
    dish_sales: sales,
  };
}
const DISH_KEYS = [
  "shop_id",
  "dish_name",
  "dish_value",
  "dish_score",
  "dish_sales",
];
const DISH_NUM = 200;
toSql("dish", DISH_KEYS, DISH_NUM, createDish);

export const ORDER_STATE = {
  WAITING: 0,
  ACCEPTED: 1,
  COURIER_RECEIVED: 2,
  COURIER_DELIVERING: 3,
  COURIER_ARRIVED: 4,
  COMPLETED: 5,
  CANCELED: 6,
};
const orderShopMap = [0];
function createOrder() {
  const shopId = faker.datatype.number({
    min: 1,
    max: SHOP_NUM,
  });
  orderShopMap.push(shopId);
  return {
    cust_id: faker.datatype.number({
      min: 1,
      max: CUSTOMER_NUM,
    }),
    shop_id: shopId,
    cour_id: faker.datatype.number({
      min: 1,
      max: COURIER_NUM,
    }),
    order_begin_time: faker.date.recent(60),
    order_state:
      Math.random() > 0.2 ? 5 : faker.helpers.arrayElement([0, 1, 2, 3, 4, 6]),
  };
}
const ORDER_KEYS = [
  "cust_id",
  "shop_id",
  "cour_id",
  "order_begin_time",
  "order_state",
];
const ORDER_NUM = 50;
toSql("orders", ORDER_KEYS, ORDER_NUM, createOrder);

const CONTAIN_KEYS = ["dish_id", "order_id", "contain_num"];
for (let i = 1; i <= ORDER_NUM; i++) {
  const dishes = faker.helpers.arrayElements(
    _.range(1, DISH_NUM).filter((j) => dishShopMap[j] === orderShopMap[i])
  );
  const num = faker.datatype.number({
    min: 1,
    max: 4,
  });
  const len = Math.min(dishes.length, num);
  let j = -1;
  toSql("contain", CONTAIN_KEYS, len, () => {
    j++;
    return {
      dish_id: dishes[j],
      order_id: i,
      contain_num:
        Math.random() > 0.2
          ? 1
          : faker.datatype.number({
              min: 2,
              max: 4,
            }),
    };
  });
}

/** @type {Set<number>} */
const allShoppingCar = new Set;
function createShoppingCar() {
  for (;;) {
    const dishId = faker.datatype.number({
      min: 1,
      max: DISH_NUM,
    });
    const custId = faker.datatype.number({
      min: 1,
      max: CUSTOMER_NUM,
    });
    if (allShoppingCar.has(custId * 256 + dishId)) continue;
    allShoppingCar.add(custId * 256 + dishId);
    return {
      dish_id: dishId,
      cust_id: custId,
      car_num: faker.datatype.number({
        min: 1,
        max: 4,
      }),
    };
  }
}
const SHOPPING_CAR_NUM = 50;
const SHOPPING_CAR_KEYS = ["dish_id", "cust_id", "car_num"];
toSql("shopping_car", SHOPPING_CAR_KEYS, SHOPPING_CAR_NUM, createShoppingCar);

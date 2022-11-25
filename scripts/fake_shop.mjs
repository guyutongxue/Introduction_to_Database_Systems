import { faker } from "@faker-js/faker/locale/zh_CN";

const TYPE = [
  "拌饭",
  "麻辣烫",
  "粥",
  "砂锅",
  "蛋糕",
  "羊棒骨",
  "火锅",
  "面馆",
  "烤串",
  "川菜",
  "咖啡",
  "烤鱼",
  "小吃",
  "烤鸭",
  "米粉",
  "酒馆",
  "日本料理",
  "凉皮",
  "海鲜",
  "奶茶",
  "羊汤",
  "披萨",
  "汉堡",
];

const FAMILY = ["氏", "记", "老师", "家", "大妈", "少爷", "阁"];

export function fakeShop() {
  if (Math.random() > 0.7) {
    return (
      faker.name.lastName() +
      faker.helpers.arrayElement(FAMILY) +
      faker.helpers.arrayElement(TYPE)
    );
  } else {
    const city = faker.address.city();
    return (
      city.substring(0, city.length - 1) + faker.helpers.arrayElement(TYPE)
    );
  }
}

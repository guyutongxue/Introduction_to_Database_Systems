export type UserLoginReq = {
  username: string;
  password: string;
};
export type Role = "customer" | "shop" | "courier" | "admin";
export type UserLoginRes = {
  token: string;
  role: Role;
};
export type UserInfoRes =
  | UserInfoCustRes
  | UserInfoShopRes
  | UserInfoCourRes
  | UserInfoShopRes
  | { admin: true };
export type UserInfoCustRes = {
  cust_id: number;
  cust_name: string;
  id?: string;
  cust_birth?: string; // ISO format
  cust_gender: number; // 0 for male, 1 for female
  cust_phone: number;
  cust_address?: string;
  cust_email?: string;
};
export type Shop = {
  shop_id: number;
  shop_name: string;
  shop_location?: string;
  shop_phone: string;
  delivery_range?: string;
  business_status: number; // 0 for off, 1 for on
};
export type UserInfoShopRes = Shop;
export type UserInfoCourRes = {
  cour_id: number;
  cour_name: string;
  cour_phone: string;
  cour_living?: string;
  cour_onboarding_time: string; // ISO format
  cour_temperature?: number;
  cour_covid?: string; // ISO format
};
export type ShopListRes = Shop[];
export type Dish = {
  dish_id: number;
  shop_id: number;
  dish_name: string;
  dish_value: number;
  dish_sales: number;
};
export type DishListRes = Dish[];
export type OrderListReq = {
  role: "customer" | "shop" | "courier" | "admin";
};
export const ORDER_STATE = {
  WAITING: 0,
  ACCEPTED: 1,
  COURIER_RECEIVED: 2,
  COURIER_DELIVERING: 3,
  COURIER_ARRIVED: 4,
  COMPLETED: 5,
  CANCELED: 6,
} as const;
export type OrderDetailed = {
  order_id: number;
  cust_id: number;
  cust_name: string;
  shop_id: number;
  shop_name: string;
  shop_location: string;
  cour_id: number;
  order_value: number;
  order_begin_time: string; // ISO format
  order_destination: string;
  order_state: number;
};
export type OrderListRes = OrderDetailed[];
export type ShoppingCarItem = {
  dish_id: number;
  dish_name: string;
  shop_id: number;
  shop_name: string;
  car_num: number;
  dish_value: number;
};
export type ShoppingCarGetRes = ShoppingCarItem[];
export type ShoppingCarSetRes = {
  success: true;
};
export type OrderSubmitRes = OrderDetailed;

export type ContainDetailed = {
  dish_id: number;
  dish_name: string;
  dish_value: number;
  contain_num: number;
};
export type OrderDishesRes = ContainDetailed[];

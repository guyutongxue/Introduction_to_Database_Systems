export interface SqlCustomer {
  cust_id: number;
  cust_name: string;
  id: string | null;
  cust_birth: Date | null;
  cust_gender: number | null;
  cust_phone: string;
  cust_email: string | null;
  cust_account: string | null;
  // cust_password: string;
}
export interface SqlShop {
  shop_id: number;
  shop_name: string;
  // shop_password: string;
  shop_location: string | null;
  shop_phone: string;
  delivery_range: string | null;
  business_status: number;
}
export interface SqlCourier {
  cour_id: number;
  cour_name: string;
  // cour_password: string;
  cour_phone: string;
  cour_living: string | null;
  cour_onboarding_time: Date;
  cour_temperature: number | null;
  cour_covid: Date | null;
}
export interface SqlDish {
  dish_id: number;
  shop_id: number;
  dish_name: string;
  dish_value: number;
  dish_sales: number;
}
export interface SqlOrderDetailed {
  order_id: number;
  cust_id: number;
  cust_name: string;
  shop_id: number;
  shop_name: string;
  cour_id: number | null;
  order_begin_time: Date;
  order_state: number;
}

type EraseDate<T> = T extends Date ? string : T;
type SqlToReply<T extends object> = {
  [k in keyof T]: T[k] extends {}
    ? EraseDate<T[k]>
    : NonNullable<EraseDate<T[k]>> | undefined;
};

/**
 * Convert NULL from sql to undefined
 */
export function sql2Reply<T extends object>(row: T): SqlToReply<T> {
  const target: any = {};
  for (const [k, v] of Object.entries(row)) {
    if (v !== null) {
      if (v instanceof Date) {
        target[k] = v.toISOString();
      } else {
        target[k] = v;
      }
    }
  }
  return target;
}

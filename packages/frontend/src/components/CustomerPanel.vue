<script setup lang="ts">
import type {
  UserInfoCustRes,
  Shop,
  ShoppingCarItem,
  OrderListRes,
} from "@/api";
import { HOST } from "@/config";
import axios from "axios";
import { onMounted } from "vue";

defineProps<{
  info: UserInfoCustRes;
}>();

let shops = $ref([] as Shop[]);
let car = $ref([] as ShoppingCarItem[]);
let orders = $ref([] as OrderListRes);

async function refreshShops() {
  const { data } = await axios.get<Shop[]>(`${HOST}/shops`);
  shops = data;
}
async function refreshCar() {
  const { data } = await axios.get<ShoppingCarItem[]>(`${HOST}/customer/car`);
  car = data;
}
async function refreshOrders() {
  const { data } = await axios.get<OrderListRes>(`${HOST}/orders`);
  orders = data;
}

onMounted(async () => {
  refreshShops();
  refreshCar();
  refreshOrders();
});
</script>

<template>
  <VRow>
    <VCol :cols="8">
      <VCard title="浏览商家">
        <VContainer>
          <div v-for="shop of shops" :key="shop.shop_id">
            {{ shop.shop_name }}
          </div>
        </VContainer>
      </VCard>
    </VCol>
    <VCol :cols="4">
      <VCard title="购物车">
        <VContainer>
          <div v-for="item of car" :key="item.dish_id">
            {{ item.dish_name }}
          </div>
        </VContainer>
      </VCard>
      <VCard class="mt-3" title="订单">
        <VContainer>
          <div v-for="item of orders" :key="item.order_id">
            {{ item.order_begin_time }}
          </div>
        </VContainer>
      </VCard>
    </VCol>
  </VRow>
</template>

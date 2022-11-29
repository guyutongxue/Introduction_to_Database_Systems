<script setup lang="ts">
import type { UserInfoCourRes, OrderDetailed } from "@/api";
import { HOST } from "@/config";
import axios from "axios";
import { onMounted } from "vue";
import OrderList from "./OrderList.vue";

defineProps<{
  info: UserInfoCourRes;
}>();

let freeOrders: OrderDetailed[] = $ref([]);
let myOrders: OrderDetailed[] = $ref([]);

async function refreshFreeOrders() {
  const { data } = await axios.get(`${HOST}/orders/free`);
  freeOrders = data;
}

async function refreshMyOrders() {
  const { data } = await axios.get(`${HOST}/orders`);
  myOrders = data;
}

onMounted(() => {
  refreshFreeOrders();
  refreshMyOrders();
});
</script>

<template>
  <OrderList class="mb-3" :orders="freeOrders" title="空闲订单" courier></OrderList>
  <OrderList :orders="myOrders" courier></OrderList>
</template>

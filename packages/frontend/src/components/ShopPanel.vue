<script setup lang="ts">
import type { UserInfoShopRes, Dish, OrderDetailed } from "@/api";
import { HOST } from "@/config";
import axios from "axios";
import { onMounted } from "vue";
import DishList from "./DishList.vue";
import OrderList from "./OrderList.vue";
import EditDishForm from "./EditDishForm.vue";

const listComponent: typeof DishList | undefined = $ref();

let showEditDialog = $ref(false);
let editDish: Dish | undefined = $ref();

const props = defineProps<{
  info: UserInfoShopRes;
}>();

function newDish() {
  editDish = undefined;
  showEditDialog = true;
}

function modifyDish(dish: Dish) {
  editDish = dish;
  showEditDialog = true;
}

async function onEditDone(result?: { name: string; value: number }) {
  showEditDialog = false;
  if (result) {
    if (editDish) {
      await axios.put(`${HOST}/shop/dish/${editDish?.dish_id}`, {
        dish_name: result.name,
        dish_value: result.value,
      });
    } else {
      await axios.post(`${HOST}/shop/dish`, {
        dish_name: result.name,
        dish_value: result.value,
      });
    }
    listComponent?.refreshDishes();
  }
}

async function deleteDish(dish: Dish) {
  await axios.delete(`${HOST}/shop/dish/${dish.dish_id}`);
  listComponent?.refreshDishes();
}

let myOrders = $ref([] as OrderDetailed[]);

async function refreshOrders() {
  const { data } = await axios.get(`${HOST}/orders`);
  myOrders = data;
}

onMounted(() => {
  refreshOrders();
});
</script>

<template>
  <VAlert
    v-if="info.shop_location === undefined"
    title="您还没有填写商铺地址"
    type="warning"
    class="mb-3"
  >
    客户将无法在您这里下单。请更新您的用户信息-商铺地址。
  </VAlert>
  <DishList
    ref="listComponent"
    :info="info"
    role="shop"
    @new="newDish"
    @modify="modifyDish"
    @delete="deleteDish"
  >
  </DishList>
  <OrderList class="mt-3" :orders="myOrders"></OrderList>
  <VDialog v-model="showEditDialog" :max-width="500">
    <EditDishForm
      :init-name="editDish?.dish_name ?? ''"
      :init-value="editDish?.dish_value ?? 0"
      @done="onEditDone"
    >
    </EditDishForm>
  </VDialog>
</template>

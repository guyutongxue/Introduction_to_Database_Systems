<script setup lang="ts">
import type { UserInfoShopRes, Dish } from "@/api";
import { HOST } from "@/config";
import axios from "axios";
import { onMounted } from "vue";
import DishList from "./DishList.vue";
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

onMounted(() => {});
</script>

<template>
  <DishList
    ref="listComponent"
    :info="info"
    role="shop"
    @new="newDish"
    @modify="modifyDish"
    @delete="deleteDish"
  ></DishList>
  <VDialog v-model="showEditDialog" :max-width="500">
    <EditDishForm
      :init-name="editDish?.dish_name ?? ''"
      :init-value="editDish?.dish_value ?? 0"
      @done="onEditDone"
    ></EditDishForm>
  </VDialog>
</template>

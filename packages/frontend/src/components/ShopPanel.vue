<script setup lang="ts">
import type { UserInfoShopRes, Dish } from "@/api";
import { HOST } from "@/config";
import axios from "axios";
import { onMounted } from "vue";
const props = defineProps<{
  info: UserInfoShopRes;
}>();

let menu = $ref([] as Dish[]);

async function refreshDishes() {
  const { data } = await axios.get<Dish[]>(`${HOST}/shop/${props.info.shop_id}/dishes`);
  menu = data;
}

onMounted(() => {
  refreshDishes();
});

</script>

<template>
  <VCard title="编辑菜单">
    <VContainer>
      <div v-for="dish of menu" :key="dish.dish_id">
        {{dish.dish_name}}
      </div>
    </VContainer>
  </VCard>
</template>

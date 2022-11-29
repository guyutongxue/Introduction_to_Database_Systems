<script setup lang="ts">
import type { Dish, UserInfoShopRes } from "@/api";
import { HOST } from "@/config";
import axios from "axios";
import { onMounted } from "vue";

const props = defineProps<{
  info: UserInfoShopRes;
  role: "customer" | "shop";
}>();
const emit = defineEmits<{
  (e: "closed"): void;
  (e: "addToCar", id: number): void;
  (e: "modify", dish: Dish): void;
  (e: "delete", dish: Dish): void;
  (e: "new"): void;
}>();

let dishes = $ref([] as Dish[]);

async function refreshDishes() {
  const { data } = await axios.get<Dish[]>(
    `${HOST}/shop/${props.info.shop_id}/dishes`
  );
  dishes = data;
}

defineExpose({ refreshDishes });

onMounted(() => {
  refreshDishes();
});
</script>

<template>
  <VCard>
    <VCardTitle v-if="role === 'customer'">
      <div class="flex w-full pt-3 items-center">
        <h2 class="flex-grow text-h3">{{ info.shop_name }}</h2>
        <VBtn icon="mdi-close" variant="plain" @click="emit('closed')"></VBtn>
      </div>
    </VCardTitle>
    <VCardTitle v-else> 编辑菜单 </VCardTitle>
    <VContainer>
      <div v-if="role === 'customer'" class="mb-2">
        <div><span class="font-bold">地址</span> {{ info.shop_location }}</div>
        <div><span class="font-bold">电话</span> {{ info.shop_phone }}</div>
      </div>
      <h4 class="text-grey">菜单</h4>
      <div v-for="dish of dishes" :key="dish.dish_id">
        <VDivider></VDivider>
        <div class="my-2 flex items-center">
          <div class="flex-grow">
            <div class="text-xl mb-2 mx-2">{{ dish.dish_name }}</div>
            <div class="text-grey">
              <VIcon icon="mdi-package-variant-closed"></VIcon>
              销量 {{ dish.dish_sales }}
            </div>
          </div>
          <div class="flex gap-2 items-center">
            <div class="text-primary text-xl">
              &yen; {{ dish.dish_value / 100 }}
            </div>
            <VBtn
              v-if="role === 'customer'"
              variant="tonal"
              color="success"
              @click="emit('addToCar', dish.dish_id)"
            >
              添加到购物车
            </VBtn>
            <template v-else>
              <VBtn
                variant="tonal"
                color="secondary"
                @click="emit('modify', dish)"
              >
                修改
              </VBtn>
              <VBtn
                variant="tonal"
                color="error"
                @click="emit('delete', dish)"
              >
                删除
              </VBtn>
            </template>
          </div>
        </div>
      </div>
    </VContainer>
    <template v-if="role === 'shop'">
      <VDivider></VDivider>
      <VCardActions>
        <VBtn variant="outlined" color="success" @click="emit('new')"
          >新建</VBtn
        >
      </VCardActions>
    </template>
  </VCard>
</template>

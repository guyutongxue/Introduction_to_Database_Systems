<script setup lang="ts">
import type { OrderDetailed } from "@/api";
import dayjs from "dayjs";

const props = defineProps<{
  courier?: boolean;
  title?: string;
  orders: OrderDetailed[];
}>();
</script>

<template>
  <VCard class="!overflow-auto" :title="title ?? '我的订单'">
    <VContainer>
      <template v-for="item of orders" :key="item.order_id">
        <div class="flex flex-row">
          <div class="flex-grow flex flex-row items-center">
            <div class="mx-2">
            {{ item.shop_name }}
            {{ item.shop_location }}
            </div>
            <div class="flex-grow relative h-[7px] mb-[7px] border-b-2 border-gray-500">
              <div
                class="w-3 h-3 absolute right-0 border-t-2 border-r-2 border-gray-500 rotate-45"
              ></div>
            </div>
            <div class="mx-2">
            {{ item.cust_name }}
            {{ item.order_destination }}
            </div>
          </div>
          <VBtn>详情</VBtn>
        </div>
        {{ dayjs(item.order_begin_time).fromNow() }}
        <VDivider></VDivider>
      </template>
    </VContainer>
  </VCard>
</template>

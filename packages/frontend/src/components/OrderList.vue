<script setup lang="ts">
import type { OrderDetailed } from '@/api';
import dayjs from "dayjs";

const props = defineProps<{
  courier?: boolean,
  title?: string, 
  orders: OrderDetailed[]
}>();

</script>

<template>
 
 <VCard class="!overflow-auto" :title="title ?? '我的订单'">
    <VContainer>
      <template v-for="item of orders" :key="item.order_id">
        {{ item.shop_name }} - {{ item.cust_name }}
        {{ dayjs(item.order_begin_time).fromNow() }}
        <VDivider></VDivider>
      </template>
    </VContainer>
  </VCard>
</template>

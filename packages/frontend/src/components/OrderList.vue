<script setup lang="ts">
import { ORDER_STATE, type OrderDetailed, type OrderDishesRes } from "@/api";
import { HOST } from "@/config";
import axios from "axios";
import dayjs from "dayjs";
import { computed, watch } from "vue";

const props = defineProps<{
  courier?: boolean;
  title?: string;
  orders: OrderDetailed[];
}>();

const emit = defineEmits<{
  (e: "next", orderId: number): void
}>();

const stateText: Record<number, string> = {
  [ORDER_STATE.WAITING]: "等待接单",
  [ORDER_STATE.ACCEPTED]: "已接单",
  [ORDER_STATE.COURIER_RECEIVED]: "骑手已到达商家",
  [ORDER_STATE.COURIER_DELIVERING]: "配送中",
  [ORDER_STATE.COURIER_ARRIVED]: "骑手已送达",
  [ORDER_STATE.COMPLETED]: "已完成",
  [ORDER_STATE.CANCELED]: "已取消",
};

const courierNextAction: Record<number, string> = {
  [ORDER_STATE.WAITING]: "接单",
  [ORDER_STATE.ACCEPTED]: "到达商家",
  [ORDER_STATE.COURIER_RECEIVED]: "收到商品",
  [ORDER_STATE.COURIER_DELIVERING]: "送达",
};
const customerNextAction: Record<number, string> = {
  [ORDER_STATE.WAITING]: "取消订单",
  [ORDER_STATE.COURIER_ARRIVED]: "确认收货",
};
let nextAction = computed(() =>
  props.courier ? courierNextAction : customerNextAction
);

let showDetail = $ref(false);
let detailedOrder = $ref(props.orders[0]);
let detailedDishes = $ref([] as OrderDishesRes);

watch(() => props.orders, (orders) => {
  if (showDetail) {
    const thisOrder = orders.find((o) => o.order_id === detailedOrder.order_id);
    if (thisOrder) {
      detailedOrder = thisOrder;
    } else {
      showDetail = false;
    }
  }
});

async function openDetail(order: OrderDetailed) {
  detailedOrder = order;
  showDetail = true;
  const { data } = await axios.get<OrderDishesRes>(
    `${HOST}/order/${order.order_id}/dishes`
  );
  detailedDishes = data;
}
async function doNext() {
  emit("next", detailedOrder.order_id);
}
</script>

<template>
  <VCard class="!overflow-auto" :title="title ?? '我的订单'">
    <VContainer>
      <div v-for="(item, i) of orders" :key="item.order_id">
        <VDivider v-if="i" class="my-1"></VDivider>
        <div class="flex flex-row items-center">
          <div class="flex-grow flex flex-col">
            <span class="text-sm text-grey">
              {{ dayjs(item.order_begin_time).fromNow() }} &CenterDot;
              {{ stateText[item.order_state] }}
            </span>
            <div class="flex-grow flex flex-row items-center">
              <div class="mx-2 flex flex-col items-center">
                <span class="text-xl"> {{ item.shop_name }} </span>
                <span class="text-sm text-grey">
                  {{ item.shop_location }}
                </span>
              </div>
              <!-- array -->
              <div
                class="flex-grow relative h-[7px] mb-[7px] border-b-2 border-gray-500"
              >
                <div
                  class="w-3 h-3 absolute right-0 border-t-2 border-r-2 border-gray-500 rotate-45"
                ></div>
              </div>
              <div class="mx-2 flex flex-col items-center">
                <span class="text-xl"> {{ item.cust_name }} </span>
                <span class="text-sm text-grey">
                  {{ item.order_destination }}
                </span>
              </div>
            </div>
          </div>
          <VBtn variant="plain" color="info" @click="openDetail(item)">
            详情
          </VBtn>
        </div>
      </div>
    </VContainer>
    <VDialog v-model="showDetail" class="sm:max-w-[70vw]">
      <VCard class="relative">
        <div class="absolute right-5 top-5">
          <VBtn
            v-if="nextAction[detailedOrder.order_state]"
            color="primary"
            size="large"
            @click="doNext"
          >
            {{ nextAction[detailedOrder.order_state] }}
          </VBtn>
        </div>
        <VCardTitle> 订单详情 </VCardTitle>
        <VCardText>
          <dl>
            <dt>订单编号</dt>
            <dd>{{ detailedOrder.order_id }}</dd>
            <dt>商家</dt>
            <dd>
              {{ detailedOrder.shop_name }} &nbsp;/&nbsp;
              {{ detailedOrder.shop_location }}
            </dd>
            <dt>顾客</dt>
            <dd>
              {{ detailedOrder.cust_name }} &nbsp;/&nbsp;
              {{ detailedOrder.order_destination }}
            </dd>
            <dt>订单金额</dt>
            <dd>&yen; {{ detailedOrder.order_value / 100 }}</dd>
            <dt>菜品列表</dt>
            <template v-for="dish of detailedDishes" :key="dish.dish_id">
              <dd>
                {{ dish.dish_name }} : &yen; {{ dish.dish_value / 100 }} &times;
                {{ dish.contain_num }}
              </dd>
            </template>
          </dl>
        </VCardText>
      </VCard>
    </VDialog>
  </VCard>
</template>

<style scoped>
dt {
  font-weight: bold;
}

dl,
dd {
  font-size: 0.9rem;
  margin-left: 2rem;
}

dd + dt {
  margin-top: 1em;
}
</style>

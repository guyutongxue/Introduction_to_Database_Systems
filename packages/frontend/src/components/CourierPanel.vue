<script setup lang="ts">
import type { UserInfoCourRes, OrderDetailed } from "@/api";
import { HOST } from "@/config";
import { checkNumber } from "@/util";
import axios from "axios";
import dayjs from "dayjs";
import { onMounted } from "vue";
import OrderList from "./OrderList.vue";

const props = defineProps<{
  info: UserInfoCourRes;
}>();

let freeOrders: OrderDetailed[] = $ref([]);
let myOrders: OrderDetailed[] = $ref([]);

let temperature = $ref(props.info.cour_temperature);
let covid = $ref(dayjs(props.info.cour_covid).format("YYYY-MM-DD"));

async function refreshFreeOrders() {
  const { data } = await axios.get(`${HOST}/orders/free`);
  freeOrders = data;
}

async function refreshMyOrders() {
  const { data } = await axios.get(`${HOST}/orders`);
  myOrders = data;
}
async function onNext(id: number) {
  await axios.post(`${HOST}/order/${id}/next`);
  refreshFreeOrders();
  refreshMyOrders();
}
async function updateHealth() {
  await axios.post(`${HOST}/courier/health`, {
    cour_temperature: temperature,
    cour_covid: new Date(covid).toISOString(),
  });
  window.location.reload();
}

onMounted(() => {
  refreshFreeOrders();
  refreshMyOrders();
});
</script>

<template>
  <VRow>
    <VCol :cols="12" :sm="6" :md="8">
      <OrderList
        class="mb-3"
        :orders="freeOrders"
        title="空闲订单"
        courier
        @next="onNext"
      ></OrderList>
    </VCol>
    <VCol :sm="6" :md="4">
      <VForm>
        <VCard>
          <VCardTitle>
            <VIcon icon="mdi-hospital-box" color="pink"></VIcon>
            更新健康信息
          </VCardTitle>
          <VCardText>
            <VTextField
              variant="underlined"
              color="primary"
              label="体温"
              v-model="temperature"
              autocomplete="off"
              :rules="[checkNumber]"
              required
            >
            </VTextField>
            <VTextField
              variant="underlined"
              color="primary"
              label="核酸检测日期"
              v-model="covid"
              autocomplete="off"
              type="date"
              required
            >
            </VTextField>
          </VCardText>
          <VDivider></VDivider>
          <VCardActions>
            <VBtn color="pink" @click="updateHealth"> 更新 </VBtn>
          </VCardActions>
        </VCard>
      </VForm>
    </VCol>
  </VRow>
  <VRow>
    <VCol>
      <OrderList :orders="myOrders" courier @next="onNext"></OrderList>
    </VCol>
  </VRow>
</template>

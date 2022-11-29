<script setup lang="ts">
import type {
  UserInfoCustRes,
  Shop,
  ShoppingCarItem,
  OrderListRes,
} from "@/api";
import { HOST } from "@/config";
import axios from "axios";
import { computed, onMounted } from "vue";
import DishList from "./DishList.vue";
import OrderList from "./OrderList.vue";
import _ from "lodash-es";

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

let searchWord = $ref("");
const filteredShops = computed(() =>
  shops.filter((s) => s.shop_name.includes(searchWord))
);

let isShowingShop = $ref(false);
let showingShop = $ref(shops[0]);
function showShop(s: Shop) {
  showingShop = s;
  isShowingShop = true;
}

const groupedCar = computed(() => _.groupBy(car, (d) => d.shop_id));
const carTotal = computed(
  () =>
    car.map((d) => d.dish_value * d.car_num).reduce((a, b) => a + b, 0) / 100
);

async function addToCar(dish_id: number) {
  await axios.post(`${HOST}/customer/car/insert`, { dish_id });
  refreshCar();
}
async function removeFromCar(dish_id: number) {
  await axios.post(`${HOST}/customer/car/delete`, { dish_id });
  refreshCar();
}
async function submitOrder() {
  const { data } = await axios.post<number[]>(`${HOST}/order`);
  console.log(data);
  refreshCar();
  refreshOrders();
}

onMounted(async () => {
  refreshShops();
  refreshCar();
  refreshOrders();
});
</script>

<template>
  <VRow>
    <VCol :cols="12" :sm="6" :md="8">
      <VCard>
        <VCardTitle>
          <div class="flex items-center">
            <h3 class="flex-grow">浏览商家</h3>
            <VTextField
              v-model="searchWord"
              prepend-inner-icon="mdi-magnify"
              density="compact"
              placeholder="搜索"
              hide-details
              clearable
            >
            </VTextField>
          </div>
        </VCardTitle>
        <VContainer>
          <template v-for="(shop, i) of filteredShops" :key="shop.shop_id">
            <VDivider v-if="i"></VDivider>
            <div class="my-2 flex items-center">
              <div class="flex-grow">
                <div class="text-xl mb-2 mx-2">{{ shop.shop_name }}</div>
                <div class="text-grey">
                  <VIcon icon="mdi-map-marker"></VIcon>
                  {{ shop.shop_location ?? "地址未知" }}
                  <VIcon icon="mdi-phone"></VIcon>
                  {{ shop.shop_phone }}
                </div>
              </div>
              <VBtn
                size="large"
                variant="tonal"
                color="primary"
                @click="showShop(shop)"
              >
                详情
              </VBtn>
            </div>
          </template>
        </VContainer>
      </VCard>
    </VCol>
    <VDialog v-model="isShowingShop" class="sm:max-w-[70vw]">
      <DishList
        :info="showingShop"
        role="customer"
        @closed="isShowingShop = false"
        @add-to-car="addToCar"
      >
      </DishList>
    </VDialog>
    <VCol :sm="6" :md="4">
      <div class="sm:sticky sm:top-4 sm:bottom-4 flex flex-col gap-4">
        <VCard title="购物车">
          <VCardText class="sm:max-h-[50vh] !overflow-auto">
            <div v-for="(v, k, i) of groupedCar" :key="k">
              <VDivider v-if="i" class="mt-2"></VDivider>
              <div class="text-sm text-grey mt-2">
                {{ v[0].shop_name }}
              </div>
              <VRow v-for="item of v" :key="item.dish_id">
                <VCol>{{ item.dish_name }}</VCol>
                <VCol class="flex items-center invisible hover:visible">
                  <VBtn
                    icon="mdi-minus"
                    size="sm"
                    variant="plain"
                    @click="removeFromCar(item.dish_id)"
                  >
                  </VBtn>
                  <div class="flex-grow text-center visible">
                    &yen; {{ item.dish_value / 100 }}
                    &times;
                    {{ item.car_num }}
                  </div>
                  <VBtn
                    icon="mdi-plus"
                    size="sm"
                    variant="plain"
                    @click="addToCar(item.dish_id)"
                  >
                  </VBtn>
                </VCol>
              </VRow>
            </div>
          </VCardText>
          <VCardActions>
            <span class="text-xl mx-2 text-primary flex-shrink-0"
              >&yen; {{ carTotal }}</span
            >
            <span class="text-grey text-sm">
              共 {{ car.length }} 个商品，{{ Object.keys(groupedCar).length }}
              个订单
            </span>
            <VSpacer></VSpacer>
            <VBtn
              color="secondary"
              :disabled="!car.length"
              @click="submitOrder"
            >
              结算
            </VBtn>
          </VCardActions>
        </VCard>
        <OrderList :orders="orders"></OrderList>
      </div>
    </VCol>
  </VRow>
</template>

<style scoped>
.shop-of-car {
  border-color: rgba(var(--v-theme-secondary), var(--v-activated-opacity));
}
</style>

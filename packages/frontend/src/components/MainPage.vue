<script setup lang="ts">
import type {
  Role,
  UserInfoCourRes,
  UserInfoCustRes,
  UserInfoRes,
  UserInfoShopRes,
} from "@/api";
import { HOST } from "@/config";
import axios from "axios";
import { onMounted } from "vue";
import CustomerPanel from "./CustomerPanel.vue";
import ShopPanel from "./ShopPanel.vue";
import CourierPanel from "./CourierPanel.vue";
import AdminPanel from "./AdminPanel.vue";

const ROLE_NAME = {
  customer: "顾客",
  shop: "商家",
  courier: "骑手",
  admin: "管理员",
};

const prop = defineProps<{
  userRole: Role;
}>();

const emit = defineEmits<{
  (e: "loggedOut"): void;
}>();

function logout() {
  localStorage.clear();
  emit("loggedOut");
}

let name = $ref("");
let info = $ref(null as UserInfoRes | null);

onMounted(async () => {
  try {
    const { data } = await axios.get<UserInfoRes>(`${HOST}/user/info`);
    console.log(data);
    info = data;
    if ("cust_id" in info) name = info.cust_name;
    else if ("shop_id" in info) name = info.shop_name;
    else if ("cour_id" in info) name = info.cour_name;
    else name = "管理员";
  } catch (e) {
    alert(`加载用户数据时出现错误：${e instanceof Error ? e.message : e}`);
  }
});
</script>

<template>
  <VContainer class="!pt-12">
    <header class="flex items-center justify-between">
      <h1 class="text-h4">
        欢迎您，{{ name }}！您的身份是 {{ ROLE_NAME[userRole] }}
      </h1>
      <VBtn @click="logout" variant="plain" color="error">注销</VBtn>
    </header>
    <div v-if="info" class="mt-12">
      <CustomerPanel
        v-if="userRole === 'customer'"
        :info="info as UserInfoCustRes"
      >
      </CustomerPanel>
      <ShopPanel v-if="userRole === 'shop'" :info="info as UserInfoShopRes">
      </ShopPanel>
      <CourierPanel
        v-if="userRole === 'courier'"
        :info="info as UserInfoCourRes"
      >
      </CourierPanel>
      <AdminPanel v-if="userRole === 'admin'"> </AdminPanel>
    </div>
  </VContainer>
</template>

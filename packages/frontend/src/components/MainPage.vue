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
import UpdateInfoForm from "./UpdateInfoForm.vue";

const ROLE_NAME = {
  customer: "顾客",
  shop: "商家",
  courier: "骑手",
  admin: "管理员",
};

const prop = defineProps<{
  role: Role;
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
const showUpdatedDialog = $ref(false);

async function refreshUserInfo() {
  const { data } = await axios.get<UserInfoRes>(`${HOST}/user/info`);
  console.log(data);
  info = data;
  if (info) {
    if ("cust_id" in info) name = info.cust_name;
    else if ("shop_id" in info) name = info.shop_name;
    else if ("cour_id" in info) name = info.cour_name;
    else name = "管理员";
  }
}

onMounted(async () => {
  refreshUserInfo();
});
</script>

<template>
  <VContainer class="!pt-12">
    <header class="flex items-center justify-between">
      <h1 class="text-h4">
        欢迎您，
        <VTooltip text="修改用户信息" location="bottom">
          <template v-slot:activator="{ props }">
            <a
              href="javascript:void 0"
              @click="showUpdatedDialog = true"
              class="text-blue hover:underline"
              v-bind="props"
            >
              {{ name }}
            </a>
          </template>
        </VTooltip>
        ！您的身份是 {{ ROLE_NAME[role] }}
      </h1>
      <VBtn @click="logout" variant="plain" color="error">注销</VBtn>
    </header>
    <div v-if="info" class="mt-12">
      <CustomerPanel v-if="role === 'customer'" :info="info as UserInfoCustRes">
      </CustomerPanel>
      <ShopPanel v-if="role === 'shop'" :info="info as UserInfoShopRes">
      </ShopPanel>
      <CourierPanel v-if="role === 'courier'" :info="info as UserInfoCourRes">
      </CourierPanel>
      <AdminPanel v-if="role === 'admin'"> </AdminPanel>
    </div>
    <VDialog v-model="showUpdatedDialog" :max-width="500">
      <UpdateInfoForm
        :role="role"
        :init-info="info"
        @submitted="refreshUserInfo"
      ></UpdateInfoForm>
    </VDialog>
  </VContainer>
</template>

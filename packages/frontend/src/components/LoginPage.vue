<script setup lang="ts">
import axios from "axios";
import { HOST } from "@/config";
import type { UserLoginRes, Role } from "@/api";
import { checkPassword, checkPhone } from "@/util";

const phone = $ref("");
const password = $ref("");
const form = $ref(false);

const emit = defineEmits<{
  (e: "loggedIn", role: Role): void;
}>();

async function login() {
  const { data } = await axios.post<UserLoginRes>(`${HOST}/user/login`, {
    phone,
    password,
  });
  const { token, role } = data;
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  emit("loggedIn", role);
}
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <h1 class="text-h2 mb-16">数据库大作业</h1>
    <VForm v-model="form">
      <VCard class="sm:w-[480px] w-[100vw]" title="登录">
        <VCardText>
          <VTextField
            variant="underlined"
            color="primary"
            v-model="phone"
            autocomplete="username"
            :rules="[checkPhone]"
            label="电话号码"
            required
          >
          </VTextField>
          <VTextField
            variant="underlined"
            color="primary"
            v-model="password"
            autocomplete="current-password"
            :rules="[checkPassword]"
            label="密码"
            required
            type="password"
          >
          </VTextField>
        </VCardText>
        <VDivider></VDivider>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="success" :disabled="!form" @click="login"> 登录 </VBtn>
        </VCardActions>
      </VCard>
    </VForm>
  </div>
</template>

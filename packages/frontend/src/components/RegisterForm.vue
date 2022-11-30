<script setup lang="ts">
import { HOST } from "@/config";
import axios from "axios";
import { checkName, checkPassword, checkPhone } from "@/util";

let role = $ref("customer");
let phone = $ref("");
let name = $ref("");
let password = $ref("");
let form = $ref(false);

async function register() {
  await axios.post(`${HOST}/user/register`, {
    role,
    phone,
    name,
    password,
  });
}
</script>

<template>
  <VCard>
    <VCardTitle>注册用户</VCardTitle>
    <VCardText>
      <VForm v-model="form">
        <VRadioGroup inline label="身份" v-model="role">
          <VRadio label="顾客" value="customer"></VRadio>
          <VRadio label="商家" value="shop"></VRadio>
          <VRadio label="骑手" value="courier"></VRadio>
        </VRadioGroup>
        <VTextField
          variant="underlined"
          color="primary"
          label="电话号码"
          v-model="phone"
          autocomplete="username"
          :rules="[checkPhone]"
          required
        >
        </VTextField>
        <VTextField
          variant="underlined"
          color="primary"
          :label="role === 'shop' ? '商铺名' : '姓名'"
          v-model="name"
          autocomplete="name"
          :rules="[checkName]"
          required
        >
        </VTextField>
        <VTextField
          variant="underlined"
          color="primary"
          label="密码"
          v-model="password"
          autocomplete="current-password"
          :rules="[checkPassword]"
          type="password"
          required
        >
        </VTextField>
      </VForm>
    </VCardText>
    <VCardActions>
      <VSpacer></VSpacer>
      <VBtn color="success" :disable="!form" @click="register"> 注册 </VBtn>
    </VCardActions>
  </VCard>
</template>

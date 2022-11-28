<script setup lang="ts">
import { HOST } from '@/config';
import axios from 'axios';

let role = $ref("customer");
let phone = $ref("");
let name = $ref("");
let password = $ref("");

async function register() {
  try {
    await axios.post(`${HOST}/user/register`, {
      role,
      phone,
      name,
      password
    });
  } catch (e) {
    alert(e instanceof Error ? e.message : e);
  }
}
</script>

<template>
  <VCard>
    <VCardTitle>注册用户</VCardTitle>
    <VCardText>
      <VForm>
        <VRadioGroup inline label="角色" v-model="role">
          <VRadio label="顾客" value="customer"></VRadio>
          <VRadio label="商家" value="shop"></VRadio>
          <VRadio label="骑手" value="courier"></VRadio>
        </VRadioGroup>
        <VTextField
          variant="underlined"
          color="primary"
          label="电话号码"
          v-model="phone"
        ></VTextField>
        <VTextField
          variant="underlined"
          color="primary"
          :label="role === 'shop' ? '商铺名' : '姓名'"
          v-model="name"
        ></VTextField>
        <VTextField
          variant="underlined"
          color="primary"
          label="密码"
          v-model="password"
          type="password"
        ></VTextField>
      </VForm>
    </VCardText>
    <VCardActions>
      <VSpacer></VSpacer>
      <VBtn color="success" @click="register"> 注册 </VBtn>
    </VCardActions>
  </VCard>
</template>

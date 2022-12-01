<script setup lang="ts">
import RegisterForm from "./RegisterForm.vue";

const showAdminer = import.meta.env.PROD;
const adminerUrl = `http://${window.location.hostname}:54188/?pgsql=db`;
</script>

<template>
  <RegisterForm></RegisterForm>
  <VCard v-if="showAdminer" title="Adminer 管理界面" class="mt-3">
    <iframe :src="adminerUrl" width="100%" height="500"></iframe>
  </VCard>
</template>

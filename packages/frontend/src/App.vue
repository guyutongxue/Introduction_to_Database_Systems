<script setup lang="ts">
import type { Role } from "@/api";
import LoginPage from "./components/LoginPage.vue";
import MainPage from "./components/MainPage.vue";

function getLocalStorageRole(): Role | null {
  const role = localStorage.getItem("role");
  if ([null, "admin", "customer", "shop", "courier"].includes(role)) {
    return role as Role;
  } else {
    return null;
  }
}
const role = $ref(getLocalStorageRole());
</script>

<template>
  <LoginPage
    v-if="!role"
    class="w-full h-full"
    @logged-in="role = $event"
  ></LoginPage>
  <MainPage
    v-else
    class="w-full"
    :role="role"
    @logged-out="role = null"
  ></MainPage>
</template>

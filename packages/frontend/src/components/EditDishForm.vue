<script setup lang="ts">
import { checkName, checkNumber } from "@/util";
import { onMounted } from "vue";

let name = $ref("");
let value = $ref("");

const form = $ref(false);
const props = defineProps<{
  initName: string;
  initValue: number;
}>();

const emit = defineEmits<{
  (e: "done", result?: { name: string; value: number }): void;
}>();

function cancel() {
  emit("done");
}
function ok() {
  emit("done", {
    name,
    value: Number(value) * 100,
  });
}

onMounted(() => {
  name = props.initName;
  value = Math.round(props.initValue / 100).toString();
});
</script>

<template>
  <VForm v-model="form">
    <VCard>
      <VCardTitle>编辑菜品信息</VCardTitle>
      <VCardText>
        <VRow>
          <VCol>
            <VTextField
              variant="outlined"
              color="primary"
              label="菜品名称"
              v-model="name"
              :rules="[checkName]"
              required
            >
            </VTextField>
          </VCol>
          <VCol>
            <VTextField
              variant="outlined"
              color="primary"
              label="菜品价格"
              prepend-inner-icon="mdi-currency-cny"
              v-model="value"
              :rules="[checkNumber]"
              required
            >
            </VTextField>
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VBtn variant="outlined" color="grey" @click="cancel"> 取消 </VBtn>
        <VBtn variant="flat" color="primary" :disabled="!form" @click="ok">
          确定
        </VBtn>
      </VCardActions>
    </VCard>
  </VForm>
</template>

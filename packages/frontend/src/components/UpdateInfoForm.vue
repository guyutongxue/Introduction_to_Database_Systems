<script setup lang="ts">
import type { Role } from "@/api";
import { HOST } from "@/config";
import { checkName, checkPassword } from "@/util";
import axios from "axios";
import dayjs from "dayjs";
import { onMounted } from "vue";

const props = defineProps<{
  role: Role;
  initInfo: any;
}>();
const emit = defineEmits<{
  (e: "submitted"): void;
}>();

const info: any = $ref({});
const rolePrefix = props.role.substring(0, 4);

interface Column {
  name: string;
  label: string;
  readonly: boolean;
  type?: "date" | "gender" | "on_off";
}

const infoCols: Record<Role, Column[]> = {
  customer: [
    { name: "cust_name", label: "姓名", readonly: true },
    { name: "id", label: "身份证号", readonly: true },
    { name: "cust_birth", label: "出生日期", readonly: true, type: "date" },
    { name: "cust_gender", label: "性别", readonly: true, type: "gender" },
    { name: "cust_email", label: "电子邮箱", readonly: false },
    { name: "cust_address", label: "配送地址", readonly: false },
  ],
  shop: [
    { name: "shop_name", label: "商铺名", readonly: false },
    { name: "shop_location", label: "商铺地址", readonly: false },
    { name: "delivery_range", label: "配送范围", readonly: false },
    {
      name: "business_status",
      label: "商铺状态",
      readonly: false,
      type: "on_off",
    },
  ],
  courier: [
    { name: "cour_name", label: "姓名", readonly: false },
    { name: "cour_living", label: "家庭住址", readonly: false },
    {
      name: "cour_onboarding_time",
      label: "入职日期",
      readonly: false,
      type: "date",
    },
  ],
  admin: [],
};

const expanded = $ref(["info"]);

// const formInfo = $ref(false);
const formPhone = $ref(false);
const formPassword = $ref(false);

// Component refs
let formPhoneRef: any;
let formPasswordRef: any;

async function updateInfo() {
  const putInfo: Record<string, any> = {};
  console.log({ ...info });
  for (const { name, readonly, type } of infoCols[props.role]) {
    if (!(name in info) || info[name] === null) {
      continue;
    }
    if (props.initInfo[name] && readonly) continue;
    if (type === "date") {
      putInfo[name] = new Date(info[name]).toISOString();
    } else {
      putInfo[name] = info[name];
    }
  }
  console.log(putInfo);
  await axios.put(`${HOST}/user/info`, putInfo);
  emit("submitted");
}

let newPhone: string = $ref(info[rolePrefix + "_phone"]);
let password = $ref("");
async function changePhone() {
  await axios.put(`${HOST}/user/phone`, {
    phone: newPhone,
    password,
  });
  formPhoneRef?.reset();
}

let oldPassword = $ref("");
let newPassword = $ref("");
async function changePassword() {
  await axios.post(`${HOST}/user/password`, {
    oldPassword,
    newPassword,
  });
  formPasswordRef?.reset();
}

onMounted(() => {
  for (const { name, type } of infoCols[props.role]) {
    if (type === "date") {
      info[name] = dayjs(props.initInfo[name]).format("YYYY-MM-DD");
    } else {
      info[name] = props.initInfo[name] ?? null;
    }
  }
  console.log(info);
});
</script>

<template>
  <VCard>
    <VExpansionPanels variant="accordion" v-model="expanded">
      <VExpansionPanel title="用户信息" value="info">
        <VExpansionPanelText>
          <VForm>
            <template v-for="col of infoCols[role]" :key="col.name">
              <template v-if="!col.type">
                <VTextField
                  variant="underlined"
                  color="primary"
                  :label="col.label"
                  v-model="info[col.name]"
                  autocomplete="off"
                  :disabled="col.name in initInfo && col.readonly"
                >
                </VTextField>
              </template>
              <template v-else-if="col.type === 'date'">
                <VTextField
                  variant="underlined"
                  color="primary"
                  :label="col.label"
                  v-model="info[col.name]"
                  autocomplete="off"
                  type="date"
                  :disabled="col.name in initInfo && col.readonly"
                >
                </VTextField>
              </template>
              <template v-else-if="col.type === 'gender'">
                <VRadioGroup
                  inline
                  :label="col.label"
                  v-model="info[col.name]"
                  :disabled="col.name in initInfo && col.readonly"
                >
                  <VRadio label="男" :value="0"></VRadio>
                  <VRadio label="女" :value="1"></VRadio>
                </VRadioGroup>
              </template>
              <template v-else-if="col.type === 'on_off'">
                <VRadioGroup
                  inline
                  :label="col.label"
                  v-model="info[col.name]"
                  :disabled="col.name in initInfo && col.readonly"
                >
                  <VRadio label="营业中" :value="1"></VRadio>
                  <VRadio label="打烊" :value="0"></VRadio>
                </VRadioGroup>
              </template>
            </template>
            <VBtn color="success" @click="updateInfo">
              提交
            </VBtn>
          </VForm>
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel title="电话号码" value="phone">
        <VExpansionPanelText>
          <VForm v-model="formPhone" ref="formPhoneRef">
            <VTextField
              variant="underlined"
              color="primary"
              label="新电话号码"
              v-model="newPhone"
              autocomplete="username"
              :rules="[checkName]"
              required
            >
            </VTextField>
            <VTextField
              variant="underlined"
              color="primary"
              label="密码"
              placeholder="输入密码以验证身份"
              v-model="password"
              autocomplete="current-password"
              :rules="[checkPassword]"
              type="password"
              required
            >
            </VTextField>
            <VBtn color="success" :disabled="!formPhone" @click="changePhone">
              确定
            </VBtn>
          </VForm>
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel title="修改密码" value="password">
        <VExpansionPanelText>
          <VForm v-model="formPassword" ref="formPasswordRef">
            <VTextField
              variant="underlined"
              color="primary"
              label="旧密码"
              v-model="oldPassword"
              autocomplete="old-password"
              :rules="[checkPassword]"
              type="password"
              required
            >
            </VTextField>
            <VTextField
              variant="underlined"
              color="primary"
              label="新密码"
              v-model="newPassword"
              autocomplete="current-password"
              :rules="[checkPassword]"
              type="password"
              required
            >
            </VTextField>
            <VBtn
              color="success"
              :disabled="!formPassword"
              @click="changePassword"
            >
              确定
            </VBtn>
          </VForm>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </VCard>
</template>

import { createApp } from "vue";
import App from "./App.vue";

import "./main.css";
import '@mdi/font/css/materialdesignicons.css';
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import axios from "axios";

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";

const vuetify = createVuetify({
  components,
  directives,
});

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token !== null) {
    config.headers ?? (config.headers = {});
    config.headers!.Authorization = `bearer ${token}`;
  }
  return config;
});
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

createApp(App).use(vuetify).mount("#app");

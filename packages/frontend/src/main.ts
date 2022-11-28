import { createApp } from "vue";
import App from "./App.vue";

import "./main.css";
import '@mdi/font/css/materialdesignicons.css';
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import axios from "axios";

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

createApp(App).use(vuetify).mount("#app");

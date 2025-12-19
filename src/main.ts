import App from "@/App.vue";
import "@/assets/css/global.css";
import { createPinia } from "pinia";
import { createApp } from "vue";
import "vue-sonner/style.css";

const app = createApp(App);

app.use(createPinia());

app.mount("#app");

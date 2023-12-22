import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { Quasar } from "quasar";
import quasarUserOptions from "./quasar-user-options";
import pinia from "./store";
import InputField from "./components/InputField.vue";
// import VueSocketIO from "vue-socket.io";

const app = createApp(App);
// const vueSocket = new VueSocketIO({
//   connection: process.env.VUE_APP_BASE_URL,
// });
app.component("InputField", InputField);
app.use(Quasar, quasarUserOptions);
app.use(router);
app.use(pinia);
// app.use(vueSocket);
app.mount("#app");

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { Quasar } from "quasar";
import quasarUserOptions from "./quasar-user-options";
import pinia from "./store";
import InputField from "./components/InputField.vue";

const app = createApp(App);

app.component("InputField", InputField);
app.use(Quasar, quasarUserOptions);
app.use(router);
app.use(pinia);
app.mount("#app");

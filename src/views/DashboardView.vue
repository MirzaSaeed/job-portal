<template>
  <q-page
    :class="loading && 'text-center column justify-center content-center'"
  >
    <q-spinner-tail v-if="loading" size="3rem" color="green" />
    <router-view v-else />
    <q-btn
      dense
      round
      icon="chat"
      size="lg"
      color="white"
      text-color="green"
      toggleUser="true"
      class="nav-link"
    >
      <q-tooltip transition-show="scale" transition-hide="scale">
        Start Chat
      </q-tooltip>
      <q-menu
        anchor="top left"
        self="bottom end"
        transition-show="scale"
        transition-hide="scale"
        fit
      >
        <q-list style="min-width: 300px">
          <q-item>
            <q-item-section class="text-subtitle1 text-bold">
              Customer Support
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item style="height: 30vh" class="d-flex column justify-end">
            <div class="q-pa-md row justify-center" style="overflow: auto">
              <div style="width: 100%; max-width: 300px">
                <q-chat-message
                  name="me"
                  size="sm"
                  avatar="https://cdn.quasar.dev/img/avatar1.jpg"
                  :text="['hey, how are you? ']"
                  stamp="7 minutes ago"
                  sent
                  text-color="white"
                  bg-color="green-7"
                /><q-chat-message
                  name="me"
                  size="sm"
                  avatar="https://cdn.quasar.dev/img/avatar1.jpg"
                  :text="['hey, how are you?']"
                  stamp="7 minutes ago"
                  sent
                  text-color="white"
                  bg-color="green-7"
                /><q-chat-message
                  name="me"
                  size="sm"
                  avatar="https://cdn.quasar.dev/img/avatar1.jpg"
                  :text="['hey, how are you?']"
                  stamp="7 minutes ago"
                  sent
                  text-color="white"
                  bg-color="green-7"
                /><q-chat-message
                  name="me"
                  size="sm"
                  avatar="https://cdn.quasar.dev/img/avatar1.jpg"
                  :text="['hey, how are you?']"
                  stamp="7 minutes ago"
                  sent
                  text-color="white"
                  bg-color="green-7"
                /><q-chat-message
                  name="me"
                  size="sm"
                  avatar="https://cdn.quasar.dev/img/avatar1.jpg"
                  :text="['hey, how are you?']"
                  stamp="7 minutes ago"
                  sent
                  text-color="white"
                  bg-color="green-7"
                />
                <q-chat-message
                  name="Jane"
                  avatar="https://cdn.quasar.dev/img/avatar5.jpg"
                  size="sm"
                  :text="['doing fine, how r you?']"
                  stamp="4 minutes ago"
                  text-color="white"
                  bg-color="green-4"
                />
              </div>
            </div>
          </q-item>
          <q-separator />
          <q-item>
            <q-item-section>
              <q-input
                outlined
                rounded
                dense
                label-color="green"
                color="green"
                v-model="message"
                label="Type message"
              >
                <template v-slot:append>
                  <q-icon
                    name="send"
                    class="cursor-pointer"
                    type="submit"
                    @click="send"
                    size="13"
                    color="green-4"
                  />
                </template> </q-input
            ></q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-page>
</template>

<script setup>
import {
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useUserStore } from "../store/user-store";
import { storeToRefs } from "pinia";
// import { io } from "socket.io-client";
import { HTTP } from "@/helper/http-config";
import { useRouter } from "vue-router";

const router = useRouter();

const userStore = useUserStore();
const { loading, profile } = storeToRefs(useUserStore());
// const socket = io(process.env.VUE_APP_BASE_URL, {
//   withCredentials: true,
// });
let message = ref("");
let typing = ref(false);
let ready = ref(false);
let info = reactive([]);
let connections = ref(0);
const messages = ref([]);
const userName = ref(null);

// Socket event handlers
const onConnect = () => {
  console.log("Connected to server");
};

const onDisconnect = () => {
  console.log("Disconnected from server");
};

const onChatMessage = (msg) => {
  messages.value.push(msg);
};

const sendMessage = () => {
  if (message.value.trim() !== "") {
    // Assuming that $socket is available globally, you may need to adjust this
    this.$socket.emit("chat message", message.value);
    message.value = "";
  }
};
// watch(newMessage, (newMessage, preNewMessage) => {
//   newMessage ? socket.emit("typing", profile?.name) : socket.emit("stopTyping");
// });

// const send = () => {
//   console.log(newMessage.value);
//   messages.push({
//     message: newMessage.value,
//     type: 0,
//     user: "Me",
//   });

//   socket.emit("chat-message", {
//     message: newMessage.value,
//     user: profile?.name,
//   });
//   newMessage.value = " ";
// };

onMounted(async () => {
  userStore.setLoading(true);
  await HTTP.get(`api/user/me`)
    .then((res) => {
      useUserStore().getProfileData(res.data);
      useUserStore().setLoading(false);
    })
    .catch((err) => {
      useUserStore().setLoading(false);
      if (err.response?.status === 400) {
        useUserStore().logoutUser();
        router.push("/");
      }
    });
  setTimeout(() => {
    userStore.setLoading(false);
  }, 1000);
});
onBeforeMount(() => {
  userStore.setHeader();
});
// onBeforeUnmount(() => {
//   socket.disconnect();
// });
</script>

<style scoped>
.nav-link {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px;
}
</style>

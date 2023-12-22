<template>
  <q-page>
    <router-view />
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
        transition-show="jump-down"
        transition-hide="jump-up"
        fit
      >
        <q-list style="max-width: 300px">
          <q-item>
            <q-item-section class="text-subtitle1 text-bold">
              Customer Support
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item
            style="height: 40vh"
            :class="
              botChat.length > 0
                ? ' d-flex column justify-end'
                : 'd-flex column justify-center items-center'
            "
          >
            <div
              v-if="botChat.length > 0"
              class="q-pa-md row justify-center"
              style="overflow: auto"
            >
              <div
                v-for="(messages, index) in botChat"
                :key="index"
                style="width: 100%; max-width: 300px"
              >
                <q-chat-message
                  :name="messages.user === 'loggedIn' ? 'user' : 'bot'"
                  size="sm"
                  :stamp="formatTime(messages.createdAt)"
                  :avatar="
                    messages.user === 'loggedIn'
                      ? 'https://icon-library.com/images/0234605a9c.svg.svg'
                      : 'https://freesvg.org/img/1538298822.png'
                  "
                  :text="[messages.message]"
                  :sent="messages.user === 'loggedIn'"
                  text-color="white"
                  :bg-color="
                    messages.user === 'loggedIn' ? 'green-7' : 'grey-7'
                  "
                />
              </div>
            </div>
            <div
              v-else
              class="q-pa-md d-flex column justify-center items-center"
              style="overflow: auto"
            >
              <q-item-section>No Chat Exist!</q-item-section>
              <q-item-section class="text-subtitle1"
                >Start to chat for support</q-item-section
              >
            </div>
          </q-item>
          <q-separator />
          <q-item>
            <q-item-section>
              <q-input
                @keypress.enter="sendMessage"
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
                    @click="sendMessage"
                    size="13"
                    color="green"
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
import { onBeforeMount, onMounted, ref } from "vue";
import { useUserStore } from "../store/user-store";
import { storeToRefs } from "pinia";
import { io } from "socket.io-client";
import { HTTP } from "@/helper/http-config";
import { useRouter } from "vue-router";
import { Notify } from "quasar";

const router = useRouter();

const userStore = useUserStore();
const { botChat } = storeToRefs(useUserStore());
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  const formattedHours = hours % 12 || 12;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};
const socketOptions = {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 3,
  timeout: 5000,
};

const socket = io(process.env.VUE_APP_BASE_URL, socketOptions);

let message = ref("");

const sendMessage = () => {
  socket.emit("chat message", message.value);
  userStore.pushChat({
    message: message.value,
    user: "loggedIn",
    createdAt: new Date(),
  });
  message.value = "";
};
socket.on("chat message", (res) => {
  console.log("Recived message from server", res);
  userStore.pushChat({
    message: res.message,
    user: res.user,
    createdAt: new Date(),
  });
});

onMounted(async () => {
  userStore.setLoading(true);
  await HTTP.get(`api/user/me`)
    .then((res) => {
      useUserStore().getProfileData(res.data);
      useUserStore().setLoading(false);
    })
    .catch((err) => {
      useUserStore().setLoading(false);
      if (err.response?.status === 401) {
        Notify.create({
          type: "negative",
          position: "top",
          message: "Session timeout",
        });
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

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
        <q-list style="min-width: 200px">
          <q-item clickable>
            <q-item-section>
              <div class="q-pa-md row justify-center">
                <div style="width: 100%; max-width: 800px">
                  <q-chat-message
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
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item>
            <q-item-section>
              <q-input
                standout
                rounded
                dense
                color="green"
                v-model="text"
                label="Type message"
              >
                <template v-slot:append>
                  <q-icon name="send" color="green-4" />
                </template> </q-input
            ></q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-page>
</template>

<script setup>
import { onMounted } from "vue";
import Sidebar from "../components/Sidebar.vue";
import { useUserStore } from "../store/user-store";
import Dashboard from "../components/Dashboard.vue";
import { storeToRefs } from "pinia";
import { HTTP } from "@/helper/http-config";

const userStore = useUserStore();
const { loading } = storeToRefs(useUserStore());

onMounted(async () => {
  userStore.setLoading(true);
  setTimeout(() => {
    userStore.setLoading(false);
  }, 1000);
  await HTTP.get(`me`).then((res) => {
    userStore.getProfileData(res.data);
  });
});
</script>

<style scoped>
.nav-link {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px;
}
</style>

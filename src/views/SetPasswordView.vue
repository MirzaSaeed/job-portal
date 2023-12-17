<template>
  <q-page
    class="container text-center column justify-center content-center"
    padding
  >
    <q-spinner-tail v-if="loading" size="3rem" color="green" />
    <SetPassword v-else />
  </q-page>
</template>

<script setup>
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user-store";
import SetPassword from "../components/SetPassword.vue";

const userStore = useUserStore();
const { loading } = storeToRefs(useUserStore());

onBeforeMount(() => {
  userStore.setLoading(true);
  setTimeout(() => {
    userStore.setLoading(false);
  }, 1000);
});
</script>

<style scoped></style>

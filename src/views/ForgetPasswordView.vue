<template>
  <q-page
    class="container text-center column justify-center content-center"
    padding
  >
    <ForgetPassword />
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user-store";
import ForgetPassword from "../components/ForgetPassword.vue";

const userStore = useUserStore();
const { loading } = storeToRefs(useUserStore());
</script>

<style scoped></style>

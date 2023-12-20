<template>
  <q-page
    class="container text-center column justify-center content-center q-px-md"
    padding
  >
    <Login />
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user-store";
import Login from "../components/Login.vue";

const userStore = useUserStore();
const { loading } = storeToRefs(useUserStore());
</script>

<style scoped></style>

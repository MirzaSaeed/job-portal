<template>
  <q-card class="my-card shadow-0">
    <q-item>
      <q-item-section class="justify-center content-center align-center">
        <img src="../assets/svg-icon/dashboard-svg.svg" class="img" alt="" />
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
import { HTTP } from "@/helper/http-config";
import { useUserStore } from "@/store/user-store";
import { onMounted } from "vue";

</script>

<style scoped>
.img {
  max-width: 500px;
  width: 100%;
}
</style>

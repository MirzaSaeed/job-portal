<template>
  <q-layout view="hHh lpR lFf" style="height: 100vh" class="rounded-borders">
    <q-header>
      <Navbar />
    </q-header>
    <Sidebar transition-show="jump-down" v-if="isAuth && token !== null" />
    <q-page-container class="bg-gray-5">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";
import { useUserStore } from "./store/user-store";

const { isAuth, token } = storeToRefs(useUserStore());
</script>
<style>
#app {
  font-family: "Poppins", sans-serif;
  -webkit-font-smoothing: antialiased;
  background: #fff;
  -moz-osx-font-smoothing: grayscale;
}
.container,
.container-sm,
.container-md,
.container-lg,
.container-xl {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 718px) {
  .container,
  .container-sm {
    max-width: 540px;
  }
}

@media (min-width: 1024px) {
  .container,
  .container-sm,
  .container-md {
    max-width: 920px;
  }
}

@media (min-width: 1439px) {
  .container,
  .container-sm,
  .container-md,
  .container-lg {
    max-width: 1140px;
  }
}

@media (min-width: 1920px) {
  .container,
  .container-sm,
  .container-md,
  .container-lg,
  .container-xl {
    max-width: 1440px;
  }
}

/* Scroll bar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color:#65b87d;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgb(153, 241, 153);
  /* transition: all ease-in-out 0.2s; */
  
}
::-webkit-scrollbar-track {
  background-color: rgb(230, 230, 230)
}
</style>

<template>
  <q-toolbar class="nav-brand">
    <q-btn
      v-if="isAuth"
      flat
      @click="toggleDrawer"
      class="nav-link"
      round
      dense
      icon="menu"
    >
      <q-tooltip transition-show="scale" transition-hide="scale"
        >Sidebar</q-tooltip
      >
    </q-btn>
    <div class="text-weight-bold text-subtitle1 text-no-wrap">Job Portal</div>
    <q-space />

    <q-tabs v-if="!isAuth" v-model="tab" shrink>
      <q-route-tab to="/" name="tab1" label="Login" />
      <q-route-tab to="/job-application" name="tab2" label="Appy for job" />
    </q-tabs>
    <q-tabs v-else-if="isAuth" v-model="tab" shrink>
      <q-btn
        flat
        round
        icon="person"
        color="white"
        text-color="black"
        @click="getUserProfile"
        to="/dashboard/profile"
        toggleUser="true"
        class="nav-link"
      >
        <q-tooltip transition-show="scale" transition-hide="scale">
          View Profile
        </q-tooltip></q-btn
      >
      <q-btn
        round
        flat
        color="white"
        text-color="black"
        @click="handleLogout"
        to="/"
        class="nav-link"
        name="tab1"
        icon="logout"
      >
        <q-tooltip transition-show="scale" transition-hide="scale">
          Logout
        </q-tooltip></q-btn
      >
    </q-tabs>
  </q-toolbar>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useUserStore } from "../store/user-store";
import { useComponentStore } from "../store/component-store";
import { HTTP } from "@/helper/http-config";
import { useRouter } from "vue-router";

const router = useRouter();
const componentStore = useComponentStore();
const { isAuth } = storeToRefs(useUserStore());

const tab = ref("tab1");

const handleLogout = () => {
  useUserStore().logoutUser();
};

const toggleDrawer = () => {
  componentStore.toggleDrawer();
};

const getUserProfile = async () => {
  useUserStore().setLoading(true);
  await HTTP.get(`/api/me`)
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
};
</script>

<style scoped>
.nav-brand {
  background: #ffffff;
  color: #000;
}
.nav-link:hover {
  background: #a5d6a7;
  color: white !important;
  transition: all ease-in-out 0.2s;
}
/* a.q-tab ,a.router-link-exact-active {
  color:#eb5e28 ;
} */
</style>

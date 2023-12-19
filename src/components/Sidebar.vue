<template>
  <q-drawer
    v-model="drawer"
    show-if-above
    :width="250"
    :breakpoint="500"
    bordered
    class="bg-grey-11"
  >
    <q-scroll-area class="fit">
      <q-item v-if="drawer" class="close-btn" v-ripple>
        <q-item-section avatar>
          <q-btn
            flat
            round
            icon="clear"
            color="white"
            text-color="black"
            @click="toggleDrawer"
            toggleUser="true"
            class="nav-link"
          >
            <q-tooltip transition-show="scale" transition-hide="scale">
              Close Menu
            </q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
      <q-list>
        <router-link to="/dashboard/user-list" class="sidebar-link-item">
          <q-item class="sidebar-list q-py-md" clickable v-ripple>
            <q-item-section avatar>
              <q-icon class="sidebar-item" name="person" color="black" />
            </q-item-section>
            <q-item-section class="sidebar-item"> User List </q-item-section>
          </q-item>
        </router-link>

        <q-separator />
        <router-link
          v-if="isAdmin"
          to="/dashboard/activity-logs"
          class="sidebar-link-item"
        >
          <q-item class="sidebar-list q-py-md" clickable v-ripple>
            <q-item-section avatar>
              <q-icon class="sidebar-item" name="list" color="black" />
            </q-item-section>
            <q-item-section class="sidebar-item">
              Activity Logs
            </q-item-section>
          </q-item>
        </router-link>
        <q-separator v-if="isAdmin" />
        <router-link to="/dashboard/job-applications" class="sidebar-link-item">
          <q-item class="sidebar-list q-py-md" clickable v-ripple>
            <q-item-section avatar>
              <q-icon class="sidebar-item" name="work" color="black" />
            </q-item-section>
            <q-item-section class="sidebar-item">
              Job Applications
            </q-item-section>
          </q-item>
        </router-link>
        <q-separator />
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { useComponentStore } from "@/store/component-store";
import { useUserStore } from "@/store/user-store";
import { storeToRefs } from "pinia";

const { drawer } = storeToRefs(useComponentStore());
const { isAdmin } = storeToRefs(useUserStore());

const toggleDrawer = () => {
  useComponentStore().toggleDrawer();
};
</script>

<style scoped>
.sidebar-list:hover {
  background: #a5d6a7;
  color: white !important;
  transition: all ease-in-out 0.2s;
}
.sidebar-list:hover .sidebar-item {
  color: white !important;
  scale: 1.1;
  transition: all ease-in-out 0.2s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.sidebar-link-item {
  color: black !important;
  text-decoration: none;
}
@media screen and (min-width: 483px) {
  .close-btn {
    display: none;
  }
}

a.router-link-exact-active .sidebar-item {
   color: #a5d6a7 !important;
  scale: 1.1;

}
</style>

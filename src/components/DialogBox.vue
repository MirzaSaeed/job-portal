<template>
  <q-dialog v-model="dialog">
    <q-card class="my-card q-pb-md" style="width: 100%; max-width: 550px">
      <q-card-section class="row items-center q-pb-sm">
        <div class="text-h6 text-bold">User Profile</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />

      <q-item class="q-pb-lg q-mt-md q-ml-md">
        <q-item-section side>
          <q-avatar round size="48px">
            <img src="../assets/svg-icon/user-profile.svg" alt="" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">
            {{ user?.firstName }} {{ user?.lastName }}</q-item-label
          >
          <q-item-label class="text-subtitle1">{{ user?.email }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useComponentStore } from "@/store/component-store";
import { storeToRefs } from "pinia";

const { dialog } = storeToRefs(useComponentStore());
</script>

<style scoped></style>

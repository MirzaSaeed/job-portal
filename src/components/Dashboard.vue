<template>
  <q-card class="my-card shadow-0">
    <div class="q-ml-md">
      <q-breadcrumbs class="q-pb-sm text-subtitle1">
        <q-breadcrumbs-el label="Dashboard" to="/dashboard" />
      </q-breadcrumbs>
      <q-separator />
    </div>
    <q-item>
      <q-item-section class="justify-center content-center align-center">
        <img src="../assets/svg-icon/dashboard-svg.svg" class="img" alt="" />
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup></script>

<style scoped>
.img {
  max-width: 500px;
  width: 100%;
}
</style>

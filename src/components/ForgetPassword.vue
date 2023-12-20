<template>
  <q-card class="my-card q-px-xs q-pb-md text-center">
    <q-card-section class="q-my-lg">
      <div class="text-h5 text-weight-bold">Forget Password?</div>
    </q-card-section>
    <q-card-section class="q-my-md">
      <q-avatar
        size="80px"
        font-size="42px"
        color="grey-12"
        text-color="green-4"
        icon="lock"
      />
    </q-card-section>
    <q-card-section class="q-pt-none q-px-lg q-mx-md">
      <div class="text-subtitle1 text-center">
        Please provide the registered email address
      </div>

      <q-form @submit.prevent="onSubmit">
        <InputField
          color="green"
          outlined
          v-model="form.email"
          :rules="[
            (val) => (val && val.length > 0) || 'Please enter an email address',
          ]"
          label="Email Address"
          iconName="email"
          type="email"
        />
        <div class="text-subtitle2 text-center">
          We will send you an email that will allow you to reset your password
        </div>
        <div class="q-mt-lg">
          <q-spinner-tail
            v-if="loading"
            class="full-width q-mt-sm"
            size="2rem"
            color="green"
          />

          <q-btn
            v-else
            color="green"
            class="full-width"
            type="submit"
            rounded
            label="Reset Password"
          />
        </div>
      </q-form>
    </q-card-section>
    <q-card-section class="q-my-none">
      <span class="text-subtitle2" color="blue">
        <router-link
          class="cursor-pointer text-weight-bold"
          style="color: #57b846 !important"
          to="/"
          >Back To Login</router-link
        >
      </span>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { Notify } from "quasar";
import { useUserStore } from "../store/user-store";
import { HTTP } from "@/helper/http-config";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { loading } = storeToRefs(useUserStore());

const form = ref({
  email: "",
});

const onSubmit = async () => {
  userStore.setLoading(true);

  await HTTP.post(`api/auth/forget-password`, {
    email: form.value.email,
  })
    .then(() => {
      form.value.email = " ";
      userStore.setLoading(false);

      Notify.create({
        type: "positive",
        position: "top",
        message: "Check your email account",
      });
    })
    .catch(() => {
      userStore.setLoading(false);

      Notify.create({
        type: "negative",
        position: "top",
        message: "Not Registered User",
      });
    })
    .finally(() => {
      userStore.setLoading(false);
    });
};
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 350px;
}
</style>

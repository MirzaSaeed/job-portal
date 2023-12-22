<template>
  <q-card class="my-card q-py-lg text-center">
    <q-card-section class="q-my-lg">
      <div class="text-h6 text-weight-bold">
        Your account is <span style="color: green">verified!</span>
      </div>
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
      <div class="text-subtitle2 text-center">Now set password</div>
      <q-form @submit.prevent="onSubmit">
        <q-input
          class="q-py-sm q-mb-lg"
          outlined
          v-model="form.password"
          color="green"
          label="Password"
          :rules="rules"
          :type="isPwd ? 'password' : 'text'"
        >
          <template v-slot:prepend>
            <q-icon name="key" color="green-4" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              size="1.25rem"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-input
          class="q-py-sm q-mb-lg"
          outlined
          v-model="form.confirmPassword"
          color="green"
          label="Confirm Password"
          :rules="[(val) => val === form.password || 'Password does not match']"
          :type="isPwd ? 'password' : 'text'"
        >
          <template v-slot:prepend>
            <q-icon name="key" color="green-4" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              size="1.25rem"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div class="q-mt-lg">
          <q-spinner-tail
            v-if="loading"
            class="full-width q-mt-xs"
            size="2rem"
            color="green"
          />

          <q-btn
            v-else
            color="green"
            class="full-width"
            type="submit"
            rounded
            label="Set Password"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { Notify } from "quasar";
import { useUserStore } from "../store/user-store";
import { useRoute, useRouter } from "vue-router";
import { HTTP } from "@/helper/http-config";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { loading } = storeToRefs(useUserStore());
const router = useRouter();
const route = useRoute();

const form = ref({
  password: "",
  confirmPassword: "",
});
const rules = [
  // (val) =>
  //   (val && val.length > 2) || "Password must contain at least 3 characters",
  (val) =>
    (val && val.length > 8) || "Password must contain at least 8 characters",
  (val) =>
    /[a-z]/.test(val) || "Password must contain at least one lowercase letter",
  (val) =>
    /[A-Z]/.test(val) || "Password must contain at least one uppercase letter",
  (val) => /\d/.test(val) || "Password must contain at least one number",
  (val) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(val) ||
    "Password must contain at least one symbol",
];

const isPwd = ref(true);

const onSubmit = async () => {
  userStore.setLoading(true);
  await HTTP.post(`api/auth/set-password`, {
    password: form.value.password,
    confirmPassword: form.value.confirmPassword,
    token: route.params.token,
  })
    .then(() => {
      userStore.setLoading(false);
      Notify.create({
        type: "positive",
        position: "top",
        message: "Password has been created successful",
      });
      router.push("/");
    })
    .catch((err) => {
      userStore.setLoading(false);
      Notify.create({
        type: "negative",
        position: "top",
        message: err.response?.data?.message,
      });
    });
};
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 350px;
}
</style>

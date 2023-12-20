<template>
  <q-card class="shadow-0">
    <q-item>
      <q-item-section class="">
        <q-breadcrumbs class="q-pb-sm">
          <q-breadcrumbs-el
            style="color: green"
            label="Dashboard"
            to="/dashboard"
          />
          <q-breadcrumbs-el label="Profile" />
        </q-breadcrumbs>
        <q-separator />
        <div class="q-pa-md">
          <p class="text-h6">User Profile</p>
          <div class="text-subtitle1 q-pb-md">
            <span>Name: </span> {{ profile?.firstName }} {{ profile?.lastName }}
            <span class="text-bold" style="color: green">
              {{ profile?.isAdmin ? "(Admin)" : "(User)" }}</span
            >
          </div>
          <div class="text-subtitle1 q-pb-md">
            <span>Email: </span>{{ profile?.email }}
          </div>
          <q-separator />
          <div class="my-card q-py-md">
            <div class="text-h6">To Change your password</div>
            <q-form @submit.prevent="onSubmit">
              <q-input
                class="q-py-sm q-mb-lg"
                v-model="form.oldPassword"
                color="green"
                label="Old Password"
                :rules="[(val) => val.length > 0 || 'Required']"
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
                v-model="form.newPassword"
                color="green"
                label="New Password"
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
                v-model="form.confirmPassword"
                color="green"
                label="Confirm Password"
                :rules="[
                  (val) =>
                    val === form.newPassword || 'Password does not match',
                ]"
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

              <q-btn
                color="green"
                class="q-mt-sm"
                type="submit"
                rounded
                label="Change Password"
              />
            </q-form>
          </div>
        </div>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
import { HTTP } from "@/helper/http-config";
import { useComponentStore } from "@/store/component-store";
import { useUserStore } from "@/store/user-store";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const componentStore = useComponentStore();
const { profile } = storeToRefs(useUserStore());

const isPwd = ref(true);
const form = ref({
  oldPassword: "",
  newPassword: "",
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

const onSubmit = async () => {
  await HTTP.patch(`api/auth/change-password`, {
    oldPassword: form.value.oldPassword,
    newPassword: form.value.newPassword,
    confirmPassword: form.value.confirmPassword,
  })
    .then(() => {
      Notify.create({
        message: "Password has been changed",
        type: "positive",
        position: "top",
      });
      form.value.newPassword = " ";
      form.value.confirmPassword = " ";
      form.value.oldPassword = " ";
    })
    .catch((err) => {
      componentStore.setLoading(false);

      if (err.response?.status === 400) {
        useUserStore().logoutUser();
        router.push("/");
      } else {
        Notify.create({
          message: "Error in password changing",
          type: "negative",
          position: "top",
        });
      }
    })
    .finally(() => {
      componentStore.setLoading(false);
    });
};

onMounted(async () => {
  componentStore.setLoading(true);
});
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 350px;
}
</style>

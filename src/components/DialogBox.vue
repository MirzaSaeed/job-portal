<template>
  <q-dialog v-model="dialog">
    <q-card class="my-card">
      <q-card-section class="row items-center q-pb-md">
        <div class="text-h5 text-bold">Create User</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-separator />
      <q-card-section class="q-pt-none q-px-lg q-mx-md">
        <q-form @submit.prevent="onSubmit" class="q-pt-lg">
          <InputField
            outlined
            color="green"
            v-model="form.firstName"
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter a first name',
            ]"
            label="First Name"
            iconName="person"
            type="text"
          />
          <InputField
            color="green"
            outlined
            v-model="form.lastName"
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter a last name',
            ]"
            label="Last Name"
            iconName="person"
            type="text"
          />
          <InputField
            color="green"
            outlined
            v-model="form.email"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Please enter an email address',
            ]"
            label="Email Address"
            iconName="email"
            type="email"
          />
          <q-btn
            color="green"
            class="full-width q-mb-lg q-mt-sm"
            type="submit"
            rounded
            label="Create User"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useComponentStore } from "@/store/component-store";
import InputField from "./InputField.vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { HTTP } from "@/helper/http-config";
import { Notify } from "quasar";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "vue-router";

const router = useRouter();

const userStore = useUserStore();

const { dialog } = storeToRefs(useComponentStore());
const form = ref({
  email: "",
  firstName: "",
  lastName: "",
});

const onSubmit = async () => {
  useComponentStore().setLoading(true);
  await HTTP.post(`api/auth/create-user`, {
    email: form.value.email,
    firstName: form.value.firstName,
    lastName: form.value.lastName,
  })
    .then(() => {
      Notify.create({
        type: "positive",
        position: "top",
        message: "Verification email has been send.",
      });
      router.push("/dashboard/user-list");

      useComponentStore().toggleDialog();
      useComponentStore().setLoading(false);
    })
    .catch((err) => {
      useComponentStore().setLoading(false);
      if (err.response?.status === 400) {
        useUserStore().logoutUser();
        router.push("/");
      } else {
        Notify.create({
          type: "negative",
          position: "top",
          message: "User is already exist",
        });
      }
    });
};
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 450px;
}
</style>

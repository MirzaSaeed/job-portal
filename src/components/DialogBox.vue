<template>
  <q-dialog v-model="dialog">
    <q-card class="my-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-subtitle1">Create User</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-none q-px-lg q-mx-md">
        <q-form @submit.prevent="onSubmit">
          <InputField
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
            class="full-width q-my-lg"
            type="submit"
            rounded
            label="Create User"
          />
        </q-form>
      </q-card-section>
    </q-card>

    <!-- <q-card v-else-if="toggleUser" class="my-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">User Profile</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="text-h6">
          <span>Name: </span> {{ userData.firstName }} {{ userData.lastName }}
        </div>
        <div class="text-subtitle2">
          <span>Email: </span>{{ userData.email }}
        </div>
      </q-card-section>
    </q-card> -->
  </q-dialog>
</template>

<script setup>
import { useComponentStore } from "@/store/component-store";
import InputField from "./InputField.vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { HTTP } from "@/helper/http-config";
import { Notify } from "quasar";

defineProps(["userData", "formData", "toggleUser"]);

const { dialog } = storeToRefs(useComponentStore());
const form = ref({
  email: "",
  firstName: "",
  lastName: "",
});

const onSubmit = async () => {
  console.log(form.value.email);

  await HTTP.post(`users/createuser`, {
    email: form.value.email,
    firstName: form.value.firstName,
    lastName: form.value.lastName,
  })
    .then((res) => {
      debugger;
      console.log(res);
      Notify.create({
        type: "positive",
        position: "top",
        message: "Verification email has been send.",
      });
      userStore.setLoading(false);
    })
    .catch((err) => {
      Notify.create({
        type: "negative",
        position: "top",
        message: "User is not created",
      });
    });

  // if (
  //   admin.value.email === form.value.email &&
  //   admin.value.password === form.value.password
  // ) {
  //   {
  //     //   userStore.setLoading(true);
  //     const login = userStore.loginUser(admin.value);
  //     login &&
  //       Notify.create({
  //         type: "positive",
  //         position: "top",
  //         message: "Login successful",
  //       });

  //     router.push("/dashboard/user-list");
  //   }
  // } else {
  //   Notify.create({
  //     type: "negative",
  //     position: "top",
  //     message: "Invalid Credentials",
  //   });
  // }
};
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 350px;
}
</style>

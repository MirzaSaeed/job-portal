<template>
  <q-card class="my-card shadow-0 text-center">
    <q-card-section class="q-my-lg">
      <div class="text-h4 text-weight-bold">Welcome</div>
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
      <q-form @submit.prevent="onSubmit">
        <InputField
          color="green"
          v-model="form.email"
          :rules="[
            (val) => (val && val.length > 0) || 'Please enter an email address',
          ]"
          label="Email Address"
          iconName="email"
          type="email"
        />

        <q-input
          class="q-py-sm q-mb-lg"
          v-model="form.password"
          color="green"
          label="Password"
          :rules="[
            (val) =>
              (val && val.length > 2) ||
              'Password must contain atleast 3 character',
          ]"
          :type="isPwd ? 'password' : 'text'"
          hint="Password must contain atleast 3 character"
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
          class="full-width q-mt-lg"
          type="submit"
          rounded
          label="Login"
        />
      </q-form>
    </q-card-section>
    <q-card-section class="q-my-none">
      <span class="text-caption" color="blue">
        <router-link
          class="cursor-pointer text-weight-bold"
          style="color: #57b846 !important"
          @click="userStore.setLoading(true)"
          to="/forget-password"
          >Forget Password?</router-link
        >
      </span>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { Notify, useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user-store";
import { useRouter } from "vue-router";
import { HTTP } from "@/helper/http-config";

const router = useRouter();
const form = ref({
  email: "",
  password: "",
});
const userStore = useUserStore();
const { users, admin } = storeToRefs(useUserStore());

const isPwd = ref(true);

const onSubmit = async () => {
  console.log(form.value.email);
  console.log(form.value.password);

  // await HTTP.post(`users/login`, {
  //   email: form.value.email,
  //   password: form.value.password,
  // })
  //   .then((res) => {
  //     const login = userStore.loginUser(res.data);
  //     console.log(res);
  //     login &&
  //       Notify.create({
  //         type: "positive",
  //         position: "top",
  //         message: "Login successful",
  //       });
  //     userStore.setLoading(false);
  //     // router.push("/dashboard");
  //   })
  //   .catch((err) => {
  //     Notify.create({
  //       type: "negative",
  //       position: "top",
  //       message: "UnAuthorized User",
  //     });
  //   });

  if (
    admin.value.email === form.value.email &&
    admin.value.password === form.value.password
  ) {
    {
      //   userStore.setLoading(true);
      const login = userStore.loginUser(admin.value);
      login &&
        Notify.create({
          type: "positive",
          position: "top",
          message: "Login successful",
        });

      router.push("/dashboard/user-list");
    }
  } else {
    Notify.create({
      type: "negative",
      position: "top",
      message: "Invalid Credentials",
    });
  }
};
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 350px;
}
</style>

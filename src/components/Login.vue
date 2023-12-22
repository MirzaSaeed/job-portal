<template>
  <q-card class="my-card row q-py-lg">
    <q-card-section
      class="col-12 col-md-6 col-lg-6 d-flex column justify-center items-center"
    >
      <q-avatar
        size="80px"
        font-size="42px"
        color="grey-12"
        text-color="green-4"
        class="q-mb-lg"
        icon="lock"
      />
      <div class="text-h4 q-mb-lg text-weight-bold">
        Welcome <span style="color: #53af50">Back!</span>
      </div>
      <p class="text-subtitle1 text-center">
        Handle activities related to individuals
      </p>
    </q-card-section>
    <q-separator vertical />
    <q-card-section
      class="text-left q-mb-lg d-flex column justify-center items-center col-12 col-md-5 col-lg-5"
    >
      <div class="text-h5 text-weight-bold">Login</div>
      <q-form @submit.prevent="onSubmit" style="width: 100%; max-width: 300px">
        <InputField
          color="green"
          outlined
          inputClass="q-py-md q-mb-lg"
          v-model="form.email"
          :rules="[
            (val) => (val && val.length > 0) || 'Please enter an email address',
          ]"
          label="Email Address"
          iconName="email"
          type="email"
        />

        <q-input
          class="q-mb-lg"
          v-model="form.password"
          outlined
          color="green"
          label="Password"
          :rules="[
            (val) =>
              (val && val.length > 7) ||
              `Password must contain atleast 8 
              character`,
          ]"
          :type="isPwd ? 'password' : 'text'"
          hint="Password must contain atleast 8 character"
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
        <div class="q-mt-xl q-mb-sm">
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
            label="Login"
          />
        </div>
      </q-form>
      <span class="text-subtitle2 q-mt-md">
        <router-link
          class="cursor-pointer text-weight-bold"
          style="color: #57b846 !important"
          to="/forget-password"
          >Forget Password?</router-link
        >
      </span>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { Notify } from "quasar";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user-store";
import { useRouter } from "vue-router";
import { HTTP } from "@/helper/http-config";

const userStore = useUserStore();
const { loading } = storeToRefs(useUserStore());

const router = useRouter();

const form = ref({
  email: "",
  password: "",
});

const isPwd = ref(true);

const onSubmit = async () => {
  userStore.setLoading(true);

  await HTTP.post(`api/auth/login`, {
    email: form.value.email,
    password: form.value.password,
  })
    .then((res) => {
      userStore.loginUser(res.data.data);
      userStore.setToken(res.data.token);
      Notify.create({
        type: "positive",
        position: "top",
        message: "Login successful",
      });
      router.push("/dashboard");
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
  max-width: 850px;
}
</style>

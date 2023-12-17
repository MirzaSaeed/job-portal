<template>
  <q-page
    class="container text-center column justify-center content-center"
    padding
  >
    <q-spinner-tail v-if="loading" size="3rem" color="green" />
    <q-card v-else class="my-card shadow-0 text-center">
      <q-card-section class="q-my-lg">
        <div class="text-h4 text-weight-bold">Welcome</div>
      </q-card-section>
      <!-- <q-card-section class="q-mb-lg">
        <div class="text-subtitle2">by John Doe</div>
        <q-avatar
          size="100px"
          font-size="52px"
          color="blue-grey"
          text-color="white"
          icon="person"
        />
      </q-card-section> -->
      <q-card-section class="q-pt-none q-px-lg q-mx-md">
        <q-form ref="userForm" @submit="onSubmit">
          <div class="row">
            <div class="col-12 col-md-6 col-lg-6 q-px-md">
              <q-input
                color="green"
                class="q-py-md"
                v-model="firstName"
                :rules="[
                  (val) => (val && val.length > 0) || 'Please enter first name',
                ]"
                label="First Name"
              >
                <template v-slot:prepend>
                  <q-icon color="green-4" name="person" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6 col-lg-6 q-px-md">
              <q-input
                class="q-py-md q-mb-lg"
                v-model="lastName"
                color="green"
                label="Last Name"
                :rules="[
                  (val) => (val && val.length > 0) || 'Please enter last name',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="person" color="green-4" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6 col-lg-6 q-px-md">
              <q-input
                color="green"
                class="q-py-md"
                v-model="email"
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Please enter an email address',
                ]"
                label="Email Address"
              >
                <template v-slot:prepend>
                  <q-icon color="green-4" name="email" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6 col-lg-6 q-px-md">
              <q-input
                class="q-py-md q-mb-lg"
                v-model="password"
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
            </div>
            <div class="col-12 col-md-6 col-lg-6 q-px-md">
              <q-input
                color="green"
                class="q-py-md"
                v-model="dob"
                type="date"
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Please select date of birth',
                ]"
                label="Date Of Birth"
              >
                <template v-slot:prepend>
                  <q-icon color="green-4" name="calendar_month" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6 col-lg-6 q-px-md">
              <q-input
                color="green"
                class="q-py-md"
                v-model="city"
                :rules="[
                  (val) => (val && val.length > 0) || 'Please enter city name',
                ]"
                label="City"
              >
                <template v-slot:prepend>
                  <q-icon color="green-4" name="location_on" />
                </template>
              </q-input>
            </div>
          </div>

          <q-btn
            color="green"
            class="full-width q-mt-lg"
            type="submit"
            rounded
            label="Register "
          />
        </q-form>
      </q-card-section>

      <q-card-section class="q-my-none">
        <span class="text-caption" color="blue"
          >Have an account?
          <router-link
            class="cursor-pointer text-weight-bold"
            style="color: #57b846 !important"
            @click="userStore.setLoading(true)"
            to="/"
            >Login</router-link
          >
        </span>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { Notify, useQuasar } from "quasar";
import { useUserStore } from "../store/user-store";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { users, loading } = storeToRefs(useUserStore());
const firstName = ref("");
const lastName = ref("");
const dob = ref("");
const city = ref("");
const email = ref("");
const password = ref("");
const userForm = ref(null);
const isPwd = ref(true);
onMounted(() => {
  userStore.setLoading(true);
  setTimeout(() => {
    userStore.setLoading(false);
  }, 1000);
});

const onSubmit = async () => {
  try {
    if (users.value.length === 0) {
      const register = userStore.createUser({
        id: 1,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
        dob: dob.value,
        city: city.value,
        createdAt: new Date(),
        updatedAt: null,
        chat: [],
      });
      if (register) {
        Notify.create({
          type: "positive",
          position: "top",
          message: "User is registered succesfully",
        });
      }
    } else if (users.value.length > 0) {
      let existEmail;
      users.value.filter((user) => {
        if (user.email === email.value) {
          existEmail = user.email;
        }
      });
      if (existEmail === email.value) {
        Notify.create({
          type: "negative",
          position: "top",
          message: "User already registered",
        });
      } else {
        const userList = JSON.parse(JSON.stringify(users.value));

        userList.sort((a, b) => b.id - a.id);
        const register = userStore.createUser({
          id: userList[0].id + 1,
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value,
          dob: dob.value,
          city: city.value,
          createdAt: new Date(),
          updatedAt: null,
          chat: [],
        });
        if (register) {
          Notify.create({
            type: "positive",
            position: "top",
            message: "User is registered succesfully",
          });
        }
      }
    }
  } catch (error) {
    console.log("Error!", error);
  }
};
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 550px;
}
</style>

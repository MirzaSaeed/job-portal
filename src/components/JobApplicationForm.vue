<template>
  <q-card class="my-card shadow-0 text-center">
    <q-card-section class="q-my-lg">
      <div class="text-h4 text-weight-bold">Job Application</div>
    </q-card-section>
    <!-- <q-card-section class="q-my-md">
      <q-avatar
        size="80px"
        font-size="42px"
        color="grey-12"
        text-color="green-4"
        icon="bag"
      />
    </q-card-section> -->

    <q-card-section class="q-pt-none q-px-lg q-mx-md">
      <q-form ref="userForm" @submit="onSubmit">
        <div class="row">
          <div class="col-12 col-md-6 col-lg-6 q-px-md">
            <!-- name  -->
            <InputField
              color="green"
              v-model="form.userName"
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please enter your full name',
              ]"
              label="Name"
              iconName="person"
              type="text"
            />
          </div>
          <div class="col-12 col-md-6 col-lg-6 q-px-md">
            <!-- email  -->
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
          </div>
          <div class="col-12 col-md-6 col-lg-6 q-px-md">
            <!-- cnic -->
            <InputField
              color="green"
              v-model="form.cnic"
              :rules="[
                (val) => (val && val.length > 0) || 'Please enter a valid cnic',
              ]"
              label="CNIC"
              iconName="email"
              fill-mask
              mask="##### - ####### - #"
              hint="Mask: 34102 - 1659171 - 3"
            />
          </div>
          <div class="col-12 col-md-6 col-lg-6 q-px-md">
            <!-- phone number  -->
            <InputField
              color="green"
              v-model="form.phoneNumber"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Please enter a valid phone number',
              ]"
              label="Phone Number"
              iconName="phone"
              mask="+92 3## ### ## ##"
              fill-mask
              hint="Mask: +92 312 345 67 89"
            />
          </div>

          <div class="col-12 col-md-6 col-lg-6 q-px-md">
            <!-- age -->
            <InputField
              color="green"
              v-model="form.age"
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please enter a valid address',
              ]"
              label="Age"
              iconName="badge"
              type="number"
              :max="60"
              :min="18"
              hint="Age Between 18-60"
            />
          </div>
          <div class="col-12 col-md-6 col-lg-6 q-px-md">
            <!-- address  -->
            <InputField
              color="green"
              v-model="form.address"
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please enter a valid address',
              ]"
              label="Address"
              iconName="home"
            />
          </div>
          <div class="col-12 col-md-6 col-lg-6 q-px-md">
            <!-- qualification -->
            <q-select
              class="q-py-md q-mb-sm"
              v-model="form.qualification"
              color="green"
              :options="options"
              label="Qualification"
            >
              <template v-slot:prepend>
                <q-icon name="school" color="green-4" /> </template
            ></q-select>
          </div>

          <div class="col-12 col-md-6 col-lg-6 q-px-md">
            <!-- address  -->
            <q-file
              color="green"
              class="col-12 q-py-md q-mb-lg"
              flat
              clearable
              max-file-size="4000000"
              v-model="form.cv"
              label="Upload your CV"
              @rejected="onRejected"
              accept=".pdf"
              hint="PDF only (4 MB max) "
            >
              <template v-slot:prepend>
                <q-icon color="green-4" name="cloud_upload" />
              </template>
            </q-file>
          </div>
        </div>

        <q-btn
          color="green"
          class="full-width q-mt-lg"
          type="submit"
          rounded
          label="Submit "
        />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { Notify, useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user-store";
import { useRouter } from "vue-router";

const router = useRouter();
const form = ref({
  userName: "",
  email: "",
  age: "",
  cnic: "",
  address: "",
  phoneNumber: "",
  qualification: "",
  cv: "",
});
const options = [
  "Matric",
  "Intermediate",
  "Undergraduate  / Bachelor ",
  "Master",
  "PhD",
];
console.log(form.value.cv, "CV");
const userStore = useUserStore();
const { users, admin } = storeToRefs(useUserStore());

function checkFileType(files) {
  return files.filter((file) => file.type === "image/png");
}

function onRejected(rejectedEntries) {
  Notify.create({
    type: "negative",
    message: `file size is exceed. Max size = 4MB`,
  });
}
function checkFileSize(files) {
  return files.filter((file) => file.size < 2048);
}

const onSubmit = async () => {
  console.log(form.value.email);
  console.log(form.value.cv);

  //   await HTTP.post(`job-application`, {
  //     email: form.value.email,
  //     userName: form.value.userName,
  //   })
  //     .then((res) => {
  //       const login = userStore.loginUser(res.data);
  //       login &&
  //         Notify.create({
  //           type: "positive",
  //           position: "top",
  //           message: "Login successful",
  //         });
  //       userStore.setLoading(true);
  //       router.push("/dashboard");
  //     })
  //     .catch((err) => {
  //       Notify.create({
  //         type: "negative",
  //         position: "top",
  //         message: "UnAuthorized User",
  //       });
  //     });

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

      router.push("/dashboard");
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
  max-width: 650px;
}
</style>
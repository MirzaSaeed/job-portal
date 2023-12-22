<template>
  <q-card class="my-card shadow-0">
    <q-item>
      <q-item-section class="">
        <q-breadcrumbs class="q-pb-sm text-subtitle1">
          <q-breadcrumbs-el
            style="color: green"
            label="Dashboard"
            to="/dashboard"
          />
          <q-breadcrumbs-el label="User List" />
        </q-breadcrumbs>
        <q-separator />
        <div class="q-pa-md">
          <div class="q-px-md row d-flex items-center">
            <div
              class="total-users col-12 col-md-6 col-md-6 col-sm-12 row d-flex justify-start"
            >
              <p class="text-subtitle1 col-12 col-md-3 col-lg-3 col-sm-6">
                Total Users:
                <span class="text-bold">{{ users?.count }}</span>
              </p>
              <p class="text-subtitle1 col-12 col-md-3 col-lg-3 col-sm-6">
                Verified Users:
                <span class="text-bold">{{ totalVerifiedUsers }}</span>
              </p>
              <p class="text-subtitle1 col-12 col-md-4 col-lg-4 col-sm-6">
                Unverified Users:
                <span class="text-bold">{{ totalNotVerifiedUsers }}</span>
              </p>
            </div>
            <q-space />
            <div class="row d-flex">
              <p class="col-6 q-mr-md" style="width: 180px">
                <q-select
                  dense
                  color="green"
                  outlined
                  v-model="dropDownFilter"
                  :options="options"
                  label="Status"
                  @input="setFilter"
                />
              </p>
              <p class="col-6" style="width: 250px">
                <q-input
                  borderless
                  dense
                  outlined
                  debounce="300"
                  color="green"
                  class="text-subtitle1"
                  v-model="filter"
                  placeholder="Search"
                >
                  <template v-slot:append>
                    <q-icon name="search" color="green-4" />
                  </template>
                </q-input>
              </p>
            </div>
          </div>
          <q-table
            :grid="$q.screen.xs"
            style="max-height: 450px; height: 100%"
            flat
            :loading="loading"
            bordered
            title="Users"
            row-key="index"
            :rows="users?.rows"
            :columns="columns"
            virtual-scroll
            :pagination="pagination"
            :rows-per-page-options="[0]"
          >
            <!-- top  -->

            <template v-slot:top-right>
              <q-btn
                color="green"
                outline
                @click="handleCreateForm"
                type="submit"
                rounded
                class="text-body1 text-capitalize"
                label="Create User"
              />
            </template>

            <!-- body  -->
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="index" auto-width :props="props">
                  {{ users?.rows?.indexOf(props.row) + 1 }}
                </q-td>
                <q-td key="name" auto-width :props="props">
                  {{ props.row.firstName }} {{ props.row.lastName }}
                </q-td>

                <q-td key="email" auto-width :props="props">
                  {{ props.row.email }}
                </q-td>
                <q-td key="status" auto-width :props="props">
                  <q-badge
                    v-if="props.row.isVerified"
                    text-color="green"
                    color="white"
                    label="Verified"
                  />
                  <q-badge
                    v-else-if="!props.row.isVerified"
                    color="white"
                    text-color="red"
                    label="Not Verified"
                  />
                </q-td>
                <q-td key="action" auto-width :props="props">
                  <q-btn
                    flat
                    round
                    v-if="!props.row.isVerified"
                    icon="send"
                    size="sm"
                    :disable="loading"
                    @click="
                      handleVerification(props.row.userId, props.row.email)
                    "
                    color="white"
                    text-color="black"
                    toggleUser="true"
                    class="nav-link"
                  >
                    <q-tooltip transition-show="scale" transition-hide="scale">
                      Send Verification Email
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    icon="visibility"
                    :disable="loading"
                    color="white"
                    text-color="black"
                    @click="onRowClick(props.row.userId)"
                    toggleUser="true"
                    size="sm"
                    class="nav-link"
                  >
                    <q-tooltip transition-show="scale" transition-hide="scale">
                      View Profile
                    </q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>

            <!-- pagination  -->
            <template v-slot:pagination="">
              <q-btn
                icon="chevron_left"
                color="grey-8"
                round
                dense
                flat
                :disable="
                  users?.pagination?.hasPrevPage === false
                    ? true
                    : false || loading
                "
                @click="handlePage(page - 1)"
              />

              <q-btn
                icon="chevron_right"
                color="grey-8"
                round
                dense
                flat
                :disable="
                  users?.pagination?.hasNextPage === false
                    ? true
                    : false || loading
                "
                @click="handlePage(page + 1)"
              />
            </template>
          </q-table>

          <q-dialog v-model="dialogValue">
            <q-card style="width: 100%; max-width: 450px">
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
                    inputClass="q-py-sm q-mb-lg"
                    v-model="form.firstName"
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Please enter a first name',
                    ]"
                    label="First Name"
                    iconName="person"
                    type="text"
                  />
                  <InputField
                    inputClass="q-py-sm q-mb-lg"
                    color="green"
                    outlined
                    v-model="form.lastName"
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Please enter a last name',
                    ]"
                    label="Last Name"
                    iconName="person"
                    type="text"
                  />
                  <InputField
                    color="green"
                    inputClass="q-py-sm q-mb-lg"
                    outlined
                    v-model="form.email"
                    :rules="[
                      (val) =>
                        (val && val.length > 0) ||
                        'Please enter an email address',
                    ]"
                    label="Email Address"
                    iconName="email"
                    type="email"
                  />
                  <div class="q-mb-md">
                    <q-spinner-tail
                      v-if="userStore.loading"
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
                      label="Create User"
                    />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </q-dialog>
          <DialogBox />
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
import { onMounted, ref,  watchEffect } from "vue";
import { useRouter } from "vue-router";
import DialogBox from "./DialogBox.vue";

const router = useRouter();

const componentStore = useComponentStore();
const userStore = useUserStore();
const { loading } = storeToRefs(useComponentStore());

const options = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Verified",
    value: "true",
  },
  {
    label: "Not Verified",
    value: "false",
  },
];
const form = ref({
  email: "",
  firstName: "",
  lastName: "",
});
const filter = ref("");
const dropDownFilter = ref("");
const users = ref({});
const dialogValue = ref(false);
const page = ref(1);
const pagination = ref({
  sortBy: "desc",
  descending: true,
  page: 1,
  totalItems: 0,
  rowsPerPage: 10,
});

const columns = [
  {
    name: "index",
    label: "Id",
    field: "index",
  },
  {
    name: "name",
    align: "center",
    label: "Name",
    field: "name",
    sortable: true,
  },

  {
    name: "email",
    align: "left",
    label: "Email Address",
    field: "email",
  },
  {
    name: "status",
    align: "center",
    label: "Status",
    field: "status",
  },
  {
    name: "action",
    align: "right",
    label: "Action",
    field: "action",
  },
];
let totalVerifiedUsers;
let totalNotVerifiedUsers;

const toggleDialog = () => {
  componentStore.toggleDialog();
};

const handleCreateForm = () => {
  dialogValue.value = true;
};

const setFilter = (status) => {
  dropDownFilter.value = status;
};
const handlePage = (pageNumber) => {
  page.value = pageNumber;
  handlePagination(page.value, "", "");
};

const onSubmit = async () => {
  useUserStore().setLoading(true);
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
      handlePagination(page.value, { value: "" }, { value: "" });
      useUserStore().setLoading(false);
      dialogValue.value = false;
      router.push("/dashboard/user-list");
    })
    .catch((err) => {
      useUserStore().setLoading(false);

      if (err.response?.status === 401) {
        Notify.create({
          type: "negative",
          position: "top",
          message: "Session timeout",
        });
        useUserStore().logoutUser();
        router.push("/");
      } else {
        Notify.create({
          type: "negative",
          position: "top",
          message: err.response?.data?.message,
        });
      }
    });
};

const handlePagination = async (
  pageNumber,
  filterValue,
  dropDownFilterValue
) => {
  componentStore.setLoading(true);
  await HTTP.get(
    `api/user/get-user?page=${pageNumber}&search=${filterValue?.value}&isVerified=${dropDownFilterValue?.value}`
  )
    .then((res) => {
      componentStore.setLoading(false);
      users.value = res.data?.data;
      page.value = res.data?.data?.pagination.page;
      pagination.value.page = res.data?.data?.pagination.page;
      pagination.value.totalItems = res.data?.data?.pagination.totalUsers;

      totalVerifiedUsers = res.data?.data?.pagination.countVerifiedUsers;
      totalNotVerifiedUsers = res.data?.data?.pagination.countUnverifiedUsers;
    })
    .catch((err) => {
      componentStore.setLoading(false);
      if (err.response?.status === 401) {
        Notify.create({
          type: "negative",
          position: "top",
          message: "Session timeout",
        });
        useUserStore().logoutUser();
        router.push("/");
      } else {
        Notify.create({
          message: err.response?.data?.message,

          type: "negative",
          position: "top",
        });
      }
    })
    .finally(() => {
      componentStore.setLoading(false);
    });
};

const onRowClick = async (id) => {
  componentStore.setLoading(true);
  await HTTP.get(`api/user/user-profile/${id}`)
    .then((res) => {
      componentStore.setLoading(false);
      userStore.getUser(res.data);
      toggleDialog();
    })

    .catch((err) => {
      componentStore.setLoading(false);
      if (err.response?.status === 401) {
        Notify.create({
          type: "negative",
          position: "top",
          message: "Session timeout",
        });
        useUserStore().logoutUser();
        router.push("/");
      } else {
        Notify.create({
          message: err.response?.data?.message,

          type: "negative",
          position: "top",
        });
      }
    })
    .finally(() => {
      componentStore.setLoading(false);
    });
};

const handleVerification = async (userId, userEmail) => {
  componentStore.setLoading(true);
  await HTTP.patch(`api/auth/verify-user/${userId}`)
    .then(() => {
      componentStore.setLoading(false);
      Notify.create({
        message: `Email have been send for verified on ${userEmail}`,
        type: "positive",
        position: "top",
      });
    })
    .catch((err) => {
      componentStore.setLoading(false);
      if (err.response?.status === 401) {
        Notify.create({
          type: "negative",
          position: "top",
          message: "Session timeout",
        });
        useUserStore().logoutUser();
        router.push("/");
      } else {
        Notify.create({
          message: err.response?.data?.message,
          type: "negative",
          position: "top",
        });
      }
    })
    .finally(() => {
      componentStore.setLoading(false);
    });
};

watchEffect(async () => {
  componentStore.setLoading(true);
  // let filterValue = filter.value || "";
  // let dropDownFilterValue = dropDownFilter.value || "";
  handlePagination(
    page.value,
    filter || { value: "" },
    dropDownFilter.value || { value: "" }
  );
});

onMounted(async () => {
  componentStore.setLoading(true);
  handlePagination(page.value, { value: "" }, { value: "" });
});
</script>

<style scoped>
.nav-link:hover {
  background: #7eca81;
  color: white !important;
  transition: all ease-in-out 0.2s;
}
</style>

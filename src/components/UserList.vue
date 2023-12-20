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
          <div class="q-px-md">
            <p class="text-subtitle1">
              Total Users:
              <span class="text-bold">{{ users?.count }}</span>
            </p>
            <p class="text-subtitle1">
              Total Verified Users:
              <span class="text-bold">{{ totalVerifiedUsers }}</span>
            </p>
            <p class="text-subtitle1">
              Total Not Verified Users:
              <span class="text-bold">{{ totalNotVerifiedUsers }}</span>
            </p>
          </div>
          <q-table
            :grid="$q.screen.xs"
            flat
            :loading="loading"
            bordered
            title="Users"
            row-key="index"
            :rows="users?.rows"
            :columns="columns"
            virtual-scroll
            :pagination="pagination"
            :filter="filter"
          >
            <!-- top  -->

            <template v-slot:top-left>
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
            <template v-slot:top-right>
              <div style="width: 180px">
                <q-select
                  dense
                  class="q-mr-md"
                  color="green"
                  outlined
                  v-model="dropDownFilter"
                  :options="options"
                  label="Status"
                  @input="setFilter"
                />
              </div>

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
            </template>

            <!-- body  -->
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="index" :props="props">
                  {{ users?.rows?.indexOf(props.row) + 1 }}
                </q-td>
                <q-td key="name" :props="props">
                  {{ props.row.firstName }} {{ props.row.lastName }}
                </q-td>

                <q-td key="email" :props="props">
                  {{ props.row.email }}
                </q-td>
                <q-td key="status" :props="props">
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
                <q-td key="action" :props="props">
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
            <q-card
              class="my-card q-pb-md"
              style="width: 100%; max-width: 550px"
            >
              <q-card-section class="row items-center q-pb-sm">
                <div class="text-h6 text-bold">User Profile</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
              </q-card-section>
              <q-separator />

              <q-item class="q-pb-lg q-mt-md q-ml-md">
                <q-item-section side>
                  <q-avatar round size="48px">
                    <img src="../assets/svg-icon/user-profile.svg" alt="" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h6">
                    {{ user?.firstName }} {{ user?.lastName }}</q-item-label
                  >
                  <q-item-label class="text-subtitle1">{{
                    user?.email
                  }}</q-item-label>
                </q-item-section>
              </q-item>
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
import { onMounted, ref, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";
import DialogBox from "./DialogBox.vue";

const router = useRouter();

const componentStore = useComponentStore();
const userStore = useUserStore();
const { user } = storeToRefs(useUserStore());
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
  toggleDialog();
};

const setFilter = (status) => {
  dropDownFilter.value = status;
};
const handlePage = (pageNumber) => {
  page.value = pageNumber;
  handlePagination(page.value);
};

const handlePagination = async (pageNumber) => {
  componentStore.setLoading(true);
  await HTTP.get(
    `api/user/get-user?page=${pageNumber}&search=${filter.value}&isVerified=${dropDownFilter.value}`
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
      if (err.response?.status === 400) {
        useUserStore().logoutUser();
        router.push("/");
      } else {
        Notify.create({
          message: "Users Not Found",
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
      dialogValue.value = true;
    })

    .catch((err) => {
      componentStore.setLoading(false);
      if (err.response?.status === 400) {
        useUserStore().logoutUser();
        router.push("/");
      } else {
        Notify.create({
          message: "User Not Found",
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
      if (err.response?.status === 400) {
        useUserStore().logoutUser();
        router.push("/");
      } else {
        Notify.create({
          message: "User Not Found",
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
  await HTTP.get(`api/user/get-user?search=${filter.value}`)
    .then((res) => {
      componentStore.setLoading(false);
      users.value = res.data?.data;
      page.value = res.data?.data?.pagination.page;
      pagination.value.page = res.data?.data?.pagination.page;
      pagination.value.totalItems = res.data?.data?.pagination.totalUsers;
    })
    .catch((err) => {
      componentStore.setLoading(false);
      if (err.response?.status === 400) {
        useUserStore().logoutUser();
        router.push("/");
      } else {
        Notify.create({
          message: "Users Not Found",
          type: "negative",
          position: "top",
        });
      }
    })
    .finally(() => {
      componentStore.setLoading(false);
    });
});
watchEffect(async () => {
  componentStore.setLoading(true);

  await HTTP.get(`api/user/get-user?isVerified=${dropDownFilter.value?.value}`)
    .then((res) => {
      componentStore.setLoading(false);
      users.value = res.data?.data;
      page.value = res.data?.data?.pagination.page;
      pagination.value.page = res.data?.data?.pagination.page;
      pagination.value.totalItems = res.data?.data?.pagination.totalUsers;
    })
    .catch((err) => {
      componentStore.setLoading(false);
      if (err.response?.status === 400) {
        useUserStore().logoutUser();
        router.push("/");
      } else {
        Notify.create({
          message: "Users Not Found",
          type: "negative",
          position: "top",
        });
      }
    })
    .finally(() => {
      componentStore.setLoading(false);
    });
});

onMounted(async () => {
  componentStore.setLoading(true);
  handlePagination(page.value);
});
</script>

<style scoped>
.nav-link:hover {
  background: #7eca81;
  color: white !important;
  transition: all ease-in-out 0.2s;
}
</style>

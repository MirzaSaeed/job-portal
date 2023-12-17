<template>
  <q-card class="my-card shadow-0">
    <q-item>
      <q-item-section class="">
        <q-breadcrumbs class="q-pb-sm">
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
            <p>
              Total Users:
              <span class="text-bold">{{ totalUsers }}</span>
            </p>
            <p>
              Total Verified Users:
              <span class="text-bold">{{ totalVerifiedUsers }}</span>
            </p>
            <p>
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
            :rows="filteredUsers"
            :columns="columns"
            virtual-scroll
            :filter="filter"
          >
            <!-- top  -->

            <template v-slot:top-left>
              <q-btn
                flat
                color="green"
                @click="toggleDialog"
                type="submit"
                rounded
                label="Create User"
              />
            </template>
            <template v-slot:top-right>
              <q-btn-dropdown flat color="green" class="q-mx-sm" label="Status">
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    v-model="dropDownFilter"
                    @click="setFilter(null)"
                  >
                    <q-item-section>
                      <q-item-label>All</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    v-model="dropDownFilter"
                    @click="setFilter(true)"
                  >
                    <q-item-section>
                      <q-item-label style="color: #53af50"
                        >Verified</q-item-label
                      >
                    </q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-close-popup
                    v-model="dropDownFilter"
                    @click="setFilter(false)"
                  >
                    <q-item-section>
                      <q-item-label style="color: red"
                        >Not Verified</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <q-input
                borderless
                dense
                debounce="300"
                v-model="filter"
                placeholder="Search"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <!-- body  -->
            <template v-slot:body="props">
              <q-tr :props="props" @click="onRowClick(props.row.id)">
                <q-td key="id" :props="props">
                  {{ props.row.id }}
                </q-td>
                <q-td key="firstName" :props="props">
                  {{ props.row.firstName }}
                </q-td>
                <q-td key="lastName" :props="props">
                  {{ props.row.lastName }}
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
                    color="white"
                    text-color="black"
                    @click="onRowClick(props.row.id)"
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

            <DialogBox />
          </q-table>
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
import { computed, onMounted, ref } from "vue";
import DialogBox from "./DialogBox.vue";

const componentStore = useComponentStore();

const filter = ref("");
const dropDownFilter = ref(null);
const users = ref([]);
const userStore = useUserStore();

const columns = [
  {
    name: "id",
    required: true,
    label: "Id",
    align: "left",
    field: "id",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "firstName",
    align: "center",
    label: "First Name",
    field: "firstName",
    sortable: true,
  },
  {
    name: "lastName",
    align: "center",
    label: "Last Name",
    field: "lastName",
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

const { loading } = storeToRefs(useComponentStore());
let totalUsers;
let totalVerifiedUsers;
let totalNotVerifiedUsers;

const toggleDialog = () => {
  componentStore.toggleDialog();
};

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    if (dropDownFilter.value === true) {
      return user.isVerified === true;
    } else if (dropDownFilter.value === false) {
      return user.isVerified === false;
    } else {
      return (
        user.firstName.toLowerCase().includes(filter.value.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filter.value.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.value.toLowerCase())
      );
    }
  });
});

const setFilter = (status) => {
  dropDownFilter.value = status;
};

const rows = filteredUsers;

const onRowClick = (id) => {
  console.log("user view");
};

onMounted(async () => {
  componentStore.setLoading(true);
  await HTTP.get(`users`)
    .then((res) => {
      componentStore.setLoading(false);
      users.value = res.data;
      totalUsers = res.data.length;
      totalVerifiedUsers = users.value.filter(
        (user) => user.isVerified && user
      ).length;
      totalNotVerifiedUsers = users.value.filter((user) => {
        if (!user.isVerified) {
          return users;
        }
      }).length;
    })
    .catch((err) => {
      componentStore.setLoading(false);
      Notify.create({
        message: "Users Not Found",
        type: "negative",
        position: "top",
      }).finally(() => {
        componentStore.setLoading(false);
      });
    });
});
</script>

<style scoped>
.nav-link:hover {
  background: #7eca81;
  color: white !important;
  transition: all ease-in-out 0.2s;
}
</style>

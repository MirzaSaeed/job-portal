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
          <q-breadcrumbs-el label="Job Applications" />
        </q-breadcrumbs>
        <q-separator />
        <div class="q-pa-md">
          <q-table
            :grid="$q.screen.xs"
            flat
            :loading="loading"
            bordered
            title="Job Application List"
            :rows="filteredApplications"
            :columns="columns"
            virtual-scroll
            :filter="filter"
          >
            <!-- top  -->

            <template v-slot:top-right>
              <q-btn-dropdown flat color="green" class="q-mx-sm" label="Status">
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    v-model="dropDownFilter"
                    @click="setFilter('')"
                  >
                    <q-item-section>
                      <q-item-label>All</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    v-model="dropDownFilter"
                    @click="setFilter('accepted')"
                  >
                    <q-item-section>
                      <q-item-label style="color: #53af50"
                        >Accepted</q-item-label
                      >
                    </q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-close-popup
                    v-model="dropDownFilter"
                    @click="setFilter('rejected')"
                  >
                    <q-item-section>
                      <q-item-label style="color: red">Rejected</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    v-model="dropDownFilter"
                    @click="setFilter('pending')"
                  >
                    <q-item-section>
                      <q-item-label style="color: orange">Pending</q-item-label>
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
                    v-if="props.row.status === 'accepted'"
                    text-color="green"
                    color="white"
                    label="Accepted"
                  />
                  <q-badge
                    v-else-if="props.row.status === 'pending'"
                    color="white"
                    text-color="orange"
                    label="Pending"
                  />
                  <q-badge
                    v-else-if="props.row.status === 'rejected'"
                    color="white"
                    text-color="red"
                    label="Rejected"
                  />
                </q-td>
                <q-td key="action" :props="props">
                  <span v-if="props.row.status === 'pending'">
                    <q-btn
                      flat
                      size="sm"
                      rounded
                      text-color="green"
                      toggleUser="true"
                      label="Accept"
                      class="nav-accept"
                    ></q-btn>
                    <q-btn
                      flat
                      size="sm"
                      text-color="red"
                      rounded
                      toggleUser="true"
                      label="Reject"
                      class="nav-reject"
                    ></q-btn>
                  </span>
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
                <q-td key="cv" :props="props">
                  <q-btn
                    flat
                    round
                    icon="visibility"
                    color="white"
                    text-color="black"
                    @click="downloadCV(props.row.id)"
                    toggleUser="true"
                    size="sm"
                    class="nav-link"
                  >
                    <q-tooltip transition-show="scale" transition-hide="scale">
                      Click to Download CV
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
const dropDownFilter = ref("");
const applicationList = ref([]);
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
    align: "center",
    label: "Action",
    field: "action",
  },
  {
    name: "cv",
    align: "center",
    label: "CV",
    field: "cv",
  },
];

const { loading } = storeToRefs(useComponentStore());

const toggleDialog = () => {
  componentStore.toggleDialog();
};

const filteredApplications = computed(() => {
  return applicationList.value.filter((user) => {
    return (
      user.firstName.toLowerCase().includes(filter.value.toLowerCase()) ||
      user.lastName.toLowerCase().includes(filter.value.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.value.toLowerCase()) ||
      user.status.toLowerCase().includes(dropDownFilter.value.toLowerCase())
    );
  });
});

const setFilter = (status) => {
  filter.value = status;
  dropDownFilter.value = status;
};

const rows = filteredApplications;

const onRowClick = (id) => {
  console.log("user view");
};

onMounted(async () => {
  componentStore.setLoading(true);
  await HTTP.get(`job-applications`)
    .then((res) => {
      componentStore.setLoading(false);
      applicationList.value = res.data;
    })
    .catch((err) => {
      componentStore.setLoading(false);
      Notify.create({
        message: "Users Applications Not Found",
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
.nav-accept:hover {
  background: #7eca81;
  color: white !important;
  transition: all ease-in-out 0.2s;
}
.nav-reject:hover {
  background: red;
  color: white !important;
  transition: all ease-in-out 0.2s;
}
</style>

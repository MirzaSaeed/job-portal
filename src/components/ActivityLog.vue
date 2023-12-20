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
          <q-breadcrumbs-el label="Activity Log" />
        </q-breadcrumbs>
        <q-separator />
        <div class="q-pa-md">
          <q-table
            :grid="$q.screen.xs"
            flat
            :loading="loading"
            bordered
            title="Activities"
            :rows="activityList?.data"
            :columns="columns"
            :pagination="pagination"
            virtual-scroll
          >
            <!-- body  -->
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="index" :props="props">
                  {{ props.row.logNumber }}
                </q-td>
                <q-td key="name" :props="props">
                  {{ props.row.name ? props.row.name : "User" }}
                </q-td>

                <q-td key="email" :props="props">
                  {{ props.row.email ? props.row.email : "No Email Exist" }}
                </q-td>

                <q-td key="activity" :props="props">
                  {{
                    `${
                      props.row.name ? props.row.name : "User"
                    } have perform an activity on ${props.row.activity}`
                  }}
                </q-td>
                <q-td key="time" :props="props">
                  {{ formatTime(props.row.createdAt) }}
                </q-td>
              </q-tr>
            </template>
            <template v-slot:pagination="">
              <q-btn
                icon="chevron_left"
                color="grey-8"
                round
                dense
                flat
                :disable="
                  activityList?.pagination?.hasPrevPage === false ? true : false
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
                  activityList?.pagination?.hasNextPage === false ? true : false
                "
                @click="handlePage(page + 1)"
              />
            </template>
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
import {  onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const componentStore = useComponentStore();
const userStore = useUserStore();

const activityList = ref([]);
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
    align: "left",
    field: "index",
    format: (val) => `${val}`,
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
    name: "activity",
    align: "left",
    label: "Activity",
    field: "activty",
  },
  {
    name: "time",
    align: "right",
    label: "Time",
    field: "time",
  },
];

const { loading } = storeToRefs(useComponentStore());


const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  const formattedHours = hours % 12 || 12;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const handlePage = (pageNumber) => {
  page.value = pageNumber;
  handlePagination(page.value);
};
const handlePagination = async (pageNumber) => {
  componentStore.setLoading(true);

  await HTTP.get(`api/log/get-logs?page=${pageNumber}`)
    .then((res) => {
      componentStore.setLoading(false);
      activityList.value = res.data;
      page.value = res.data.pagination.page;
      pagination.value.page = res.data.pagination.page;
      pagination.value.rowsPerPage = res.data.pagination.page;
      pagination.value.totalItems = res.data.pagination.totalUsers;
    })
    .catch((err) => {
      componentStore.setLoading(false);
      if (err.response?.status === 400) {
        userStore.logoutUser();
        router.push("/");
      } else {
        Notify.create({
          message: "Activities Not Found",
          type: "negative",
          position: "top",
        });
      }
    })
    .finally(() => {
      componentStore.setLoading(false);
    });
};
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

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
            :rows="applicationList?.data"
            :columns="columns"
            :pagination="pagination"
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
              <q-tr :props="props">
                <q-td key="index" :props="props">
                  {{ applicationList?.data?.indexOf(props.row) + 1 }}
                </q-td>
                <q-td key="userName" :props="props">
                  {{ props.row.userName }}
                </q-td>

                <q-td key="email" :props="props">
                  {{ props.row.email }}
                </q-td>
                <q-td key="age" :props="props">
                  {{ props.row.age }}
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
                      @click="handleAction('accepted', props.row.applicantId)"
                      class="nav-accept"
                    ></q-btn>
                    <q-btn
                      flat
                      size="sm"
                      text-color="red"
                      rounded
                      toggleUser="true"
                      label="Reject"
                      @click="handleAction('rejected', props.row.applicantId)"
                      class="nav-reject"
                    ></q-btn>
                  </span>
                  <q-btn
                    flat
                    round
                    icon="visibility"
                    color="white"
                    text-color="black"
                    @click="onRowClick(props.row.applicantId)"
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
                    icon="description"
                    color="white"
                    text-color="black"
                    @click="
                      downloadCV(props.row.applicantId, props.row.userName)
                    "
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
            <template v-slot:pagination="">
              <q-btn
                icon="chevron_left"
                color="grey-8"
                round
                dense
                flat
                :disable="
                  applicationList?.pagination?.hasPrevPage === false
                    ? true
                    : false
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
                  applicationList?.pagination?.hasNextPage === false
                    ? true
                    : false
                "
                @click="handlePage(page + 1)"
              />
            </template>
          </q-table>
          <q-dialog v-model="dialogValue">
            <q-card id="my-card">
              <q-card-section class="row items-center q-pb-none">
                <div class="text-subtitle1">Applicant Profile</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
              </q-card-section>
              <q-item class="q-pb-lg">
                <q-item-section side>
                  <q-avatar round size="48px">
                    <img src="../assets/svg-icon/user-profile.svg" alt="" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <span>Name: </span>
                    <span class="text-bold"> {{ userInfo?.userName }} </span>
                  </q-item-label>
                  <q-item-label>
                    Email:
                    <span class="text-bold"> {{ userInfo?.email }} </span>
                  </q-item-label>
                  <q-item-label>
                    CNIC:
                    <span class="text-bold"> {{ userInfo?.cnic }} </span>
                  </q-item-label>
                  <q-item-label>
                    Phone Number:
                    <span class="text-bold"> {{ userInfo?.phoneNumber }} </span>
                  </q-item-label>
                  <q-item-label>
                    Age:
                    <span class="text-bold"> {{ userInfo?.age }} </span>
                  </q-item-label>
                  <q-item-label>
                    Qualification:
                    <span class="text-bold">
                      {{ userInfo?.qualification }}
                    </span>
                  </q-item-label>
                  <q-item-label>
                    Address:
                    <span class="text-bold"> {{ userInfo?.address }} </span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
          </q-dialog>
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

const router = useRouter();

const componentStore = useComponentStore();
const userStore = useUserStore();
const { loading } = storeToRefs(useComponentStore());

const filter = ref("");
const dropDownFilter = ref("");
const dialogValue = ref(false);
const applicationList = ref({});
const userInfo = ref({});
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
    required: true,
    label: "Id",
    align: "left",
    field: "index",
    format: (val) => `${val}`,
  },
  {
    name: "userName",
    align: "center",
    label: "Name",
    field: "userName",
    sortable: true,
  },

  {
    name: "email",
    align: "left",
    label: "Email Address",
    field: "email",
  },
  {
    name: "age",
    align: "center",
    label: "Age",
    field: "age",
    sortable: true,
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

const handlePage = (pageNumber) => {
  page.value = pageNumber;
  handlePagination(page.value);
};

const setFilter = (status) => {
  dropDownFilter.value = status;
};

const onRowClick = async (applicantId) => {
  componentStore.setLoading(true);
  await HTTP.get(`api/applicantProfile/${applicantId}`)
    .then((res) => {
      componentStore.setLoading(false);
      userInfo.value = res.data.data;
      dialogValue.value = true;
    })
    .catch((err) => {
      console.log(err);
      componentStore.setLoading(false);
      if (err.response?.status === 400) {
        userStore.logoutUser();
        router.push("/");
      } else {
        Notify.create({
          message: "User Application Not Found",
          type: "negative",
          position: "top",
        });
        router.push("/*");
      }
    })
    .finally(() => {
      componentStore.setLoading(false);
    });
};

const handleAction = async (action, applicantId) => {
  componentStore.setLoading(true);
  await HTTP.patch(`api/update-applicants/${applicantId}`, { status: action })
    .then(() => {
      handlePagination(page.value).then(() => {
        componentStore.setLoading(false);
      });
    })
    .catch((err) => {
      componentStore.setLoading(false);
      if (err.response?.status === 400) {
        userStore.logoutUser();
        router.push("/");
      } else {
        Notify.create({
          message: "Users Application status not updated",
          type: "negative",
          position: "top",
        });
      }
    })
    .finally(() => {
      componentStore.setLoading(false);
    });
};
const downloadCV = async (applicantId, userName) => {
  componentStore.setLoading(true);

  await HTTP.get(`/api/download-cv/${applicantId}`, {
    responseType: "blob",
  })
    .then((res) => {
      const contentDisposition = res.headers["content-disposition"];
      const matches =
        contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const suggestedFilename = matches && matches[1];

      const blob = new Blob([res.data], {
        type: res.headers["content-type"],
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);

      link.download = suggestedFilename || `CV_${userName}.pdf`;

      link.click();
      componentStore.setLoading(false);
    })
    .catch((err) => {
      componentStore.setLoading(false);
      if (err.response?.status === 400) {
        userStore.logoutUser();
        router.push("/");
      } else {
        Notify.create({
          message: "Error in downloading CV",
          type: "negative",
          position: "top",
        });
      }
    });
};

const handlePagination = async (pageNumber) => {
  componentStore.setLoading(true);
  await HTTP.get(
    `api/get-applicants?page=${pageNumber}&search=${filter.value}&status=${dropDownFilter.value}`
  )
    .then((res) => {
      componentStore.setLoading(false);

      applicationList.value = res.data;
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
          message: "Applications Not Found",
          type: "negative",
          position: "top",
        });
        router.push("/*");
      }
    })
    .finally(() => {
      componentStore.setLoading(false);
    });
};

watchEffect(async () => {
  componentStore.setLoading(true);
  await HTTP.get(`api/get-applicants?search=${filter.value}`)
    .then((res) => {
      componentStore.setLoading(false);
      applicationList.value = res.data;
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
          message: "Users Not Found",
          type: "negative",
          position: "top",
        });
        router.push("/*");
      }
    })
    .finally(() => {
      componentStore.setLoading(false);
    });
});
watchEffect(async () => {
  componentStore.setLoading(true);
  await HTTP.get(`api/get-applicants?status=${dropDownFilter.value}`)
    .then((res) => {
      componentStore.setLoading(false);
      applicationList.value = res.data;
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
          message: "Users Not Found",
          type: "negative",
          position: "top",
        });
        router.push("/*");
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

#my-card {
  width: 100%;
  max-width: 450px;
}
</style>

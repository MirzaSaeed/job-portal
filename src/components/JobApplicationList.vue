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
          <q-breadcrumbs-el label="Job Applications" />
        </q-breadcrumbs>
        <q-separator />
        <div class="q-pa-md">
          <q-table
            :grid="$q.screen.xs"
            flat
            style="max-height: 450px; height: 100%"
            :loading="loading"
            bordered
            :rows-per-page-options="[0]"
            title="Job Application List"
            :rows="applicationList?.rows"
            :columns="columns"
            :pagination="pagination"
            virtual-scroll
            :filter="filter"
          >
            <!-- top  -->

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
                color="green"
                debounce="300"
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
                  {{ applicationList?.rows?.indexOf(props.row) + 1 }}
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
                <q-td key="action" auto-width :props="props">
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
                    :disable="loading"
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
                <q-td key="cv" auto-width :props="props">
                  <q-btn
                    flat
                    round
                    icon="description"
                    color="white"
                    text-color="black"
                    :disable="loading"
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
            <q-card
              class="my-card q-pb-md"
              style="width: 100%; max-width: 350px"
            >
              <q-card-section class="row items-center q-pb-sm">
                <div class="text-h6 text-bold">Applicant Profile</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
              </q-card-section>
              <q-separator />

              <q-card-section
                class="d-flex column justify-center items-center content-center q-pb-lg q-mt-md"
              >
                <div class="q-pb-sm">
                  <q-avatar round size="48px">
                    <img src="../assets/svg-icon/user-profile.svg" alt="" />
                  </q-avatar>
                </div>

                <q-item-label class="text-h6 q-pb-md">
                  {{ userInfo?.userName }}</q-item-label
                >
                <div>
                  <q-item-label class="text-subtitle1">
                    <span class="text-bold">Email: </span
                    >{{ userInfo?.email }}</q-item-label
                  >
                  <q-item-label class="text-subtitle1">
                    <span class="text-bold">CNIC: </span>
                    {{ userInfo?.cnic }}</q-item-label
                  >
                  <q-item-label class="text-subtitle1">
                    <span class="text-bold">Age: </span
                    >{{ userInfo?.age }}</q-item-label
                  >
                  <q-item-label class="text-subtitle1">
                    <span class="text-bold">Phone Number: </span>
                    {{ userInfo?.phoneNumber }}</q-item-label
                  >
                  <q-item-label class="text-subtitle1">
                    <span class="text-bold">Qualification: </span
                    >{{ userInfo?.qualification }}</q-item-label
                  >
                  <q-item-label class="text-subtitle1">
                    <span class="text-bold">Address: </span
                    >{{ userInfo?.address }}</q-item-label
                  >
                </div>
              </q-card-section>
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
import { onMounted, ref, watchEffect } from "vue";
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
const options = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Accepted",
    value: "accepted",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
  {
    label: "Pending",
    value: "pending",
  },
];

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
  await HTTP.get(`api/applicant/applicant-profile/${applicantId}`)
    .then((res) => {
      componentStore.setLoading(false);
      userInfo.value = res.data.data;
      dialogValue.value = true;
    })
    .catch((err) => {
      componentStore.setLoading(false);
      if (err.response?.status === 401) {
        Notify.create({
          type: "negative",
          position: "top",
          message: "Session timeout",
        });
        userStore.logoutUser();
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

const handleAction = async (action, applicantId) => {
  componentStore.setLoading(true);
  await HTTP.patch(`api/applicant/update-applicants/${applicantId}`, {
    status: action,
  })
    .then(() => {
      handlePagination(page.value, { value: "" }, { value: "" }).then(() => {
        componentStore.setLoading(false);
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
        userStore.logoutUser();
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
const downloadCV = async (applicantId, userName) => {
  componentStore.setLoading(true);

  await HTTP.get(`/api/applicant/download-cv/${applicantId}`, {
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
      if (err.response?.status === 401) {
        Notify.create({
          type: "negative",
          position: "top",
          message: "Session timeout",
        });
        userStore.logoutUser();
        router.push("/");
      } else {
        Notify.create({
          message: err.response?.data?.message,
          type: "negative",
          position: "top",
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
    `api/applicant/get-applicants?page=${pageNumber}&search=${filterValue?.value}&status=${dropDownFilterValue?.value}`
  )
    .then((res) => {
      componentStore.setLoading(false);

      applicationList.value = res.data?.data;
      page.value = res.data?.data?.pagination.page;
      pagination.value.page = res.data?.data?.pagination.page;
      pagination.value.totalItems = res.data?.data?.pagination.totalUsers;
    })
    .catch((err) => {
      componentStore.setLoading(false);
      if (err.response?.status === 401) {
        Notify.create({
          type: "negative",
          position: "top",
          message: "Session timeout",
        });
        userStore.logoutUser();
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
  handlePagination(
    page.value,
    filter.value || { value: "" },
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

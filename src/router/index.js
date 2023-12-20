import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import { useUserStore } from "@/store/user-store";

const routes = [
  // { redirect: "/login", path: "/" },
  {
    path: "/",
    name: "login",
    component: LoginView,
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (userStore.isAuth && userStore.token !== null) {
        next("/dashboard");
      } else {
        next();
      }
    },
  },
  {
    path: `/set-password/:token`,
    name: "password",
    component: () => import("../views/SetPasswordView.vue"),
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (userStore.isAuth && userStore.token !== null) {
        next("/dashboard");
      } else {
        next();
      }
    },
  },
  {
    path: "/forget-password",
    name: "forgetPassword",
    component: () => import("../views/ForgetPasswordView.vue"),
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (userStore.isAuth && userStore.token !== null) {
        next("/dashboard");
      } else {
        next();
      }
    },
  },
  {
    path: "/:catchAll(.*)",
    name: "notfound",
    component: () => import("../components/NotFoundException.vue"),
  },
  {
    path: "/job-application",
    name: "jobApplication",
    component: () => import("../views/JobApplicationView.vue"),
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (userStore.isAuth && userStore.token !== null) {
        next("/dashboard");
      } else {
        next();
      }
    },
  },

  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashboardView.vue"),
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (userStore.isAuth && userStore.token !== null) {
        next();
      } else {
        next("/");
      }
    },
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("../components/Dashboard.vue"),
      },
      {
        path: "user-list",
        name: "userList",
        component: () => import("../components/UserList.vue"),
      },
      {
        path: "activity-logs",
        name: "activtiyLog",
        component: () => import("../components/ActivityLog.vue"),
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore();
          if (
            userStore.isAuth &&
            userStore.token !== null &&
            userStore.isAdmin
          ) {
            next();
          } else {
            next("/");
          }
        },
      },
      {
        path: "job-applications",
        name: "jobApplications",
        component: () => import("../components/JobApplicationList.vue"),
      },
      {
        path: "profile",
        name: "userProfile",
        component: () => import("../components/UserProfile.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

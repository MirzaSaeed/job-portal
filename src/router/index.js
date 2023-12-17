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
      if (userStore.isAuth) {
        next("/dashboard");
      } else {
        next();
      }
    },
  },
  {
    path: "/set-password",
    name: "password",
    component: () => import("../views/SetPasswordView.vue"),
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (userStore.isAuth) {
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
      if (userStore.isAuth) {
        next("/dashboard");
      } else {
        next();
      }
    },
  },
  {
    path: "/job-application",
    name: "jobApplication",
    component: () => import("../views/JobApplicationView.vue"),
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (userStore.isAuth) {
        next("/dashboard");
      } else {
        next();
      }
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/RegisterView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashboardView.vue"),
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (userStore.isAuth) {
        next();
      } else {
        next("/login");
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
      },
      {
        path: "job-applications",
        name: "jobApplications",
        component: () => import("../components/JobApplicationList.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

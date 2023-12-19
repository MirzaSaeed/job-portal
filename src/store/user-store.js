import { HTTP } from "@/helper/http-config";
import { defineStore } from "pinia";
import { parseQuery } from "vue-router";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      users: [],
      isAuth: false,
      isAdmin: false,
      loading: false,
      user: null,
      profile: null,
      token: null,
    };
  },
  getters: {},

  actions: {
    // Get user profile
    getProfileData(payload) {
      this.profile = payload.data;
      return true;
    },
    setToken(token) {
      this.token = token;
      HTTP.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },
    setHeader() {
      HTTP.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
    },
    getUsers(payload) {
      this.users = [...payload];
      return true;
    },
    setLoading(bool) {
      this.loading = bool;
    },
    loginUser(payload) {
      // this.auth = {
      //   id: payload.id,
      //   email: payload.email,
      //   session: new Date(),
      // };
      this.isAuth = true;
      this.isAdmin = payload.user.isAdmin;
      return true;
    },
    userList(payload) {
      this.users.push(payload);
      return true;
    },
    getUser(payload) {
      this.user = payload.data;
    },
    logoutUser() {
      this.auth = null;
      this.isAuth = false;
      this.token = null;
      localStorage.clear();
      return true;
    },
  },
  persist: true,
});

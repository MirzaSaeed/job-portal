import { HTTP } from "@/helper/http-config";
import { defineStore } from "pinia";

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
      botChat: [],
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
      this.isAuth = true;
      this.isAdmin = payload.isAdmin;
      return true;
    },

    getUser(payload) {
      this.user = payload.data;
    },
    pushChat(payload) {
      this.botChat.push(payload);
    },

    logoutUser() {
      this.auth = null;
      this.isAuth = false;
      this.token = null;
      this.botChat = [];
      this.user = null;
      this.profile = null;
      this.isAdmin = false;
      localStorage.clear();
      return true;
    },
  },
  persist: true,
});

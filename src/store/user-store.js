import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      users: [],
      admin: {
        id: 1,
        email: "admin@test.com",
        password: "123",
      },
      auth: null,
      isAuth: false,
      loading: false,
      profile: null,
    };
  },
  getters: {},

  actions: {
    // Get user profile
    getProfileData(payload) {
      this.profile = payload[0];
      return true;
    },

    getUsers(payload) {
      this.users = [...payload];
      return true;
    },
    setLoading(bool) {
      this.loading = bool;
    },
    loginUser(payload) {
      this.auth = {
        id: payload.id,
        email: payload.email,
        session: new Date(),
      };
      this.isAuth = true;
      return true;
    },
    userList(payload) {
      this.users.push(payload);
      return true;
    },
    logoutUser() {
      this.auth = null;
      this.isAuth = false;
      return true;
    },
  },
  persist: true,
});

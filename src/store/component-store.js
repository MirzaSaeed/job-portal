import { defineStore } from "pinia";

export const useComponentStore = defineStore("component", {
  state: () => {
    return {
      drawer: true,
      dialog: false,
      loading: false,
    };
  },
  getters: {},

  actions: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    setLoading(bool) {
      this.loading = bool;
    },
    toggleDialog() {
      this.dialog = !this.dialog;
    },
  },
  persist: false,
});

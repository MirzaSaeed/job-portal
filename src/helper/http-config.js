import axios from "axios";

export const HTTP = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});
// HTTP.defaults.headers.common["Authorization"] = `Bearer ${JSON.parse(
//   localStorage.getItem("token")
// )}`;

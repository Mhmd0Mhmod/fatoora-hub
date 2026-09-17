import axios from "axios";
const baseURL = `${process.env.NEXT_PUBLIC_NET_API}/api/v1`;
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  fetchOptions: {
    credentials: "include",
  },
});
export default api;

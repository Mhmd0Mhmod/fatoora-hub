import axios from "axios";
const baseURL = `${process.env.NEXT_PUBLIC_NET_API}/api`;
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;

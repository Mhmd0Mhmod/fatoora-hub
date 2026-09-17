import axios from "axios";
import { getCookie } from "cookies-next/server";
const baseURL = `${process.env.NEXT_PUBLIC_NET_API}/api`;
const apiAuth = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiAuth.interceptors.request.use(async (config) => {
  const token = await getCookie("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default apiAuth;

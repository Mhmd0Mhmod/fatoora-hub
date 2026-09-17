import axios from "axios";
const baseURL = `${process.env.NEXT_PUBLIC_NET_API}/api/v1`;
const apiAuth = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiAuth;

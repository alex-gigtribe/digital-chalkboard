// frontend/src/api/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let authToken: string | null =
  typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

if (authToken) {
  axiosClient.defaults.headers.common.Authorization = `Bearer ${authToken}`;
}

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem("authToken", token);
    axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("authToken");
    delete axiosClient.defaults.headers.common.Authorization;
  }
}

axiosClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default axiosClient;

// frontend/src/api/axiosClient.ts
// Axios wrapper to handle:
//  - baseURL selection via .env (QA, Prod, Localhost)
//  - token storage + injection into headers
//  - automatic inclusion of Authorization header on each request

import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // change in .env for QA/Prod
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Holds JWT / session token for authenticated requests
let authToken: string | null =
  typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

if (authToken) {
  axiosClient.defaults.headers.common.Authorization = `Bearer ${authToken}`;
}

/**
 * setAuthToken
 * - Call this after login to store token in memory + localStorage.
 * - Automatically attaches token to all requests (via Authorization header).
 */
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

// Request interceptor ensures token always sent
axiosClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default axiosClient;

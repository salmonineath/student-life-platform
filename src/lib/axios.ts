import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://studentlifeapis.onrender.com/api/v1";

// ─────────────────────────────────────────────
// Axios Instance
// ─────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,           // Keep this for refresh token cookie
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// ─────────────────────────────────────────────
// Request Interceptor - Attach Access Token if available
// ─────────────────────────────────────────────

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");   // Change key if you use different name

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────
// State for Refresh Logic
// ─────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void }[] = [];
let isLoggingOut = false;

export const setLoggingOut = (value: boolean) => {
  isLoggingOut = value;
};
  failedQueue = [];

const redirectToLogin = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// ─────────────────────────────────────────────
// Response Interceptor (Improved)
// ─────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh-token");
    const isUnauthorized = error.response?.status === 401;

    if (isLoggingOut) {
      redirectToLanding();
      return Promise.reject(error);
    }
    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh-token");
      isRefreshing = false;
      redirectToLanding();
      return Promise.reject(error);
    }

    // Normal 401 → try to refresh token
    if (isUnauthorized && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint
        await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Refresh successful → retry original request
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Other errors (non-401) just reject normally
    return Promise.reject(error);
  }
);

export default axiosInstance;
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ─────────────────────────────────────────────
// Axios Instance
// ─────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies (refresh token) with every request
});

// ─────────────────────────────────────────────
// State (module-level to share across requests)
// ─────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void }[] = [];
let isLoggingOut = false;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
export const setLoggingOut = (value: boolean) => {
  isLoggingOut = value;
};

const processQueue = (error: any) => {
  failedQueue.forEach((request) => {
    if (error) request.reject(error);
    else request.resolve(null);
  });
  failedQueue = [];
};

const redirectToLanding = () => {
  // Change this to your actual landing page if it's not /login
  window.location.href = "/"; // or "/login" or "/landing"
  // Optional: clear any local state/cookies here if needed
};

// ─────────────────────────────────────────────
// Response Interceptor
// ─────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (isLoggingOut) {
      redirectToLanding();
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh-token");

    // 1. Refresh token request itself failed (401) → refresh token is invalid/expired
    if (isRefreshRequest && isUnauthorized) {
      isRefreshing = false;
      processQueue(error);
      redirectToLanding();
      return Promise.reject(error);
    }

    // 2. Any other 401 → try to refresh access token (only once per request)
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
        // Call refresh endpoint (uses httpOnly refresh token cookie)
        await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Refresh succeeded → process queued requests and retry original
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        // Refresh failed → this will be caught by the "isRefreshRequest" block above
        // which will redirect to landing page
        processQueue(refreshError);
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
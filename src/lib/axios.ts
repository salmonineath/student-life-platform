import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ─────────────────────────────────────────────
// Axios Instance
// ─────────────────────────────────────────────

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // always send cookies with every request
});

// ─────────────────────────────────────────────
// State
// ─────────────────────────────────────────────

// Prevents multiple refresh token requests from firing at the same time
let isRefreshing = false;

// When a refresh is in progress, other failed requests wait here
// Once refresh is done, they all retry at once
let failedQueue: {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}[] = [];

// Set to true during logout so the interceptor skips refresh and redirects immediately
let isLoggingOut = false;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

// Call this before logout so the interceptor knows not to attempt a refresh
export const setLoggingOut = (value: boolean) => {
  isLoggingOut = value;
};

// Resolve or reject all queued requests depending on whether refresh succeeded
const processQueue = (error: any) => {
  failedQueue.forEach((request) => {
    if (error) request.reject(error);
    else request.resolve(null);
  });
  failedQueue = [];
};

const redirectToLogin = () => {
  window.location.href = "/login";
};

// ─────────────────────────────────────────────
// Response Interceptor
// ─────────────────────────────────────────────

axiosInstance.interceptors.response.use(
  // Successful response — just pass it through
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest?.url?.includes(
      "/auth/refresh-token",
    );
    const isUnauthorized = error.response?.status === 401;

    // User is logging out — skip refresh and redirect immediately
    if (isLoggingOut) {
      redirectToLogin();
      return Promise.reject(error);
    }

    // The refresh token request itself got a 401 — session is completely dead
    if (isRefreshRequest && isUnauthorized) {
      isRefreshing = false;
      processQueue(error);
      redirectToLogin();
      return Promise.reject(error);
    }

    // Any other 401 — access token is expired, try to refresh it
    if (isUnauthorized && !originalRequest._retry) {
      // Another refresh is already running — queue this request and wait for it to finish
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      // Mark this request so it doesn't get retried more than once
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Ask the backend for a new access token using the refresh token cookie
        await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        // Refresh succeeded — retry all queued requests with the new access token
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed — the isRefreshRequest block above will handle redirect
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

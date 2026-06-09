import axios from "axios";
import { clearSessionCookie } from "@/lib/session";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // browser automatically sends cookies on every request
});

let isRefreshing = false;
let failedQueue: { resolve: (v: any) => void; reject: (r?: any) => void }[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(null)));
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const is401 = error.response?.status === 401;
    const isRefreshUrl = originalRequest?.url?.includes("/auth/refresh-token");

    // Refresh token itself expired/failed → clear session and go back to the
    // landing (home) page.
    if (isRefreshUrl && is401) {
      isRefreshing = false;
      processQueue(error);
      await clearSessionCookie().catch(() => {});
      if (typeof window !== "undefined") window.location.href = "/student-life";
      return Promise.reject(error);
    }

    // Access token expired → try refresh once
    if (is401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true });
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh request failed (token invalid/expired) → clear session and
        // send the user back to the landing (home) page.
        processQueue(refreshError);
        await clearSessionCookie().catch(() => {});
        if (typeof window !== "undefined") window.location.href = "/student-life";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

// import axios from "axios";

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// let isRefreshing = false;
// let failedQueue: {
//   resolve: (value: any) => void;
//   reject: (reason?: any) => void;
// }[] = [];

// const processQueue = (error: any) => {
//   failedQueue.forEach((req) => (error ? req.reject(error) : req.resolve(null)));
//   failedQueue = [];
// };

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const isUnauthorized = error.response?.status === 401;
//     const isRefreshRequest = originalRequest?.url?.includes(
//       "/auth/refresh-token",
//     );

//     // Refresh token itself is expired → go to login
//     if (isRefreshRequest && isUnauthorized) {
//       isRefreshing = false;
//       processQueue(error);
//       window.location.href = "/login";
//       return Promise.reject(error);
//     }

//     // Access token expired → try refresh
//     if (isUnauthorized && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(() => axiosInstance(originalRequest))
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         // when access token expires, the refresh token is sent automatically via cookie
//         await axios.post(
//           `${API_URL}/auth/refresh-token`,
//           {},
//           { withCredentials: true },
//         );
//         processQueue(null);
//         return axiosInstance(originalRequest);
//       } catch (refreshError: any) {
//         // If refresh also fails (e.g. refresh token expired), log out and redirect to login
//         await axiosInstance.post("/auth/logout", {}, { withCredentials: true });

//         if (typeof window !== "undefined") {
//           window.location.href = "/login";
//         }

//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// export default axiosInstance;

import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Attach token from localStorage on every request
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// If token is expired (401) → clear everything and go to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");

        // Clear the middleware flag cookie
        document.cookie =
          "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

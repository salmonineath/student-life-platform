// import { createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   getMeRequest,
//   loginRequest,
//   registerRequest,
//   requestLogout,
// } from "./request";
// import { LoginPayload, RegisterPayload } from "@/types/authType";

// export const loginAction = createAsyncThunk(
//   "/auth/login",
//   async (payload: LoginPayload, { rejectWithValue }) => {
//     try {
//       const res = await loginRequest(payload);
//       // No setSessionCookie — refreshToken httpOnly cookie is set by Spring directly
//       return {
//         user: res.data.user,
//         accessToken: res.data.accessToken,
//       };
//     } catch (error: any) {
//       return rejectWithValue(error?.response?.data?.message || "Login failed.");
//     }
//   },
// );

// export const registerAction = createAsyncThunk(
//   "/auth/register",
//   async (payload: RegisterPayload, { rejectWithValue }) => {
//     try {
//       const res = await registerRequest(payload);
//       return { user: res.data.user };
//     } catch (error: any) {
//       return rejectWithValue(
//         error?.response?.data?.message || "Register failed.",
//       );
//     }
//   },
// );

// export const getMeAction = createAsyncThunk(
//   "/auth/me",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await getMeRequest();
//       return res.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error?.response?.data?.message || "Failed to get profile.",
//       );
//     }
//   },
// );

// export const logoutAction = createAsyncThunk(
//   "/auth/logout",
//   async (_, { rejectWithValue }) => {
//     try {
//       await requestLogout(); // Spring clears the httpOnly refreshToken cookie
//     } catch (error: any) {
//       return rejectWithValue(
//         error?.response?.data?.message || "Logout failed.",
//       );
//     }
//   },
// );

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMeRequest, loginRequest, registerRequest } from "./request";
import { LoginPayload, RegisterPayload } from "@/types/authType";

export const loginAction = createAsyncThunk(
  "/auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await loginRequest(payload);

      // Save token + set middleware flag cookie (30 days)
      localStorage.setItem("accessToken", res.data.accessToken);
      document.cookie = "isLoggedIn=true; path=/; max-age=2592000";

      return {
        accessToken: res.data.accessToken,
        user: res.data.user,
      };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Login failed.");
    }
  },
);

export const registerAction = createAsyncThunk(
  "/auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await registerRequest(payload);
      return { user: res.data.user };
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Register failed.",
      );
    }
  },
);

export const getMeAction = createAsyncThunk(
  "/auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMeRequest();
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to get profile.",
      );
    }
  },
);

export const logoutAction = createAsyncThunk(
  "/auth/logout",
  async () => {
    localStorage.removeItem("accessToken");
    document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  },
);
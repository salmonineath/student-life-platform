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

      localStorage.setItem("accessToken", res.data.accessToken);
      document.cookie = "isLoggedIn=true; path=/; max-age=2592000";

      // ✅ Register OneSignal player ID after login
      try {
        const OneSignal = (await import("react-onesignal")).default;
        await OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
          allowLocalhostAsSecureOrigin: true,
        });
        await OneSignal.Slidedown.promptPush();
        const playerId = OneSignal.User.PushSubscription.id;
        if (playerId) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/onesignal/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${res.data.accessToken}`,
            },
            body: JSON.stringify({ playerId }),
          });
        }
      } catch (e) {
        console.warn("[OneSignal] Registration skipped:", e);
      }

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

      // ✅ Save token same way as login
      localStorage.setItem("accessToken", res.data.accessToken);
      document.cookie = "isLoggedIn=true; path=/; max-age=2592000";

      // ✅ Register OneSignal player ID after successful registration
      try {
        const OneSignal = (await import("react-onesignal")).default;
        await OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
          allowLocalhostAsSecureOrigin: true,
        });
        await OneSignal.Slidedown.promptPush();
        const playerId = OneSignal.User.PushSubscription.id;
        if (playerId) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/onesignal/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${res.data.accessToken}`,
            },
            body: JSON.stringify({ playerId }),
          });
        }
      } catch (e) {
        console.warn("[OneSignal] Registration skipped:", e);
      }

      return {
        accessToken: res.data.accessToken,
        user: res.data.user,
      };
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
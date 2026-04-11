import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMeRequest,
  loginRequest,
  registerRequest,
  requestLogout,
} from "./request";
import { LoginPayload, RegisterPayload } from "@/types/authType";
import { clearSessionCookie, setSessionCookie } from "@/lib/session";

/**
 * Login — sets cookie, returns user + token from the login response.
 * Does NOT call /me. The login response already contains the user.
 */
export const loginAction = createAsyncThunk(
  "/auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await loginRequest(payload);
      await setSessionCookie();
      return {
        user: res.data.user,
        accessToken: res.data.accessToken,
      };
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login failed.";
      return rejectWithValue(message);
    }
  },
);

/**
 * Register — sets cookie, returns user from the register response.
 * Does NOT call /me. The register response already contains the user.
 */
export const registerAction = createAsyncThunk(
  "/auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await registerRequest(payload);
      await setSessionCookie();
      return {
        user: res.data.user,
      };
    } catch (error: any) {
      const message = error?.response?.data?.message || "Register failed.";
      return rejectWithValue(message);
    }
  },
);

/**
 * Fetch current user profile.
 * Call this on dashboard mount to rehydrate state after a hard refresh,
 * NOT after login/register (the response already gives you the user).
 */
export const getMeAction = createAsyncThunk(
  "/auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMeRequest();
      return res.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to get profile.";
      return rejectWithValue(message);
    }
  },
);

export const logoutAction = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await requestLogout();
      await clearSessionCookie();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Logout failed.";
      return rejectWithValue(message);
    }
  },
);

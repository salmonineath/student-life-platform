import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMeRequest,
  loginRequest,
  registerRequest,
  requestLogout,
} from "./request";
import { LoginPayload, RegisterPayload } from "@/types/authType";
import { setSessionCookie, clearSessionCookie } from "@/lib/session";
import { getApiErrorMessage } from "@/lib/apiError";

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
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(
          error,
          "We couldn't sign you in. Please check your details and try again.",
        ),
      );
    }
  },
);

export const registerAction = createAsyncThunk(
  "/auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await registerRequest(payload);
      await setSessionCookie();
      return { user: res.data.user, accessToken: res.data.accessToken };
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(
          error,
          "We couldn't create your account. Please try again.",
        ),
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
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, "We couldn't load your account right now."),
      );
    }
  },
);

export const logoutAction = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await requestLogout();
      await clearSessionCookie();
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, "We couldn't sign you out. Please try again."),
      );
    }
  },
);


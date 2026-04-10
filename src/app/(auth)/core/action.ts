import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMeRequest, loginRequest, registerRequest, requestLogout} from "./request";
import { LoginPayload, RegisterPayload } from "@/types/authType";
import { clearSessionCookie, setSessionCookie } from "@/lib/session";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

export const loginAction = createAsyncThunk(
    "/auth/login",
    async (payload: LoginPayload, {dispatch, rejectWithValue}) => {
        try {
            const res = await loginRequest(payload);
            await setSessionCookie();
            await dispatch(getMeAction());
            return {
                user : res.data.user,
                accessToken: res.data.accessToken,
            };
        } catch (error: any) {
            console.log(error);
            const message = error?.res?.data?.message || "Login failed.";
            return rejectWithValue(message)
        }
    }
);

export const registerAction = createAsyncThunk(
    "/auth/register",
    async (payload: RegisterPayload, {dispatch, rejectWithValue}) => {
        try {
            const res = await registerRequest(payload);
            await setSessionCookie();
            await dispatch(getMeAction());
            return {
                user: res.data.user
            };
        } catch (error: any) {
            console.log(error);
            const message = error?.res?.data?.message || "Register failed.";
            return rejectWithValue(message)
        }
    }
);

export const getMeAction = createAsyncThunk(
    "/me",
    async (_, {rejectWithValue}) => {
        try {
            const res = await getMeRequest();
            return res.data;
        } catch (error: any) {
            console.log(error);
            const message = error?.res?.data?.message || "Failed to get profile.";
            return rejectWithValue(message)
        }
    }
);

export const logoutAction = createAsyncThunk(
    "/auth/logout",
    async (_, {rejectWithValue}) => {
        try {
            await requestLogout();
            await clearSessionCookie();
        } catch (error: any) {
            console.log(error);
            const message = error?.res?.data?.message || "Failed to get profile.";
            return rejectWithValue(message)
        }
    }
)
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginRequest} from "./request";
import { LoginPayload } from "@/types/authType";

export const loginAction = createAsyncThunk(
    "/auth/login",
    async (payload: LoginPayload, {rejectWithValue}) => {
        try {
            const res = await loginRequest(payload);
            return {
                user : res.data.user,
                accessToken: res.data.accessToken,
            };
        } catch (error: any) {
            console.log(error);
            const message = error?.res?.data?.message || "Login falied.";
            return rejectWithValue(message)
        }
    }
)
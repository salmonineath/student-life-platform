import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProfileRequest } from "./request";

export const getProfileAction = createAsyncThunk(
    "profile/getProfile",
    async (_, {rejectWithValue}) => {
        try {
            const res = await getProfileRequest();
            return res.data;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message ?? "Falied to fetch profile"
            )
        }
    }
)
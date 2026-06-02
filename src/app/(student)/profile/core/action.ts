import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProfileRequest, updateProfileRequest } from "./request";
import { UpdateProfilePayload } from "@/types/userType";

export const getProfileAction = createAsyncThunk(
  "profile/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProfileRequest();
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch profile",
      );
    }
  },
);

export const updateProfileAction = createAsyncThunk(
  "profile/updateProfile",
  async (payload: UpdateProfilePayload, { rejectWithValue }) => {
    try {
      const res = await updateProfileRequest(payload);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to update profile",
      );
    }
  },
);

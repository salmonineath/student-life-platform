import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProfileRequest, updateProfileRequest } from "./request";
import { UpdateProfilePayload } from "@/types/userType";
import { getApiErrorMessage } from "@/lib/apiError";

export const getProfileAction = createAsyncThunk(
  "profile/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProfileRequest();
      return res.data;
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, "We couldn't load your profile right now."),
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
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, "We couldn't save your changes. Please try again."),
      );
    }
  },
);

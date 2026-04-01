import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

interface User {
  id: number;
  fullname: string;
  username: string;
  email: string;
  phone?: string;
  university?: string;
  major?: string;
  academicYear?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
};

// 🔥 Fetch current user (/me)
export const fetchMe = createAsyncThunk("auth/fetchMe", async () => {
  const res = await axiosInstance.get("/me");
  return res.data.data;
});

// 🔥 Logout
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await axiosInstance.post("/auth/logout");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchMe
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;

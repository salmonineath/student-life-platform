import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMeAPI, registerAPI, logoutAPI, loginAPI } from "./authAPI";
import { AuthState, LoginData, RegisterData } from "@/types/authType";

const initialState: AuthState = {
  user: null,
  loading: true,
};

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchMeAPI();
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "/auth?login",
  async (data: LoginData, { rejectWithValue }) => {
    try {
      return await loginAPI(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      return await registerAPI(data);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await logoutAPI();
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

      // loginUser
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })

      // registerUser
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })

      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;

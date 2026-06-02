import { createSlice } from "@reduxjs/toolkit";
import { UserProfile } from "@/types/userType";
import { getProfileAction, updateProfileAction } from "./action";

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  updateError: string | null;
  updateSuccess: boolean;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  updating: false,
  updateError: null,
  updateSuccess: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(state) {
      state.profile = null;
      state.error = null;
    },
    clearUpdateStatus(state) {
      state.updateError = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileAction.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfileAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateProfileAction.pending, (state) => {
        state.updating = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateProfileAction.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.profile = action.payload;
      })
      .addCase(updateProfileAction.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload as string;
      });
  },
});

export const { clearProfile, clearUpdateStatus } = profileSlice.actions;
export default profileSlice.reducer;

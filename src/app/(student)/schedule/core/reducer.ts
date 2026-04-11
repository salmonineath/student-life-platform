import { createSlice } from "@reduxjs/toolkit";
import { getMyScheduleAction } from "./action";
import { Schedule, ScheduleState } from "@/types/scheduleTypes";
import { PayloadAction } from "@reduxjs/toolkit";

const initialState: ScheduleState = {
  schedules: [],
  loading: false,
  error: null,
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    clearScheduleError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyScheduleAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getMyScheduleAction.fulfilled,
        (state, action: PayloadAction<Schedule[]>) => {
          state.loading = false;
          state.schedules = action.payload;
        },
      )
      .addCase(getMyScheduleAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearScheduleError } = scheduleSlice.actions;
export default scheduleSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getMyScheduleAction,
  createOneTimeScheduleAction,
  createRecurringScheduleAction,
  updateScheduleAction,
  deleteScheduleAction,
} from "./action";
import {
  Schedule,
  ScheduleState,
  SingleScheduleResponse,
} from "@/types/scheduleTypes";

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

      // ── GET ──────────────────────────────────────────────────────────────────
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
      })

      // ── CREATE ONE-TIME ───────────────────────────────────────────────────────
      .addCase(createOneTimeScheduleAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createOneTimeScheduleAction.fulfilled,
        (state, action: PayloadAction<SingleScheduleResponse>) => {
          state.loading = false;
          // SingleScheduleResponse matches the shape of Schedule,
          // cast is safe because type field drives the discriminated union
          state.schedules.push(action.payload as unknown as Schedule);
        },
      )
      .addCase(createOneTimeScheduleAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ── CREATE RECURRING ──────────────────────────────────────────────────────
      .addCase(createRecurringScheduleAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createRecurringScheduleAction.fulfilled,
        (state, action: PayloadAction<SingleScheduleResponse>) => {
          state.loading = false;
          state.schedules.push(action.payload as unknown as Schedule);
        },
      )
      .addCase(createRecurringScheduleAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ── UPDATE ────────────────────────────────────────────────────────────────
      .addCase(updateScheduleAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateScheduleAction.fulfilled,
        (state, action: PayloadAction<SingleScheduleResponse>) => {
          state.loading = false;
          const idx = state.schedules.findIndex(
            (s) => s.id === action.payload.id,
          );
          if (idx !== -1)
            state.schedules[idx] = action.payload as unknown as Schedule;
        },
      )
      .addCase(updateScheduleAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ── DELETE ────────────────────────────────────────────────────────────────
      .addCase(deleteScheduleAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteScheduleAction.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.schedules = state.schedules.filter(
            (s) => s.id !== action.payload,
          );
        },
      )
      .addCase(deleteScheduleAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearScheduleError } = scheduleSlice.actions;
export default scheduleSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { scheduleService } from "./scheduleAPI";
import {
  ScheduleItem,
  ScheduleState,
  OneTimeScheduleRequest,
  RecurringScheduleRequest,
  ScheduleUpdateRequest,
} from "@/types/scheduleTypes";

const initialState: ScheduleState = {
  items: [],
  loading: false,
  error: null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchMySchedule = createAsyncThunk<
  ScheduleItem[],
  { startDate?: string; endDate?: string } | undefined
>("schedule/fetchMySchedule", async (dateRange, { rejectWithValue }) => {
  try {
    const res = await scheduleService.getMySchedule(
      dateRange?.startDate,
      dateRange?.endDate,
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ?? "Failed to fetch schedule",
    );
  }
});

export const createOneTimeSchedule = createAsyncThunk<
  ScheduleItem,
  OneTimeScheduleRequest
>("schedule/createOneTime", async (payload, { rejectWithValue }) => {
  try {
    const res = await scheduleService.createOneTime(payload);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ?? "Failed to create one-time schedule",
    );
  }
});

export const createRecurringSchedule = createAsyncThunk<
  ScheduleItem,
  RecurringScheduleRequest
>("schedule/createRecurring", async (payload, { rejectWithValue }) => {
  try {
    const res = await scheduleService.createRecurring(payload);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ?? "Failed to create recurring schedule",
    );
  }
});

export const updateSchedule = createAsyncThunk<
  ScheduleItem,
  { id: number; payload: ScheduleUpdateRequest }
>("schedule/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const res = await scheduleService.updateSchedule(id, payload);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ?? "Failed to update schedule",
    );
  }
});

export const deleteSchedule = createAsyncThunk<number, number>(
  "schedule/delete",
  async (id, { rejectWithValue }) => {
    try {
      await scheduleService.deleteSchedule(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Failed to delete schedule",
      );
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── fetchMySchedule ────────────────────────────────────────────────────
      .addCase(fetchMySchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySchedule.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchMySchedule.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // ── createOneTimeSchedule ──────────────────────────────────────────────
      .addCase(createOneTimeSchedule.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // ── createRecurringSchedule ────────────────────────────────────────────
      .addCase(createRecurringSchedule.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // ── updateSchedule ─────────────────────────────────────────────────────
      .addCase(updateSchedule.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })

      // ── deleteSchedule ─────────────────────────────────────────────────────
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export default scheduleSlice.reducer;

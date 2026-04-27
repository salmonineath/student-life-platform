import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyScheduleRequest,
  createOneTimeScheduleRequest,
  createRecurringScheduleRequest,
  updateScheduleRequest,
  deleteScheduleRequest,
} from "./request";
import {
  ScheduleParams,
  OneTimeScheduleRequest,
  RecurringScheduleRequest,
  ScheduleUpdateRequest,
} from "@/types/scheduleTypes";

// ── GET ────────────────────────────────────────────────────────────────────────

export const getMyScheduleAction = createAsyncThunk(
  "schedule/getMySchedule",
  async (
    params: ScheduleParams | undefined = undefined,
    { rejectWithValue },
  ) => {
    try {
      const res = await getMyScheduleRequest(params);
      return res.data; // ScheduleListResponse → .data is Schedule[]
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch schedules.",
      );
    }
  },
);

// ── CREATE ONE-TIME ────────────────────────────────────────────────────────────

export const createOneTimeScheduleAction = createAsyncThunk(
  "schedule/createOneTime",
  async (body: OneTimeScheduleRequest, { rejectWithValue }) => {
    try {
      return await createOneTimeScheduleRequest(body); // SingleScheduleResponse directly
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to create schedule.",
      );
    }
  },
);

// ── CREATE RECURRING ───────────────────────────────────────────────────────────

export const createRecurringScheduleAction = createAsyncThunk(
  "schedule/createRecurring",
  async (body: RecurringScheduleRequest, { rejectWithValue }) => {
    try {
      return await createRecurringScheduleRequest(body); // SingleScheduleResponse directly
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to create schedule.",
      );
    }
  },
);

// ── UPDATE ─────────────────────────────────────────────────────────────────────

export const updateScheduleAction = createAsyncThunk(
  "schedule/update",
  async (
    { id, body }: { id: number; body: ScheduleUpdateRequest },
    { rejectWithValue },
  ) => {
    try {
      return await updateScheduleRequest(id, body); // SingleScheduleResponse directly
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to update schedule.",
      );
    }
  },
);

// ── DELETE ─────────────────────────────────────────────────────────────────────

export const deleteScheduleAction = createAsyncThunk(
  "schedule/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteScheduleRequest(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to delete schedule.",
      );
    }
  },
);

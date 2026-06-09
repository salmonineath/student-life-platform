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
import { getApiErrorMessage } from "@/lib/apiError";

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
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, "We couldn't load your schedule right now."),
      );
    }
  },
);

// ── CREATE ONE-TIME ────────────────────────────────────────────────────────────

export const createOneTimeScheduleAction = createAsyncThunk(
  "schedule/createOneTime",
  async (body: OneTimeScheduleRequest, { rejectWithValue }) => {
    try {
      const res = await createOneTimeScheduleRequest(body);
      return res.data; // ApiResponse<SingleScheduleResponse> → unwrap to the schedule
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(
          error,
          "We couldn't create your schedule. Please try again.",
        ),
      );
    }
  },
);

// ── CREATE RECURRING ───────────────────────────────────────────────────────────

export const createRecurringScheduleAction = createAsyncThunk(
  "schedule/createRecurring",
  async (body: RecurringScheduleRequest, { rejectWithValue }) => {
    try {
      const res = await createRecurringScheduleRequest(body);
      return res.data; // ApiResponse<SingleScheduleResponse> → unwrap to the schedule
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(
          error,
          "We couldn't create your schedule. Please try again.",
        ),
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
      const res = await updateScheduleRequest(id, body);
      return res.data; // ApiResponse<SingleScheduleResponse> → unwrap to the schedule
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(
          error,
          "We couldn't update your schedule. Please try again.",
        ),
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
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(
          error,
          "We couldn't delete this schedule. Please try again.",
        ),
      );
    }
  },
);

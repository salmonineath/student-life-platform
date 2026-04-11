import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMyScheduleRequest } from "./request";
import { ScheduleParams } from "@/types/scheduleTypes";

/**
 * Fetch schedules with optional date range.
 *
 * Usage:
 *   dispatch(getMyScheduleAction())                                     // all schedules
 *   dispatch(getMyScheduleAction({ startDate: "2026-03-24", endDate: "2026-03-30" }))  // weekly
 *   dispatch(getMyScheduleAction({ startDate: "2026-03-30", endDate: "2026-03-30" }))  // daily
 *   dispatch(getMyScheduleAction({ startDate: "2026-03-01", endDate: "2026-03-31" }))  // monthly
 */
export const getMyScheduleAction = createAsyncThunk(
  "/schedule/my-schedule",
  async (
    params: ScheduleParams | undefined = undefined,
    { rejectWithValue },
  ) => {
    try {
      const res = await getMyScheduleRequest(params);
      return res.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to fetch schedules.";
      return rejectWithValue(message);
    }
  },
);

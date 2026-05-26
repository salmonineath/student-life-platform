import axiosInstance from "@/lib/axios";
import {
  ScheduleParams,
  ScheduleResponse,
  SingleScheduleResponse,
  OneTimeScheduleRequest,
  RecurringScheduleRequest,
  ScheduleUpdateRequest,
} from "@/types/scheduleTypes";

// ── GET ────────────────────────────────────────────────────────────────────────

/** Fetch all schedules (optionally filtered by date range). */
export const getMyScheduleRequest = async (
  params?: ScheduleParams,
): Promise<ScheduleResponse> => {
  const res = await axiosInstance.get<ScheduleResponse>(
    "/schedule/my-schedule",
    { params },
  );
  return res.data;
};

// ── CREATE ─────────────────────────────────────────────────────────────────────

/** POST /schedule/one-time — create a single-occurrence schedule. */
export const createOneTimeScheduleRequest = async (
  body: OneTimeScheduleRequest,
): Promise<SingleScheduleResponse> => {
  const res = await axiosInstance.post<SingleScheduleResponse>(
    "/schedule/one-time",
    body,
  );
  return res.data;
};

/** POST /schedule/recurring — create a weekly repeating schedule. */
export const createRecurringScheduleRequest = async (
  body: RecurringScheduleRequest,
): Promise<SingleScheduleResponse> => {
  const res = await axiosInstance.post<SingleScheduleResponse>(
    "/schedule/recurring",
    body,
  );
  return res.data;
};

// ── UPDATE ─────────────────────────────────────────────────────────────────────

/** PUT /schedule/:id — update any field(s) of an existing schedule. */
export const updateScheduleRequest = async (
  id: number,
  body: ScheduleUpdateRequest,
): Promise<SingleScheduleResponse> => {
  const res = await axiosInstance.put<SingleScheduleResponse>(
    `/schedule/${id}`,
    body,
  );
  return res.data;
};

// ── DELETE ─────────────────────────────────────────────────────────────────────

/** DELETE /schedule/:id — permanently remove a schedule. */
export const deleteScheduleRequest = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/schedule/${id}`);
};

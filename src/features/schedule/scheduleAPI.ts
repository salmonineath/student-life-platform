import axiosInstance from "@/lib/axios";
import {
  ScheduleApiResponse,
  ScheduleItem,
  OneTimeScheduleRequest,
  RecurringScheduleRequest,
  ScheduleUpdateRequest,
} from "@/types/scheduleTypes";

interface SingleScheduleResponse {
  status: number;
  success: boolean;
  message: string;
  data: ScheduleItem;
}

interface DeleteResponse {
  status: number;
  success: boolean;
  message: string;
  data: null;
}

export const scheduleService = {
  /**
   * GET /schedule/my-schedule
   * Pass startDate + endDate to filter by range (weekly / daily / monthly).
   * Omit params to get all schedules.
   */
  getMySchedule: async (
    startDate?: string,
    endDate?: string,
  ): Promise<ScheduleApiResponse> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const res = await axiosInstance.get<ScheduleApiResponse>(
      "/schedule/my-schedule",
      { params },
    );
    return res.data;
  },

  /** GET /schedule/:id */
  getById: async (id: number): Promise<SingleScheduleResponse> => {
    const res = await axiosInstance.get<SingleScheduleResponse>(
      `/schedule/${id}`,
    );
    return res.data;
  },

  /** POST /schedule/one-time */
  createOneTime: async (
    payload: OneTimeScheduleRequest,
  ): Promise<SingleScheduleResponse> => {
    const res = await axiosInstance.post<SingleScheduleResponse>(
      "/schedule/one-time",
      payload,
    );
    return res.data;
  },

  /** POST /schedule/recurring */
  createRecurring: async (
    payload: RecurringScheduleRequest,
  ): Promise<SingleScheduleResponse> => {
    const res = await axiosInstance.post<SingleScheduleResponse>(
      "/schedule/recurring",
      payload,
    );
    return res.data;
  },

  /** PUT /schedule/:id */
  updateSchedule: async (
    id: number,
    payload: ScheduleUpdateRequest,
  ): Promise<SingleScheduleResponse> => {
    const res = await axiosInstance.put<SingleScheduleResponse>(
      `/schedule/${id}`,
      payload,
    );
    return res.data;
  },

  /** DELETE /schedule/:id */
  deleteSchedule: async (id: number): Promise<DeleteResponse> => {
    const res = await axiosInstance.delete<DeleteResponse>(`/schedule/${id}`);
    return res.data;
  },
};

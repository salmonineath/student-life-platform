import axiosInstance from "@/lib/axios";
import { ScheduleParams, ScheduleResponse } from "@/types/scheduleTypes";

export const getMyScheduleRequest = async (
  params?: ScheduleParams,
): Promise<ScheduleResponse> => {
  const res = await axiosInstance.get<ScheduleResponse>(
    "/schedule/my-schedule",
    { params },
  );
  return res.data;
};

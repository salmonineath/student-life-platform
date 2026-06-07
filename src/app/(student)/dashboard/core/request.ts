import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponseType";
import { UserProfile } from "@/types/userType";
import { Assignments } from "@/types/assignmentType";
import { Schedule } from "@/types/scheduleTypes";
import { GroupSummary } from "@/types/groupMessageType";

export const getMeRequest = async (): Promise<ApiResponse<UserProfile>> => {
  const res = await axiosInstance.get<ApiResponse<UserProfile>>("/me");
  return res.data;
};

export const getMyAssignmentsRequest = async (): Promise<ApiResponse<Assignments[]>> => {
  const res = await axiosInstance.get<ApiResponse<Assignments[]>>("/assignments/my-assignment");
  return res.data;
};

export const getTodaySchedulesRequest = async (
  startDate: string,
  endDate: string,
): Promise<ApiResponse<Schedule[]>> => {
  const res = await axiosInstance.get<ApiResponse<Schedule[]>>("/schedule/my-schedule", {
    params: { startDate, endDate },
  });
  return res.data;
};

export const getMyGroupsRequest = async (): Promise<ApiResponse<GroupSummary[]>> => {
  const res = await axiosInstance.get<ApiResponse<GroupSummary[]>>("/chat/groups");
  return res.data;
};

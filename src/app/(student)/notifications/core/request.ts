import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponseType";
import { Notification } from "@/types/notificationType";

export const getNotificationsRequest = async (): Promise<ApiResponse<Notification[]>> => {
  const res = await axiosInstance.get<ApiResponse<Notification[]>>("/notification");
  return res.data;
};

export const getUnreadCountRequest = async (): Promise<ApiResponse<number>> => {
  const res = await axiosInstance.get<ApiResponse<number>>("/notification/unread/count");
  return res.data;
};

export const markAsReadRequest = async (id: number): Promise<ApiResponse<unknown>> => {
  const res = await axiosInstance.patch<ApiResponse<unknown>>(`/notification/${id}/read`);
  return res.data;
};

export const markAllAsReadRequest = async (): Promise<ApiResponse<unknown>> => {
  const res = await axiosInstance.put<ApiResponse<unknown>>("/notification/mark-all-read");
  return res.data;
};

export const deleteNotificationRequest = async (id: number): Promise<ApiResponse<unknown>> => {
  const res = await axiosInstance.delete<ApiResponse<unknown>>(`/notification/${id}`);
  return res.data;
};

import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponseType";
import {
  Notification,
  PaginatedNotifications,
  UnreadCountPayload,
} from "@/types/notificationType";

// `data` is a paginated envelope ({ items, pagination }); the union tolerates a
// bare array too so a backend shape change never crashes the page.
export const getNotificationsRequest = async (): Promise<
  ApiResponse<PaginatedNotifications | Notification[]>
> => {
  const res = await axiosInstance.get<
    ApiResponse<PaginatedNotifications | Notification[]>
  >("/notification");
  return res.data;
};

// Tolerates either a bare number or an envelope ({ count } / { unreadCount }).
export const getUnreadCountRequest = async (): Promise<
  ApiResponse<UnreadCountPayload>
> => {
  const res = await axiosInstance.get<ApiResponse<UnreadCountPayload>>(
    "/notification/unread/count",
  );
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

// No bulk endpoint yet — clears read notifications by deleting them one by one.
// Returns only the ids that were actually deleted server-side, so the UI never
// removes anything the backend kept. See docs/notification-deep-link-request.md
// (and the clear-read request) for the bulk endpoint we've asked the backend for.
export const clearReadNotificationsRequest = async (
  ids: number[],
): Promise<number[]> => {
  const results = await Promise.allSettled(
    ids.map((id) => deleteNotificationRequest(id)),
  );
  return ids.filter((_, i) => results[i].status === "fulfilled");
};

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import {
  getNotificationsRequest,
  getUnreadCountRequest,
  markAsReadRequest,
  markAllAsReadRequest,
  deleteNotificationRequest,
  clearReadNotificationsRequest,
} from "./request";

export const getNotificationsAction = createAsyncThunk(
  "notification/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getNotificationsRequest();
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch notifications",
      );
    }
  },
);

export const getUnreadCountAction = createAsyncThunk(
  "notification/getUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUnreadCountRequest();
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch unread count",
      );
    }
  },
);

export const markAsReadAction = createAsyncThunk(
  "notification/markAsRead",
  async (id: number, { rejectWithValue }) => {
    try {
      await markAsReadRequest(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to mark notification as read",
      );
    }
  },
);

export const markAllAsReadAction = createAsyncThunk(
  "notification/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await markAllAsReadRequest();
      return true;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to mark all as read",
      );
    }
  },
);

export const clearReadNotificationsAction = createAsyncThunk(
  "notification/clearRead",
  async (_, { getState, rejectWithValue }) => {
    try {
      const readIds = (getState() as RootState).notification.notifications
        .filter((n) => n.read)
        .map((n) => n.id);
      if (readIds.length === 0) return [];
      const deletedIds = await clearReadNotificationsRequest(readIds);
      // If the server kept every one of them, the delete endpoint isn't working.
      if (deletedIds.length === 0) {
        return rejectWithValue(
          "Couldn't clear notifications — the server didn't delete them.",
        );
      }
      return deletedIds;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to clear notifications",
      );
    }
  },
);

export const deleteNotificationAction = createAsyncThunk(
  "notification/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteNotificationRequest(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to delete notification",
      );
    }
  },
);

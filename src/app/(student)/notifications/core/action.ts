import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getNotificationsRequest,
  getUnreadCountRequest,
  markAsReadRequest,
  markAllAsReadRequest,
  deleteNotificationRequest,
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

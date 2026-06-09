import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import { getApiErrorMessage } from "@/lib/apiError";
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
      // The endpoint returns a paginated envelope ({ items, pagination }).
      // Tolerate a bare array too, in case the backend shape varies.
      const data = res.data;
      const items = Array.isArray(data) ? data : data.items;
      return items ?? [];
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(
          error,
          "We couldn't load your notifications right now.",
        ),
      );
    }
  },
);

export const getUnreadCountAction = createAsyncThunk(
  "notification/getUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUnreadCountRequest();
      // Accept a bare number or an envelope ({ count } / { unreadCount }) so the
      // badge keeps working if the backend shape changes (the list endpoint
      // already moved to a paginated envelope).
      const data = res.data;
      const count =
        typeof data === "number"
          ? data
          : (data.count ?? data.unreadCount ?? 0);
      return Number(count) || 0;
    } catch (error) {
      // Surfaced only in logs — this poll runs silently in the background.
      return rejectWithValue(
        getApiErrorMessage(error, "Failed to fetch unread count"),
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
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, "We couldn't mark that as read. Please try again."),
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
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(
          error,
          "We couldn't mark everything as read. Please try again.",
        ),
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
          "We couldn't clear your read notifications. Please try again.",
        );
      }
      return deletedIds;
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(
          error,
          "We couldn't clear your notifications right now.",
        ),
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
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(
          error,
          "We couldn't delete that notification. Please try again.",
        ),
      );
    }
  },
);

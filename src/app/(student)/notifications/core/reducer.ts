import { createSlice } from "@reduxjs/toolkit";
import { Notification } from "@/types/notificationType";
import {
  getNotificationsAction,
  getUnreadCountAction,
  markAsReadAction,
  markAllAsReadAction,
  deleteNotificationAction,
  clearReadNotificationsAction,
} from "./action";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markingAll: boolean;
  clearingRead: boolean;
  clearError: string | null; // shown inline, not as the full-page error
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  markingAll: false,
  clearingRead: false,
  clearError: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    dismissClearError: (state) => {
      state.clearError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch all ──
      .addCase(getNotificationsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotificationsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.read).length;
      })
      .addCase(getNotificationsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ── Unread count (topnav badge) ──
      .addCase(getUnreadCountAction.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      // ── Mark one as read ──
      .addCase(markAsReadAction.fulfilled, (state, action) => {
        const item = state.notifications.find((n) => n.id === action.payload);
        if (item && !item.read) {
          item.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // ── Mark all as read ──
      .addCase(markAllAsReadAction.pending, (state) => {
        state.markingAll = true;
      })
      .addCase(markAllAsReadAction.fulfilled, (state) => {
        state.markingAll = false;
        state.notifications.forEach((n) => (n.read = true));
        state.unreadCount = 0;
      })
      .addCase(markAllAsReadAction.rejected, (state) => {
        state.markingAll = false;
      })

      // ── Clear all read ──
      .addCase(clearReadNotificationsAction.pending, (state) => {
        state.clearingRead = true;
        state.clearError = null;
      })
      .addCase(clearReadNotificationsAction.fulfilled, (state, action) => {
        state.clearingRead = false;
        // Only drop the ids the server actually deleted — never lie to the user.
        const deleted = new Set(action.payload);
        state.notifications = state.notifications.filter(
          (n) => !deleted.has(n.id),
        );
      })
      .addCase(clearReadNotificationsAction.rejected, (state, action) => {
        state.clearingRead = false;
        state.clearError = action.payload as string;
      })

      // ── Delete ──
      .addCase(deleteNotificationAction.fulfilled, (state, action) => {
        const item = state.notifications.find((n) => n.id === action.payload);
        if (item && !item.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(
          (n) => n.id !== action.payload,
        );
      });
  },
});

export const { dismissClearError } = notificationSlice.actions;
export default notificationSlice.reducer;

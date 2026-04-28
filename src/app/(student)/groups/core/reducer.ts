import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage, GroupChatState, PresenceEvent } from "@/types/groupMessageType";
import { getAllGroupAction, getChatHistoryAction, clearChatHistoryAction } from "./action";

const initialState: GroupChatState = {
  groups:           [],
  messageMap:       {},
  activeId:         null,
  input:            "",
  search:           "",
  showClearConfirm: false,
  loading:          false,
  historyLoading:   false,
  error:            null,
};

// Sort groups: most recent lastMessageTime first
function sortGroups(groups: GroupChatState["groups"]) {
  return [...groups].sort((a, b) => {
    if (!a.lastMessageTime && !b.lastMessageTime) return 0;
    if (!a.lastMessageTime) return 1;
    if (!b.lastMessageTime) return -1;
    return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
  });
}

const groupChatSlice = createSlice({
  name: "groupChat",
  initialState,
  reducers: {
    setActiveId(state, action: PayloadAction<number | null>) {
      state.activeId = action.payload;
      // Clear unread when opening a group
      if (action.payload !== null) {
        const group = state.groups.find((g) => g.assignmentId === action.payload);
        if (group) group.unreadCount = 0;
      }
    },
    setInput(state, action: PayloadAction<string>) {
      state.input = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setShowClearConfirm(state, action: PayloadAction<boolean>) {
      state.showClearConfirm = action.payload;
    },

    appendOptimisticMessage(state, action: PayloadAction<ChatMessage>) {
      const msg  = action.payload;
      const prev = state.messageMap[msg.assignmentId] ?? [];
      state.messageMap[msg.assignmentId] = [...prev, msg];
      const group = state.groups.find((g) => g.assignmentId === msg.assignmentId);
      if (group) {
        group.lastMessage       = msg.content;
        group.lastMessageTime   = msg.createdAt;
        group.lastMessageSender = msg.senderFullname;
      }
      state.groups = sortGroups(state.groups);
      state.input = "";
    },

    appendIncomingMessage(state, action: PayloadAction<ChatMessage>) {
      const msg  = action.payload;
      const prev = state.messageMap[msg.assignmentId] ?? [];

      const optimisticIndex = prev.findIndex(
        (m) =>
          m.id > 1_000_000_000_000 &&
          m.senderId === msg.senderId &&
          m.content  === msg.content
      );

      if (optimisticIndex !== -1) {
        const updated = [...prev];
        updated[optimisticIndex] = msg;
        state.messageMap[msg.assignmentId] = updated;
      } else {
        state.messageMap[msg.assignmentId] = [...prev, msg];
      }

      const group = state.groups.find((g) => g.assignmentId === msg.assignmentId);
      if (group) {
        group.lastMessage       = msg.content;
        group.lastMessageTime   = msg.createdAt;
        group.lastMessageSender = msg.senderFullname;
        // Increment unread only if this group isn't active
        if (state.activeId !== msg.assignmentId) {
          group.unreadCount = (group.unreadCount ?? 0) + 1;
        }
      }

      // Always re-sort so the group with the newest message floats to top
      state.groups = sortGroups(state.groups);
    },

    updatePresence(state, action: PayloadAction<PresenceEvent>) {
      const { assignmentId, onlineCount } = action.payload;
      const group = state.groups.find((g) => g.assignmentId === assignmentId);
      if (group) {
        // Store onlineCount on the group summary for the header to display
        (group as any).onlineCount = onlineCount;
      }
    },

    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllGroupAction.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(getAllGroupAction.fulfilled, (state, action) => {
        state.loading = false;
        state.groups  = sortGroups(action.payload);
      })
      .addCase(getAllGroupAction.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      });

    builder
      .addCase(getChatHistoryAction.pending, (state) => {
        state.historyLoading = true;
        state.error          = null;
      })
      .addCase(getChatHistoryAction.fulfilled, (state, action) => {
        state.historyLoading = false;
        const { assignmentId, messages } = action.payload;
        state.messageMap[assignmentId]   = messages;
      })
      .addCase(getChatHistoryAction.rejected, (state, action) => {
        state.historyLoading = false;
        state.error          = action.payload as string;
      });

    builder
      .addCase(clearChatHistoryAction.fulfilled, (state, action) => {
        const id = action.payload;
        state.messageMap[id]   = [];
        state.showClearConfirm = false;
        const group = state.groups.find((g) => g.assignmentId === id);
        if (group) {
          group.lastMessage       = undefined;
          group.lastMessageTime   = undefined;
          group.lastMessageSender = undefined;
          group.unreadCount       = 0;
        }
      })
      .addCase(clearChatHistoryAction.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setActiveId,
  setInput,
  setSearch,
  setShowClearConfirm,
  appendOptimisticMessage,
  appendIncomingMessage,
  updatePresence,
  clearError,
} = groupChatSlice.actions;

export default groupChatSlice.reducer;
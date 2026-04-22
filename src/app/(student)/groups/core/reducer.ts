import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {ChatMessage, GroupChatState} from "@/types/groupMessageType";
import {getAllGroupAction, getChatHistoryAction, clearChatHistoryAction} from "./action";

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

const groupChatSlice = createSlice({
    name: "groupChat",
    initialState,
    reducers: {
        setActiveId(state, action: PayloadAction<number | null>) {
            state.activeId = action.payload;
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
        // Optimistic send before WebSocket confirms
        appendOptimisticMessage(state, action: PayloadAction<ChatMessage>) {
            const msg = action.payload;
            const prev = state.messageMap[msg.assignmentId] ?? [];
            state.messageMap[msg.assignmentId] = [...prev, msg];

            // update group;s last message preview
            const group = state.groups.find((g) => g.assignmentId === msg.assignmentId);

            if (group) {
                group.lastMessage = msg.content;
                group.lastMessageTime = msg.createdAt;
                group.lastMessageSender = msg.senderFullname;
            }
            state.input = "";
        },

        // Real-time message from WebSocket
        // If the incoming message matches an optimistic one (same sender + content + close timestamp),
        // REPLACE the optimistic entry with the real one (which has the server's real id).
        // Otherwise just append it.
        appendIncomingMessage(state, action: PayloadAction<ChatMessage>) {
            const msg  = action.payload;
            const prev = state.messageMap[msg.assignmentId] ?? [];
 
            // Find an optimistic placeholder: negative/temp id (Date.now()), same sender + content
            const optimisticIndex = prev.findIndex(
                (m) =>
                    m.id > 1_000_000_000_000 && // Date.now() is always 13 digits
                    m.senderId === msg.senderId &&
                    m.content  === msg.content
                );
 
            if (optimisticIndex !== -1) {
                // Replace the optimistic message with the real one from the server
                const updated = [...prev];
                updated[optimisticIndex] = msg;
                state.messageMap[msg.assignmentId] = updated;
            } else {
                // Not our message — just append (someone else sent it)
                state.messageMap[msg.assignmentId] = [...prev, msg];
            }
 
            // Always update last message preview
            const group = state.groups.find((g) => g.assignmentId === msg.assignmentId);
            if (group) {
                group.lastMessage       = msg.content;
                group.lastMessageTime   = msg.createdAt;
                group.lastMessageSender = msg.senderFullname;
            }
        },
        clearError(state) {
          state.error = null;
        },
    },
    extraReducers: (builder) => {
        // get group action
        builder
        .addCase(getAllGroupAction.pending, (state) => {
            state.loading = true,
            state.error = null;
        })
        .addCase(getAllGroupAction.fulfilled, (state, action) => {
            state.loading = false;
            state.groups = action.payload;
        })
        .addCase(getAllGroupAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // get chat history
        builder
        .addCase(getChatHistoryAction.pending, (state) => {
            state.historyLoading = true;
            state.error = null;
        })
        .addCase(getChatHistoryAction.fulfilled, (state, action) => {
            state.historyLoading = false;
            const {assignmentId, messages} = action.payload;
            state.messageMap[assignmentId] = messages;
        })
        .addCase(getChatHistoryAction.rejected, (state, action) => {
            state.historyLoading = false;
            state.error = action.payload as string;
        })

        // clear chat history
        builder 
        .addCase(clearChatHistoryAction.fulfilled, (state, action) => {
            const id = action.payload;
            state.messageMap[id] = [];
            state.showClearConfirm = false;
            const group = state.groups.find((g) => g.assignmentId === id);
            if (group) {
                group.lastMessage = undefined;
                group.lastMessageTime = undefined;
                group.lastMessageSender = undefined;
            }
        })
        .addCase(clearChatHistoryAction.rejected, (state, action) => {
            state.error = action.payload as string;
        })
    }
})

export const {
    setActiveId,
    setInput,
    setSearch,
    setShowClearConfirm,
    appendOptimisticMessage,
    appendIncomingMessage,
    clearError,
} = groupChatSlice.actions;

export default groupChatSlice.reducer;
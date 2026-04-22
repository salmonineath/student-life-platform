import { createAsyncThunk } from "@reduxjs/toolkit";
import {getAllGroupsRequest, getChatHistoryRequest, clearChatHistoryRequest} from "./request";

export const getAllGroupAction = createAsyncThunk(
    "/groupChat/fetchGroups",
    async (_, {rejectWithValue}) => {
        try {
            const res = await getAllGroupsRequest();
            return res.data;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message ?? "Failed to fetch groups"
            )
        }
    }
)

export const getChatHistoryAction = createAsyncThunk(
    "/groupChat/fetchHistory",
    async (assignmentId: number, {rejectWithValue}) => {
        try {
            const res = await getChatHistoryRequest(assignmentId);
            return {assignmentId, messages: res.data};
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message ?? "Failed to fetch chat history"
            )
        }
    }
)

export const clearChatHistoryAction = createAsyncThunk(
    "/groupChat/clearHistory",
    async (assignmentId: number, {rejectWithValue}) => {
        try {
            const res = await clearChatHistoryRequest(assignmentId);
            return assignmentId;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message ?? "Failed to clear chat history"
            )
        }
    }
)
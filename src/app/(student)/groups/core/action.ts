import { createAsyncThunk } from "@reduxjs/toolkit";
import {getAllGroupsRequest, getChatHistoryRequest, clearChatHistoryRequest} from "./request";
import { getApiErrorMessage } from "@/lib/apiError";

export const getAllGroupAction = createAsyncThunk(
    "/groupChat/fetchGroups",
    async (_, {rejectWithValue}) => {
        try {
            const res = await getAllGroupsRequest();
            return res.data;
        } catch (error) {
            return rejectWithValue(
                getApiErrorMessage(error, "We couldn't load your study groups right now.")
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
        } catch (error) {
            return rejectWithValue(
                getApiErrorMessage(error, "We couldn't load this conversation right now.")
            )
        }
    }
)

export const clearChatHistoryAction = createAsyncThunk(
    "/groupChat/clearHistory",
    async (assignmentId: number, {rejectWithValue}) => {
        try {
            await clearChatHistoryRequest(assignmentId);
            return assignmentId;
        } catch (error) {
            return rejectWithValue(
                getApiErrorMessage(error, "We couldn't clear this conversation. Please try again.")
            )
        }
    }
)
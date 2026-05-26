import axiosInstance from "@/lib/axios";
import {ApiResponse, GroupSummary, ChatMessage} from "@/types/groupMessageType";

export const getAllGroupsRequest = async (): Promise<ApiResponse<GroupSummary[]>> => {
    const res = await axiosInstance.get<ApiResponse<GroupSummary[]>>("/chat/groups")
    return res.data;
}

export const getChatHistoryRequest = async (assignmentId: number): Promise<ApiResponse<ChatMessage[]>> => {
    const res = await axiosInstance.get<ApiResponse<ChatMessage[]>>(`/chat/${assignmentId}/history`)
    return res.data;
}

export const clearChatHistoryRequest = async (assignmentId: number): Promise<ApiResponse<null>> => {
    const res = await axiosInstance.delete<ApiResponse<null>>(`/chat/${assignmentId}/history`)
    return res.data;
}
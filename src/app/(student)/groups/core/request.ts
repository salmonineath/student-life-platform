import axiosInstance from "@/lib/axios";

export interface GroupSummary {
  assignmentId: number;
  assignmentTitle: string;
  subject: string;
  ownerName: string;
  ownerUsername: string;
  memberCount: number;
  lastMessage: string | null;
  lastMessageTime: string | null;
  lastMessageSender: string | null;
}

export interface ChatMessage {
  id: number;
  assignmentId: number;
  senderId: number;
  senderName: string;
  senderUsername: string;
  content: string;
  createdAt: string;
}

export const getMyGroupsRequest = async (): Promise<GroupSummary[]> => {
  const res = await axiosInstance.get("/chat/groups");
  return res.data.data;
};

export const getChatHistoryRequest = async (assignmentId: number): Promise<ChatMessage[]> => {
  const res = await axiosInstance.get(`/chat/${assignmentId}/history`);
  return res.data.data;
};

export const clearChatHistoryRequest = async (assignmentId: number): Promise<void> => {
  await axiosInstance.delete(`/chat/${assignmentId}/history`);
};
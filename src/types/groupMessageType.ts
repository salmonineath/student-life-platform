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

export interface GroupSummaryResponse {
    status: number;
    success: boolean;
    message: string;
    data: GroupSummary[];
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

export interface ChatMessageResponse {
    status: number;
    success: boolean;
    message: string;
    data: ChatMessage;
}
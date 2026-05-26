export interface GroupSummary {
  assignmentId: number;
  assignmentTitle: string;
  subject: string;
  ownerName: string;
  ownerUsername: string;
  memberCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSender?: string;
  unreadCount?: number; // tracked client-side
}

export interface ChatMessage {
  id: number;
  assignmentId: number;
  senderId: number;
  senderFullname: string;
  senderUsername: string;
  content: string;
  createdAt: string;
}

export interface ChatMessageRequest {
  assignmentId: number;
  content: string;
}

export interface Member {
  id: number;
  fullname: string;
  username: string;
  email: string;
  university?: string;
  major?: string;
  academicYear?: string;
  online: boolean;
}

export interface PresenceEvent {
  assignmentId: number;
  onlineCount: number;
  onlineUserIds: number[];
}

export interface GroupChatState {
  groups:           GroupSummary[];
  messageMap:       Record<number, ChatMessage[]>;
  activeId:         number | null;
  input:            string;
  search:           string;
  showClearConfirm: boolean;
  loading:          boolean;
  historyLoading:   boolean;
  error:            string | null;
}

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}
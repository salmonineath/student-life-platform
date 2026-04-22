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
}

export interface ChatMessage {
  id: number;
  assignmentId: number;
  senderId: number;
  senderFullname: string;
  senderUsername: string;
  content: string;
  createdAt: string; // Java Instant → ISO 8601 string
}

// Matches ChatMessageRequest.java — sent over WebSocket
export interface ChatMessageRequest {
  assignmentId: number;
  content: string;
}

// Full app state shape
export interface ChatState {
  groups: GroupSummary[];
  messageMap: Record<number, ChatMessage[]>;
  activeId: number | null;
  input: string;
  search: string;
  showClearConfirm: boolean;
  loading: boolean;
  error: string | null;
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
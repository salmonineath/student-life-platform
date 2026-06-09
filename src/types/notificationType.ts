export type NotificationType =
  | "CHAT"
  | "ASSIGNMENT"
  | "INVITE"
  | "ANNOUNCEMENT"
  | "REMINDER"
  | "SCHEDULE"
  | "SYSTEM";

export interface Notification {
  id: number;
  recipientId: number;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean; // backend `isRead` serializes as `read`
  createdAt: string;

  // ── Deep-link target (optional until the backend ships it) ──
  // The id of the entity this notification refers to, e.g. the assignment id
  // for an ASSIGNMENT notification or the group id for a CHAT/INVITE.
  referenceId?: number | string | null;
  // Optional explicit override. If the backend sends a ready-made relative
  // path (e.g. "/assignments/42"), the frontend uses it as-is and ignores
  // the type→route mapping. Must be a relative in-app path, not an absolute URL.
  link?: string | null;
}

// The /notification endpoint returns a paginated envelope: the list lives under
// `items`, with `pagination` metadata alongside it.
export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginatedNotifications {
  items: Notification[];
  pagination: Pagination;
}

// The unread-count endpoint returns a bare number today, but we accept a small
// envelope too so a backend change can't break the bell badge.
export type UnreadCountPayload =
  | number
  | { count?: number; unreadCount?: number };

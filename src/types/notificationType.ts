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
}

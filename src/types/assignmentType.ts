export type AssignmentStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "OVERDUE";

export interface Assignments {
  id: number;
  title: string;
  description: string;
  subject: string;
  startDate?: string;
  dueDate: string; // ISO date string from Java LocalDateTime
  status: AssignmentStatus;
  progress: number; // 0–100
  scheduleId: number | null; // ← linked schedule, set by backend on create
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentResponse {
  status: number;
  success: boolean;
  message: string;
  data: Assignments[];
}

export interface AssignmentByIdResponse {
  status: number;
  success: boolean;
  message: string;
  data: Assignments;
}

export type CreateAssignmentPayload = {
  title: string;
  description: string;
  subject: string;
  startDate: string;
  dueDate: string;
};

export type UpdateAssignmentPayload = {
  title?: string;
  description?: string;
  subject?: string;
  dueDate?: string;
};

export type UpdateProgressPayload = {
  // status: AssignmentStatus;
  progress: number; // 0–100
};

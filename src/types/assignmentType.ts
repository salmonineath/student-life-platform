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
  dueDate: string; // ISO date string from Java Date
  status: AssignmentStatus;
  progress: number; // 0–100
  scheduleId: number | null;
  createdAt: string; // ISO instant string
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
  dueDate: string;
};

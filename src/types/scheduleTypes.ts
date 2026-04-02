// ─── Enums / Literals ────────────────────────────────────────────────────────

export type ScheduleType = "RECURRING" | "ONE_TIME";
export type ViewMode = "weekly" | "daily" | "monthly";

// ─── Core entity ─────────────────────────────────────────────────────────────

export interface ScheduleCreatedBy {
  id: number;
  fullname: string;
  username: string;
}

export interface ScheduleItem {
  id: number;
  title: string;
  description: string;
  type: ScheduleType;
  // ONE_TIME
  startTime: string | null; // "2026-04-10T09:00:00"
  endTime: string | null;
  // RECURRING
  dayOfWeek: number | null; // 0=Sun … 6=Sat
  recurringStartTime: string | null; // "HH:mm:ss"
  recurringEndTime: string | null;
  location: string;
  important: boolean; // API returns "important" (not "isImportant")
  createdBy: ScheduleCreatedBy;
}

// ─── API response wrapper ─────────────────────────────────────────────────────

export interface ScheduleApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: ScheduleItem[];
}

// ─── Request payloads (mirror backend DTOs exactly) ───────────────────────────

export interface OneTimeScheduleRequest {
  title: string;
  description?: string;
  startTime: string; // "YYYY-MM-DDTHH:mm:ss"
  endTime: string;
  location?: string;
  isImportant?: boolean;
}

export interface RecurringScheduleRequest {
  title: string;
  description?: string;
  dayOfWeek: number; // 0=Sun … 6=Sat
  recurringStartTime: string; // "HH:mm:ss"
  recurringEndTime: string;
  location?: string;
  isImportant?: boolean;
}

// All fields optional — only non-null fields applied by backend
export interface ScheduleUpdateRequest {
  title?: string;
  description?: string;
  location?: string;
  isImportant?: boolean;
  // ONE_TIME
  startTime?: string;
  endTime?: string;
  // RECURRING
  dayOfWeek?: number;
  recurringStartTime?: string;
  recurringEndTime?: string;
}

// ─── Redux state ──────────────────────────────────────────────────────────────

export interface ScheduleState {
  items: ScheduleItem[];
  loading: boolean;
  error: string | null;
}

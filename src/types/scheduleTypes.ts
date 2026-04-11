export type ScheduleType = "ONE_TIME" | "RECURRING";

export interface ScheduleCreatedBy {
  id: number;
  fullname: string;
  username: string;
}

export interface OneTimeSchedule {
  id: number;
  title: string;
  description: string;
  type: "ONE_TIME";
  startTime: string;       // ISO datetime e.g. "2026-03-25T09:00:00"
  endTime: string;         // ISO datetime e.g. "2026-03-25T11:30:00"
  dayOfWeek: null;
  recurringStartTime: null;
  recurringEndTime: null;
  location: string;
  createdBy: ScheduleCreatedBy;
  important: boolean;
}

export interface RecurringSchedule {
  id: number;
  title: string;
  description: string;
  type: "RECURRING";
  startTime: null;
  endTime: null;
  dayOfWeek: number;       // 1 = Monday ... 7 = Sunday
  recurringStartTime: string; // "HH:mm:ss"
  recurringEndTime: string;   // "HH:mm:ss"
  location: string;
  createdBy: ScheduleCreatedBy;
  important: boolean;
}

export type Schedule = OneTimeSchedule | RecurringSchedule;

// ── Query params ───────────────────────────────────────────────────────────────

export interface ScheduleParams {
  startDate?: string; // "YYYY-MM-DD"
  endDate?: string;   // "YYYY-MM-DD"
}

// ── API response ───────────────────────────────────────────────────────────────

export interface ScheduleResponse {
  status: number;
  success: boolean;
  message: string;
  data: Schedule[];
}

// ── Redux state ────────────────────────────────────────────────────────────────

export interface ScheduleState {
  schedules: Schedule[];
  loading: boolean;
  error: string | null;
}
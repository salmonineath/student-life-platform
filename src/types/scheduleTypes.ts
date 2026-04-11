export type ScheduleType = "ONE_TIME" | "RECURRING";

export interface ScheduleCreatedBy {
  id: number;
  fullname: string;
  username: string;
}

export interface OneTimeSchedule {
  id: number;
  title: string;
  description: string | null;
  type: "ONE_TIME";
  startTime: string; // "YYYY-MM-DDTHH:mm:ss"
  endTime: string; // "YYYY-MM-DDTHH:mm:ss"
  dayOfWeek: null;
  recurringStartTime: null;
  recurringEndTime: null;
  location: string | null;
  createdBy: ScheduleCreatedBy;
  important: boolean;
}

export interface RecurringSchedule {
  id: number;
  title: string;
  description: string | null;
  type: "RECURRING";
  startTime: null;
  endTime: null;
  dayOfWeek: number; // 0=Sun, 1=Mon ... 6=Sat  ← backend is 0-indexed!
  recurringStartTime: string; // "HH:mm:ss"
  recurringEndTime: string; // "HH:mm:ss"
  location: string | null;
  createdBy: ScheduleCreatedBy;
  important: boolean;
}

export interface OneTimeScheduleRequest {
  title: string;
  description?: string;
  startTime: string; // "YYYY-MM-DDTHH:mm:ss"  (LocalDateTime)
  endTime: string; // "YYYY-MM-DDTHH:mm:ss"
  location?: string;
  isImportant: boolean;
}

export interface RecurringScheduleRequest {
  title: string;
  description?: string;
  dayOfWeek: number; // 0=Sun … 6=Sat
  recurringStartTime: string; // "HH:mm:ss"  (LocalTime)
  recurringEndTime: string; // "HH:mm:ss"
  location?: string;
  isImportant: boolean;
}

// All fields optional — backend applies only non-null values
export interface ScheduleUpdateRequest {
  title?: string;
  description?: string;
  location?: string;
  isImportant?: boolean;
  // ONE_TIME only
  startTime?: string; // "YYYY-MM-DDTHH:mm:ss"
  endTime?: string; // "YYYY-MM-DDTHH:mm:ss"
  // RECURRING only
  dayOfWeek?: number; // 0=Sun … 6=Sat
  recurringStartTime?: string; // "HH:mm:ss"
  recurringEndTime?: string; // "HH:mm:ss"
}

export type Schedule = OneTimeSchedule | RecurringSchedule;

export interface ScheduleParams {
  startDate?: string; // "YYYY-MM-DD"
  endDate?: string; // "YYYY-MM-DD"
}

export interface ScheduleResponse {
  status: number;
  success: boolean;
  message: string;
  data: Schedule[];
}

// Single schedule returned by create / update endpoints
// Mirrors backend ScheduleResponse.java exactly
export interface SingleScheduleResponse {
  id: number;
  title: string;
  description: string | null;
  type: ScheduleType;

  // ONE_TIME fields (null for RECURRING)
  startTime: string | null; // "YYYY-MM-DDTHH:mm:ss"
  endTime: string | null; // "YYYY-MM-DDTHH:mm:ss"

  // RECURRING fields (null for ONE_TIME)
  dayOfWeek: number | null; // 0=Sun … 6=Sat
  recurringStartTime: string | null; // "HH:mm:ss"
  recurringEndTime: string | null; // "HH:mm:ss"

  location: string | null;
  isImportant: boolean;
  createdBy: ScheduleCreatedBy;
}

// List endpoint wrapper  e.g. GET /schedule/my-schedule
export interface ScheduleListResponse {
  status: number;
  success: boolean;
  message: string;
  data: Schedule[];
}

export interface ScheduleState {
  schedules: Schedule[];
  loading: boolean;
  error: string | null;
}

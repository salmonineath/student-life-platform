export type ScheduleType = "RECURRING" | "ONE_TIME";
export type ViewMode = "weekly" | "daily" | "monthly";

export interface ScheduleItem {
  id: number;
  title: string;
  description: string;
  type: ScheduleType;
  startTime: string | null;
  endTime: string | null;
  dayOfWeek: number; // 0=Sun, 1=Mon, ... 6=Sat (used for RECURRING)
  recurringStartTime: string | null; // "HH:mm:ss"
  recurringEndTime: string | null;
  location: string;
  isImportant: boolean;
  createdBy: {
    id: number;
    fullname: string;
    username: string;
  };
}

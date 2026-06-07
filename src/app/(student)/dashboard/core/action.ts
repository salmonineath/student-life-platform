import { UserProfile } from "@/types/userType";
import { Assignments } from "@/types/assignmentType";
import { Schedule } from "@/types/scheduleTypes";
import { GroupSummary } from "@/types/groupMessageType";

export type DashboardAction =
  | { type: "FETCH_START" }
  | {
      type: "FETCH_SUCCESS";
      payload: {
        user: UserProfile;
        assignments: Assignments[];
        schedules: Schedule[];
        groups: GroupSummary[];
      };
    }
  | { type: "FETCH_ERROR"; payload: string };

import { UserProfile } from "@/types/userType";
import { Assignments } from "@/types/assignmentType";
import { Schedule } from "@/types/scheduleTypes";
import { GroupSummary } from "@/types/groupMessageType";
import { DashboardAction } from "./action";

export interface DashboardState {
  user: UserProfile | null;
  assignments: Assignments[];
  schedules: Schedule[];
  groups: GroupSummary[];
  loading: boolean;
  error: string | null;
}

export const initialDashboardState: DashboardState = {
  user: null,
  assignments: [],
  schedules: [],
  groups: [],
  loading: true,
  error: null,
};

export function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        assignments: action.payload.assignments,
        schedules: action.payload.schedules,
        groups: action.payload.groups,
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

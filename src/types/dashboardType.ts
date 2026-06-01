export interface DashboardResponse {
  greeting: Greeting;
  todaySchedule: TodaySchedule;
  assignmentStatus: AssignmentStatus;
  progressOverview: ProgressOverview;
  upcomingDeadlines: UpcomingDeadline[];
  groupActivity: GroupActivity;
}

export interface Greeting {
  firstName: string;
  deadlinesThisWeek: number;
}

export interface TodaySchedule {
  currentClass: CurrentClass | null;
  upNext: unknown[];
}

export interface CurrentClass {
  // define when backend structure is known
}

export interface AssignmentStatus {
  upcoming: number;
  overdue: number;
  done: number;
  featured: FeaturedAssignment | null;
}

export interface FeaturedAssignment {
  // define when available
}

export interface ProgressOverview {
  overallPercent: number;
  onTrack: number;
  behind: number;
  done: number;
}

export type UpcomingDeadline = unknown; // replace with real type later

export interface GroupActivity {
  activeGroups: number;
  recentActivity: unknown[]; // replace when backend structure is known
}
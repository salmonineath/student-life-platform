export interface StudyPlanData {
  assignmentId: number;
  plan: string;
}

export interface PlanTask {
  day: string;
  detail: string;
  done: boolean;
}

export interface ChatMessage {
  role: "user" | "ai";
  content: string;
}
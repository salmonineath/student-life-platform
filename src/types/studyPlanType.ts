export interface StudyPlanData {
  assignmentId: number;
  plan: string;
}

export interface StudyPlanResponse {
  status: number;
  success: boolean;
  message: string;
  data: StudyPlanData;
}

export interface StudyPlanByIdResponse {
  status: number;
  success: boolean;
  message: string;
  data: StudyPlanData;
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
import axiosInstance from "@/lib/axios";
import { StudyPlanResponse, StudyPlanByIdResponse } from "@/types/studyPlanType";

export const generateStudyPlanRequest = async (
  assignmentId: number,
): Promise<StudyPlanResponse> => {
  const res = await axiosInstance.post<StudyPlanResponse>(
    `/study-plan/${assignmentId}`,
  );
  return res.data;
};

export const getStudyPlanRequest = async (
  assignmentId: number,
): Promise<StudyPlanResponse> => {
  const res = await axiosInstance.get<StudyPlanResponse>(
    `/study-plan/${assignmentId}`,
  );
  return res.data;
};
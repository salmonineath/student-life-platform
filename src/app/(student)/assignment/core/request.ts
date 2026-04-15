import axiosInstance from "@/lib/axios";
import {
  AssignmentByIdResponse,
  AssignmentResponse,
  CreateAssignmentPayload,
} from "@/types/assignmentType";

export const getMyAssignmentRequest = async (): Promise<AssignmentResponse> => {
  const res = await axiosInstance.get<AssignmentResponse>(
    "/assignments/my-assignment",
  );
  return res.data;
};

export const getAssignmentByIdRequest = async (
  id: number,
): Promise<AssignmentByIdResponse> => {
  const res = await axiosInstance.get<AssignmentByIdResponse>(
    `/assignments/${id}`,
  );
  return res.data;
};

export const createAssignmentRequest = async (
  payload: CreateAssignmentPayload,
): Promise<AssignmentByIdResponse> => {
  const res = await axiosInstance.post<AssignmentByIdResponse>(
    "/assignments",
    payload,
  );
  return res.data;
};

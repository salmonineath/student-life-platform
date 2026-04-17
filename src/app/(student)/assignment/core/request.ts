import axiosInstance from "@/lib/axios";
import {
  AssignmentByIdResponse,
  AssignmentPayload,
  AssignmentResponse,
  UpdateProgressPayload,
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
  payload: AssignmentPayload,
): Promise<AssignmentByIdResponse> => {
  const res = await axiosInstance.post<AssignmentByIdResponse>(
    "/assignments",
    payload,
  );
  return res.data;
};

// PUT /assignments/:id — update title, description, subject, or dueDate
export const updateAssignmentRequest = async (
  id: number,
  payload: AssignmentPayload,
): Promise<AssignmentByIdResponse> => {
  const res = await axiosInstance.put<AssignmentByIdResponse>(
    `/assignments/${id}`,
    payload,
  );
  return res.data;
};

// PATCH /assignments/:id/progress — update status and progress percentage
export const updateProgressRequest = async (
  id: number,
  payload: UpdateProgressPayload,
): Promise<AssignmentByIdResponse> => {
  const res = await axiosInstance.patch<AssignmentByIdResponse>(
    `/assignments/${id}/progress`,
    payload,
  );
  return res.data;
};

export const deleteAssignmentRequest = async (id: number): Promise<void> => {
  const res = await axiosInstance.delete(`/assignments/${id}`);
  return res.data;
};

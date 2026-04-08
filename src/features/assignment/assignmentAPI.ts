// src/features/assignment/assignmentAPI.ts
import axiosInstance from "@/lib/axios";

export interface CreateAssignmentRequest {
  title: string;
  description: string;
  subject: string;
  due_date: string;
}

export interface Assignment {
  _id?: string; // backend id
  id?: string | number; // optional fallback
  title: string;
  description: string;
  subject: string;
  due_date: string;
  createdAt?: string;
  updatedAt?: string;
}

// Create assignment
export const createAssignmentAPI = async (
  data: CreateAssignmentRequest
): Promise<Assignment> => {
  const res = await axiosInstance.post("/assignments", data);
  return res.data?.data ?? res.data;
};

// Get all assignments
export const getAssignmentsAPI = async (): Promise<Assignment[]> => {
  const res = await axiosInstance.get("/assignments");
  const payload = res.data?.data ?? res.data;
  return Array.isArray(payload) ? payload : [];
};
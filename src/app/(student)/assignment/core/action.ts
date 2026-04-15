import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyAssignmentRequest,
  getAssignmentByIdRequest,
  createAssignmentRequest,
} from "./request";
import {
  AssignmentByIdResponse,
  AssignmentResponse,
  Assignments,
  CreateAssignmentPayload,
} from "@/types/assignmentType";

export const getMyAssignmentAction = createAsyncThunk<
  Assignments[],
  void,
  { rejectValue: string }
>("assignment/getMyAssignment", async (_, { rejectWithValue }) => {
  try {
    const res: AssignmentResponse = await getMyAssignmentRequest();
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to fetch assignments",
    );
  }
});

export const getAssignmentByIdAction = createAsyncThunk<
  Assignments,
  number,
  { rejectValue: string }
>("assignment/getById", async (id, { rejectWithValue }) => {
  try {
    const res: AssignmentByIdResponse = await getAssignmentByIdRequest(id);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to fetch assignment",
    );
  }
});

export const createAssignmentAction = createAsyncThunk<
  Assignments,
  CreateAssignmentPayload,
  { rejectValue: string }
>("assignment/create", async (payload, { rejectWithValue }) => {
  try {
    const res: AssignmentByIdResponse = await createAssignmentRequest(payload);
    return res.data;
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to create assignment",
    );
  }
});

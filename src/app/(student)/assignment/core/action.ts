import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMyAssignmentRequest, getAssignmentByIdRequest } from "./request";
import {
  AssignmentByIdResponse,
  AssignmentResponse,
  Assignments,
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

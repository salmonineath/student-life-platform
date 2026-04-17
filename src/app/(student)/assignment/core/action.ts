import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyAssignmentRequest,
  getAssignmentByIdRequest,
  createAssignmentRequest,
  deleteAssignmentRequest,
  updateAssignmentRequest,
  updateProgressRequest,
} from "./request";
import {
  AssignmentByIdResponse,
  AssignmentPayload,
  AssignmentResponse,
  Assignments,
  UpdateProgressPayload,
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
  AssignmentPayload,
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

export const updateAssignmentAction = createAsyncThunk<
  Assignments,
  { id: number; payload: AssignmentPayload },
  { rejectValue: string }
>("assignment/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const res: AssignmentByIdResponse = await updateAssignmentRequest(
      id,
      payload,
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to update assignment",
    );
  }
});

export const updateProgressAction = createAsyncThunk<
  Assignments,
  { id: number; payload: UpdateProgressPayload },
  { rejectValue: string }
>("assignment/updateProgress", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const res: AssignmentByIdResponse = await updateProgressRequest(
      id,
      payload,
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to update progress",
    );
  }
});

export const deleteAssignmentAction = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("assignment/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteAssignmentRequest(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to delete assignment",
    );
  }
});

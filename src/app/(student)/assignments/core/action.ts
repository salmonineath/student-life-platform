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
  CreateAssignmentPayload,
  UpdateAssignmentPayload,
  AssignmentResponse,
  Assignments,
  UpdateProgressPayload,
} from "@/types/assignmentType";
import { getApiErrorMessage } from "@/lib/apiError";

export const getMyAssignmentAction = createAsyncThunk<
  Assignments[],
  void,
  { rejectValue: string }
>("assignment/getMyAssignment", async (_, { rejectWithValue }) => {
  try {
    const res: AssignmentResponse = await getMyAssignmentRequest();
    return res.data;
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, "We couldn't load your assignments right now."),
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
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, "We couldn't open this assignment right now."),
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
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(
        error,
        "We couldn't create your assignment. Please try again.",
      ),
    );
  }
});

export const updateAssignmentAction = createAsyncThunk<
  Assignments,
  { id: number; payload: UpdateAssignmentPayload },
  { rejectValue: string }
>("assignment/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const res: AssignmentByIdResponse = await updateAssignmentRequest(
      id,
      payload,
    );
    return res.data;
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(
        error,
        "We couldn't update your assignment. Please try again.",
      ),
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
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(
        error,
        "We couldn't update your progress. Please try again.",
      ),
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
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(
        error,
        "We couldn't delete this assignment. Please try again.",
      ),
    );
  }
});

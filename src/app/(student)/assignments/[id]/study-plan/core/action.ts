import { createAsyncThunk } from "@reduxjs/toolkit";
import { generateStudyPlanRequest, getStudyPlanRequest } from "./request";
import { StudyPlanData } from "@/types/studyPlanType";

export const generateStudyPlanAction = createAsyncThunk<
  StudyPlanData,
  number,
  { rejectValue: string }
>("studyPlan/generate", async (assignmentId, { rejectWithValue }) => {
  try {
    const res = await generateStudyPlanRequest(assignmentId);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to generate study plan",
    );
  }
});

export const getStudyPlanAction = createAsyncThunk<
  StudyPlanData,
  number,
  { rejectValue: string }
>("studyPlan/get", async (assignmentId, { rejectWithValue }) => {
  try {
    const res = await getStudyPlanRequest(assignmentId);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to fetch study plan",
    );
  }
});
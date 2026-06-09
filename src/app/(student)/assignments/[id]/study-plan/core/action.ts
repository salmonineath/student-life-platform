import { createAsyncThunk } from "@reduxjs/toolkit";
import { generateStudyPlanRequest, getStudyPlanRequest } from "./request";
import { StudyPlanData } from "@/types/studyPlanType";
import { getApiErrorMessage } from "@/lib/apiError";

export const generateStudyPlanAction = createAsyncThunk<
  StudyPlanData,
  number,
  { rejectValue: string }
>("studyPlan/generate", async (assignmentId, { rejectWithValue }) => {
  try {
    const res = await generateStudyPlanRequest(assignmentId);
    return res.data;
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(
        error,
        "We couldn't generate your study plan. Please try again.",
      ),
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
  } catch (error) {
    return rejectWithValue(
      getApiErrorMessage(error, "We couldn't load your study plan right now."),
    );
  }
});
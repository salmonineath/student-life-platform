import { createSlice } from "@reduxjs/toolkit";
import { generateStudyPlanAction, getStudyPlanAction } from "./action";
import { StudyPlanData } from "@/types/studyPlanType";

interface StudyPlanState {
  plan: StudyPlanData | null;
  loading: boolean;
  error: string | null;
}

const initialState: StudyPlanState = {
  plan: null,
  loading: false,
  error: null,
};

const studyPlanSlice = createSlice({
  name: "studyPlan",
  initialState,
  reducers: {
    clearStudyPlan(state) {
      state.plan = null;
      state.error = null;
    },
    updatePlanLocally(state, action) {
      if (state.plan) {
        state.plan.plan = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateStudyPlanAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateStudyPlanAction.fulfilled, (state, action) => {
        state.loading = false;
        state.plan = action.payload;
      })
      .addCase(generateStudyPlanAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error";
      })

      .addCase(getStudyPlanAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudyPlanAction.fulfilled, (state, action) => {
        state.loading = false;
        state.plan = action.payload;
      })
      .addCase(getStudyPlanAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error";
      });
  },
});

export const { clearStudyPlan, updatePlanLocally } = studyPlanSlice.actions;
export default studyPlanSlice.reducer;
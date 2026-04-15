import { createSlice } from "@reduxjs/toolkit";
import {
  getMyAssignmentAction,
  getAssignmentByIdAction,
  createAssignmentAction,
} from "./action";
import { Assignments } from "@/types/assignmentType";

interface AssignmentState {
  assignments: Assignments[];
  selectedAssignment: Assignments | null;
  loading: boolean;
  error: string | null;
}

const initialState: AssignmentState = {
  assignments: [],
  selectedAssignment: null,
  loading: false,
  error: null,
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    clearSelectedAssignment(state) {
      state.selectedAssignment = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // get all
      .addCase(getMyAssignmentAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyAssignmentAction.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(getMyAssignmentAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error";
      })

      // get by id
      .addCase(getAssignmentByIdAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAssignmentByIdAction.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAssignment = action.payload;
      })
      .addCase(getAssignmentByIdAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error";
      })

      .addCase(createAssignmentAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignmentAction.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = [...state.assignments, action.payload];
      })
      .addCase(createAssignmentAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error";
      });
  },
});

export const { clearSelectedAssignment } = assignmentSlice.actions;
export default assignmentSlice.reducer;

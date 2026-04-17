import { createSlice } from "@reduxjs/toolkit";
import {
  getMyAssignmentAction,
  getAssignmentByIdAction,
  createAssignmentAction,
  deleteAssignmentAction,
  updateProgressAction,
  updateAssignmentAction,
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

      // create assignment
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
      })

      // update assignment (title / description / subject / dueDate)
      .addCase(updateAssignmentAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignmentAction.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = state.assignments.map((a) =>
          a.id === action.payload.id ? action.payload : a,
        );
        if (state.selectedAssignment?.id === action.payload.id) {
          state.selectedAssignment = action.payload;
        }
      })
      .addCase(updateAssignmentAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error";
      })

      // update progress (status + progress %)
      .addCase(updateProgressAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProgressAction.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = state.assignments.map((a) =>
          a.id === action.payload.id ? action.payload : a,
        );
        if (state.selectedAssignment?.id === action.payload.id) {
          state.selectedAssignment = action.payload;
        }
      })
      .addCase(updateProgressAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error";
      })

      // delete assignment
      .addCase(deleteAssignmentAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAssignmentAction.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = state.assignments.filter(
          (assignment) => assignment.id !== action.payload,
        );
      })
      .addCase(deleteAssignmentAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error";
      });
  },
});

export const { clearSelectedAssignment } = assignmentSlice.actions;
export default assignmentSlice.reducer;

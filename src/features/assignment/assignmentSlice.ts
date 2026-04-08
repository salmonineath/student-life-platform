// src/features/assignment/assignmentSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  createAssignmentAPI,
  getAssignmentsAPI,
  Assignment,
  CreateAssignmentRequest,
} from "./assignmentAPI";

interface AssignmentState {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  createSuccess: boolean;
}

const initialState: AssignmentState = {
  assignments: [],
  loading: false,
  error: null,
  creating: false,
  createSuccess: false,
};

// Fetch all assignments
export const fetchAssignments = createAsyncThunk<
  Assignment[],
  void,
  { rejectValue: string }
>("assignment/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const assignments = await getAssignmentsAPI();
    return assignments;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || err?.message || "Failed to fetch assignments"
    );
  }
});

// Create assignment
export const createAssignment = createAsyncThunk<
  Assignment,
  CreateAssignmentRequest,
  { rejectValue: string }
>("assignment/create", async (data, { rejectWithValue }) => {
  try {
    const assignment = await createAssignmentAPI(data);
    return assignment;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || err?.message || "Failed to create assignment"
    );
  }
});

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    resetCreateStatus: (state) => {
      state.createSuccess = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAssignments.fulfilled,
        (state, action: PayloadAction<Assignment[]>) => {
          state.loading = false;
          state.assignments = action.payload;
        }
      )
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch assignments";
      })

      // Create
      .addCase(createAssignment.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(
        createAssignment.fulfilled,
        (state, action: PayloadAction<Assignment>) => {
          state.creating = false;
          state.createSuccess = true;
          state.assignments.unshift(action.payload); // add new assignment at top
        }
      )
      .addCase(createAssignment.rejected, (state, action) => {
        state.creating = false;
        state.createSuccess = false;
        state.error = action.payload || "Failed to create assignment";
      });
  },
});

export const { resetCreateStatus, clearError } = assignmentSlice.actions;
export default assignmentSlice.reducer;
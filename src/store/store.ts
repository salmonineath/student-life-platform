import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import scheduleReducer from "@/features/schedule/scheduleSlice";
import assignmentReducer from "@/features/assignment/assignmentSlice";

export const authStore = configureStore({
  reducer: {
    auth: authReducer,
    schedule: scheduleReducer,
    assignment: assignmentReducer,

  },
});

export type RootState = ReturnType<typeof authStore.getState>;
export type AppDispatch = typeof authStore.dispatch;

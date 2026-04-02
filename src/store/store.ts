import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import scheduleReducer from "@/features/schedule/scheduleSlice";

export const authStore = configureStore({
  reducer: {
    auth: authReducer,
    schedule: scheduleReducer,
  },
});

export type RootState = ReturnType<typeof authStore.getState>;
export type AppDispatch = typeof authStore.dispatch;

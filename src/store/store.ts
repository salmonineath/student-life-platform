import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/slices/authSlice";
import scheduleReducer from "@/slices/scheduleSlice";

export const authStore = configureStore({
  reducer: {
    auth: authReducer,
    schedule: scheduleReducer,
  },
});

export type RootState = ReturnType<typeof authStore.getState>;
export type AppDispatch = typeof authStore.dispatch;

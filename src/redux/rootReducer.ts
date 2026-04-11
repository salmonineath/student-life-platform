import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/app/(auth)/core/reducer";
import scheduleReducer from "@/app/(student)/schedule/core/reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  schedule: scheduleReducer,
});

export default rootReducer;

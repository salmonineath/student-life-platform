import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/app/(auth)/core/reducer";
import scheduleReducer from "@/app/(student)/schedule/core/reducer";
import assignmentReducer from "@/app/(student)/assignment/core/reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  schedule: scheduleReducer,
  assignment: assignmentReducer,
});

export default rootReducer;

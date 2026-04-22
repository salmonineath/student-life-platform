import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/app/(auth)/core/reducer";
import scheduleReducer from "@/app/(student)/schedule/core/reducer";
import assignmentReducer from "@/app/(student)/assignment/core/reducer";
import profileReducer from "@/app/(student)/profile/core/reducer";
import groupReducer from "@/app/(student)/groups/core/reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  schedule: scheduleReducer,
  assignment: assignmentReducer,
  profile: profileReducer,
  group: groupReducer
});

export default rootReducer;

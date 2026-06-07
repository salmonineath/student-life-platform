import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/app/(auth)/core/reducer";
import scheduleReducer from "@/app/(student)/schedules/core/reducer";
import assignmentReducer from "@/app/(student)/assignments/core/reducer";
import profileReducer from "@/app/(student)/profile/core/reducer";
import groupReducer from "@/app/(student)/groups/core/reducer";
import studyPlan from "@/app/(student)/assignments/[id]/study-plan/core/reducer";
import notificationReducer from "@/app/(student)/notifications/core/reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  schedule: scheduleReducer,
  assignment: assignmentReducer,
  profile: profileReducer,
  group: groupReducer,
  studyPlan: studyPlan,
  notification: notificationReducer,
});

export default rootReducer;

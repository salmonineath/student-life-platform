import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/app/(auth)/core/reducer";

const rootReducer = combineReducers({
    auth: authReducer
})

export default rootReducer

import { configureStore } from "@reduxjs/toolkit";
import principleReducer from "./principleSlice";
import studentReducer from "./studentSlice";
import collegeReducer from "./collegeSlice";
import competitionReducer from "./competitionSlice"

const appStore = configureStore({
  reducer: {
    principle:principleReducer,
    students: studentReducer,
    colleges:collegeReducer,
    competitions: competitionReducer,
  },
});

export default appStore;
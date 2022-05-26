import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth";
import errorSlice from "./error";
import tutorSlice from "./tutor";
import meetingSlice from "./meeting";
import reviewSlice from "./review";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    error: errorSlice.reducer,
    tutor: tutorSlice.reducer,
    meeting: meetingSlice.reducer,
    review: reviewSlice.reducer,
  },
});

export default store;

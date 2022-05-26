import { createSlice } from "@reduxjs/toolkit";

const meetingSlice = createSlice({
  name: "meeting",
  initialState: {
    bookedMeeting: [],
    tutorMeeting: [],
  },

  reducers: {
    fetchbookedMeeting(state, action) {
      return {
        ...state,
        bookedMeeting: action.payload.bookedMeeting,
      };
    },

    fetchPendingMeeting(state, action) {
      return {
        ...state,
        tutorMeeting: action.payload.tutorMeeting,
      };
    },
  },
});

export const meetingAction = meetingSlice.actions;
export default meetingSlice;

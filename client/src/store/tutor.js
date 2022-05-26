import { createSlice } from "@reduxjs/toolkit";

const tutorSlice = createSlice({
  name: "tutor",
  initialState: {
    tutors: [],
    requests: [],
    departments: [],
    subjects: [],
  },

  reducers: {
    fetchAllTutor(state, action) {
      return {
        ...state,
        tutors: action.payload.tutors,
      };
    },

    removeTutor(state, action) {
      return {
        ...state,
        tutors: state.tutors.filter((tutor) => {
          return tutor.id !== action.payload.tutorId;
        }),
      };
    },

    fetchRequests(state, action) {
      return {
        ...state,
        requests: action.payload.requests,
      };
    },

    fetchDepartment(state, action) {
      return {
        ...state,
        departments: action.payload.departments,
      };
    },
  },
});

export const tutorActions = tutorSlice.actions;

export default tutorSlice;

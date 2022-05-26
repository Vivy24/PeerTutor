import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
  },

  reducers: {
    fetchReviews(state, action) {
      return {
        reviews: action.payload.reviews,
      };
    },

    resetReviews(state, action) {
      return {
        reviews: [],
      };
    },
  },
});

export const reviewActions = reviewSlice.actions;
export default reviewSlice;

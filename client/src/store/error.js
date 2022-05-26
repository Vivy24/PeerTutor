import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice({
  name: "error",
  initialState: {
    errors: [],
  },
  reducers: {
    setError(state, action) {
      const newErrors = [...state.errors, action.payload.error];
      return { errors: newErrors };
    },

    removeError(state, action) {
      return {
        errors: state.error.filer(
          (error) => error.id !== action.payload.errorID
        ),
      };
    },

    resetState(state, action) {
      return {
        errors: [],
      };
    },
  },
});
export const errorActions = errorSlice.actions;
export default errorSlice;

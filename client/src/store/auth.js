import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userToken: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
  },
  reducers: {
    loggedIn_success(state, action) {
      localStorage.setItem("token", action.payload.token.token);
      return {
        ...state,
        userToken: action.payload.token.token,
        isAuthenticated: true,
        loading: false,
      };
    },

    loggedIn_fail(state, action) {
      localStorage.removeItem("token");
      return {
        ...state,
        userToken: null,
        isAuthenticated: false,
        loading: false,
      };
    },

    load_user(state, action) {
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload.user,
      };
    },

    log_out(state) {
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;

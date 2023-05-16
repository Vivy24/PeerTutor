import { tutorActions } from "./tutor"
import { addError } from "./errorActions"
import { errorActions } from "./error"

// import axiosConfig from "axiosConfig";
import axiosConfig from "../axiosconfig"

export const fetchTutor = () => {
  return async (dispatch) => {
    try {
      dispatch(errorActions.resetState())
      const res = await axiosConfig.get("/api/tutors")

      dispatch(
        tutorActions.fetchAllTutor({
          tutors: res.data,
        })
      )
    } catch (error) {
      const errors = error.response.data.errors

      if (errors.length > 0) {
        errors.forEach((error) => {
          dispatch(addError(error.msg, "fetchTutor"))
        })
      }
    }
  }
}

export const fetchRequests = () => {
  return async (dispatch) => {
    try {
      dispatch(errorActions.resetState())
      const res = await axiosConfig.get("/api/requests")

      dispatch(
        tutorActions.fetchRequests({
          requests: res.data,
        })
      )
    } catch (error) {
      const errors = error.response.data.errors

      if (errors.length > 0) {
        errors.forEach((error) => {
          dispatch(addError(error.msg, "fetchRequests"))
        })
      }
    }
  }
}

import { addError } from "./errorActions"
import { errorActions } from "./error"

import { meetingAction } from "./meeting"
import axiosConfig from "../axiosconfig"

export const fetchStudentMeeting = () => {
  return async (dispatch) => {
    try {
      dispatch(errorActions.resetState())
      const res = await axiosConfig.get("/api/meetings/student")
      dispatch(
        meetingAction.fetchbookedMeeting({
          bookedMeeting: res.data,
        })
      )
    } catch (error) {
      const errors = error.response.data.errors

      if (errors.length > 0) {
        errors.forEach((error) => {
          dispatch(addError(error.msg, "fetchMeeting"))
        })
      }
    }
  }
}

export const fetchTutorMeeting = () => {
  return async (dispatch) => {
    try {
      dispatch(errorActions.resetState())
      const res = await axiosConfig.get("/api/meetings/tutor")
      dispatch(
        meetingAction.fetchPendingMeeting({
          tutorMeeting: res.data,
        })
      )
    } catch (error) {
      const errors = error.response.data.errors

      if (errors.length > 0) {
        errors.forEach((error) => {
          dispatch(addError(error.msg, "fetchMeeting"))
        })
      }
    }
  }
}

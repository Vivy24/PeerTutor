import { authActions } from "./auth"
import { addError } from "./errorActions"
import { errorActions } from "./error"
import setAuthToken from "../helpers/setAuthToken"
import axiosConfig from "../axiosconfig"

export const loadUser = () => {
  return async (dispatch) => {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }

    try {
      const res = await axiosConfig.get("/api/auth")

      dispatch(
        authActions.load_user({
          user: res.data,
        })
      )
    } catch (error) {
      dispatch(authActions.loggedIn_fail())
    }
  }
}

export const logIn = (email, password) => {
  return async (dispatch) => {
    dispatch(errorActions.resetState())

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    const loggedIn = {
      email,
      password,
    }

    const body = JSON.stringify(loggedIn)

    try {
      const res = await axiosConfig.post("/api/auth", body, config)
      dispatch(
        authActions.loggedIn_success({
          token: res.data,
        })
      )
    } catch (error) {
      const errors = error.response.data.errors

      if (errors.length > 0) {
        errors.forEach((error) => {
          dispatch(addError(error.msg, "auth"))
        })
      }

      dispatch(authActions.loggedIn_fail({}))
    }
  }
}

export const logOut = () => {
  return async (dispatch) => {
    dispatch(authActions.log_out())
  }
}

// register user
export const register = (name, email, password, avatar) => {
  return async (dispatch) => {
    dispatch(errorActions.resetState())
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    const newUser = {
      name,
      email,
      password,
      avatar,
    }

    const body = JSON.stringify(newUser)

    try {
      const res = await axiosConfig.post("/api/users", body, config)
      dispatch(
        authActions.loggedIn_success({
          token: res.data,
        })
      )

      loadUser()
    } catch (error) {
      const errors = error.response.data.errors

      if (errors.length > 0) {
        errors.forEach((error) => {
          dispatch(addError(error.msg, "register"))
        })
      }

      dispatch(authActions.loggedIn_fail({}))
    }
  }
}

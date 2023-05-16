import axiosConfig from "../axiosconfig"
import store from "../store/index"
import { authActions } from "../store/auth"
// Create an instance of axiosConfig
const api = axiosConfig.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})
/*
  NOTE: intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
*/

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      store.dispatch(authActions.log_out())
    }
    return Promise.reject(err)
  }
)

export default api

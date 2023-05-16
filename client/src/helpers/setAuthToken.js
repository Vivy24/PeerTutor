import axiosConfig from "../axiosconfig"

const setAuthToken = (token) => {
  if (token) {
    axiosConfig.defaults.headers.common["x-auth-token"] = token
  } else {
    delete axiosConfig.defaults.headers.common["x-auth-token"]
  }
}

export default setAuthToken

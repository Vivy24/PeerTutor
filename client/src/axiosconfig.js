import axios from "axios"

const api = axios.create({
  baseURL: "https://peertutor.onrender.com",
})

export default api

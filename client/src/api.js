import axios from "axios"
import Cookies from "js-cookie"

// Update the baseURL to match your actual backend API URL
const api = axios.create({
  baseURL: `http://localhost:3000/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("jwt")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Log the error but don't redirect automatically
    console.error("API Error:", error.response?.status, error.message)
    return Promise.reject(error)
  },
)

export default api

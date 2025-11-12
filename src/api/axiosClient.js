import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL
const DEFAULT_LANG = "en"

if (!localStorage.getItem("language")) {
  localStorage.setItem("language", DEFAULT_LANG)
}

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": localStorage.getItem("language"),
  },
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    const lang = localStorage.getItem("language") || DEFAULT_LANG
    config.headers["Accept-Language"] = lang

    return config
  },
  (error) => Promise.reject(error),
)

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default axiosClient

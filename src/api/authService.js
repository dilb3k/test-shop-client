import axiosClient from "./axiosClient"

export const authService = {
  register: async (email, password, name, phone) => {
    const response = await axiosClient.post("/auth/register", {
      email,
      password,
      name,
      phone,
    })
    return response.data
  },

  login: async (email, password) => {
    const response = await axiosClient.post("/auth/login", {
      email,
      password,
    })
    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token)
      localStorage.setItem("user", JSON.stringify(response.data.data))
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("access_token")
  },
}

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: JSON.parse(localStorage.getItem("authUser")) || null,
  token: localStorage.getItem("authToken"),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true
      state.error = null
    },
    setUser: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.loading = false
      localStorage.setItem("authToken", action.payload.token)
      localStorage.setItem("authUser", JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem("authToken")
      localStorage.removeItem("authUser")
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setLoading, setUser, setError, logout } = authSlice.actions
export default authSlice.reducer

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
}

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true
      state.error = null
    },
    setOrders: (state, action) => {
      state.items = Array.isArray(action.payload.content)
        ? action.payload.content
        : Array.isArray(action.payload)
          ? action.payload
          : []
      if (action.payload.number !== undefined) {
        state.pagination = {
          page: action.payload.number || 0,
          size: action.payload.size || 10,
          totalElements: action.payload.totalElements || 0,
          totalPages: action.payload.totalPages || 0,
        }
      }
      state.loading = false
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload
      state.loading = false
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setLoading, setOrders, setCurrentOrder, setError } = ordersSlice.actions
export default ordersSlice.reducer

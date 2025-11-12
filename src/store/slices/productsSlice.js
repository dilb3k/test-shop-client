import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
}

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true
      state.error = null
    },
    setProducts: (state, action) => {
      state.items = action.payload.content || action.payload
      state.pagination = {
        page: action.payload.number || 0,
        size: action.payload.size || 10,
        totalElements: action.payload.totalElements || 0,
        totalPages: action.payload.totalPages || 0,
      }
      state.loading = false
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload
      state.loading = false
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { setLoading, setProducts, setCurrentProduct, setError, clearError } = productsSlice.actions
export default productsSlice.reducer

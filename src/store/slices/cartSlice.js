import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: JSON.parse(localStorage.getItem("cart")) || [],
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 })
      }
      localStorage.setItem("cart", JSON.stringify(state.items))
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      localStorage.setItem("cart", JSON.stringify(state.items))
    },
    updateCartItem: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
      }
      localStorage.setItem("cart", JSON.stringify(state.items))
    },
    clearCart: (state) => {
      state.items = []
      localStorage.removeItem("cart")
    },
  },
})

export const { addToCart, removeFromCart, updateCartItem, clearCart } = cartSlice.actions
export default cartSlice.reducer

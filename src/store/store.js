import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import productsReducer from "./slices/productsSlice"
import ordersReducer from "./slices/ordersSlice"
import cartReducer from "./slices/cartSlice"

export default configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    orders: ordersReducer,
    cart: cartReducer,
  },
})

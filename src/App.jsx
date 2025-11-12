import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import Header from "./components/Header"
import Toast from "./components/Toast"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailsPage from "./pages/ProductDetailsPage"
import OrdersPage from "./pages/OrdersPage"
import OrderDetailsPage from "./pages/OrderDetailsPage"
import CartPage from "./pages/CartPage"
import DashboardPage from "./pages/DashboardPage"
import { logout } from "./store/slices/authSlice"

function App() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    if (!user && token) {
      dispatch(logout())
      localStorage.removeItem("token")
    }
  }, [user, token, dispatch])

  const [toast, setToast] = useState(null)

  const showToast = (message, type = "info") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        {token && user && <Header />}
        <Routes>
          <Route path="/login" element={!token ? <LoginPage onToast={showToast} /> : <Navigate to="/products" />} />
          <Route path="/register" element={!token ? <RegisterPage onToast={showToast} /> : <Navigate to="/products" />} />

          <Route path="/products" element={token && user ? <ProductsPage onToast={showToast} /> : <Navigate to="/login" />} />
          <Route path="/products/:id" element={token && user ? <ProductDetailsPage onToast={showToast} /> : <Navigate to="/login" />} />

          <Route path="/orders" element={token && user ? <OrdersPage onToast={showToast} /> : <Navigate to="/login" />} />
          <Route path="/orders/:id" element={token && user ? <OrderDetailsPage onToast={showToast} /> : <Navigate to="/login" />} />

          <Route path="/cart" element={token && user ? <CartPage onToast={showToast} /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={token && user ? <DashboardPage onToast={showToast} /> : <Navigate to="/login" />} />

          <Route path="/" element={token && user ? <Navigate to="/products" /> : <Navigate to="/login" />} />
        </Routes>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    </Router>
  )
}

export default App

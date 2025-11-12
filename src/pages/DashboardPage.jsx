"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { ordersAPI, productsAPI } from "../api/apiService"
import LoadingSpinner from "../components/LoadingSpinner"

export default function DashboardPage() {
  const user = useSelector((state) => state.auth.user)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const [ordersRes, productsRes] = await Promise.all([ordersAPI.getAll(0, 100), productsAPI.getAll(0, 100)])

      const allOrders = ordersRes.data.content || []
      const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0)

      setStats({
        totalOrders: allOrders.length,
        totalRevenue,
        totalProducts: productsRes.data.totalElements || 0,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-4xl font-bold mb-2" style={{ color: "#5CAB7A" }}>
            {stats.totalProducts}
          </div>
          <p className="text-gray-600">Jami Mahsulotlar</p>
        </div>

        <div className="card text-center">
          <div className="text-4xl font-bold mb-2" style={{ color: "#5CAB7A" }}>
            {stats.totalOrders}
          </div>
          <p className="text-gray-600">Jami Buyurtmalar</p>
        </div>

        <div className="card text-center">
          <div className="text-4xl font-bold mb-2" style={{ color: "#5CAB7A" }}>
            ${stats.totalRevenue.toFixed(2)}
          </div>
          <p className="text-gray-600">Jami Daromad</p>
        </div>
      </div>

      <div className="mt-8 card">
        <h2 className="text-2xl font-bold mb-4">Xush kelibsiz, {user?.username}!</h2>
        <p className="text-gray-600">
          Bu dastur sizga mahsulotlarni boshqarish va buyurtmalarni kuzatish imkonini beradi.
        </p>
      </div>
    </main>
  )
}

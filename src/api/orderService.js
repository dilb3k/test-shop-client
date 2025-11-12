import axiosClient from "./axiosClient"

export const orderService = {
  getOrders: async (page = 1, size = 10) => {
    const response = await axiosClient.get("/orders", {
      params: { page, size },
    })
    return response.data
  },

  getOrderById: async (id) => {
    const response = await axiosClient.get(`/orders/${id}`)
    return response.data
  },

  getCustomerOrders: async (email) => {
    const response = await axiosClient.get(`/orders/customer/${email}`)
    return response.data
  },

  createOrder: async (orderData) => {
    const response = await axiosClient.post("/orders", orderData)
    return response.data
  },

  updateOrderStatus: async (id, status) => {
    const response = await axiosClient.put(`/orders/${id}/status`, {
      status,
    })
    return response.data
  },

  cancelOrder: async (id) => {
    const response = await axiosClient.delete(`/orders/${id}`)
    return response.data
  },
}

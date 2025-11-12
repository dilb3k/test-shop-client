import axiosClient from "./axiosClient"

export const productService = {
  getProducts: async (page = 1, size = 10) => {
    const response = await axiosClient.get("/products", {
      params: { page, size },
    })
    return response.data
  },

  getProductById: async (id) => {
    const response = await axiosClient.get(`/products/${id}`)
    return response.data
  },

  searchProducts: async (name, category) => {
    const response = await axiosClient.get("/products/search", {
      params: { name, category },
    })
    return response.data
  },

  createProduct: async (productData) => {
    const response = await axiosClient.post("/products", productData)
    return response.data
  },

  updateProduct: async (id, productData) => {
    const response = await axiosClient.put(`/products/${id}`, productData)
    return response.data
  },

  deleteProduct: async (id) => {
    const response = await axiosClient.delete(`/products/${id}`)
    return response.data
  },
}

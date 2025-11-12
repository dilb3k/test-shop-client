const API_URL = import.meta.env.VITE_API_URL

const getAuthToken = () => localStorage.getItem("authToken")

const apiCall = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    "Accept-Language": "en",
    ...options.headers,
  }

  const token = getAuthToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("authToken")
      window.location.href = "/login"
    }
    const error = await response.json()
    throw new Error(error.message || "API error")
  }

  return response.json()
}

export const authAPI = {
  register: (username, email, password) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    }),
  login: (username, password) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
}

export const productsAPI = {

  getAll: (page = 0, size = 10, sortBy = "id", sortDir = "asc") =>
    apiCall(`/products?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`),
  getById: (id) => apiCall(`/products/${id}`),
  search: (name = "", category = "", page = 0, size = 10) =>
    apiCall(`/products/search?name=${name}&category=${category}&page=${page}&size=${size}`),
  create: (productData) =>
    apiCall("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }),
  update: (id, productData) =>
    apiCall(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }),
  delete: (id) =>
    apiCall(`/products/${id}`, {
      method: "DELETE",
    }),
}

export const ordersAPI = {
  getAll: (page = 0, size = 10, sortBy = "orderDate", sortDir = "desc") =>
    apiCall(`/orders?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`),
  getById: (id) => apiCall(`/orders/${id}`),
  getByEmail: (email) => apiCall(`/orders/customer/${email}`),
  create: (orderData) =>
    apiCall("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),
  updateStatus: (id, status) =>
    apiCall(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  cancel: (id) =>
    apiCall(`/orders/${id}`, {
      method: "DELETE",
    }),
}

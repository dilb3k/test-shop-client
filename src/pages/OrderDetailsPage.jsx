import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setLoading, setCurrentOrder, setError } from "../store/slices/ordersSlice"
import { ordersAPI } from "../api/apiService"
import OrderDetailSkeleton from "../components/OrderDetailSkeleton"
import { useTranslation } from "react-i18next"
import {
  Container, Typography, Button, Box, Grid, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow,
  Chip, Select, MenuItem, CircularProgress, Stack
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

export default function OrderDetailsPage({ onToast }) {
  const { t } = useTranslation()
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(s => s.auth.user)
  const { currentOrder, loading } = useSelector(s => s.orders)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => { fetchOrder() }, [id])
  useEffect(() => { if (currentOrder) setNewStatus(currentOrder.status) }, [currentOrder])

  const fetchOrder = async () => {
    dispatch(setLoading())
    try {
      const res = await ordersAPI.getById(id)
      dispatch(setCurrentOrder(res.data))
    } catch (e) {
      dispatch(setError(e.message))
      onToast(e.message || t("common.error"), "error")
    }
  }

  const handleUpdate = async () => {
    if (newStatus === currentOrder.status) return
    setUpdating(true)
    try {
      await ordersAPI.updateStatus(id, newStatus)
      onToast(t("orders.updateStatus"), "success")
      fetchOrder()
    } catch (e) {
      onToast(e.message || t("common.error"), "error")
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = async () => {
    if (!window.confirm(t("orders.cancelConfirm"))) return
    setUpdating(true)
    try {
      await ordersAPI.cancel(id)
      onToast(t("orders.cancelSuccess"), "success")
      navigate("/orders")
    } catch (e) {
      onToast(e.message || t("common.error"), "error")
    } finally {
      setUpdating(false)
    }
  }

  const statusCfg = s => {
    const map = {
      PENDING: { color: "warning", label: t("orders.status.PENDING") },
      PROCESSING: { color: "info", label: t("orders.status.PROCESSING") },
      CONFIRMED: { color: "primary", label: t("orders.status.CONFIRMED") },
      SHIPPED: { color: "secondary", label: t("orders.status.SHIPPED") },
      DELIVERED: { color: "success", label: t("orders.status.DELIVERED") },
      CANCELLED: { color: "error", label: t("orders.status.CANCELLED") }
    }
    return map[s] || { color: "default", label: s }
  }

  if (loading) return <OrderDetailSkeleton />
  if (!currentOrder) {
    return (
      <Container sx={{ textAlign: "center", py: 8 }}>
        <Box sx={{ bgcolor: "grey.200", border: "2px dashed", borderColor: "grey.400", borderRadius: 2, width: 96, height: 96, mx: "auto", mb: 2 }} />
        <Typography>{t("common.noData")}</Typography>
        <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={() => navigate("/orders")}>
          {t("nav.orders")}
        </Button>
      </Container>
    )
  }

  const st = statusCfg(currentOrder.status)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        {t("nav.back")}
      </Button>

      <Grid container spacing={4}>
        {/* LEFT: Order Info + Items */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">
                  {t("orders.orderId")}: #{currentOrder.id}
                </Typography>
                <Chip label={st.label} color={st.color} />
              </Box>

              <Grid container spacing={2}>
                {[
                  { key: "customer", value: currentOrder.customerName },
                  { key: "email", value: currentOrder.customerEmail },
                  { key: "date", value: new Date(currentOrder.orderDate).toLocaleString("uz-UZ") },
                  { key: "total", value: `$${currentOrder.totalAmount.toFixed(2)}` }
                ].map(item => (
                  <Grid item xs={6} key={item.key}>
                    <Typography color="text.secondary" variant="body2">{t(`orders.${item.key}`)}:</Typography>
                    <Typography fontWeight="medium" sx={{ color: item.key === "total" ? "success.main" : "inherit" }}>
                      {item.value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t("orders.items")}</Typography>
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("products.title")}</TableCell>
                      <TableCell align="center">{t("products.quantity")}</TableCell>
                      <TableCell align="right">{t("products.price")}</TableCell>
                      <TableCell align="right">{t("orders.total")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentOrder.orderItems?.map(i => (
                      <TableRow key={i.id}>
                        <TableCell>{i.productName}</TableCell>
                        <TableCell align="center">{i.quantity}</TableCell>
                        <TableCell align="right">${i.unitPrice.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold", color: "success.main" }}>
                          ${i.totalPrice.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT: Total + Status */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3, height: "fit-content" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t("cart.total")}</Typography>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                ${currentOrder.totalAmount.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>

          {user?.role === "ADMIN" && !["CANCELLED", "DELIVERED"].includes(currentOrder.status) && (
            <Card sx={{ p: 2 }}>
              <Typography fontWeight="medium" gutterBottom>{t("orders.updateStatus")}</Typography>
              <Select
                fullWidth
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                disabled={updating}
                size="small"
              >
                {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(v => (
                  <MenuItem key={v} value={v}>{statusCfg(v).label}</MenuItem>
                ))}
              </Select>
              <Button
                fullWidth
                variant="contained"
                color="success"
                sx={{ mt: 1.5 }}
                onClick={handleUpdate}
                disabled={updating || newStatus === currentOrder.status}
              >
                {updating ? <CircularProgress size={20} /> : t("button.save")}
              </Button>
            </Card>
          )}

          {currentOrder.status === "PENDING" && (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              sx={{ mt: 2 }}
              onClick={handleCancel}
              disabled={updating}
            >
              {updating ? <CircularProgress size={20} /> : t("orders.cancelOrder")}
            </Button>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}
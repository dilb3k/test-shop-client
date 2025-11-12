import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setLoading, setOrders, setError } from "../store/slices/ordersSlice"
import { ordersAPI } from "../api/apiService"
import OrderSkeleton from "../components/OrderSkeleton"
import Pagination from "../components/Pagination"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Chip, Box, Alert
} from "@mui/material"

export default function OrdersPage({ onToast }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const user = useSelector(s => s.auth.user)
  const { items, loading, pagination } = useSelector(s => s.orders)
  const [page, setPage] = useState(0)

  useEffect(() => { if (user?.email) fetchOrders() }, [page, user?.email])

  const fetchOrders = async () => {
    dispatch(setLoading())
    try {
      const res = user?.role === "ADMIN"
        ? await ordersAPI.getAll(page, 10)
        : await ordersAPI.getByEmail(user.email, page, 10)
      dispatch(setOrders(res.data))
    } catch (e) {
      dispatch(setError(e.message))
      onToast(e.message, "error")
    }
  }

  const statusCfg = s => {
    const m = {
      PENDING: "warning", PROCESSING: "info", CONFIRMED: "primary",
      SHIPPED: "secondary", DELIVERED: "success", CANCELLED: "error"
    }
    return { color: m[s] || "default", label: t(`orders.status.${s}`) || s }
  }

  if (!user) {
    return (
      <Container sx={{ textAlign: "center", py: 8 }}>
        <Alert severity="info">{t("auth.requireLogin")}</Alert>
        <Button component={Link} to="/login" variant="contained" color="success" sx={{ mt: 2 }}>
          {t("auth.login")}
        </Button>
      </Container>
    )
  }

  if (loading) return <OrderSkeleton />

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          {user.role === "ADMIN" ? t("orders.title") : t("orders.myOrders")}
        </Typography>
        {user.role === "ADMIN" && (
          <Button component={Link} to="/orders/create" variant="contained" color="success">
            {t("orders.createNew")}
          </Button>
        )}
      </Box>

      {items.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Box sx={{ bgcolor: "grey.200", border: "2px dashed", borderColor: "grey.400", borderRadius: 2, width: 96, height: 96, mx: "auto", mb: 2 }} />
          <Typography>{t("common.noData")}</Typography>
        </Box>
      ) : (
        <>
          <Table container component={Box} sx={{ overflowX: "auto" }}>
            <TableHead>
              <TableRow>
                <TableCell>{t("orders.orderId")}</TableCell>
                {user.role === "ADMIN" && (
                  <>
                    <TableCell>{t("orders.customer")}</TableCell>
                    <TableCell>{t("orders.email")}</TableCell>
                  </>
                )}
                <TableCell>{t("orders.date")}</TableCell>
                <TableCell>{t("orders.total")}</TableCell>
                <TableCell>{t("orders.status")}</TableCell>
                <TableCell>{t("common.actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(o => {
                const st = statusCfg(o.status)
                return (
                  <TableRow key={o.id} hover>
                    <TableCell>#{o.id}</TableCell>
                    {user.role === "ADMIN" && (
                      <>
                        <TableCell>{o.customerName}</TableCell>
                        <TableCell>{o.customerEmail}</TableCell>
                      </>
                    )}
                    <TableCell>{new Date(o.orderDate).toLocaleString("uz-UZ")}</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "success.main" }}>${o.totalAmount.toFixed(2)}</TableCell>
                    <TableCell><Chip label={st.label} color={st.color} size="small" /></TableCell>
                    <TableCell>
                      <Button component={Link} to={`/orders/${o.id}`} size="small" variant="outlined">
                        {t("orders.viewDetails")}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {pagination?.totalPages > 1 && (
            <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
          )}
        </>
      )}
    </Container>
  )
}
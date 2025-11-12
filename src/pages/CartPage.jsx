import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { removeFromCart, updateCartItem, clearCart } from "../store/slices/cartSlice"
import { ordersAPI } from "../api/apiService"
import { useTranslation } from "react-i18next"
import {
  Container, Typography, Box, Grid, Card, CardContent, IconButton, Input,
  Button, CircularProgress, Stack, Divider, Alert,
  AlertTitle
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"

export default function CartPage({ onToast }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const cartItems = useSelector((state) => state.cart.items)
  const [loading, setLoading] = useState(false)

  const subtotal = cartItems.reduce((s, i) => s + i.price * (i.quantity || 1), 0)

  const handleCheckout = async () => {
    if (!cartItems.length) return onToast(t("orders.emptyCart"), "error")
    setLoading(true)
    try {
      const orderData = {
        customerName: user.username,
        customerEmail: user.email,
        orderItems: cartItems.map(i => ({ productId: i.id, quantity: i.quantity || 1 }))
      }
      const res = await ordersAPI.create(orderData)
      if (res.success) {
        onToast(t("orders.orderPlaced"), "success")
        dispatch(clearCart())
        navigate(`/orders/${res.data.id}`)
      }
    } catch (e) {
      onToast(e.message || t("common.error"), "error")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
        <Alert severity="info">{t("auth.requireLogin")}</Alert>
        <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={() => navigate("/login")}>
          {t("auth.login")}
        </Button>
      </Container>
    )
  }

  if (!cartItems.length) {
    return (
      <Container sx={{ textAlign: "center", py: 8 }}>
        <Box textAlign="center" py={10}>
          <Box
            sx={{
              width: 120,
              height: 120,
              mx: "auto",
              mb: 3,
              bgcolor: "grey.100",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "grey.400"
            }}
          >
            <Inventory2OutlinedIcon sx={{ fontSize: 60 }} />
          </Box>
          <Alert severity="info" sx={{ maxWidth: 500, mx: "auto" }}>
            <AlertTitle>{t("cart.empty")}</AlertTitle>
          </Alert>
        </Box>
        <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={() => navigate("/products")}>
          {t("nav.products")}
        </Button>
      </Container>
    )
  }

  return (
    <Container sx={{ py: 4 }} >
      <Typography variant="h4" fontWeight="bold" gutterBottom>{t("cart.title")}</Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Card elevation={2}>
            <CardContent sx={{ p: 0 }}>
              {cartItems.map(item => (
                <Box key={item.id} sx={{ p: 3, borderBottom: 1, borderColor: "divider", "&:last-child": { border: 0 } }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={5}>
                      <Typography fontWeight="bold">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.category}</Typography>
                      <Typography color="success.main" fontWeight="medium">${item.price.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Input
                          type="number"
                          value={item.quantity || 1}
                          inputProps={{ min: 1, max: item.stock }}
                          onChange={e => dispatch(updateCartItem({ id: item.id, quantity: Math.max(1, Math.min(item.stock, +e.target.value)) }))}
                          sx={{ width: 70, textAlign: "center" }}
                        />
                        <Typography fontWeight="bold" color="success.main">
                          ${(item.price * (item.quantity || 1)).toFixed(2)}
                        </Typography>
                        <IconButton color="error" onClick={() => dispatch(removeFromCart(item.id))}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card elevation={2} sx={{ position: "sticky", top: 24 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>{t("cart.total")}</Typography>
              <Stack spacing={2} divider={<Divider />}>
                <Box display="flex" justifyContent="space-between">
                  <Typography>{t("cart.subtotal")}:</Typography>
                  <Typography fontWeight="medium">${subtotal.toFixed(2)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>{t("cart.shipping")}:</Typography>
                  <Typography color="success.main" fontWeight="medium">{t("common.free") || "Bepul"}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">{t("cart.total")}:</Typography>
                  <Typography variant="h6" color="success.main" fontWeight="bold">${subtotal.toFixed(2)}</Typography>
                </Box>
              </Stack>
              <Button
                fullWidth variant="contained" color="success" size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                onClick={handleCheckout} disabled={loading} sx={{ mt: 3 }}
              >
                {loading ? t("common.loading") : t("button.checkout")}
              </Button>
              <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => navigate("/products")}>
                {t("button.continueShopping")}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
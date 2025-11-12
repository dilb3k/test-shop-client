import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setLoading, setCurrentProduct, setError } from "../store/slices/productsSlice"
import { addToCart } from "../store/slices/cartSlice"
import { productsAPI } from "../api/apiService"
import ProductDetailSkeleton from "../components/ProductDetailSkeleton"
import { useTranslation } from "react-i18next"
import {
  Container, Typography, Button, Box, Grid, Card, CardContent, Chip, Stack
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"

export default function ProductDetailsPage({ onToast }) {
  const { t } = useTranslation()
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentProduct, loading } = useSelector(s => s.products)

  useEffect(() => { fetchProduct() }, [id])

  const fetchProduct = async () => {
    dispatch(setLoading())
    try {
      const res = await productsAPI.getById(id)
      dispatch(setCurrentProduct(res.data))
    } catch (e) {
      dispatch(setError(e.message))
      onToast(e.message, "error")
    }
  }

  const handleAdd = () => {
    dispatch(addToCart({ ...currentProduct, quantity: 1 }))
    onToast(t("products.addedToCart"), "success")
  }

  if (loading) return <ProductDetailSkeleton />
  if (!currentProduct) {
    return (
      <Container sx={{ textAlign: "center", py: 8 }}>
        <Box sx={{ bgcolor: "grey.200", border: "2px dashed", borderColor: "grey.400", borderRadius: 2, width: 96, height: 96, mx: "auto", mb: 2 }} />
        <Typography>{t("common.noData")}</Typography>
        <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={() => navigate("/products")}>
          {t("nav.products")}
        </Button>
      </Container>
    )
  }

  return (
    <Container sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        {t("nav.back")}
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ bgcolor: "grey.100", borderRadius: 2, p: 4, height: { xs: 300, md: 400 }, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="h1" color="success.main" fontWeight="bold">
              {currentProduct.name[0].toUpperCase()}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>{currentProduct.name}</Typography>
          <Typography variant="h5" color="success.main" fontWeight="bold" gutterBottom>
            ${currentProduct.price}
          </Typography>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight="medium">{t("products.category")}:</Typography>
                  <Typography>{currentProduct.category}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight="medium">{t("products.stock")}:</Typography>
                  <Chip
                    label={currentProduct.stock > 0 ? `${currentProduct.stock} ${t("products.stock")}` : t("products.outOfStock")}
                    color={currentProduct.stock > 0 ? "success" : "error"}
                    size="small"
                  />
                </Box>
                {currentProduct.description && (
                  <Box>
                    <Typography fontWeight="medium">{t("products.description")}:</Typography>
                    <Typography variant="body2">{currentProduct.description}</Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Button
            fullWidth variant="contained" color="success" size="large"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAdd} disabled={currentProduct.stock === 0}
          >
            {currentProduct.stock === 0 ? t("products.outOfStock") : t("button.addToCart")}
          </Button>

          <Button fullWidth variant="text" sx={{ mt: 1 }} onClick={() => navigate("/products")}>
            {t("button.continueShopping")}
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}
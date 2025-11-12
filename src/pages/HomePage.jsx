import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { setLoading, setProducts } from "../store/slices/productsSlice"
import { productsAPI } from "../api/apiService"
import ProductCard from "../components/ProductCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { Container, Typography, Button, Box, Grid } from "@mui/material"

export default function HomePage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { items, loading } = useSelector((state) => state.products)

  useEffect(() => {
    const fetch = async () => {
      dispatch(setLoading())
      try {
        const res = await productsAPI.getAll(0, 10)
        dispatch(setProducts(res))
      } catch { }
    }
    fetch()
  }, [dispatch])

  return (
    <Box>
      <Box sx={{ bgcolor: "primary.main", color: "white", py: { xs: 8, md: 12 }, textAlign: "center" }}>
        <Container>
          <Typography variant="h3" fontWeight="bold" gutterBottom>{t("nav.home")}</Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Welcome to our online shop. Browse our collection of quality products.
          </Typography>
          <Button variant="contained" size="large" color="inherit" href="/products">
            {t("nav.products")}
          </Button>
        </Container>
      </Box>

      <Container sx={{ py: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Featured Products</Typography>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Grid container spacing={3}>
            {items.slice(0, 6).map(p => (
              <Grid item xs={12} sm={6} md={4} key={p.id}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}
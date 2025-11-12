import { useState, useEffect, useCallback, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { setLoading, setProducts, setError } from "../store/slices/productsSlice"
import { productsAPI } from "../api/apiService"
import ProductCard from "../components/ProductCard"
import ProductSkeleton from "../components/ProductSkeleton"
import { useTranslation } from "react-i18next"
import useDebounce from "../hooks/useDebounce"
import {
  Container, Typography, TextField, Grid, Box, InputAdornment, Alert, AlertTitle
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"

export default function ProductsPage({ onToast }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector(s => s.products)

  const [searchParams, setSearchParams] = useSearchParams()
  const urlSearch = searchParams.get("search") || ""
  const urlCategory = searchParams.get("category") || ""

  const [search, setSearch] = useState(urlSearch)
  const [category, setCategory] = useState(urlCategory)

  const debouncedSearch = useDebounce(search, 500)
  const debouncedCategory = useDebounce(category, 500)

  const didMountRef = useRef(false)
  const isFetchingRef = useRef(false)

  const fetchProducts = useCallback(async (s = "", c = "") => {
    if (isFetchingRef.current) return
    isFetchingRef.current = true
    dispatch(setLoading())
    try {
      const res = s || c
        ? await productsAPI.search(s, c, 0, 10)
        : await productsAPI.getAll(0, 10)
      dispatch(setProducts(res.data))
    } catch (e) {
      dispatch(setError(e.message))
      onToast?.(e.message || t("common.error"), "error")
    } finally {
      isFetchingRef.current = false
    }
  }, [dispatch, onToast, t])

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      fetchProducts(urlSearch, urlCategory)
    }
  }, []) 

  useEffect(() => {
    if (!didMountRef.current) return

    const params = new URLSearchParams()
    if (debouncedSearch) params.set("search", debouncedSearch)
    if (debouncedCategory) params.set("category", debouncedCategory)
    setSearchParams(params)

    fetchProducts(debouncedSearch, debouncedCategory)
  }, [debouncedSearch, debouncedCategory])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {t("products.title")}
      </Typography>

      <Box
        component="form"
        onSubmit={e => e.preventDefault()}
        sx={{ display: "flex", justifyContent: "end", gap: 2, mb: 4, flexWrap: "wrap" }}
      >
        <TextField
          size="small"
          placeholder={t("products.search")}
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
          }}
          sx={{ flex: 1, maxWidth: 220 }}
        />
        <TextField
          size="small"
          placeholder={t("products.category")}
          value={category}
          onChange={e => setCategory(e.target.value)}
          sx={{ flex: 1, maxWidth: 220 }}
        />
      </Box>

      {loading && (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <ProductSkeleton />
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && error && (
        <Box textAlign="center" py={8}>
          <Alert severity="error" sx={{ maxWidth: 500, mx: "auto" }}>
            <AlertTitle>{t("common.error")}</AlertTitle>
            {error}
          </Alert>
        </Box>
      )}

      {!loading && !error && items.length === 0 && (
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
            <AlertTitle>{t("products.noProducts")}</AlertTitle>
            {search || category ? t("products.tryDifferentSearch") : t("products.noProductsInCatalog")}
          </Alert>
        </Box>
      )}

      {!loading && !error && items.length > 0 && (
        <Grid container spacing={3}>
          {items.map(p => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
              <ProductCard product={p} onAddCart={onToast} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { addToCart } from "../store/slices/cartSlice"
import { useTranslation } from "react-i18next"
import {
  Card, CardContent, CardActions, Typography, Button, Chip, Box
} from "@mui/material"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"

export default function ProductCard({ product, onAddCart }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleAdd = e => {
    e.preventDefault()
    dispatch(addToCart({ ...product, quantity: 1 }))
    onAddCart?.(t("products.addedToCart"), "success")
  }

  return (
    <Card
      component={Link}
      to={`/products/${product.id}`}
      sx={{
        minWidth: 230,
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        "&:hover": { boxShadow: 4 },
        transition: "0.3s"
      }}
    >
      <Box sx={{ bgcolor: "grey.100", height: 160, display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
        <Typography variant="h3" color="success.main" fontWeight="bold">
          {product.name[0].toUpperCase()}
        </Typography>
      </Box>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>{product.name}</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" color="success.main" fontWeight="bold">${product.price}</Typography>
          <Chip
            label={product.stock > 0 ? `${product.stock} ${t("products.stock")}` : t("products.outOfStock")}
            color={product.stock > 0 ? "success" : "error"}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" noWrap>
          {product.description || product.category}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          fullWidth variant="contained" color="success"
          startIcon={<ShoppingCartIcon />}
          onClick={handleAdd} disabled={product.stock === 0}
        >
          {product.stock === 0 ? t("products.outOfStock") : t("button.addToCart")}
        </Button>
      </CardActions>
    </Card>
  )
}
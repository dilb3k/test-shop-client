import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../store/slices/authSlice"
import { useTranslation } from "react-i18next"
import {
  AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem, Button, Box, Avatar
} from "@mui/material"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import MenuIcon from "@mui/icons-material/Menu"
import PersonIcon from "@mui/icons-material/Person"
import StorefrontIcon from "@mui/icons-material/Storefront"
import ListAltIcon from "@mui/icons-material/ListAlt"

export default function Header() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(s => s.auth.user)
  const cartItems = useSelector(s => s.cart.items)
  const cartCount = cartItems.reduce((s, i) => s + (i.quantity || 1), 0)

  const [profileAnchorEl, setProfileAnchorEl] = useState(null)
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
    handleProfileMenuClose()
    handleMobileMenuClose()
  }

  const handleProfileMenuOpen = (event) => setProfileAnchorEl(event.currentTarget)
  const handleProfileMenuClose = () => setProfileAnchorEl(null)

  const handleMobileMenuOpen = (event) => setMobileAnchorEl(event.currentTarget)
  const handleMobileMenuClose = () => setMobileAnchorEl(null)

  const profileMenuId = "profile-menu"
  const mobileMenuId = "mobile-menu"

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component={Link}
          to="/products"
          sx={{ color: "success.main", fontWeight: "bold", textDecoration: "none" }}
        >
          ShopHub
        </Typography>

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          <Button
            component={Link}
            to="/products"
            startIcon={<StorefrontIcon />}
          >
            {t("nav.products")}
          </Button>
          <Button
            component={Link}
            to="/orders"
            startIcon={<ListAltIcon />}
          >
            {t("nav.orders")}
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton component={Link} to="/cart" color="inherit">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <IconButton
            edge="end"
            color="inherit"
            aria-controls={profileMenuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
          >
            {user ? <Avatar sx={{ width: 32, height: 32 }}>{user.username[0].toUpperCase()}</Avatar> : <PersonIcon />}
          </IconButton>

          <IconButton
            edge="end"
            color="inherit"
            sx={{ display: { md: "none" } }}
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      <Menu
        id={profileMenuId}
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {user
          ? [
            <MenuItem key="user" disabled>{user.username} ({user.email})</MenuItem>,
            <MenuItem key="logout" onClick={handleLogout} sx={{ color: "error.main" }}>{t("nav.logout")}</MenuItem>
          ]
          : [
            <MenuItem key="login" component={Link} to="/login" onClick={handleProfileMenuClose}>
              {t("nav.login")}
            </MenuItem>
          ]
        }
      </Menu>


      <Menu
        id={mobileMenuId}
        anchorEl={mobileAnchorEl}
        open={Boolean(mobileAnchorEl)}
        onClose={handleMobileMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { m: 0, minWidth: 180 } }}
        disablePortal
      >
        <MenuItem component={Link} to="/products" onClick={handleMobileMenuClose}>
          <StorefrontIcon sx={{ mr: 1 }} />
          {t("nav.products")}
        </MenuItem>
        <MenuItem component={Link} to="/orders" onClick={handleMobileMenuClose}>
          <ListAltIcon sx={{ mr: 1 }} />
          {t("nav.orders")}
        </MenuItem>

        {!user && (
          <MenuItem component={Link} to="/login" onClick={handleMobileMenuClose}>
            {t("nav.login")}
          </MenuItem>
        )}
      </Menu>
    </AppBar>
  )
}

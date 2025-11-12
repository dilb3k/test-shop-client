import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useTranslation } from "react-i18next";
import {
  AppBar, Toolbar, IconButton, Badge, Menu, MenuItem, Box, Avatar, Typography,
  ListItemIcon, ListItemText, Divider
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Storefront as StorefrontIcon,
  ListAlt as ListAltIcon,
  Logout as LogoutIcon,
  Language as LanguageIcon
} from "@mui/icons-material";

export default function Header() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(s => s.auth.user);
  const cartItems = useSelector(s => s.cart.items);
  const cartCount = cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0);

  const [mobileAnchor, setMobileAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [langAnchor, setLangAnchor] = useState(null);

  const closeAll = () => {
    setMobileAnchor(null);
    setProfileAnchor(null);
    setLangAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    closeAll();
  };

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    closeAll();
  };

  // Shared navigation items
  const navLinks = [
    { to: "/products", icon: StorefrontIcon, label: t("nav.products") },
    { to: "/orders", icon: ListAltIcon, label: t("nav.orders") },
  ];

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>

        <Typography
          component={Link}
          to="/products"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            color: "success.main",
            textDecoration: "none",
            letterSpacing: 0.5
          }}
        >
          ShopHub
        </Typography>

        <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 3, alignItems: "center" }}>
          {navLinks.map(({ to, icon: Icon, label }) => (
            <IconButton
              key={to}
              component={Link}
              to={to}
              size="large"
              sx={{
                color: "text.primary",
                "&:hover": { color: "primary.main" },
                borderRadius: 2,
                px: 1.5,
                py: 0.75,
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <Icon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {label}
              </Typography>
            </IconButton>
          ))}

          <IconButton component={Link} to="/cart" size="large">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} size="large">
            {user ? (
              <Avatar sx={{ width: 36, height: 36, fontSize: "0.95rem", bgcolor: "primary.main" }}>
                {user.username[0].toUpperCase()}
              </Avatar>
            ) : (
              <PersonIcon />
            )}
          </IconButton>
        </Box>

        <IconButton
          sx={{ display: { lg: "none" } }}
          onClick={(e) => setMobileAnchor(e.currentTarget)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Menu
        anchorEl={mobileAnchor}
        open={Boolean(mobileAnchor)}
        onClose={closeAll}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { mt: 1, minWidth: 220 } }}
      >
        {navLinks.map(({ to, icon: Icon, label }) => (
          <MenuItem key={to} component={Link} to={to} onClick={closeAll}>
            <ListItemIcon><Icon fontSize="small" /></ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}

        <MenuItem component={Link} to="/cart" onClick={closeAll}>
          <ListItemIcon>
            <Badge badgeContent={cartCount} color="error" fontSize="small">
              <ShoppingCartIcon fontSize="small" />
            </Badge>
          </ListItemIcon>
          <ListItemText>{t("nav.cart")}</ListItemText>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        {user ? (
          <>
            <MenuItem disabled>
              <ListItemText
                primary={user.username}
                secondary={user.email}
                primaryTypographyProps={{ fontWeight: 600, fontSize: "0.95rem" }}
                secondaryTypographyProps={{ fontSize: "0.8rem" }}
              />
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              <ListItemText>{t("nav.logout")}</ListItemText>
            </MenuItem>
            <MenuItem onClick={(e) => { setLangAnchor(e.currentTarget); e.stopPropagation(); }}>
              <ListItemIcon><LanguageIcon fontSize="small" /></ListItemIcon>
              <ListItemText>{t("nav.language")}</ListItemText>
            </MenuItem>
          </>
        ) : (
          <MenuItem component={Link} to="/login" onClick={closeAll}>
            <ListItemText>{t("nav.login")}</ListItemText>
          </MenuItem>
        )}
      </Menu>

      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={closeAll}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { mt: 1.5, minWidth: 200 } }}
      >
        {user ? (
          <>
            <MenuItem disabled>
              <ListItemText
                primary={user.username}
                secondary={user.email}
                primaryTypographyProps={{ fontWeight: 600 }}
                secondaryTypographyProps={{ fontSize: "0.8rem", color: "text.secondary" }}
              />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              <ListItemText>{t("nav.logout")}</ListItemText>
            </MenuItem>
            <MenuItem onClick={(e) => { setLangAnchor(e.currentTarget); e.stopPropagation(); }}>
              <ListItemIcon><LanguageIcon fontSize="small" /></ListItemIcon>
              <ListItemText>{t("nav.language")}</ListItemText>
            </MenuItem>
          </>
        ) : (
          <MenuItem component={Link} to="/login" onClick={closeAll}>
            {t("nav.login")}
          </MenuItem>
        )}
      </Menu>

      <Menu
        anchorEl={langAnchor}
        open={Boolean(langAnchor)}
        onClose={closeAll}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{ sx: { mt: -1 } }}
      >
        <MenuItem onClick={() => changeLang("uz")}>
          <ListItemText inset={!langAnchor}>O'zbekcha</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => changeLang("en")}>
          <ListItemText inset={!langAnchor}>English</ListItemText>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
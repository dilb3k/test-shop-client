import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser, setError } from "../store/slices/authSlice"
import { authAPI } from "../api/apiService"
import { useTranslation } from "react-i18next"
import {
  Container, Card, CardContent, TextField, Button, Typography, Box, CircularProgress, Link
} from "@mui/material"

export default function RegisterPage({ onToast }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return onToast(t("validation.passwordMatch"), "error")
    setLoading(true)
    try {
      const res = await authAPI.register(form.username, form.email, form.password)
      if (res.success) {
        dispatch(setUser({ user: res.data, token: res.data.token }))
        onToast(t("auth.registerSuccess"), "success")
        navigate("/products")
      }
    } catch (err) {
      dispatch(setError(err.message))
      onToast(err.message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ display: "flex", alignItems: "center", minHeight: "100vh" }}>
      <Card sx={{ width: "100%", p: 2 }}>
        <CardContent>
          <Typography variant="h4" textAlign="center" color="success.main" fontWeight="bold" gutterBottom>
            ShopHub
          </Typography>
          <Typography variant="h5" textAlign="center" gutterBottom>{t("auth.register")}</Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label={t("auth.name")} name="username" value={form.username} onChange={handleChange} required fullWidth />
            <TextField label={t("auth.email")} name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />
            <TextField label={t("auth.password")} name="password" type="password" value={form.password} onChange={handleChange} required fullWidth />
            <TextField label={t("auth.passwordConfirm")} name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required fullWidth />
            <Button type="submit" variant="contained" color="success" disabled={loading} fullWidth>
              {loading ? <CircularProgress size={24} /> : t("auth.register")}
            </Button>
          </Box>

          <Typography textAlign="center" sx={{ mt: 2 }}>
            {t("auth.haveAccount")}{" "}
            <Link href="/login" underline="hover" color="success.main" fontWeight="bold">
              {t("auth.login")}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}
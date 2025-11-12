import { Snackbar, Alert } from "@mui/material"

export default function Toast({ message, type }) {
  return (
    <Snackbar open={!!message} autoHideDuration={3000} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <Alert severity={type} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
import { createTheme } from "@mui/material/styles"

const theme = createTheme({
    palette: {
        primary: {
            main: "#5CAB7A",
            contrastText: "#ffffff"
        },
        success: {
            main: "#10B981",
            contrastText: "#ffffff"
        },
        error: {
            main: "#EF4444",
            contrastText: "#ffffff"
        },
        warning: {
            main: "#F59E0B",
            contrastText: "#ffffff"
        },
        info: {
            main: "#3B82F6",
            contrastText: "#ffffff"
        },
        secondary: {
            main: "#8B5CF6",
            contrastText: "#ffffff"
        }
    },
    typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true
            },
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600
                }
            }
        },
        MuiCard: {
            defaultProps: { elevation: 2 }
        }
    }
})

export default theme
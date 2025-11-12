import { Card, CardContent, Skeleton, Box } from "@mui/material"

export default function ProductSkeleton() {
    return (
        <Card sx={{ height: "100%", display: "flex",minWidth: 230, flexDirection: "column" }}>
            <Skeleton variant="rectangular" height={200} sx={{ bgcolor: "grey.200" }} />

            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Skeleton width="80%" height={28} sx={{ mb: 1 }} />
                <Skeleton width="60%" height={24} sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
                    <Skeleton width="40%" height={32} />
                    <Skeleton width={36} height={36} variant="circular" />
                </Box>
            </CardContent>
        </Card>
    )
}
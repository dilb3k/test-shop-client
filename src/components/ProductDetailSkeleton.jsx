import { Container, Grid, Box, Skeleton, Stack } from "@mui/material"

export default function ProductDetailSkeleton() {
    return (
        <Container sx={{ py: 4 }}>
            <Skeleton width={120} height={40} sx={{ mb: 3 }} />

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Skeleton width="70%" height={48} sx={{ mb: 2 }} />
                    <Skeleton width="40%" height={40} sx={{ mb: 3 }} />

                    <Stack spacing={2} sx={{ mb: 3 }}>
                        {[...Array(3)].map((_, i) => (
                            <Box key={i} display="flex" justifyContent="space-between">
                                <Skeleton width="30%" height={24} />
                                <Skeleton width="50%" height={24} />
                            </Box>
                        ))}
                    </Stack>

                    <Skeleton width="100%" height={56} sx={{ mb: 2 }} />
                    <Skeleton width="100%" height={48} />
                </Grid>
            </Grid>
        </Container>
    )
}
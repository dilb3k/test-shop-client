import { Container, Grid, Card, CardContent, Skeleton, Box, Stack } from "@mui/material"

export default function OrderDetailSkeleton() {
    return (
        <Container sx={{ py: 4 }}>
            <Skeleton width={120} height={40} sx={{ mb: 3 }} />

            <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Skeleton width="40%" height={36} />
                                <Skeleton width={80} height={32} />
                            </Box>

                            <Grid container spacing={2}>
                                {[...Array(4)].map((_, i) => (
                                    <Grid item xs={6} key={i}>
                                        <Skeleton width="40%" height={20} />
                                        <Skeleton width="60%" height={28} />
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Skeleton width="30%" height={32} sx={{ mb: 2 }} />
                            <Stack spacing={1.5}>
                                {[...Array(3)].map((_, i) => (
                                    <Box key={i} display="flex" justifyContent="space-between">
                                        <Skeleton width="50%" />
                                        <Skeleton width="15%" />
                                        <Skeleton width="20%" />
                                        <Skeleton width="20%" />
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* RIGHT */}
                <Grid item xs={12} lg={4}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Skeleton width="40%" height={32} />
                            <Skeleton width="60%" height={56} />
                        </CardContent>
                    </Card>

                    <Card sx={{ p: 2 }}>
                        <Skeleton width="60%" height={28} sx={{ mb: 2 }} />
                        <Skeleton width="100%" height={40} sx={{ mb: 1 }} />
                        <Skeleton width="100%" height={48} />
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, IconButton, Chip, Skeleton } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import offerbgimg from '../../assets/images/Overview_Images/dealsofferPngimage.png'
import { apiget } from "../service/api";

const DealsSlider = ({ buisnessId }) => {
    const sliderRef = useRef(null);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(false);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 300;
            sliderRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
        }
    };

    const fetchPromoCode = async () => {
        try {
            if (!buisnessId) return;

            setLoading(true);
            const result = await apiget(`api/v1/PromoCode/list/${buisnessId}`);

            if (result?.data?.Status === 200) {
                setDeals(result?.data?.Data || []);
            }
        } catch (err) {
            console.log(err);
            setDeals([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPromoCode();
    }, [buisnessId]);

    // Hide component if not loading and no deals
    if (!loading && (!deals || deals.length === 0)) {
        return null;
    }

    const gradients = [
        "linear-gradient(135deg, #ff416c, #ff4b2b)",
        "linear-gradient(135deg, #00c6ff, #0072ff)",
        "linear-gradient(135deg, #11998e, #38ef7d)",
        "linear-gradient(135deg, #8e2de2, #4a00e0)",
        "linear-gradient(135deg, #f7971e, #ffd200)",
        "linear-gradient(135deg, #43e97b, #38f9d7)",
        "linear-gradient(135deg, #fc5c7d, #6a82fb)",
    ];


    return (
        <Box
            sx={{
                bgcolor: "black",
                color: "white",
                p: 2,
                borderRadius: 6,
                maxWidth: "1300px",
                margin: "30px auto",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h6">Deals for you</Typography>

                {!loading && (
                    <Box>
                        <IconButton size="small" sx={{ color: "white" }} onClick={() => scroll("left")}>
                            <KeyboardBackspaceIcon sx={{ fontSize: "28px" }} />
                        </IconButton>
                        <IconButton
                            size="small"
                            sx={{ color: "white" }}
                            onClick={() => scroll("right")}
                        >
                            <KeyboardBackspaceIcon
                                sx={{
                                    transform: "rotate(180deg)",
                                    fontSize: "28px",
                                }}
                            />
                        </IconButton>
                    </Box>
                )}
            </Box>

            <Box
                ref={sliderRef}
                sx={{
                    display: "flex",
                    gap: 1,
                    overflowX: "auto",
                    pb: 1,
                    scrollBehavior: "smooth",
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                }}
            >
                {loading ? (
                    // Skeleton loading state
                    Array.from({ length: 3 }).map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                bgcolor: "white",
                                borderRadius: "16px",
                                minWidth: "210px",
                                height: "60px",
                                display: "flex",
                                alignItems: "center",
                                padding: "8px 12px",
                                gap: 1,
                                flexShrink: 0,
                            }}
                        >
                            <Skeleton
                                variant="circular"
                                width={45}
                                height={45}
                                sx={{ bgcolor: "grey.300" }}
                            />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton
                                    variant="text"
                                    width="80%"
                                    height={20}
                                    sx={{ bgcolor: "grey.300" }}
                                />
                                <Skeleton
                                    variant="text"
                                    width="60%"
                                    height={16}
                                    sx={{ bgcolor: "grey.300" }}
                                />
                            </Box>
                        </Box>
                    ))
                ) : (

                    deals.map((deal, index) => {
                        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
                        return (
                            <Chip
                                key={index}
                                icon={
                                    <div
                                        style={{
                                            width: "45px",
                                            height: "45px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 600,
                                            backgroundImage: randomGradient,
                                            color: "#fff",
                                            WebkitMaskImage: `url(${offerbgimg})`,
                                            maskImage: `url(${offerbgimg})`,
                                            WebkitMaskSize: "cover",
                                            maskSize: "cover",
                                            WebkitMaskRepeat: "no-repeat",
                                            maskRepeat: "no-repeat",
                                            marginLeft: "5px",
                                            marginRight: "7px",
                                            flexShrink: 0,
                                        }}
                                    >
                                        OFF
                                    </div>
                                }
                                label={
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            maxWidth: "100px",
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                            {`${deal.discount_type} ₹${deal.discount_value} OFF`}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontWeight: 700,
                                                color: "grey",
                                            }}
                                        >
                                            USE {deal.code}
                                        </Typography>
                                    </Box>
                                }
                                sx={{
                                    bgcolor: "white",
                                    color: "black",
                                    width: "max-content",
                                    minWidth: "210px",
                                    height: "60px",
                                    justifyContent: "flex-start",
                                    "& .MuiChip-label": {
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        gap: 1,
                                        padding: "10px 0",
                                        width: "100%",
                                    },
                                }}
                            />
                        )
                    })
                )}
            </Box>
        </Box>
    );
};

export default DealsSlider;
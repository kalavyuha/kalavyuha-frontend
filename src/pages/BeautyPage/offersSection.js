import React, { useRef } from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import offerbgimg from '../../assets/images/Overview_Images/dealsofferPngimage.png'

// Sample deals data
const deals = [
    {
        label: "Flat 10% OFF",
        code: "USE CODE: MUFFT",
    },
    {

        label: "20% Cashback",
        code: "USE CODE: SAVE20",
    },
    {

        label: "Free Shipping",
        code: "ON ORDERS ABOVE ₹500",
    },
    {

        label: "50% OFF",
        code: "LIMITED OFFER",
    },
    {

        label: "Buy 1 Get 1",
        code: "USE CODE: BOGO",
    },
    {

        label: "Flat 10% OFF",
        code: "USE CODE: MUFFT",
    },
    {

        label: "20% Cashback",
        code: "USE CODE: SAVE20",
    },
    {

        label: "Free Shipping",
        code: "ON ORDERS ABOVE ₹500",
    },
    {

        label: "50% OFF",
        code: "LIMITED OFFER",
    },
    {

        label: "Buy 1 Get 1",
        code: "USE CODE: BOGO",
    },
];

const DealsSlider = () => {
    const sliderRef = useRef(null);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 300; 
            sliderRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
        }
    };

    return (
        <Box
            sx={{
                bgcolor: "black",
                color: "white",
                p: 2,
                borderRadius: 6,
                maxWidth: "1300px",
                margin: "0 auto",
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
            </Box>

            
            <Box
                ref={sliderRef}
                sx={{
                    display: "flex",
                    gap: 1,
                    overflowX: "auto",
                    pb: 1,
                    scrollBehavior: "smooth", // Smooth scrolling effect
                    "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar for Chrome
                    scrollbarWidth: "none", // Hide scrollbar for Firefox
                }}
            >
                {deals.map((deal, index) => (
                    <Chip
                        key={index}
                        icon={

                            <div
                                style={{
                                    width: "45px",
                                    height: "45px",
                                    display:'flex',
                                    alignItems:'center',
                                    justifyContent:'center',
                                    fontWeight:600,
                                    backgroundColor: '#000',
                                    color:'#fff',
                                    WebkitMaskImage: `url(${offerbgimg})`,
                                    maskImage: `url(${offerbgimg})`,
                                    WebkitMaskSize: "cover",
                                    maskSize: "cover",
                                    WebkitMaskRepeat: "no-repeat",
                                    maskRepeat: "no-repeat",
                                    marginLeft:'0'
                                }}
                            >Off</div>
                        }
                        label={
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    marginLeft: "20px",
                                    maxWidth: '100px',

                                }}
                            >
                                <Typography variant="body2"
                                    sx={{
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        width: '100%'
                                    }}
                                    fontWeight="bold">
                                    {deal.label}
                                </Typography>
                                <Typography sx={{
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    width: '100%'
                                }} variant="caption">{deal.code}</Typography>
                            </Box>
                        }
                        sx={{
                            bgcolor: "white",
                            color: "black",
                            width: "max-content",
                            minWidth: "190px",
                            height: "60px",
                            "& .MuiChip-label": {
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                padding: "10px 0",
                            },
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default DealsSlider;

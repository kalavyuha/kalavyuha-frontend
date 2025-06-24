import React, { useRef, useState } from 'react';
import { Box, Typography, Card, Grid, IconButton, CardMedia, Button, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import EastIcon from '@mui/icons-material/East';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import ProductMainImg from '../../../assets/images/Overview_Images/productsMainImg.jpg'
import Slider from 'react-slick';
import ImageIcon from '../../../assets/images/Overview_Images/image.png'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Products = ({ products, location }) => {
    const sliderRef = useRef(null);

    // State for main image index (changes with arrow clicks)
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [selectedProductIndex, setSelectedProductIndex] = useState(0);

    // Get main image based on mainImageIndex
    const getMainImage = () => {
        if (products && products.length > 0 && products[mainImageIndex]) {
            return products[mainImageIndex].ImageURL?.[0] || ImageIcon;
        }
        return ImageIcon;
    };

    // Get current selected product for details display
    const selectedProduct = products && products.length > 0 ? products[selectedProductIndex] : null;

    const settings = {
        dots: false,
        infinite: products && products.length > 2,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
        variableWidth: true,
        centerMode: true,
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    const handleNext = () => {
        sliderRef.current.slickNext();
        // Change main image on arrow click
        if (products && products.length > 0) {
            setMainImageIndex((prevIndex) =>
                prevIndex === products.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

   
    const handleImageClick = (product, index) => {
        setSelectedProductIndex(index);
      
    };

    // Calculate discounted price
    // const calculateDiscountedPrice = (price, discountPercentage) => {
    //     if (!price || !discountPercentage) return price;
    //     return Math.round(price - (price * discountPercentage / 100));
    // };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
            <Typography
                variant="h4"
                component="h2"
                fontSize={{ xs: '20px', sm: '24px', md: '28px' }}
                sx={{ fontWeight: 'bold', mb: 3, textAlign: 'left' }}
            >
                Recommended Care Products
            </Typography>

            <Card
                sx={{
                    position: 'relative',
                    borderRadius: 2,
                    mb: 3,
                    boxShadow: 3,
                    width: { xs: '100%', sm: '80%', md: '80%' },
                    margin: '0 auto',
                    cursor: 'pointer',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8))',
                        zIndex: 1,
                    }}
                ></Box>

                <IconButton
                    sx={{
                        position: 'absolute',
                        padding: 0,
                        top: -4,
                        left: 8,
                        zIndex: 9999,
                    }}
                >
                    <BookmarkAddIcon sx={{ color: '#fff', fontSize: '28px' }} />
                </IconButton>

                <CardMedia
                    component="img"
                    image={getMainImage()}
                    alt="Product Image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = ImageIcon;
                    }}
                    sx={{
                        height: { xs: 200, sm: 350 },
                        objectFit: 'cover'
                    }}
                />


                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                    }}
                >
                    <IconButton
                        sx={{
                            color: 'white',
                            mx: 1,
                            '&:hover': { color: '#ff6f61' },
                        }}
                    >
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton
                        sx={{
                            color: 'white',
                            mx: 1,
                            '&:hover': { color: '#4caf50' },
                        }}
                    >
                        <ShareIcon />
                    </IconButton>
                </Box>
            </Card>

            <Grid container width={{ xs: '100%', sm: '80%', md: '80%' }} height={'max-content'} margin={'0 auto'} spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                    {/* Product Details */}
                    {selectedProduct && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                {selectedProduct.Name || 'Premium Care Product'}
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    mb: 2,
                                   
                                }}
                            >
                                {selectedProduct?.DiscountedPrice < selectedProduct?.Price ? (
                                    <>
                                        <Typography
                                            variant="body1"
                                            sx={{ textDecoration: 'line-through', color: 'text.disabled' }}
                                        >
                                            ₹{selectedProduct?.Price}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            color="grey"
                                        >
                                            ₹{selectedProduct?.DiscountedPrice}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        color="grey"
                                    >
                                        ₹{selectedProduct?.Price || 'N/A'}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}

                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        {selectedProduct?.Description || 'This product is designed to reduce hair loss and promote hair regrowth effectively....'}{' '}
                        <Typography component="span" color="primary" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                            more.
                        </Typography>
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => {
                            const encodedDestination = encodeURIComponent(location);
                            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}&travelmode=driving`;
                            window.open(mapsUrl, '_blank');
                        }}
                        sx={{
                            bgcolor: 'black',
                            color: 'white',
                            borderRadius: '20px',
                            '&:hover': { bgcolor: '#333', color: 'white' },
                            mt: 1,
                        }}
                    >
                        VISIT SHOP
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} display="flex" alignItems="center">
                    <Slider
                        ref={sliderRef}
                        {...settings}
                        style={{
                            width: "100%",
                            height: "150px",
                            overflow: "hidden",
                        }}
                        slidesToShow={2}
                        slidesToScroll={1}
                        centerMode={false}
                        infinite={true}
                    >
                        {products &&
                            products.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        margin: 0,
                                        padding: 0,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Card
                                        onClick={() => handleImageClick(item, index)}
                                        sx={{
                                            borderRadius: 2,
                                            overflow: "hidden",
                                            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                                            width: "150px",
                                            height: "150px",
                                            marginRight: "50px",
                                            cursor: 'pointer',
                                           
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={item.ImageURL?.[0] || ImageIcon}
                                            alt={`Product ${index + 1}`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = ImageIcon;
                                            }}
                                            sx={{
                                                width: "150px",
                                                height: "150px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Card>
                                </div>
                            ))}
                    </Slider>

                    <IconButton
                        onClick={handleNext}
                        sx={{
                            bgcolor: "#000",
                            color: "#f1f1f1",
                            boxShadow: 3,
                            ml: 1,
                            transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                            "&:hover": { bgcolor: "grey.200", color: "#000" },
                        }}
                    >
                        <EastIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Products;
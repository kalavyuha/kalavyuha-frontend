import React, { useRef } from 'react';
import { Box, Typography, Card, Grid, IconButton, CardMedia, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import EastIcon from '@mui/icons-material/East';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import ProductMainImg from '../../../assets/images/Overview_Images/productsMainImg.jpg'
import Slider from 'react-slick';
import ImageIcon from '../../../assets/images/Overview_Images/image.png'


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



const Products = ({ products,location }) => {
    const sliderRef = useRef(null);

    const settings = {
        dots: false,
        infinite: products.length > 2,
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
    };

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
                    // overflow: 'hidden',
                    mb: 3,
                    boxShadow: 3,
                    width: { xs: '100%', sm: '80%', md: '80%' },
                    margin: '0 auto',
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
                    image={ProductMainImg}
                    alt="OI Shampoo"
                    sx={{ height: { xs: 200, sm: 350 } }}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        color: 'white',
                        textShadow: '1px 1px 5px rgba(0,0,0,0.8)',
                        zIndex: 2,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        MRP: ₹1499
                    </Typography>
                </Box>

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
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        This product is designed to reduce hair loss and promote hair regrowth effectively....{' '}
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
                                        sx={{
                                            borderRadius: 2,
                                            overflow: "hidden",
                                            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                                            width: "150px",
                                            height: "150px",
                                            marginRight: "50px",
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={item.ImageURL[0] || ImageIcon}
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

        </Box >
    );
};

export default Products;


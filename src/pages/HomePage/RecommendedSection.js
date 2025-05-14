import React, { useState, useRef } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Button, Container } from '@mui/material';
import { NavigateBefore, NavigateNext, LocationOn } from '@mui/icons-material';
import RecommendedImgPath from '../../assets/images/recommended/recommended.png';
import { useMediaQuery } from '@mui/material';
import TypeOneCard from '../../components/cardtypeone';

const ServicesRecommendations = () => {
    const salons = [
        {
            id: 1,
            name: 'Shree Sai Nath Saloon',
            location: 'Jaipur',
            rating: 4.8,
            service: 'Hair cut',
            discountedPrice: 50,
            originalPrice: 50,
            distance: '2.3 Km',
            image: RecommendedImgPath
        },
        {
            id: 2,
            name: 'Meraki Unisex Salon',
            location: 'Jaipur',
            rating: 4.8,
            service: 'Hair cut',
            discountedPrice: 50,
            originalPrice: 50,
            distance: '2.3 Km',
            image: RecommendedImgPath
        },
        {
            id: 3,
            name: 'Wellbeings Salon',
            location: 'Jaipur',
            rating: 4.8,
            service: 'Hair cut',
            discountedPrice: 50,
            originalPrice: 50,
            distance: '2.3 Km',
            image: RecommendedImgPath
        },
        {
            id: 4,
            name: 'Karishma Hair Cuts',
            location: 'Jaipur',
            rating: 4.8,
            service: 'Hair cut',
            discountedPrice: 50,
            originalPrice: 50,
            distance: '2.3 Km',
            image: RecommendedImgPath
        },
    ];

    const carouselRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const isSmallScreen = useMediaQuery('(max-width: 600px)');

    const scroll = (direction) => {
        const container = carouselRef.current;
        if (!container) return;

        const cardWidth = 300 + 32;
        const scrollAmount = direction === 'next' ? cardWidth : -cardWidth;
        const newPosition = scrollPosition + scrollAmount;

        const maxScroll = container.scrollWidth - container.clientWidth;
        const validPosition = Math.max(0, Math.min(newPosition, maxScroll));

        setScrollPosition(validPosition);
        container.scrollTo({ left: validPosition, behavior: 'smooth' });
    };


    return (
        <Container maxWidth="lg" sx={{ px: { xs: 4, sm: 8, md: 8, lg: 4 }, my: 10 }}>
            <Box>
                <Box
                    sx={{
                        display: isSmallScreen ? 'block' : 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: isSmallScreen ? 2 : 4
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, mb: 2 }}
                    >
                        Top-rated Services Near You
                    </Typography>
                </Box>

                <Box
                    ref={carouselRef}
                    sx={{
                        display: 'flex',
                        gap: 7,
                        position: 'relative',
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                        msOverflowStyle: 'none',
                        scrollBehavior: 'smooth'
                    }}
                >
                    {salons.map((salon) => (
                        <TypeOneCard key={salon.id} salon={salon} isSmallScreen={isSmallScreen} />
                    ))}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 0,
                        gap: 4
                    }}
                >
                    <IconButton
                        sx={{
                            height: "26px",
                            width: "26px",
                            bgcolor: '#e2e6ea',
                            boxShadow: 2,
                            '&:hover': { bgcolor: 'white' }
                        }}
                        onClick={() => scroll('prev')}
                    >
                        <NavigateBefore />
                    </IconButton>

                    <IconButton
                        sx={{
                            height: "26px",
                            width: "26px",
                            bgcolor: '#cdddec',
                            boxShadow: 2,
                            '&:hover': { bgcolor: 'white' }
                        }}
                        onClick={() => scroll('next')}
                    >
                        <NavigateNext sx={{ color: "#1b4d69" }} />
                    </IconButton>
                </Box>
            </Box>
        </Container>
    );
};

export default ServicesRecommendations;
import React, { useState, useRef } from 'react';
import { Box, IconButton, Container, Typography } from '@mui/material';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import TypeOneCard from '../../components/cardtypeone';

const ServicesRecommendations = ({ Services = [] }) => {
    const carouselRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const isSmallScreen = useMediaQuery('(max-width: 600px)');

    // Normalize incoming Services prop to handle various data formats
    const normalizedServices = (() => {
        if (Array.isArray(Services)) return Services;
        if (Services && Array.isArray(Services.items)) return Services.items;
        if (Services && Services.Data && Array.isArray(Services.Data.items)) return Services.Data.items;
        if (Services && typeof Services === 'object') return [Services];
        return [];
    })();

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

    // Don't render if no services available
    if (!normalizedServices || normalizedServices.length === 0) {
        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4, md: 4, lg: 4 }, my: 8 }}>
            <Box>
                <Box
                    sx={{
                        display: isSmallScreen ? 'block' : 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                            fontWeight: 600,
                            color: '#1b4d69',
                            mb: 2
                        }}
                    >
                        Recommended Services
                    </Typography>
                </Box>

                <Box
                    ref={carouselRef}
                    sx={{
                        display: 'flex',
                        gap: 4,
                        position: 'relative',
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                        msOverflowStyle: 'none',
                        scrollBehavior: 'smooth',
                        pb: 2
                    }}
                >
                    {normalizedServices.map((service, idx) => (
                        <TypeOneCard
                            key={service.id || service._id || idx}
                            salon={service}
                            isSmallScreen={isSmallScreen}
                        />
                    ))}
                </Box>

                {normalizedServices.length > 4 && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                            gap: 2
                        }}
                    >
                        <IconButton
                            sx={{
                                height: '36px',
                                width: '36px',
                                bgcolor: '#e8f0f7',
                                boxShadow: 1,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: '#1b4d69',
                                    '& svg': { color: 'white' }
                                }
                            }}
                            onClick={() => scroll('prev')}
                            aria-label="scroll left"
                        >
                            <NavigateBefore sx={{ color: '#1b4d69' }} />
                        </IconButton>
                        <IconButton
                            sx={{
                                height: '36px',
                                width: '36px',
                                bgcolor: '#e8f0f7',
                                boxShadow: 1,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: '#1b4d69',
                                    '& svg': { color: 'white' }
                                }
                            }}
                            onClick={() => scroll('next')}
                            aria-label="scroll right"
                        >
                            <NavigateNext sx={{ color: '#1b4d69' }} />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default ServicesRecommendations;
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import ImageIcon from '../assets/images/Overview_Images/image.png'

const TypeOneCard = React.memo(({ salon, isSmallScreen }) => {
    const { Business, Service } = salon
    return (
        <Card
            sx={{
                minWidth: 300,
                maxWidth: 300,
                borderRadius: 1,
                position: 'relative',
                background: "transparent",
                boxShadow: 'none'
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="175"
                    image={Business?.Image ? Business?.Image : ImageIcon}
                    alt={Business?.Name || 'Business Image'}
                    sx={{
                        borderRadius: "8px",
                        objectFit: "cover"
                    }}
                    onError={(e) => {
                        e.target.src = ImageIcon;
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: '#1B4B66',
                        color: 'white',
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                        fontSize: "0.7rem"
                    }}
                >
                    UP TO 10% OFF
                </Box>
            </Box>

            <CardContent sx={{ px: 0 }}>
                <Box sx={{ mb: 1 }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: isSmallScreen ? '0.75rem' : '0.9rem' }}
                    >
                        {Business?.Address || ''}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                            variant="h6"
                            component="div"
                            fontWeight="bold"
                            sx={{ fontSize: isSmallScreen ? '0.9rem' : '1.15rem' }}
                        >
                            {Business?.Name || ''}
                        </Typography>
                        <Typography
                            sx={{
                                bgcolor: '#1B4B66',
                                color: 'white',
                                py: 0.2,
                                px: 1,
                                borderRadius: 1,
                                fontSize: isSmallScreen ? '0.65rem' : '0.8rem'
                            }}
                        >
                            {Business?.Rating} ★
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
});

export default TypeOneCard;

import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const DiscountBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  fontWeight: 'bold',
  '& .MuiChip-label': {
    padding: '0 12px',
  },
}));

const PriceText = styled(Typography)({
  display: 'inline-block',
  marginRight: 8,
});

const StrikethroughPrice = styled(Typography)({
  textDecoration: 'line-through',
  color: 'text.secondary',
  display: 'inline-block',
});

export default function SalonCard({
  name,
  location,
  rating,
  distance,
  image,
  service,
  originalPrice,
  discountedPrice,
}) {
  return (
    <Card sx={{ maxWidth: 345, position: 'relative', borderRadius: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={name}
        sx={{ objectFit: 'cover' }}
      />
      <DiscountBadge label="UP TO 10% OFF" />
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {location}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'primary.main', color: 'white', px: 1, py: 0.5, borderRadius: 1 }}>
            <Typography variant="body2">{rating}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body1" component="div" sx={{ mb: 1 }}>
              {service}
            </Typography>
            <Box>
              <PriceText variant="body1">₹{discountedPrice}</PriceText>
              <StrikethroughPrice variant="body2">₹{originalPrice}</StrikethroughPrice>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2">{distance}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Button, IconButton, Typography, Chip, Box, Grid, Stack, Tooltip, Skeleton } from '@mui/material';
import { Clock, Wifi, AirVent, PawPrint } from 'lucide-react';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import PlusIcon from '@mui/icons-material/PlusOne';
import PoolIcon from '@mui/icons-material/Pool';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { DealsSection } from './DealSeaction';
import { apidelete, apiget, apipost } from '../service/api';
import { showError, showSuccess } from '../../components/toast';
import ImageIcon from '../../assets/images/Overview_Images/image.png'

const userId = 76368169;

const iconStyle = {
  height: '16px',
  fontSize: '16px'
}

const CardList = React.memo(({ data = [], isLoading, buisnessType }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState([])
  const [updatingFavourite, setUpdatingFavourite] = useState(null);
  const [type, setType] = useState('');

  useEffect(() => {
    setType(buisnessType)
  }, [buisnessType])




  const processAmenities = (businessFacilities) => {
  // Handle case where businessFacilities is null, undefined, empty array, or not an array
  if (!businessFacilities || !Array.isArray(businessFacilities) || businessFacilities.length === 0) {
    return [];
  }

  // Get the first (and likely only) facilities object from the array
  const facilities = businessFacilities[0];
  
  // Return empty array if facilities object is invalid
  if (!facilities || typeof facilities !== 'object') {
    return [];
  }

  const uniqueAmenities = [];
  const seenAmenities = new Set();

  // Helper function to add amenity if not already seen
  const addUniqueAmenity = (key, displayName) => {
    const normalizedKey = displayName.toLowerCase().trim();
    if (!seenAmenities.has(normalizedKey)) {
      seenAmenities.add(normalizedKey);
      uniqueAmenities.push({
        icon: getAmenityIcon(key),
        label: displayName
      });
    }
  };

  // Fields to skip (non-amenity database fields)
  const skipFields = [
    'BusinessId', 
    'CreatedBy', 
    'CreatedOn', 
    'UpdatedBy', 
    'UpdatedOn', 
    '_id',
    'ExtraAmenities' // We'll handle this separately
  ];

  // Process main facilities (excluding ExtraAmenities and database fields)
  Object.entries(facilities).forEach(([key, value]) => {
    // Skip non-amenity fields and ExtraAmenities (handled separately)
    if (skipFields.includes(key)) {
      return;
    }

    // Only process boolean true values
    if (typeof value === 'boolean' && value === true) {
      let displayName = key;

      // Special cases for better display names
      const displayNameMap = {
        'ACCooler': 'AC',
        'FreeWiFi': 'WiFi',
        'Internet': 'WiFi',
        'ParkingFacility': 'Parking',
        'Parking': 'Parking',
        'InstantConfirmation': 'Instant Booking',
        'VirtualConsultation': 'Virtual Service',
        'AtHomeService': 'Home Service',
        'Accessibility': 'Wheelchair Accessible',
        'Water': 'Water Supply'
      };

      if (displayNameMap[key]) {
        displayName = displayNameMap[key];
      } else {
        // Convert camelCase to readable format
        displayName = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
      }

      addUniqueAmenity(key, displayName);
    }
  });

  // Process ExtraAmenities separately
  if (facilities.ExtraAmenities && typeof facilities.ExtraAmenities === 'object') {
    Object.entries(facilities.ExtraAmenities).forEach(([key, value]) => {
      // Only process boolean true values
      if (typeof value === 'boolean' && value === true) {
        let displayName = key;

        // Special cases for extra amenities
        const extraDisplayNameMap = {
          'SpaAvailable': 'Spa',
          'GymInside': 'Gym',
          'PetFriendly': 'Pet Friendly',
          'ValetParking': 'Valet Parking'
        };

        if (extraDisplayNameMap[key]) {
          displayName = extraDisplayNameMap[key];
        } else {
          // Convert camelCase to readable format
          displayName = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
        }

        addUniqueAmenity(key, displayName);
      }
    });
  }

  return uniqueAmenities;
};

// Enhanced getAmenityIcon function with more comprehensive mapping
const getAmenityIcon = (amenityName) => {
  const iconStyle = {
    height: '16px',
    fontSize: '16px'
  };

  const iconMap = {
    // AC/Cooling related
    'ACCooler': <AirVent style={iconStyle} />,
    'AC': <AirVent style={iconStyle} />,
    'A C Cooler': <AirVent style={iconStyle} />,
    'Air Conditioning': <AirVent style={iconStyle} />,
    'Cooler': <AirVent style={iconStyle} />,
    
    // WiFi/Internet related
    'FreeWiFi': <Wifi style={iconStyle} />,
    'WiFi': <Wifi style={iconStyle} />,
    'Wifi': <Wifi style={iconStyle} />,
    'Wi-Fi': <Wifi style={iconStyle} />,
    'Free Wi Fi': <Wifi style={iconStyle} />,
    'Internet': <Wifi style={iconStyle} />,
    'VirtualConsultation': <Wifi style={iconStyle} />,
    'Virtual Consultation': <Wifi style={iconStyle} />,
    
    // Pet related
    'PetFriendly': <PawPrint style={iconStyle} />,
    'Pet Friendly': <PawPrint style={iconStyle} />,
    'Pet-Friendly': <PawPrint style={iconStyle} />,
    'Pets': <PawPrint style={iconStyle} />,
    'Animals': <PawPrint style={iconStyle} />,
    
    // Water/Pool/Spa related
    'Pool': <PoolIcon style={iconStyle} />,
    'Swimming Pool': <PoolIcon style={iconStyle} />,
    'Swimming': <PoolIcon style={iconStyle} />,
    'Water': <PoolIcon style={iconStyle} />,
    'SpaAvailable': <PoolIcon style={iconStyle} />,
    'Spa Available': <PoolIcon style={iconStyle} />,
    
    // Parking related
    'Parking': <PlusIcon style={iconStyle} />,
    'ParkingFacility': <PlusIcon style={iconStyle} />,
    'Parking Facility': <PlusIcon style={iconStyle} />,
    'ValetParking': <PlusIcon style={iconStyle} />,
    'Valet Parking': <PlusIcon style={iconStyle} />,
    
    // Time/Booking related
    'InstantConfirmation': <Clock style={iconStyle} />,
    'Instant Confirmation': <Clock style={iconStyle} />,
    
    // Other services
    'GymInside': <PlusIcon style={iconStyle} />,
    'Gym Inside': <PlusIcon style={iconStyle} />,
    'Accessibility': <PlusIcon style={iconStyle} />,
    'AtHomeService': <PlusIcon style={iconStyle} />,
    'At Home Service': <PlusIcon style={iconStyle} />,
  };

  // Direct match first
  if (iconMap[amenityName]) {
    return iconMap[amenityName];
  }

  // Case-insensitive match
  const normalizedName = amenityName?.trim();
  const matchedKey = Object.keys(iconMap).find(key =>
    key.toLowerCase() === normalizedName?.toLowerCase()
  );

  // Return matched icon or default to AirVent
  return matchedKey ? iconMap[matchedKey] : <AirVent style={iconStyle} />;
};

// Test with your sample data
const sampleApiData = [
  {
    "ACCooler": true,
    "Accessibility": true,
    "AtHomeService": false,
    "BusinessId": 99349543,
    "CreatedBy": null,
    "CreatedOn": "2025-06-05T17:34:19.217000",
    "ExtraAmenities": {
      "GymInside": true,
      "PetFriendly": false,
      "SpaAvailable": true,
      "ValetParking": true
    },
    "FreeWiFi": true,
    "InstantConfirmation": false,
    "Internet": true,
    "Parking": true,
    "ParkingFacility": true,
    "UpdatedBy": null,
    "UpdatedOn": "2025-06-05T17:34:19.217000",
    "VirtualConsultation": true,
    "Water": true,
    "_id": 91187966
  }
];


  const listings = data && data.map(filter => {
    const { business_details, services, 'Business Facilities': apiAmenities, 'Average Rating': rating } = filter;

    const processedAmenities = processAmenities(apiAmenities);

    return {
      name: business_details.BusinessName,
      location: `${business_details.StreetAddress}, ${business_details.Region}`,
      rating: rating,
      reviews: business_details.LikesCount,
      distance: '0.5km Away',
      closeAt: business_details.ClosingTime,
      services: services.map(service => ({
        name: service.ServiceName,
        duration: service.Duration,
        basePrice: `₹${service.Price}`,
        discountPrice: service.isDiscount ? `₹${service.DiscountedPrice}` : `₹${service.Price}`,
      })),
      amenities: processedAmenities, // Use the new processed amenities
      image: business_details.ProfileImage,
      _id: business_details._id
    };
  });



  const favouriteServices = async () => {
    try {
      if (!userId) return;
      const result = await apiget(`api/v1/FavoriteService/list/${userId}`);
      if (result?.data?.Status === 200) {
        setFavourites(result?.data?.Data || [])
      }
    } catch (error) {
      console.log('Error fetching favourites:', error)
    }
  }

  useEffect(() => {
    favouriteServices();
  }, [])

  useEffect(() => {
    setLoading(false);
  }, [listings])

  const addFavourite = async (businessId) => {
    if (!businessId || !userId) {
      showError('Please Login First');
      return;
    }

    setUpdatingFavourite(businessId);

    try {
      const result = await apipost('api/v1/FavoriteService/create', {
        UserId: userId,
        BussinessId: businessId,
        AddedOn: new Date()
      });

      if (result?.data?.Status === 200) {
        const newFavourite = {
          BussinessId: businessId,
          UserId: userId,
          _id: result?.data?.Data?._id || Date.now(),
          AddedOn: new Date()
        };
        setFavourites(prevFavs => [...prevFavs, newFavourite]);
      } else {
        console.log('Failed to add to favourites');
      }
    } catch (error) {
      console.log('Error adding favourite:', error);
    } finally {
      setUpdatingFavourite(null);
    }
  }

  const removeFavourite = async (favouriteId, businessId) => {
    if (!userId) {
      showError('Please Login First');
      return;
    }

    setUpdatingFavourite(businessId);

    try {
      const result = await apidelete(`api/v1/FavoriteService/delete/${favouriteId}`);

      if (result?.data?.Status === 200) {
        setFavourites(prevFavs => prevFavs.filter(fav => fav._id !== favouriteId));
      } else {
        console.log('Failed to remove from favourites');
      }
    } catch (error) {
      console.log('Error removing favourite:', error);
    } finally {
      setUpdatingFavourite(null);
    }
  }

  const handleFavouriteToggle = (businessId) => {
    const favouriteItem = favourites.find(fav => fav.BussinessId === businessId);

    if (favouriteItem) {
      removeFavourite(favouriteItem._id, businessId);
    } else {
      addFavourite(businessId);
    }
  }

  const SkeletonCard = () => (
    <Box sx={{
      maxWidth: { xs: '100%', sm: '100%', md: '100%' },
      mx: 'auto',
      mt: 2,
    }}>
      <Card variant="contained" sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        p: 1,
        gap: { xs: 1, sm: 1 },
        bgcolor: '#e2e6ea',
        borderRadius: '15px'
      }}>
        {/* Left section - Image skeleton */}
        <Box sx={{
          position: 'relative',
          width: { xs: '100%', md: '250px' },
          minHeight: { xs: 200, md: 220 },
          overflow: 'hidden',
        }}>
          <Skeleton
            variant="rectangular"
            sx={{
              height: '80%',
              borderRadius: 3,
              animation: 'pulse 1.5s ease-in-out 0.5s infinite'
            }}
          />
          <Skeleton
            variant="rectangular"
            sx={{
              height: '40px',
              width: '100%',
              marginTop: '10px',
              borderRadius: 3,
              animation: 'pulse 1.5s ease-in-out 0.5s infinite'
            }}
          />
        </Box>

        {/* Middle section - Services skeleton */}
        <CardContent
          sx={{
            flex: { xs: '1', md: '2' },
            p: { xs: 1, sm: 2, md: '10px 10px 0px' },
            border: '2px solid #919191',
            borderRadius: '10px',
            backgroundColor: '#fff',
            m: { xs: 1, sm: 0 },
            width: { sm: '100%', md: '200px' },
            minWidth: '230px',
            boxSizing: 'border-box',
          }}
        >
          <Skeleton variant="text" width="70%" height={28} sx={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
          <Skeleton variant="text" width="40%" height={24} sx={{ animation: 'pulse 1.5s ease-in-out 0.2s infinite' }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ animation: 'pulse 1.5s ease-in-out 0.4s infinite' }} />

          <Box sx={{ mt: 2, width: '100%', maxWidth: '300px' }}>
            {[0, 1].map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  mb: '5px',
                  borderBottom: '1px solid #e2e6ea',
                  width: '100%',
                  py: 1
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Skeleton variant="text" width="50%" height={24} sx={{ animation: 'pulse 1.5s ease-in-out 0.3s infinite' }} />
                  <Skeleton variant="text" width="30%" height={24} sx={{ animation: 'pulse 1.5s ease-in-out 0.4s infinite' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>
                  <Skeleton variant="text" width="30%" height={20} sx={{ animation: 'pulse 1.5s ease-in-out 0.5s infinite' }} />
                  <Skeleton variant="text" width="10%" height={20} sx={{ animation: 'pulse 1.5s ease-in-out 0.6s infinite' }} />
                </Box>
              </Box>
            ))}
            <Skeleton variant="text" width="20%" height={20} sx={{ animation: 'pulse 1.5s ease-in-out 0.7s infinite' }} />
          </Box>
        </CardContent>

        {/* Right section - Overview skeleton */}
        <Box
          sx={{
            width: { md: '400px' },
            p: { xs: 1, sm: '12px' },
            bgcolor: 'grey.100',
            border: '2px solid #919191',
            borderRadius: '10px',
            m: { xs: 1, sm: 0 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Skeleton variant="rectangular" width="30%" height={24} sx={{ borderRadius: '20px', animation: 'pulse 1.5s ease-in-out 0.2s infinite' }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, mb: 1 }}>
            <Skeleton variant="text" width="30%" height={20} sx={{ animation: 'pulse 1.5s ease-in-out 0.3s infinite' }} />
            <Skeleton variant="text" width="30%" height={20} sx={{ animation: 'pulse 1.5s ease-in-out 0.4s infinite' }} />
          </Box>

          <Skeleton variant="rectangular" width="40%" height={24} sx={{ borderRadius: '20px', mb: 1, animation: 'pulse 1.5s ease-in-out 0.5s infinite' }} />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <Skeleton
                key={index}
                variant="circular"
                width={16}
                height={16}
                sx={{ animation: `pulse 1.5s ease-in-out ${0.1 * index}s infinite` }}
              />
            ))}
          </Box>

          <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton variant="text" width="20%" height={20} sx={{ animation: 'pulse 1.5s ease-in-out 0.6s infinite' }} />
            <Skeleton variant="text" width="40%" height={20} sx={{ animation: 'pulse 1.5s ease-in-out 0.7s infinite' }} />
          </Box>
        </Box>
      </Card>
    </Box>
  );

  // Add the CSS keyframes for the pulse animation
  const pulseAnimation = `
    @keyframes pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
      100% {
        opacity: 1;
      }
    }
  `;

  return (
    <>
      <style>{pulseAnimation}</style>
      <Grid container mt={0} spacing={3}>
        <Grid item sx={{ width: { xs: '100%', sm: '100%', md: '30%' } }}>
          <DealsSection loading={isLoading} />
        </Grid>

        <Grid item sx={{ width: { xs: '100%', sm: '100%', md: '70%' } }}>
          <Box sx={{
            mt: 5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {(loading || isLoading) ? (
              <>
                <Skeleton variant="text" width="20%" height={24} sx={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                <Skeleton variant="text" width="40%" height={24} sx={{ animation: 'pulse 1.5s ease-in-out 0.2s infinite' }} />
              </>
            ) : (
              <>
                {(listings && listings.length > 0) && <Typography variant="h5" sx={{ fontSize: { xs: '1rem', sm: '1rem' }, color: '#000' }}>
                  Home / {type}
                </Typography>}
                {(listings && listings.length > 0) && <Typography variant="h5" sx={{ fontSize: { xs: '1rem', sm: '1rem' }, color: '#000' }}>
                  {listings.length} nearby location found matched to your Search
                </Typography>}
              </>
            )}
          </Box>

          {(listings && listings.length > 0) ? <Box sx={{ mt: 1 }}>
            {(loading || isLoading) ? (
              // Display skeleton cards while loading
              Array.from(new Array(3)).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : (
              // Display actual content when data is loaded
              listings && listings.map((item, index) => {
                // Check if current item is in favorites
                const isFavorite = favourites && favourites.some(fav => fav.BussinessId === item._id);
                const isUpdating = updatingFavourite === item._id;

                return (
                  <Box key={index} sx={{
                    maxWidth: { xs: '100%', sm: '100%', md: '100%' },
                    mx: 'auto',
                    mt: 2,
                  }}>
                    <Card variant="contained" sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      p: 1,
                      gap: { xs: 1, sm: 1 },
                      bgcolor: '#e2e6ea',
                      borderRadius: '15px'
                    }}>
                      <Box sx={{
                        position: 'relative',
                        width: { xs: '100%', md: '250px' },
                        minHeight: { xs: 200, md: 220 },
                        overflow: 'hidden',
                      }}>
                        <Chip
                          label="DEAL"
                          color="success"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 15,
                            left: -30,
                            transform: 'rotate(-45deg)',
                            zIndex: 1,
                            width: "120px"
                          }}
                        />
                        <CardMedia
                          component="img"
                          image={item.image || ImageIcon}
                          alt="Barber Hirsch"
                          onError={(e) => { e.target.src = ImageIcon }}
                          sx={{
                            borderRadius: 3,
                            height: '80%',
                            objectFit: 'cover'
                          }}
                        />

                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'white',
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                            opacity: isUpdating ? 0.6 : 1
                          }}
                          aria-label="add to favorites"
                          disabled={isUpdating}
                          onClick={() => handleFavouriteToggle(item._id)}
                        >
                          {isFavorite ? (
                            <FavoriteOutlinedIcon color="error" />
                          ) : (
                            <FavoriteBorderOutlinedIcon color="action" />
                          )}
                        </IconButton>
                        <Button
                          variant="contained"
                          fullWidth
                          endIcon={<ArrowCircleRightOutlinedIcon />}
                          onClick={() => navigate(`/detail/${item._id}`)}
                          sx={{
                            fontSize: '12px',
                            fontWeight: 600,
                            marginTop: '10px',
                            borderRadius: 3,
                            backgroundColor: '#1b4d69',
                            color: '#fff',
                            '&:hover': {
                              backgroundColor: '#164056',
                            },
                            width: { xs: '100%', sm: 'auto', md: '100%' },
                          }}
                        >
                          Book Slot
                        </Button>
                      </Box>

                      {/* Middle Section - Services */}
                      <CardContent
                        sx={{
                          flex: { xs: '1', md: '2' },
                          p: { xs: 1, sm: 2, md: '10px 10px 0px' },
                          border: '2px solid #919191',
                          borderRadius: '10px',
                          backgroundColor: '#fff',
                          m: { xs: 1, sm: 0 },
                          width: { sm: '100%', md: '200px' },
                          minWidth: '230px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            gap: { xs: 1, sm: 0 },
                            flexWrap: 'wrap',
                            width: '100%',
                          }}
                        >
                          <Box sx={{ flex: '1 1 100%', width: '100%' }}>
                            <Typography
                              variant="body1"
                              sx={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                lineHeight: 1.2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '100%',
                              }}
                              component="div"
                            >
                              {item.name}
                            </Typography>
                            {item?.rating && item?.rating !== 'No ratings' ? (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  flexWrap: 'wrap',
                                  gap: 0.5,
                                  maxWidth: '100%',
                                }}
                              >
                                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                  {item?.rating}
                                </Typography>
                                <Box sx={{ display: 'flex', color: '#1b4d69' }}>
                                  {'★'.split('').map((star, i) => (
                                    <span key={i}>{star}</span>
                                  ))}
                                </Box>
                              </Box>
                            ) : null}

                          </Box>
                        </Box>

                        <Box sx={{ mt: 1, width: '100%', maxWidth: '300px' }}>
                          {item.services?.slice(0, 2).map((service, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: 'space-between',
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                mb: '5px',
                                borderBottom: '1px solid #e2e6ea',
                                gap: { xs: 1, sm: 0 },
                                flexWrap: 'wrap',
                                width: '100%',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    lineHeight: 'inherit',
                                    overflow: 'hidden',
                                    fontSize: '0.9rem',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '60%',
                                    textTransform: 'capitalize',
                                    fontWeight: 600
                                  }}
                                >
                                  {service.name}
                                </Typography>

                                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                  <Typography variant="body2" color="textSecondary" sx={{ textDecoration: 'line-through' }}>
                                    {service.basePrice}
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    {service.discountPrice}
                                  </Typography>
                                </Stack>
                              </Box>

                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  width: '100%',
                                  justifyContent: 'space-between',
                                  flexWrap: 'wrap',
                                }}
                              >
                                <Typography variant="body1" sx={{ fontSize: '12px', fontWeight: 600, color: 'gray' }}>
                                  {`${service.duration}`}
                                </Typography>
                                <Button
                                  sx={{
                                    color: '#1b4d69',
                                    fontSize: '1.4rem',
                                    fontWeight: 700,
                                    height: '28px',
                                    ml: { xs: 0, sm: 1 },
                                  }}
                                >
                                  +
                                </Button>
                              </Box>
                            </Box>
                          ))}
                          <Button
                            onClick={() => navigate(`/detail/${item._id}`)}
                            sx={{
                              color: '#1b4d69',
                              fontWeight: 700,
                              textDecoration: 'underline',
                              fontSize: '0.7rem'
                            }}
                            size="small"
                          >
                            View all
                          </Button>
                        </Box>
                      </CardContent>

                      {/* Right Section - Overview */}
                      <Box
                        sx={{
                          width: { md: '400px' },
                          p: { xs: 1, sm: '12px' },
                          bgcolor: 'grey.100',
                          border: '2px solid #919191',
                          borderRadius: '10px',
                          m: { xs: 1, sm: 0 },
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="medium"
                          mb={1}
                          sx={{
                            width: 'max-content',
                            backgroundColor: '#1b4d69',
                            color: '#fff',
                            px: 1.5,
                            py: 0,
                            borderRadius: '20px',
                            fontWeight: 600,
                            fontSize: { xs: '0.775rem', sm: '0.8rem', md: '0.8rem' },
                          }}
                        >
                          Overview
                        </Typography>





                        <Stack
                          direction={'row'}
                          spacing={{ xs: 1, sm: 2 }}
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                          justifyContent="space-between"
                          mb={1}
                        >
                          <Typography variant="body2" color="gray">
                            {item.distance}
                          </Typography>
                          <Stack direction={'row'}>
                            <Typography variant="body2" color="red">
                              Close At
                            </Typography>
                            <Typography variant="body2" color="gray">
                              {` : ${item.closeAt}`}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            maxWidth: '100%',
                            color: 'rgb(70 64 64 / 60%)',
                            marginBottom:'5px'
                          }}
                        >
                          {item.location}
                        </Typography>

                        <Typography
                          variant="subtitle1"
                          fontWeight="medium"
                          mb={1}
                          sx={{
                            width: 'max-content',
                            backgroundColor: '#1b4d69',
                            color: '#fff',
                            px: 1.5,
                            py: 0,
                            borderRadius: '20px',
                            fontWeight: 600,
                            fontSize: { xs: '0.775rem', sm: '0.8rem', md: '0.8rem' },
                          }}
                        >
                          What Includes
                        </Typography>

                        <Grid container spacing={1} sx={{ flexWrap: 'wrap' }}>
                          {item?.amenities?.map((amenity, index) => (
                            <Grid item sm="auto" key={index}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  color: 'gray',
                                  gap: '6px',
                                }}
                              >
                                <Tooltip title={amenity.label} arrow>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: '16px',
                                      height: '16px',
                                      fontSize: '16px',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {amenity.icon}
                                  </Box>
                                </Tooltip>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>

                        <Box sx={{ mt: 'auto', pt: 2 }}>
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            justifyContent="space-between"
                            spacing={{ xs: 2, sm: 1 }}
                          >
                            <Button
                              onClick={() => navigate(`/detail/${item._id}`)}
                              sx={{
                                color: '#1b4d69',
                                fontWeight: 800,
                                fontSize: '10px',
                                textDecoration: 'underline',
                                padding: 0,
                              }}
                              size="small"
                            >
                              View Detail
                            </Button>
                          </Stack>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                )
              })
            )}
          </Box> :
            <Typography style={{ width: '100%', textAlign: 'center', marginTop: '100px' }}>
              No Result Found
            </Typography>
          }
        </Grid>
      </Grid>
    </>
  );
});

export default CardList;
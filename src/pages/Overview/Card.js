import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Typography,
  Chip,
  Box,
  Grid,
  Stack,
  Skeleton,
} from '@mui/material';
import {
  Clock,
  Wifi,
  AirVent,
  PawPrint,
  Plus,
  MapPin,
  Star,
} from 'lucide-react';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import PoolIcon from '@mui/icons-material/Pool';
import { DealsSection } from './DealSeaction';
import { apidelete, apiget, apipost } from '../service/api';
import { showError, showSuccess } from '../../components/toast';
import ImageIcon from '../../assets/images/Overview_Images/image.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Constants
const USER_ID = 76368169;
const AMENITY_ICON_SIZE = { height: '16px', fontSize: '16px' };

// Amenity Configuration
const AMENITY_CONFIG = {
  displayNames: {
    ACCooler: 'AC',
    FreeWiFi: 'WiFi',
    Internet: 'WiFi',
    ParkingFacility: 'Parking',
    Parking: 'Parking',
    InstantConfirmation: 'Instant Booking',
    VirtualConsultation: 'Virtual Service',
    AtHomeService: 'Home Service',
    Accessibility: 'Wheelchair Accessible',
    Water: 'Water Supply',
  },
  extraAmenityDisplayNames: {
    SpaAvailable: 'Spa',
    GymInside: 'Gym',
    PetFriendly: 'Pet Friendly',
    ValetParking: 'Valet Parking',
  },
  skipFields: [
    'BusinessId',
    'CreatedBy',
    'CreatedOn',
    'UpdatedBy',
    'UpdatedOn',
    '_id',
    'ExtraAmenities',
  ],
};

// Icon Mapping
const getAmenityIcon = (amenityName) => {
  const iconMap = {
    // AC/Cooling
    ACCooler: <AirVent style={AMENITY_ICON_SIZE} />,
    AC: <AirVent style={AMENITY_ICON_SIZE} />,
    'Air Conditioning': <AirVent style={AMENITY_ICON_SIZE} />,

    // WiFi/Internet
    FreeWiFi: <Wifi style={AMENITY_ICON_SIZE} />,
    WiFi: <Wifi style={AMENITY_ICON_SIZE} />,
    Wifi: <Wifi style={AMENITY_ICON_SIZE} />,
    Internet: <Wifi style={AMENITY_ICON_SIZE} />,

    // Pet
    PetFriendly: <PawPrint style={AMENITY_ICON_SIZE} />,
    'Pet Friendly': <PawPrint style={AMENITY_ICON_SIZE} />,

    // Water/Pool
    Pool: <PoolIcon style={AMENITY_ICON_SIZE} />,
    'Swimming Pool': <PoolIcon style={AMENITY_ICON_SIZE} />,
    Water: <PoolIcon style={AMENITY_ICON_SIZE} />,
    SpaAvailable: <PoolIcon style={AMENITY_ICON_SIZE} />,

    // Parking
    Parking: <Plus style={AMENITY_ICON_SIZE} />,
    ParkingFacility: <Plus style={AMENITY_ICON_SIZE} />,
    ValetParking: <Plus style={AMENITY_ICON_SIZE} />,

    // Time/Booking
    InstantConfirmation: <Clock style={AMENITY_ICON_SIZE} />,

    // Other
    GymInside: <Plus style={AMENITY_ICON_SIZE} />,
    Accessibility: <Plus style={AMENITY_ICON_SIZE} />,
    AtHomeService: <Plus style={AMENITY_ICON_SIZE} />,
  };

  const normalizedName = amenityName?.trim();
  const directMatch = iconMap[amenityName];
  if (directMatch) return directMatch;

  const caseInsensitiveMatch = Object.keys(iconMap).find(
    (key) => key.toLowerCase() === normalizedName?.toLowerCase()
  );

  return caseInsensitiveMatch
    ? iconMap[caseInsensitiveMatch]
    : <AirVent style={AMENITY_ICON_SIZE} />;
};

// Utility Functions
const formatDisplayName = (key, displayNameMap) => {
  if (displayNameMap && displayNameMap[key]) {
    return displayNameMap[key];
  }
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const processAmenities = (businessFacilities) => {
  if (!businessFacilities?.length) return [];

  const facilities = businessFacilities[0];
  if (!facilities || typeof facilities !== 'object') return [];

  const uniqueAmenities = [];
  const seenAmenities = new Set();

  const addUniqueAmenity = (key, displayName) => {
    const normalizedKey = displayName.toLowerCase().trim();
    if (!seenAmenities.has(normalizedKey)) {
      seenAmenities.add(normalizedKey);
      uniqueAmenities.push({
        icon: getAmenityIcon(key),
        label: displayName,
      });
    }
  };

  // Process main facilities
  Object.entries(facilities).forEach(([key, value]) => {
    if (AMENITY_CONFIG.skipFields.includes(key)) return;
    if (typeof value === 'boolean' && value === true) {
      const displayName = formatDisplayName(key, AMENITY_CONFIG.displayNames);
      addUniqueAmenity(key, displayName);
    }
  });

  // Process ExtraAmenities
  if (facilities.ExtraAmenities && typeof facilities.ExtraAmenities === 'object') {
    Object.entries(facilities.ExtraAmenities).forEach(([key, value]) => {
      if (typeof value === 'boolean' && value === true) {
        const displayName = formatDisplayName(
          key,
          AMENITY_CONFIG.extraAmenityDisplayNames
        );
        addUniqueAmenity(key, displayName);
      }
    });
  }

  return uniqueAmenities;
};

const processServices = (services) => {
  if (!services?.length || !Array.isArray(services[0]?.Categories)) {
    return [];
  }

  return services[0].Categories.slice(0, 2).map((category) => {
    const service = category?.Services?.[0];
    if (!service) {
      return { name: 'N/A', duration: 'N/A', basePrice: 'N/A', discountPrice: 'N/A' };
    }

    return {
      name: service.Name || 'N/A',
      duration: service.Duration || 'N/A',
      basePrice: service.Price ? `₹${service.Price}` : 'N/A',
      discountPrice: service.isDiscount && service.DiscountedPrice
        ? `₹${service.DiscountedPrice}`
        : service.Price
          ? `₹${service.Price}`
          : 'N/A',
    };
  });
};

const transformListingData = (data) => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    const details = item.business_details || {};

    return {
      id: details._id,

      name: details.BusinessName || "N/A",

      image: details.ProfileImage || ImageIcon,

      location: `${details.StreetAddress || ""} ${details.Region || ""
        }`.trim(),

      rating: details.AverageRating || 0,

      reviews: details.ReviewCount || 0,

      closeTime: details.ClosingTime,

      service_count:
        item.services?.length + (item.more_services_count || 0),

      services:
        item.services?.map((service) => ({
          name: service.Name,
          duration: "Service",
          price:
            service.isDiscount && service.DiscountedPrice
              ? service.DiscountedPrice
              : service.Price,
        })) || [],

      more_services_count: item.more_services_count || 0,

      more_services_starting_from:
        item.more_services_starting_from || 0,
    };
  });
};
// Sub-components
const ServiceItem = ({ service, onViewAll }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      alignItems: { xs: 'flex-start', sm: 'center' },
      mb: 1,
      borderBottom: '1px solid #e2e6ea',
      gap: { xs: 1, sm: 0 },
      width: '100%',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <Typography
        variant="subtitle1"
        sx={{
          fontSize: '0.9rem',
          fontWeight: 600,
          textTransform: 'capitalize',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '60%',
        }}
      >
        {service.name}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {service.discountPrice}
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <Typography variant="body1" sx={{ fontSize: '12px', fontWeight: 600, color: 'gray' }}>
        {service.duration}
      </Typography>
      <Button
        sx={{ color: '#1b4d69', fontSize: '1.4rem', fontWeight: 700, height: '28px' }}
        onClick={onViewAll}
      >
        +
      </Button>
    </Box>
  </Box>
);

const SkeletonCard = () => (
  <Box sx={{ maxWidth: '100%', mx: 'auto', mt: 2 }}>
    <Card
      variant="contained"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        p: 1,
        gap: 1,
        bgcolor: '#e2e6ea',
        borderRadius: '15px',
      }}
    >
      <Box sx={{ position: 'relative', width: { xs: '100%', md: '250px' }, minHeight: { xs: 200, md: 220 } }}>
        <Skeleton variant="rectangular" sx={{ height: '80%', borderRadius: 3 }} />
        <Skeleton variant="rectangular" sx={{ height: '40px', width: '100%', mt: '10px', borderRadius: 3 }} />
      </Box>
      <CardContent
        sx={{
          flex: { xs: '1', md: '2' },
          p: { xs: 1, sm: 2, md: '10px' },
          border: '2px solid #919191',
          borderRadius: '10px',
          backgroundColor: '#fff',
          m: { xs: 1, sm: 0 },
          width: { sm: '100%', md: '200px' },
          minWidth: '230px',
          boxSizing: 'border-box',
        }}
      >
        <Skeleton variant="text" width="70%" height={28} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
        {[0, 1].map((_, index) => (
          <Box key={index} sx={{ mt: 2, borderBottom: '1px solid #e2e6ea', py: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton variant="text" width="50%" height={24} />
              <Skeleton variant="text" width="30%" height={24} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Skeleton variant="text" width="30%" height={20} />
              <Skeleton variant="text" width="10%" height={20} />
            </Box>
          </Box>
        ))}
        <Skeleton variant="text" width="20%" height={20} sx={{ mt: 1 }} />
      </CardContent>
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
        <Skeleton variant="rectangular" width="30%" height={24} sx={{ borderRadius: '20px' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="text" width="30%" height={20} />
        </Box>
        <Skeleton variant="rectangular" width="40%" height={24} sx={{ borderRadius: '20px', mt: 1 }} />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          {[1, 2, 3].map((_, index) => (
            <Skeleton key={index} variant="circular" width={16} height={16} />
          ))}
        </Box>
        <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width="20%" height={20} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
      </Box>
    </Card>
  </Box>
);

// Main Component
const CardList = React.memo(({ data = [], isLoading, buisnessType }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState([]);
  const [updatingFavourite, setUpdatingFavourite] = useState(null);

  // Memoized transformed data
  console.log(data)
  const listings = useMemo(() => {
    return Array.isArray(data)
      ? transformListingData(data)
      : [];
  }, [data]);

  // Fetch favorites
  const fetchFavourites = useCallback(async () => {
    try {
      const result = await apiget(`api/v1/FavoriteService/list/${USER_ID}`);
      if (result?.data?.Status === 200) {
        setFavourites(result?.data?.Data || []);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  }, []);

  useEffect(() => {
    fetchFavourites();
  }, [fetchFavourites]);

  useEffect(() => {
    setLoading(false);
  }, [listings]);

  // Favourite handlers
  const addFavourite = useCallback(async (businessId) => {
    if (!businessId || !USER_ID) {
      showError('Please Login First');
      return;
    }

    setUpdatingFavourite(businessId);

    try {
      const result = await apipost('api/v1/FavoriteService/create', {
        UserId: USER_ID,
        BussinessId: businessId,
        AddedOn: new Date(),
      });

      if (result?.data?.Status === 200) {
        const newFavourite = {
          BussinessId: businessId,
          UserId: USER_ID,
          _id: result?.data?.Data?._id || Date.now(),
          AddedOn: new Date(),
        };
        setFavourites((prev) => [...prev, newFavourite]);
        showSuccess('Added to favourites');
      }
    } catch (error) {
      console.error('Failed to add favourite:', error);
      showError('Failed to add to favourites');
    } finally {
      setUpdatingFavourite(null);
    }
  }, []);

  const removeFavourite = useCallback(async (favouriteId, businessId) => {
    if (!USER_ID) {
      showError('Please Login First');
      return;
    }

    setUpdatingFavourite(businessId);

    try {
      const result = await apidelete(`api/v1/FavoriteService/delete/${favouriteId}`);

      if (result?.data?.Status === 200) {
        setFavourites((prev) => prev.filter((fav) => fav._id !== favouriteId));
        showSuccess('Removed from favourites');
      }
    } catch (error) {
      console.error('Failed to remove favourite:', error);
      showError('Failed to remove from favourites');
    } finally {
      setUpdatingFavourite(null);
    }
  }, []);

  const handleFavouriteToggle = useCallback(
    (businessId) => {
      const favouriteItem = favourites.find((fav) => fav.BussinessId === businessId);
      if (favouriteItem) {
        removeFavourite(favouriteItem._id, businessId);
      } else {
        addFavourite(businessId);
      }
    },
    [favourites, addFavourite, removeFavourite]
  );

  const handleViewDetails = useCallback(
    (id) => {
      navigate(`/detail/${id}`);
    },
    [navigate]
  );


  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating > 4) return "Great";
    return "Good";
  };
  
  // Render functions
  const renderListingCard = (item, index) => {
    const isFavorite = favourites.some((fav) => fav.BussinessId === item.id);
    const isUpdating = updatingFavourite === item.id;

    return (
      <Card
        key={index}
        sx={{
          mb: 2,
          borderRadius: "20px",
          p: 2,
          background: "#f7f7f7",
          boxShadow: "none",
          border: "1px solid #e5e5e5",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: "stretch",
          }}
        >
          {/* LEFT IMAGE SECTION */}
          <Box
            sx={{
              width: { xs: "100%", md: 250 },
              position: "relative",
              flexShrink: 0,
            }}
          >
            <CardMedia
              component="img"
              image={item.image || ImageIcon}
              alt={item.name}
              sx={{
                height: 'stretch',
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />

            {/* Favourite Button */}
            <IconButton
              onClick={() => handleFavouriteToggle(item.id)}
              disabled={isUpdating}
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                bgcolor: "#fff",
                width: 42,
                height: 42,
                "&:hover": {
                  bgcolor: "#fff",
                },
              }}
            >
              {isFavorite ? (
                <FavoriteOutlinedIcon color="error" />
              ) : (
                <FavoriteBorderOutlinedIcon />
              )}
            </IconButton>
          </Box>

          {/* CENTER CONTENT */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              py: 1,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#111",
                  mb: 1,
                }}
              >
                {item.name}
              </Typography>

              {/* LOCATION */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <MapPin size={14} color="#8c8c8c" />

                <Typography
                  sx={{
                    color: "#666",
                    fontSize: "0.8rem",
                  }}
                >
                  3.4 km to {item.location}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {!item.is_closed && (
                  <Chip
                    label="Open Now"
                    size="small"
                    sx={{
                      bgcolor: "#dcfce7",
                      color: "#15803d",
                      fontWeight: 700,
                    }}
                  />
                )}
              </Stack>
            </Box>

            {/* RATING */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  bgcolor: "#1b4d69",
                  color: "#fff",
                  px: 2,
                  py: 1,
                  borderRadius: "10px 10px 10px 0",
                  minWidth: 35,
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontWeight: 500, fontSize: "1.2rem" }}>
                  {item.rating}
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#111",
                    lineHeight: 1.1,
                  }}
                >
                  {getRatingLabel(item.rating)}
                </Typography>

                <Typography
                  sx={{
                    color: "#777",
                    fontSize: "0.8rem",
                  }}
                >
                  ({item.reviews || 0} reviews)
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* RIGHT PRICE PANEL */}
          <Box
            sx={{
              width: { xs: "100%", md: 230 },
              pl: { md: 2 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Stack spacing={1.2}>
              {item.services?.slice(0, 3).map((service, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "#fefefe",
                    borderRadius: "9px",
                    px: 2.5,
                    py: 1,
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        color: "#888",
                        fontWeight: 600,
                      }}
                    >
                      {service.name}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "#000",
                      }}
                    >
                      ₹{service.price || service.discountPrice}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: "999px",
                      bgcolor: "#aec5d2",
                      textTransform: "none",
                      fontWeight: 600,
                      boxShadow: "none",

                      px: "9px",
                      py: "5px",

                      minWidth: "unset",
                      lineHeight: 1,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      "&:hover": {
                        bgcolor: "#CBD5E0",
                        boxShadow: "none",
                      },
                    }}
                  >
                    ADD
                  </Button>
                </Box>
              ))}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "#f8fafc",
                  borderRadius: "12px",
                  px: 2.5,
                  py: 1,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      color: "#888",
                      fontWeight: 600,

                    }}
                  >
                    +{item.more_services_count} more
                  </Typography>
                  <Typography
                    sx={{

                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    From ₹{item.more_services_starting_from}
                  </Typography>
                </Box>
                <ExpandMoreIcon sx={{ color: "#888" }} />
              </Box>

            </Stack>
          </Box>
        </Box>
      </Card>
    );
  };

  const renderSkeletons = () => (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </>
  );

  return (
    <>
      <Grid container mt={0} spacing={3}>
        <Grid item sx={{ width: { xs: '100%', sm: '100%', md: '30%' } }}>
          <DealsSection loading={isLoading} />
        </Grid>

        <Grid item sx={{ width: { xs: '100%', sm: '100%', md: '70%' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {loading || isLoading ? (
              <>
                <Skeleton variant="text" width="20%" height={24} />
                <Skeleton variant="text" width="40%" height={24} />
              </>
            ) : (
              <>
                {listings.length > 0 && (
                  <>
                    <Typography variant="h5" sx={{ fontSize: { xs: '1rem', sm: '1rem' }, color: '#000' }}>
                      Home /{' '}
                      <Box component="span" sx={{ color: '#164056', fontWeight: 700 }}>
                        Overview
                      </Box>{' '}
                      {buisnessType}
                    </Typography>
                    <Typography variant="h5" sx={{ fontSize: { xs: '1rem', sm: '1rem' }, color: '#000' }}>
                      {listings.length} nearby location found matched to your Search
                    </Typography>
                  </>
                )}
              </>
            )}
          </Box>

          {listings.length > 0 ? (
            <Box sx={{ mt: 1 }}>
              {loading || isLoading
                ? renderSkeletons()
                : listings.map((item, index) => renderListingCard(item, index))}
            </Box>
          ) : (
            <Typography sx={{ width: '100%', textAlign: 'center', mt: '100px' }}>
              No Result Found
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
});

CardList.displayName = 'CardList';

export default CardList;
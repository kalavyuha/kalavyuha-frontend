import React, { useEffect, useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ReplyIcon from '@mui/icons-material/Reply';
import ShareIcon from "@mui/icons-material/Share";
import {
  Box,
  Container,
  Grid,
  Chip,
  Button,
  Typography,
  Stack,
  Skeleton
} from '@mui/material';
import { Info, Heart, Share2, ChevronRight } from 'lucide-react';
import SearchField from '../../../components/searchField';
import CustomButton from '../../../components/customButton';
import { apiget, apipost, apidelete } from '../../service/api';
import { useMatchingSearchResult } from '../../../Context/detailPageContext';
import { showError, showSuccess } from '../../../components/toast';

const userId = 76368169;

const SearchBar = ({ buisnessInfo, reviews, }) => {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { setIsMatchingResult } = useMatchingSearchResult();
  const categories = ['All', 'Beauty', 'Wellness', 'Fitness'];
  const [isOpen, setIsOpen] = useState(false);
  const [statusText, setStatusText] = useState("");

  // Favorites state
  const [favourites, setFavourites] = useState([]);
  const [updatingFavourite, setUpdatingFavourite] = useState(false);

  // Check if current business is in favorites
  const isFavorite = favourites && favourites.some(fav => fav.BussinessId === buisnessInfo?._id);
  const currentFavorite = favourites.find(fav => fav.BussinessId === buisnessInfo?._id);

  // Fetch user's favorites
  const favouriteServices = async () => {
    try {
      if (!userId) return;
      const result = await apiget(`api/v1/FavoriteService/list/${userId}`);
      if (result?.data?.Status === 200) {
        setFavourites(result?.data?.Data || []);
      }
    } catch (error) {
      console.log('Error fetching favourites:', error);
    }
  };

  // Add to favorites
  const addFavourite = async (businessId) => {
    if (!businessId || !userId) {
      showError('Please Login First');
      return;
    }

    setUpdatingFavourite(true);

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
      showError('Error adding to favourites');
    } finally {
      setUpdatingFavourite(false);
    }
  };

  // Remove from favorites
  const removeFavourite = async (favouriteId, businessId) => {
    if (!userId) {
      showError('Please Login First');
      return;
    }

    setUpdatingFavourite(true);

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
      setUpdatingFavourite(false);
    }
  };

  // Handle favorite toggle
  const handleFavouriteToggle = () => {
    if (!buisnessInfo?._id) return;

    if (isFavorite && currentFavorite) {
      removeFavourite(currentFavorite._id, buisnessInfo._id);
    } else {
      addFavourite(buisnessInfo._id);
    }
  };

  useEffect(() => {
    const checkBusinessStatus = () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

      const openingTime = buisnessInfo?.OpeningTime || '';
      const closingTime = buisnessInfo?.ClosingTime || '';

      if (currentTimeString >= openingTime && currentTimeString < closingTime) {
        setIsOpen(true);
        setStatusText(`Closes At: ${closingTime}`);
      } else {
        setIsOpen(false);
        setStatusText(`Opens At: ${openingTime}`);
      }
    };

    checkBusinessStatus();
    const intervalId = setInterval(checkBusinessStatus, 60000);

    return () => clearInterval(intervalId);
  }, [buisnessInfo]);

  // Fetch favorites on component mount
  useEffect(() => {
    favouriteServices();
  }, []);

  

  const updateSearchResult = async () => {
    setLoading(true);
    const result = await apiget(`api/v1/BussinessDetails/filter/?ServiceName=${serviceName}&Location=${location}&BussinessType=${selectedCategory}`);
    // if (result && result.status === 200) {
    //   console.log('');
    // }
    setLoading(false);
  };

  useEffect(() => {
    if (serviceName) {
      setIsMatchingResult(false);
    }
  }, [serviceName]);

  return (
    <Box sx={{ position: 'relative', pt: 18 }}>
      <Box
        sx={{
          background: 'linear-gradient(to bottom, #467d9b, #002c5c)',
          position: 'absolute',
          // height: '35vh',
          height: '19rem', //----CHANGES DONE BY RAKSHIT
          width: '100%',
          zIndex: -1,
          top: 0,
        }}
      />
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 5,
            boxShadow: 3,
            p: '18px',
          }}
        >
          <SearchField serviceName={serviceName} setServiceName={setServiceName} location={location} setLocation={setLocation} handleFetchData={updateSearchResult} loading={loading} />

          <Box
            sx={{
              borderRadius: "8px",
              maxWidth: "100%",
              backgroundColor: "#fff",
              mt: 3
            }}
          >

            <Grid container spacing={2}>

              <Grid item xs={12} md={9}>
                {buisnessInfo?.BusinessName ? (
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: "18px", md: "32px" },
                    }}
                  >
                    {buisnessInfo.BusinessName}
                  </Typography>
                ) : (
                  <Skeleton variant="text" width="60%" height={40} />
                )}

                <Stack
                  direction={{ xs: 'column', sm: 'row', md: 'row' }}
                  gap={1}
                  alignItems={{ xs: 'flex-start', sm: 'center', md: 'center' }}
                >
                  {buisnessInfo?.StreetAddress ? (
                    <>
                      <Typography
                        variant="body2"
                        sx={{ color: "#666", marginTop: "8px", fontSize: "14px" }}
                      >
                        {`${buisnessInfo.StreetAddress}, ${buisnessInfo.Region || ''}`}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#1b4d69",
                          fontWeight: "bold",
                          marginTop: "10px",
                          cursor: "pointer",
                          display: "inline-block",
                          marginLeft: "10px"
                        }}
                        onClick={() => {
                          const encodedDestination = encodeURIComponent(buisnessInfo.StreetAddress);
                          const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}&travelmode=driving`;
                          window.open(mapsUrl, '_blank');
                        }}
                      >
                        Get direction →
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Skeleton variant="text" width="70%" height={20} />
                      <Skeleton variant="text" width="30%" height={20} />
                    </>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: { xs: 'space-between', sm: 'flex-end', md: 'flex-end' },
                    gap: 1,
                    flexWrap: "wrap",
                    width: { xs: '100%', sm: 'unset', md: 'unset' }
                  }}
                >
                  {buisnessInfo?.AverageRating && <Box
                    sx={{
                      backgroundColor: "#0D4D69",
                      borderRadius: "8px",
                      padding: "6px 0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "48px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {buisnessInfo?.AverageRating}
                    </Typography>
                  </Box>}

                  {reviews!== 0 &&
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "18px",
                        }}
                      >
                        Best
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "black",
                          fontSize: "12px",
                          width: "100px",
                        }}
                      >
                        See all {reviews} reviews
                        <ChevronRight height={20} width={20} style={{ marginLeft: "14px" }} />
                      </Box>
                    </Box>}
                </Box>

              </Grid>
            </Grid>

            <Stack
              direction={{ xs: "column", sm: "row", md: "row" }}
              alignItems={{ xs: "flex-start", sm: "center", md: "center" }}
              justifyContent={"space-between"}
            >
              {!statusText ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    marginTop: "16px",
                    border: "2px solid #ccc",
                    borderRadius: "12px",
                    width: "max-content",
                    paddingRight: "10px",
                  }}
                >
                  <Skeleton variant="rounded" width={80} height={32} />
                  <Skeleton variant="circular" width={24} height={24} />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    marginTop: "16px",
                    border: `2px solid ${!isOpen ? "#2e7d32" : "#d32f2f"}`,
                    borderRadius: "12px",
                    width: "max-content",
                    paddingRight: "10px",
                  }}
                >
                  <Chip
                    label={statusText}
                    sx={{
                      background: "#fff",
                      color: !isOpen ? "#2e7d32" : "#d32f2f",
                      fontWeight: "bold",
                      borderColor: !isOpen ? "#2e7d32" : "#d32f2f",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    ⓘ
                  </Typography>
                </Box>
              )}

              {/* Save & Share Buttons */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "space-between", sm: "unset" },
                  gap: 1,
                  mt: "16px",
                  width: { xs: "100%", sm: "unset", md: "unset" },
                }}
              >
                <Button
                  variant="contained"
                  startIcon={
                    isFavorite ?
                      <FavoriteOutlinedIcon /> :
                      <FavoriteBorderIcon />
                  }
                  onClick={handleFavouriteToggle}
                  disabled={updatingFavourite || !buisnessInfo?._id}
                  sx={{
                    backgroundColor: isFavorite ? "#143a50" : "#fff",
                    borderRadius: "8px",
                    border: '2px solid #143a50',
                    padding: "4px 16px",
                    color: isFavorite ? '#fff' : '#143a50',
                    fontWeight: "bold",
                    width: '108px',
                    opacity: updatingFavourite ? 0.6 : 1,
                    "&:hover": {
                      backgroundColor: "#143a50",
                      color: '#fff',
                    },
                    "&:disabled": {
                      backgroundColor: isFavorite ? "#143a50" : "#fff",
                      color: isFavorite ? '#fff' : '#143a50',
                      opacity: 0.6,
                    }
                  }}
                >
                  {updatingFavourite ? 'Saving' : (isFavorite ? 'Saved' : 'Save')}
                </Button>

                <Button
                  variant="contained"
                  startIcon={<ReplyIcon sx={{ transform: "scaleX(-1)" }} />}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: '2px solid #143a50',
                    color: '#143a50',
                    padding: "4px 16px",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#143a50",
                      color: '#fff'
                    },
                  }}
                >
                  Share
                </Button>
              </Box>
            </Stack>

          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SearchBar;
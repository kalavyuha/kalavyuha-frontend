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
import Img from '../../assets/images/Overview_Images/overviewListMainImg.jpg'

const defaultImage = '/api/placeholder/400/320';

const iconStyle = {
  height: '16px',
  fontSize: '16px'
}

const amenities = [
  { icon: <AirVent style={iconStyle} />, label: 'AC' },
  { icon: <Wifi style={iconStyle} />, label: 'Wi-Fi' },
  { icon: <PawPrint style={iconStyle} />, label: 'Pets' },
  { icon: <PoolIcon style={iconStyle} />, label: 'Pool' },
];

// const ServiceRow = ({ service, onAddService }) => (
//   <Box sx={{
//     display: 'flex',
//     flexDirection: { xs: 'column', sm: 'row' },
//     justifyContent: 'space-between',
//     alignItems: { xs: 'flex-start', sm: 'center' },
//     mb: '5px',
//     borderBottom: '1px solid #e2e6ea',
//     gap: { xs: 1, sm: 0 },
//     width: '100%',
//   }}>
//     <Box sx={{
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       width: '100%',
//     }}>
//       <Typography
//         variant="subtitle1"
//         sx={{
//           lineHeight: 'inherit',
//           overflow: 'hidden',
//           fontSize: '1rem',
//           textOverflow: 'ellipsis',
//           whiteSpace: 'nowrap',
//           maxWidth: '60%',
//         }}
//       >
//         {service.name}
//       </Typography>

//       <Stack direction="row" spacing={1}>
//         <Typography variant="body2" color="textSecondary" sx={{ textDecoration: 'line-through' }}>
//           {service.basePrice}
//         </Typography>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           {service.discountPrice}
//         </Typography>
//       </Stack>
//     </Box>

//     <Box sx={{
//       display: 'flex',
//       alignItems: 'center',
//       width: '100%',
//       justifyContent: 'space-between',
//     }}>
//       <Typography variant="body1" sx={{ fontSize: '12px', fontWeight: 600, color: 'gray' }}>
//         {`${service.duration} min`}
//       </Typography>
//       <Button
//         onClick={() => onAddService(service)}
//         sx={{
//           color: '#1b4d69',
//           fontSize: '1.7rem',
//           fontWeight: 600,
//           ml: { xs: 0, sm: 1 },
//         }}
//       >+</Button>
//     </Box>
//   </Box>
// );

const CardList = ({ data = [], isLoading }) => {
  const navigate = useNavigate();
  const [heart, setHeart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());


  const listings = data && data.map(filter => {
    const { business_details, services } = filter;


    return {
      name: business_details.BusinessName,
      location: `${business_details.StreetAddress}, ${business_details.Region}`,
      rating: 4.9,
      reviews: business_details.LikesCount,
      distance: '0.5km Away',
      closeAt: business_details.ClosingTime,
      owner: 'Mr. Rakesh Kumar',
      specialOffer: {
        description: 'Pick any 6 services',
        price: '₹1499',
      },
      services: services.map(service => ({
        name: service.ServiceName,
        duration: service.Duration,
        basePrice: `₹${service.Price}`,
        discountPrice: service.isDiscount ? `₹${service.DiscountedPrice}` : `₹${service.Price}`,
      })),
      amenities,
      image: business_details.ProfileImage,
      _id: business_details._id
    };
  });


  useEffect(() => {
    setLoading(false);
  }, [listings])

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleNavigateDetailPage = (id) => {
    navigate(`/beautymain/${id}`);
  };

  // Skeleton loading component for a single card
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
                {(listings && listings.length > 0) &&<Typography variant="h5" sx={{ fontSize: { xs: '1rem', sm: '1rem' }, color: '#000' }}>
                  Home / Beauty
                </Typography>}
                {(listings && listings.length > 0) && <Typography variant="h5" sx={{ fontSize: { xs: '1rem', sm: '1rem' }, color: '#000' }}>
                  {listings.length} Salons, Die and Massage in Chandigarh
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
              listings && listings.map((item, index) => (
                // Your existing card code here
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
                        image={item.image}
                        alt="Barber Hirsch"
                        onError={(e) => { e.target.src = Img }}
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
                          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                        }}
                        aria-label="add to favorites"
                        onClick={() => setHeart(!heart)}
                      >
                        {
                          !heart ? (
                            <FavoriteBorderOutlinedIcon color="action" />
                          ) : (
                            <FavoriteOutlinedIcon color="error" />
                          )
                        }
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
                      {/* Rest of your middle section code */}
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
                              {item.rating || 4.5}
                            </Typography>
                            <Box sx={{ display: 'flex', color: '#1b4d69' }}>
                              {'★'.split('').map((star, i) => (
                                <span key={i}>{star}</span>
                              ))}
                            </Box>
                          </Box>

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
                            }}
                          >
                            {item.location}
                          </Typography>
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
                                {`${service.duration} min`}
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
                      {/* Rest of your right section code */}
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
                            sx={{
                              color: '#1b4d69',
                              fontWeight: 800,
                              fontSize: '10px',
                              textDecoration: 'underline',
                              padding: 0,
                            }}
                            size="small"
                          >
                            View Deals
                          </Button>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 800,
                              fontSize: '10px',
                              color: '#323733',
                              textAlign: { xs: 'left', sm: 'right' },
                            }}
                          >
                            Owner: Mr. Rakesh Kumar
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              ))
            )}
          </Box> :
          <Typography style={{width:'100%',textAlign:'center',marginTop:'100px'}}>
            No Result Found
          </Typography>
          }
        </Grid>
      </Grid>
    </>
  );
};

export default CardList;
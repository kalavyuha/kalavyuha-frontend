import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  Badge,
  CardContent,
  Tabs,
  Tab,
  Stack,
  MenuItem,
  Select,
  CircularProgress,
  Skeleton
} from '@mui/material';
import ImageIcon from '../../../assets/images/Overview_Images/image.png'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DemoImg from '../../../assets/images/Overview_Images/detailServiceListingImg.jpg';
import { apipost, apipatch, apidelete, apiget } from '../../service/api';

const ServiceCard = ({
  serviceName,
  _id,
  rating,
  duration,
  price,
  onAddToCart,
  isInCart,
  loadingId,
  loading,
  imageUrl,
  DiscountPercentage
}) => {

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        justifyContent: 'space-between',
        flexDirection: 'row'
      }}
    >
      <Box
        display={'flex'}
        gap={2}
        flexDirection={{ xs: 'column', sm: 'row', md: 'row' }}
        alignItems={'flex-start'}
      >
        {loading ? (
          <Skeleton variant="rectangular" width={90} height={60} sx={{ borderRadius: 1 }} />
        ) : (
          <CardMedia
            component="img"
            sx={{ width: 90, height: 60, borderRadius: 1 }}
            image={imageUrl || ImageIcon}
            alt={serviceName}
          />
        )}

        <CardContent style={{ padding: '0px' }}>
          {loading ? (
            <>
              <Skeleton width="40vw" height={24} sx={{ mb: 0.5 }} />
              <Skeleton width="30vw" height={20} />
            </>
          ) : (
            <>
              <Typography
                variant="body1"
                fontSize={{ xs: '14px', sm: 'unset', md: 'unset' }}
                sx={{
                  width: '40vw',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textTransform: 'capitalize '
                }}
                fontWeight={600}
              >
                {serviceName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {duration}
                <span style={{
                  color: '#1b4d69',
                  fontWeight: 600,
                  marginLeft: '12px'
                }}>
                  ⭐ ({rating})
                </span>

              </Typography>
            </>
          )}
        </CardContent>
      </Box>

      <Box
        sx={{
          height: { xs: '116px', sm: 'unset', md: 'unset' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            alignItems: 'flex-end',
            justifyContent: { xs: 'space-between', sm: 'center', md: 'center' },
            height: { xs: '100%', sm: 'unset', md: 'unset' }
          }}
        >
          {loading ? (
            <Box>
              <Skeleton width={60} height={28} sx={{ mb: 0.5 }} />
              <Skeleton width={80} height={20} />
            </Box>
          ) : (
            <Box
              display={'flex'}
              flexDirection={'column'}
              justifyContent={{ xs: 'flex-start', sm: 'flex-end', md: 'flex-end' }}
            >
              <Typography variant="body1" color="#000" fontWeight={600} textAlign={'end'}>
                ₹{price}
              </Typography>
              <Typography
                variant="body2"
                color="#1b4d69"
                fontSize={{ xs: '10px', sm: '14px', md: '14px' }}
              >
                Save up to {DiscountPercentage || '50%'}
              </Typography>
            </Box>
          )}

          {loading ? (
            <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
          ) : (
            <Button
              variant="contained"
              sx={{
                background: isInCart ? '#ff4444' : '#000',
                color: '#f1f1f1',
                ml: 2,
                textTransform: 'capitalize'
              }}
              onClick={() => onAddToCart({
                serviceName,
                price,
                duration,
                img: DemoImg,
                _id
              })}
            >
              {loadingId === _id ? <CircularProgress size={24} color="inherit" /> : (isInCart ? 'Remove' : 'Add')}
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
}

// Skeleton Card Component for loading state
const SkeletonServiceCard = () => {
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        justifyContent: 'space-between',
        flexDirection: 'row'
      }}
    >
      <Box
        display={'flex'}
        gap={2}
        flexDirection={{ xs: 'column', sm: 'row', md: 'row' }}
        alignItems={'flex-start'}
      >
        <Skeleton variant="rectangular" width={90} height={60} sx={{ borderRadius: 1 }} />

        <CardContent style={{ padding: '0px' }}>
          <Skeleton width="40vw" height={24} sx={{ mb: 0.5 }} />
          <Skeleton width="30vw" height={20} />
        </CardContent>
      </Box>

      <Box
        sx={{
          height: { xs: '116px', sm: 'unset', md: 'unset' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            alignItems: 'flex-end',
            justifyContent: { xs: 'space-between', sm: 'center', md: 'center' },
            height: { xs: '100%', sm: 'unset', md: 'unset' }
          }}
        >
          <Box>
            <Skeleton width={60} height={28} sx={{ mb: 0.5 }} />
            <Skeleton width={80} height={20} />
          </Box>

          <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    </Card>
  );
};

const Services = ({ services, buisness_Id, loading, staffData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedValue, setSelectedValue] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [actionId, setActionId] = useState(null);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetail = JSON.parse(localStorage.getItem("userDetail"));

        if (userDetail && userDetail._id) {
          setUserId(userDetail._id);

          await fetchCartItems(userDetail._id);
        } else {
          const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
          setCartItems(savedCartItems);
        }
      } catch (error) {
        console.error("Error initializing cart:", error);
      } finally {
        setLoadingCart(false);
      }
    };

    fetchData();
  }, []);

  const fetchCartItems = async (userId) => {
    try {
      const result = await apiget(`api/v1/addToCart/service/cart/${userId}`);

      if (result && result.status === 200 && result.data && result.data.Data) {
        const cartData = result?.data?.Data;
        setCartId(cartData._id);

        const apiCartItems = cartData.services.map(service => ({
          _id: service.service_id,
          serviceName: service.service_name,
          price: service.price,
          duration: service.duration,
        }));

        setCartItems(apiCartItems);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddToCart = async (service) => {
    setActionId(service._id)
    const isServiceInCart = cartItems.some(item => item._id == service._id);

    // If user is logged in, use API
    if (userId) {
      try {
        if (isServiceInCart) {
          // Remove from cart
          await removeFromCartAPI(service);
        } else {
          // Add to cart
          await addToCartAPI(service);
        }

        await fetchCartItems(userId);
      } catch (error) {
        console.error("Cart operation failed:", error);
      }
    } else {
      // If user is not logged in, use localStorage
      handleLocalStorageCart(service);
    }
    setActionId(null)
  };

  // Add to cart using API
  const addToCartAPI = async (service) => {

    if (!cartId && userId) {

      const result = await apipost('api/v1/addToCart/service/add', {
        UserId: `${userId}`,
        BussinessId: buisness_Id,
        selected_date: "",
        selected_time: "",
        services: [
          {
            service_id: `${service._id}`,
            service_name: service.serviceName,
            duration: service.duration,
            price: service.price
          }
        ],
      });
      if (result && result.status === 200) {
        setCartId(result?.data?.Data);

      }
    } else {

      await apipatch(`api/v1/addToCart/service/update/${cartId}`, {
        services: [
          ...cartItems.map(item => ({
            service_id: item._id,
            service_name: item.serviceName,
            duration: item.duration,
            price: item.price
          })),
          {
            service_id: `${service._id}`,
            service_name: service.serviceName,
            duration: service.duration,
            price: service.price
          }
        ],
      });

    }

  };

  const removeFromCartAPI = async (service) => {

    if (cartId) {
      // Get current services excluding the one to remove
      const updatedServices = cartItems
        .filter(item => item._id != service._id)
        .map(item => ({
          service_id: item._id,
          service_name: item.serviceName,
          duration: item.duration,
          price: item.price
        }));

      if (updatedServices.length > 0) {
        // Update cart with remaining services
        const result = await apipatch(`api/v1/addToCart/service/update/${cartId}`, {
          services: updatedServices,
        });
        if (result && result.status === 200) {
          setCartItems(result?.data?.Data?.services);
        }
      } else {
        // Delete entire cart if no services left
        // await apidelete(`api/v1/cart/delete/${cartId}`);

        setCartId(null);
        const result = await apipatch(`api/v1/addToCart/service/update/${cartId}`, {
          services: updatedServices,
        });
        if (result && result.status === 200) {
          setCartItems(result?.data?.Data?.services);
        }
      }
    }

  };

  // Handle cart operations with localStorage
  const handleLocalStorageCart = (service) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item._id === service._id
      );

      let updatedItems;
      if (existingItemIndex > -1) {
        // Remove item if it exists
        updatedItems = prevItems.filter((_, index) => index !== existingItemIndex);
      } else {
        // Add item if it doesn't exist
        updatedItems = [...prevItems, service];
      }

      // Update localStorage
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };


  const syncCartWithAPI = async (userId) => {
    try {
      const localCart = JSON.parse(localStorage.getItem('cartItems') || '[]');

      if (localCart.length > 0) {
        // Create a new cart with local items
        setActionId("")
        const result = await apipost('api/v1/addToCart/service/add', {
          UserId: userId,
          BussinessId: buisness_Id,
          selected_date: "",
          selected_time: "",
          services: localCart.map(item => ({
            service_id: item._id,
            service_name: item.serviceName,
            duration: item.duration,
            price: item.price
          })),
        });

        if (result && result.status === 200) {
          // Clear localStorage cart after syncing
          localStorage.removeItem('cartItems');
          setCartId(result?.data?.Data);
          await fetchCartItems(userId);
        }
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
    setActionId(null)
  };

  const handleNavigateCart = () => {
  navigate(`/cart`, { state: { staff: staffData} });
};


  return (
    <Box sx={{ p: 2 }}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h4"
          fontSize={{ xs: '24px', sm: '28px', md: '28px' }}
          fontWeight={600}
        >
          Services
        </Typography>
      </Stack>

      <Box mt={2}>
        <Grid container spacing={2}>
          {loading ? (
            // Show skeleton cards when loading
            Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={12} md={12} key={`skeleton-${index}`}>
                <SkeletonServiceCard />
              </Grid>
            ))
          ) : (
            // Show actual services when loaded
            services && services.length > 0 && services.map((service, index) => {
              const isInCart = cartItems.some((item) => item._id == service._id);

              return (
                <Grid item xs={12} sm={12} md={12} key={service._id || index}>
                  <ServiceCard
                    serviceName={service.ServiceName}
                    _id={service._id}
                    duration={service.Duration}
                    imageUrl={service.ImageURL}
                    price={service.Price}
                    rating={service.AverageRating}
                    DiscountPercentage={service.DiscountPercentage}
                    onAddToCart={handleAddToCart}
                    isInCart={isInCart}
                    loadingId={actionId}
                    loading={false} // Individual card loading is false since we handle it at component level
                  />
                </Grid>
              );
            })
          )}
        </Grid>

        {/* Show "No services found" message when not loading and no services */}
        {!loading && (!services || services.length === 0) && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Typography variant="h6" color="textSecondary">
              No services available
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Please check back later for available services.
            </Typography>
          </Box>
        )}

        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              width: '100%',
              zIndex: '999999',
              backgroundColor: '#fff',
              borderTop: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 10px',
              boxShadow: '0px -2px 5px rgba(0,0,0,0.1)',
            }}
          >
            <Typography fontWeight={600}>
              {cartItems.length} item added
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Badge badgeContent={cartItems.length} color="primary">
                <ShoppingCartIcon sx={{ color: '#1b4d69' }} />
              </Badge>
              <Button
                variant="contained"
                onClick={handleNavigateCart}
                sx={{
                  backgroundColor: '#1b4d69',
                  color: '#fff',
                  marginRight: '20px'
                }}
              >
                View Cart
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Services;
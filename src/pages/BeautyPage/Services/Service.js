import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { notifyCartUpdate, updateCartAndNotify } from '../../../utils';

const ServiceCard = ({
  serviceName,
  _id,
  rating,
  duration,
  price,
  description,
  onAddToCart,
  isInCart,
  loadingId,
  loading,
  imageUrl,
  DiscountPercentage
}) => {

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center', // Center both sides vertically
        padding: '10px',
        justifyContent: 'space-between',
        flexDirection: 'row',
        bgcolor: "#d7dbdf",
        borderRadius: '8px',
      }}
    >
      <Box
        display={'flex'}
        gap={2}
        flexDirection={{ xs: 'column', sm: 'row', md: 'row' }}
        alignItems={'flex-start'}
        flex={1}
        minWidth={0}
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
              {description && (
                <Typography 
                  variant="body2" 
                  color="textSecondary"
                  sx={{
                    // width: '16rem',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '12px', sm: '14px', md: '14px' },
                    mb: 0.5
                  }}
                >
                  {description.length > 30 ? description.slice(0, 30) + '...' : description}
                </Typography> 
              )}
              <Typography variant="body2" color="textSecondary">
                {duration} {duration && !duration.includes('m') && !duration.includes('h') ? 'mins' : ''}
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            alignItems: 'center',
            justifyContent: { xs: 'space-between', sm: 'center', md: 'center' },
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
                Save up to {DiscountPercentage || '0%'}
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
                img: imageUrl || DemoImg,
                _id
              })}
            >
              {loadingId === _id ? <CircularProgress size={24} color="inherit" /> : (isInCart ? 'Remove' : 'Add')}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
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
  const params = useParams();
  const [visibleServices, setVisibleServices] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState('All');

  console.log("Services component props:", { services, buisness_Id, loading, staffData });

  // Extract and flatten services from the nested structure
  const flattenedServices = React.useMemo(() => {
    if (!services || !services.length || !services[0]?.Categories) {
      return [];
    }
    
    const allServices = [];
    services[0].Categories.forEach(category => {
      if (category.Services && category.Services.length > 0) {
        category.Services.forEach(service => {
          allServices.push({
            ...service,
            _id: service._id,
            ServiceName: service.Name,
            Price: service.Price,
            Duration: service.Duration,
            ImageURL: service.Image,
            Description: service.Description,
            AverageRating: services[0].AverageRating || 0,
            DiscountPercentage: service.DiscountPercentage,
            CategoryName: category.Name
          });
        });
      }
    });
    return allServices;
  }, [services]);

  // Get all available categories dynamically from the data
  const categories = React.useMemo(() => {
    if (!services || !services.length || !services[0]?.Categories) return ['All'];
    
    const categoryNames = services[0].Categories.map(cat => cat.Name);
    return ['All', ...categoryNames];
  }, [services]);

  // Filter services based on selected category
  const filteredServices = React.useMemo(() => {
    if (selectedCategory === 'All') {
      return flattenedServices;
    }
    return flattenedServices.filter(service => service.CategoryName === selectedCategory);
  }, [flattenedServices, selectedCategory]);

  const handleSeeMore = () => {
    setVisibleServices(prev => prev + 5);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setVisibleServices(5); // Reset visible services when category changes
  };

  const hasMoreServices = filteredServices && visibleServices < filteredServices.length;


  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Initializing cart...");
        const userDetail = JSON.parse(localStorage.getItem("userDetail"));
        console.log("User detail from localStorage:", userDetail);

        if (userDetail && userDetail._id) {
          console.log("User is logged in, setting userId:", userDetail._id);
          setUserId(userDetail._id);

          await fetchCartItems(userDetail._id);
        } else {
          console.log("User not logged in, using localStorage for cart");
          const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
          console.log("Saved cart items from localStorage:", savedCartItems);
          setCartItems(savedCartItems);
        }
      } catch (error) {
        console.error("Error initializing cart:", error);
      } finally {
        console.log("Cart initialization complete");
        setLoadingCart(false);
      }
    };

    fetchData();
  }, []);

  const fetchCartItems = async (userId) => {
    try {
      console.log("Fetching cart items for userId:", userId);
      const result = await apiget(`api/v1/addToCart/service/cart/${userId}`);
      console.log("Fetch cart result:", result);

      if (result && result.status === 200 && result.data && result.data.Data) {
        const cartData = result?.data?.Data;
        setCartId(cartData._id);

        const apiCartItems = cartData.services.map(service => ({
          _id: service.service_id,
          serviceName: service.service_name,
          price: service.price,
          duration: service.duration,
          img: service.image || service.img,
        }));

        console.log("Setting cart items:", apiCartItems);
        setCartItems(apiCartItems);
        // Notify navbar about cart update
        notifyCartUpdate();
      } else {
        console.log("No cart data found or unexpected response structure");
        // Clear cart and notify
        setCartItems([]);
        notifyCartUpdate();
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      // Clear cart on error and notify
      setCartItems([]);
      notifyCartUpdate();
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddToCart = async (service) => {
    console.log("Service being added to cart:", service);
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

        // Refresh cart items after operation
        await fetchCartItems(userId);
      } catch (error) {
        console.error("Cart operation failed:", error);
        // Even if API fails, let's try to continue with localStorage as fallback
        handleLocalStorageCart(service);
      }
    } else {
      // If user is not logged in, use localStorage
      handleLocalStorageCart(service);
    }
    setActionId(null)
  };

  // Add to cart using API
  const addToCartAPI = async (service) => {
    console.log("addToCartAPI called with service:", service);
    console.log("Current cartId:", cartId);
    console.log("Current userId:", userId);

    try {
      if (!cartId && userId) {
        console.log("Creating new cart...");
        const result = await apipost('api/v1/addToCart/service/add', {
          UserId: `${userId}`,
          BussinessId: buisness_Id,
          SelectedDate: "",
          SelectedTime: "",
          Services: [
            {
              ServiceId: `${service._id}`,
              ServiceName: service.serviceName,
              Duration: service.duration,
              Price: service.price,
              Image: service.img
            }
          ],
        });
        console.log("Create cart result:", result);
        if (result && result.status === 200) {
          setCartId(result?.data?.Data);
        }
      } else {
        console.log("Updating existing cart...");
        const updatePayload = {
          services: [
            ...cartItems.map(item => ({
              service_id: item._id,
              service_name: item.serviceName,
              duration: item.duration,
              price: item.price,
              image: item.img
            })),
            {
              service_id: `${service._id}`,
              service_name: service.serviceName,
              duration: service.duration,
              price: service.price,
              image: service.img
            }
          ],
        };
        console.log("Update payload:", updatePayload);
        
        const result = await apipatch(`api/v1/addToCart/service/update/${cartId}`, updatePayload);
        console.log("Update cart result:", result);
      }
    } catch (error) {
      console.error("Error in addToCartAPI:", error);
      throw error; // Re-throw to be caught by handleAddToCart
    }
  };

  const removeFromCartAPI = async (service) => {

    if (cartId) {
      const updatedServices = cartItems
        .filter(item => item._id != service._id)
        .map(item => ({
          service_id: item._id,
          service_name: item.serviceName,
          duration: item.duration,
          price: item.price,
          image: item.img
        }));

      if (updatedServices.length > 0) {
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

  const handleLocalStorageCart = (service) => {
    console.log("Using localStorage for cart. Current cartItems:", cartItems);
    console.log("Service to add/remove:", service);
    
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item._id === service._id
      );

      let updatedItems;
      if (existingItemIndex > -1) {
        console.log("Removing service from localStorage cart");
        updatedItems = prevItems.filter((_, index) => index !== existingItemIndex);
      } else {
        console.log("Adding service to localStorage cart");
        updatedItems = [...prevItems, service];
      }

      console.log("Updated cart items:", updatedItems);
      // Update localStorage and notify navbar
      updateCartAndNotify(updatedItems);
      return updatedItems;
    });
  };


  const syncCartWithAPI = async (userId) => {
    try {
      const localCart = JSON.parse(localStorage.getItem('cartItems') || '[]');

      if (localCart.length > 0) {
        setActionId("")
        const result = await apipost('api/v1/addToCart/service/add', {
          UserId: userId,
          BussinessId: buisness_Id,
          SelectedDate: "",
          SelectedTime: "",
          services: localCart.map(item => ({
            ServiceId: item._id,
            ServiceName: item.serviceName,
            Duration: item.duration,
            Price: item.price,
            Image: item.img
          })),
        });

        if (result && result.status === 200) {
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
    // Set business ID in localStorage before navigating to cart
    if (params.id) {
      localStorage.setItem('businessId', params.id);
    }
    navigate(`/cart`, { state: { staff: staffData, _id: params.id } });
  };


  return (
    <Box sx={{ p: {xs:0 , sm: 2} }}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h4"
          fontSize={{ xs: '24px', sm: '28px', md: '28px' }}
          // fontWeight={600}
        >
          Services
        </Typography>
      </Stack>

      {/* Category Section */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={3}>
          {categories.map((category) => (
            <Typography
              key={category}
              onClick={() => handleCategoryChange(category)}
              sx={{
                cursor: 'pointer',
                fontSize: { xs: '14px', sm: '16px', md: '18px' },
                // fontWeight: 600,
                color: selectedCategory === category ? '#1b4d69' : '#000',
                position: 'relative',
                transition: 'color 0.3s ease',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-2px',
                  left: 0,
                  width: selectedCategory === category ? '100%' : '0%',
                  height: '2px',
                  backgroundColor: '#1b4d69',
                  transition: 'width 0.3s ease',
                },
                '&:hover': {
                  color: '#1b4d69',
                  '&::after': {
                    width: '100%',
                  }
                }
              }}
            >
              {category}
            </Typography>
          ))}
        </Stack>
      </Box>

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
            // Show actual services when loaded - LIMITED TO visibleServices
            filteredServices && filteredServices.length > 0 && filteredServices.slice(0, visibleServices).map((service, index) => {
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
                    description={service.Description}
                    onAddToCart={handleAddToCart}
                    isInCart={isInCart}
                    loadingId={actionId}
                    loading={false}
                  />
                </Grid>
              );
            })
          )}
        </Grid>

        {/* See More Button */}
        {!loading && hasMoreServices && (
          <Box sx={{
            
            mt: 3,
            mb: 2
          }}>
            <Button
              variant="outlined"
              onClick={handleSeeMore}
              sx={{
                borderColor: '2px solid #1b4d69',
                color: '#1b4d69',
                '&:hover': {
                  backgroundColor: '#1b4d69',
                  color: '#fff',
                },
                p: '5px 10px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '8px'
              }}
            >
              See More
            </Button>
          </Box>
        )}

        {!loading && (!filteredServices || filteredServices.length === 0) && (
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
              {selectedCategory === 'All' ? 'No services available' : `No services available in ${selectedCategory}`}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {selectedCategory === 'All' ? 'Please check back later for available services.' : 'Try selecting a different category or check back later.'}
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
              <Badge 
                badgeContent={cartItems.length} 
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#1b4d69',
                    color: 'white'
                  }
                }}
              >
                <ShoppingCartIcon sx={{ color: '#000' }} />
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
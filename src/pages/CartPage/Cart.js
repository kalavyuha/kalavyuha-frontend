import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Skeleton
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BoltIcon from '@mui/icons-material/Bolt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 
import DiscountTicket from "../../assets/cart/discount-ticket.png";
import MonthSelect from './CalenderData';
import CartList from './CartList';
import ServiceStaffSelect from './StaffMember';
import { showSuccess, showError } from '../../components/toast';
import { apipost, apipatch, apiget } from '../service/api';

const BookingInterface = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [userId, setUserId] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(true);

  const generateDateOptions = () => {
    const options = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

      options.push({
        day: dayNames[date.getDay()],
        date: date.getDate(),
        fullDate: date
      });
    }

    return options;
  };

  const days = generateDateOptions();


  const timeSlots = [
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM'
  ];

  // Fetch cart items 
  useEffect(() => {
    const fetchData = async () => {
      try {

        const userDetail = JSON.parse(localStorage.getItem("userDetail"));

        if (userDetail && userDetail._id) {
          setUserId(userDetail);

          // to  get cart from API
          const result = await apiget(`api/v1/addToCart/service/cart/${userDetail._id}`);

          if (result && result.status === 200 && result?.data && result?.data?.Data) {
            const cartData = result?.data?.Data;
            setCartId(cartData._id);
            console.log(result)
            // Transform API cart items to match local format
            const apiCartItems = cartData.services.map(service => ({
              _id: service.service_id,
              serviceName: service.service_name,
              duration: service.duration,
              price: service.price
            }));

            setCartItems(apiCartItems);

          } else {
            // If no cart from API, try localStorage
            const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            setCartItems(savedCartItems);
          }
        } else {
          // If user is not logged in, get cart from localStorage
          const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
          setCartItems(savedCartItems);
        }
      } catch (error) {
        console.error("Error initializing cart:", error);
        // Fallback to localStorage
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        setCartItems(savedCartItems);
      } finally {
        setLoadingCart(false);
      }
    };

    fetchData();
  }, []);

  // Update subtotal whenever cart items change
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);
    setSubtotal(total);
  }, [cartItems]);

  // Handle removing items from cart
  const handleRemove = async (index) => {
    try {
      const itemToRemove = cartItems[index];

      // Create new array without the removed item
      const newCartItems = cartItems.filter((_, i) => i !== index);
      setCartItems(newCartItems);

      // Update cart in API if user is logged in and we have a cartId
      if (userId && cartId) {
        const updatedServices = newCartItems.map(item => ({
          service_id: item._id,
          service_name: item.serviceName,
          duration: item.duration,
          price: item.price
        }));

        await apipatch(`api/v1/addToCart/service/update/${cartId}`, {
          services: updatedServices
        });
      }

      // Update localStorage
      localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    } catch (error) {
      console.error("Error removing item from cart:", error);
      showError("Failed to remove item from cart");
    }
  };

  // Navigate to services page
  const handleAddServices = () => {
    navigate(-1);
  };

  // Handle checkout and booking creation
  const handleCheckout = async () => {

    if (!selectedTime) {
      showError("Please select a time slot");
      return;
    }

    if (!selectedDate) {
      showError("Please select a date");
      return;
    }

    if (cartItems.length === 0) {
      showError("Your cart is empty");
      return;
    }

    if (!userId) {
      showError("Please login to your account");
      // Redirect to login
      // navigate('/login', { state: { redirectTo: location.pathname } });
      return;
    }

    setIsLoading(true);

    try {
      // Get the selected day object
      const selectedDay = days.find(day => day.date === selectedDate);

      if (!selectedDay) {
        showError("Invalid date selected");
        return;
      }


      const formattedDate = selectedDay.fullDate.toISOString().split('T')[0];

      // Transform cart items to match API expected format
      const services = cartItems.map(item => ({
        service_id: item._id,
        service_name: item.serviceName,
        duration: item.duration,
        price: Number(item.price)
      }));

      // Build the request payload
      const payload = {
        UserId: userId._id,
        BussinessId: params.id || "default-business-id",
        selected_date: formattedDate,
        selected_time: selectedTime,
        cart_items: services,
        totalPrice: subtotal,
        discount: discount,
        finalPrice: subtotal - discount,
        staffId: selectedStaff.length > 0 ? selectedStaff : null,
        paymentStatus: "pending",
        sendSms: true
      };


      // Call the booking API
      const result = await apipost('api/v1/booking/book/', payload);

      if (result && result.status === 200) {
        showSuccess("Appointment Booking successfully");

        // Clear cart after successful booking
        if (cartId) {
          // If we have a cart ID, we should empty the cart on the server
          await apipatch(`api/v1/addToCart/service/update/${cartId}`, {
            services: [] // Empty the services array
          });
        }

        // Clear local cart
        localStorage.removeItem('cartItems');
        setCartItems([]);

        // Navigate to booking confirmation or history page
        navigate('/cart/success', {
          state: {
            bookingId: result.data.Data._id,
            date: formattedDate,
            time: selectedTime,
            services: services,
            total: subtotal - discount
          }
        });
      }
    } catch (err) {
      console.log("Error in booking", err);
      showError(err.response?.data?.message || "Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Empty Cart Component
  const EmptyCart = () => (
    <Paper
      elevation={0}
      sx={{
        px: 4,
        mb: 2,
        py:15,
        bgcolor: '#f5f5f5',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '250px',
        textAlign: 'center'
      }}
    >
      <ShoppingCartIcon sx={{ fontSize: 60, color: '#aab4be', mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 1, color: '#555' }}>Your cart is empty</Typography>
      <Typography variant="body2" sx={{ mb: 3, color: '#777' }}>
        Add some services to continue with booking
      </Typography>
      <Button
        variant="contained"
        onClick={handleAddServices}
        sx={{
          bgcolor: '#1b4d69',
          borderRadius: 2,
          px: 3,
          '&:hover': {
            bgcolor: '#143a50'
          }
        }}
      >
        Add Services
      </Button>
    </Paper>
  );

  // Skeleton loader for the entire component
  if (loadingCart) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, margin: '100px auto' }}>
        <Grid container spacing={6}>
          {/* Left column skeletons */}
          <Grid item xs={12} md={4}>
            <Skeleton variant="text" width="60%" height={30} sx={{ mb: 3 }} />
            <Box sx={{ mb: 4 }}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Box>

            <Skeleton variant="text" width="70%" height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 3, mb: 2 }} />
            <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 3 }} />
          </Grid>

          {/* Right column skeletons */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Skeleton variant="text" width="80%" height={30} sx={{ mb: 3 }} />
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Skeleton variant="text" width="60%" height={30} sx={{ mb: 3, ml: 'auto' }} />
              </Grid>
            </Grid>

            {/* Cart items skeleton */}
            {[1, 2, 3].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                height={100}
                sx={{ borderRadius: 3, mb: 2 }}
              />
            ))}

            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Skeleton variant="text" width="40%" height={30} sx={{ my: 3 }} />
                <Skeleton variant="rectangular" height={90} sx={{ borderRadius: 4 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <Skeleton variant="text" width="50%" height={30} sx={{ my: 3 }} />
                <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 4 }} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (

    cartItems.length > 0 ? <Box sx={{ p: 3, maxWidth: 1200, margin: '100px auto' }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontSize={16} sx={{ mb: 3 }}>Choose professional</Typography>
          <Box sx={{ mb: 4 }}>
            <ServiceStaffSelect selectedStaff={setSelectedStaff} />
          </Box>

          <Typography variant="h6" fontSize={16} sx={{ mb: 2 }}>Choose date and time</Typography>
          <Paper elevation={0} sx={{ padding: "1.5rem 2rem", bgcolor: "#dce1e6", borderRadius: 3 }}>
            <Box sx={{ mb: 2 }}>
              <MonthSelect />
            </Box>
            <Box sx={{
              display: 'flex',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}>
              {days.map(({ day, date }) => (
                <Box
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  sx={{
                    minWidth: 40,
                    height: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '20%',
                    bgcolor: selectedDate === date ? '#1b4d69' : 'transparent',
                    color: selectedDate === date ? 'white' : 'inherit',
                    cursor: 'pointer',
                    mx: 0.5,
                  }}
                >
                  <Typography variant="caption">{day}</Typography>
                  <Typography variant="body2">{date}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ padding: "1.5rem 2rem", bgcolor: "#dce1e6", borderRadius: 3, mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'contained' : 'none'}
                  fullWidth
                  sx={{
                    justifyContent: "space-between",
                    bgcolor: selectedTime === time ? "black" : "#c6cace",
                    color: selectedTime === time ? "white" : "inherit",
                    borderRadius: "7px",
                    padding: "8px 16px"
                  }}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                  <BoltIcon sx={{ fontSize: 18, color: "#e66f2a" }} />
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h6" fontSize={16} sx={{ mb: 3 }}>
                {cartItems.length} {cartItems.length === 1 ? 'service' : 'services'} selected
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography variant="h6" onClick={() => navigate(-1)} fontSize={14} fontWeight="bold" sx={{ mb: 3, color: "#1b4d69", cursor: "pointer" }}>
                Add other services
              </Typography>
            </Grid>
          </Grid>


          <CartList cartItems={cartItems} onRemove={handleRemove} />


          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontSize={16} sx={{ my: 3 }}>Offers</Typography>
              <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#dce1e6', borderRadius: '16px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box component="img" src={DiscountTicket} alt="Promo" sx={{ width: 40, height: 20, pl: "0.28rem" }} />
                    <Box sx={{ pl: "0.28rem" }}>
                      <Typography fontSize={18}>Select offers/User Promo Code</Typography>
                      <Typography variant="caption" color="#1b4d69" fontSize={10} fontWeight="bold">
                        Get 20% special discount on FREEBEAUTY
                      </Typography>
                    </Box>
                  </Box>
                  <ChevronRightIcon sx={{ pr: 1 }} />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontSize={16} sx={{ my: 3 }}>Price Details</Typography>
              <Paper elevation={0} sx={{ py: 2, px: 4, bgcolor: '#dce1e6', borderRadius: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="gray">Sub Total</Typography>
                  <Typography color="gray">₹{subtotal}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="gray">Discount</Typography>
                  <Typography color="#ff716d"> ₹{discount}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography fontWeight="bold">Total</Typography>
                  <Typography fontWeight="bold">₹{subtotal - discount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: 'black',
                      borderRadius: 2,
                      '&:disabled': {
                        bgcolor: 'gray',
                        color: 'white',
                        minWidth: '50px'
                      }
                    }}
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || !selectedTime || !selectedDate || isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Checkout'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box> : <EmptyCart/>

  );
};

export default BookingInterface;
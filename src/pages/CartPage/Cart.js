import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BoltIcon from '@mui/icons-material/Bolt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DiscountTicket from "../../assets/cart/discount-ticket.png";
import CartList from './CartList';
import ServiceStaffSelect from './StaffMember';
import { showSuccess, showError } from '../../components/toast';
import { apipost, apipatch, apiget } from '../service/api';
import { notifyCartUpdate, updateCartAndNotify } from '../../utils';
import Calendar from './CalenderData';
import AvailableTimesComponent from './TimeSlots';

const BookingInterface = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();

  const staffData = location?.state?.staff || [];
  const buisnes_id = location?.state?._id || [];

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
  const [promoCode, setPromoCode] = useState([]);
  const [selectedPromoCode, setSelectedPromoCode] = useState(null);
  const [promoModalOpen, setPromoModalOpen] = useState(false);

  const fetchPromoCode = async () => {

    try {
      if (!buisnes_id) return;
      const result = await apiget(`api/v1/PromoCode/list/${buisnes_id}`);

      if (result && result?.data?.Status === 200) {
        setPromoCode(result?.data?.Data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchPromoCode();
  }, [])

  // Function to check if promo code is applicable
  const isPromoCodeApplicable = (promo) => {
    // Check if subtotal meets minimum order value
    if (subtotal < promo.min_order_value) {
      return false;
    }

    // Check if current date is within valid period
    const currentDate = new Date();
    const validFrom = new Date(promo.valid_from);
    const validTo = new Date(promo.valid_to);

    if (currentDate < validFrom || currentDate > validTo) {
      return false;
    }

    // Check if any cart item's service ID is in applicable_services
    const cartServiceIds = cartItems.map(item => parseInt(item._id));
    const hasApplicableService = promo.applicable_services.some(serviceId =>
      cartServiceIds.includes(serviceId)
    );

    return hasApplicableService;
  };

  // Function to calculate discount based on promo code
  const calculateDiscount = (promo) => {
    if (!promo || !isPromoCodeApplicable(promo)) {
      return 0;
    }

    if (promo.discount_type === 'flat') {
      return promo.discount_value;
    } else if (promo.discount_type === 'percentage') {
      return (subtotal * promo.discount_value) / 100;
    }

    return 0;
  };

  // Handle promo code selection
  const handlePromoCodeSelect = (promo) => {
    if (isPromoCodeApplicable(promo)) {
      setSelectedPromoCode(promo);
      const discountAmount = calculateDiscount(promo);
      setDiscount(discountAmount);
      setPromoModalOpen(false);
      showSuccess(`Promo code ${promo.code} applied successfully!`);
    } else {
      showError('This promo code is not applicable for your current cart');
    }
  };

  // Handle removing promo code
  const handleRemovePromoCode = () => {
    setSelectedPromoCode(null);
    setDiscount(0);
    showSuccess('Promo code removed');
  };

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


  // Fetch cart items 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetail = JSON.parse(localStorage.getItem("userDetail"));

        if (userDetail && userDetail._id) {
          setUserId(userDetail);

          // to get cart from API
          const result = await apiget(`api/v1/addToCart/service/cart/${userDetail._id}`);

          if (result && result.status === 200 && result?.data && result?.data?.Data) {
            const cartData = result?.data?.Data;
            setCartId(cartData._id);
            console.log(result)
            // Transform API cart items to match local format
            const apiCartItems = cartData.services.map(service => ({
              _id: service.service_id,
              serviceName: service.service_name,
              duration: service.duration, // Use lowercase to match local format
              price: service.price // Use lowercase to match local format
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

    // Recalculate discount if promo code is selected
    if (selectedPromoCode) {
      const newDiscount = calculateDiscount(selectedPromoCode);
      setDiscount(newDiscount);
    }
  }, [cartItems, selectedPromoCode]);

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

      // Update localStorage and notify navbar
      updateCartAndNotify(newCartItems);
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
      return;
    }

    setIsLoading(true);

    try {
      // Create date object from selected date
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      
      // Find the correct date - selectedDate is just the day number
      let targetDate = new Date(currentYear, currentMonth, selectedDate);
      
      // If the selected date is in the past, move to next month
      if (targetDate < today) {
        targetDate = new Date(currentYear, currentMonth + 1, selectedDate);
      }

      const formattedDate = targetDate.toISOString().split('T')[0];

      // Transform cart items to match API expected format
      const services = cartItems.map(item => ({
        ServiceId: String(item._id), // Convert to string as expected by API
        ServiceName: item.serviceName,
        Duration: item.duration || item.Duration, // Handle both lowercase and uppercase
        Price: Number(item.price)
      }));

      // Build the request payload to match the API structure
      const payload = {
        BusinessId: Number(buisnes_id), // Convert to number and fix field name
        CustomerId: Number(userId._id), // Convert to number
        AssignedStaffs: selectedStaff.length > 0 ? selectedStaff : [], // Use empty array instead of null
        SelectedDate: formattedDate,
        SelectedTime: selectedTime,
        Services: services,
        TotalPrice: subtotal,
        PaymentMethod: "online", // Add required PaymentMethod field
        PaymentStatus: "pending",
        SendSms: true
      };

      console.log("Booking payload:", payload);

      // Validate payload before sending
      if (!payload.BusinessId || isNaN(payload.BusinessId)) {
        showError("Invalid business ID");
        return;
      }

      if (!payload.CustomerId || isNaN(payload.CustomerId)) {
        showError("Invalid customer ID");
        return;
      }

      if (!payload.Services || payload.Services.length === 0) {
        showError("No services selected");
        return;
      }

      // Call the booking API
      const result = await apipost('api/v1/booking/book/', payload);

      if (result && result.status === 200) {
        showSuccess("Appointment Booking successfully");

        // Clear cart after successful booking
        if (cartId) {
          await apipatch(`api/v1/addToCart/service/update/${cartId}`, {
            services: []
          });
        }

        // Clear local cart and promo code
        localStorage.removeItem('cartItems');
        setCartItems([]);
        setSelectedPromoCode(null);
        setDiscount(0);
        
        // Notify navbar that cart has been cleared
        notifyCartUpdate();

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
      console.log("Error response:", err.response?.data);
      
      // Show specific API error message if available
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.response?.data?.details ||
                          "Failed to create booking. Please try again.";
      
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Promo Code Modal Component
  const PromoCodeModal = () => (
    <Dialog
      open={promoModalOpen}
      onClose={() => setPromoModalOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Select Promo Code</Typography>
        <IconButton onClick={() => setPromoModalOpen(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {promoCode.length === 0 ? (
          <Typography textAlign="center" color="gray" py={4}>
            No promo codes available
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {promoCode.map((promo) => {
              const applicable = isPromoCodeApplicable(promo);
              const discountAmount = calculateDiscount(promo);

              return (
                <Paper
                  key={promo._id}
                  elevation={1}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    cursor: applicable ? 'pointer' : 'not-allowed',
                    opacity: applicable ? 1 : 0.6,
                    border: selectedPromoCode?._id === promo._id ? '2px solid #1b4d69' : '1px solid #e0e0e0',
                    '&:hover': {
                      bgcolor: applicable ? '#f5f5f5' : 'inherit'
                    }
                  }}
                  onClick={() => applicable && handlePromoCodeSelect(promo)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocalOfferIcon sx={{ color: '#1b4d69', fontSize: 20 }} />
                        <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 'bold' }}>
                          {promo.code}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="gray" sx={{ mb: 1 }}>
                        {promo.discount_type === 'flat'
                          ? `Flat ₹${promo.discount_value} off`
                          : `${promo.discount_value}% off`
                        }
                      </Typography>

                      <Typography variant="body2" color="gray" sx={{ mb: 1 }}>
                        Min order: ₹{promo.min_order_value}
                      </Typography>

                      <Typography variant="body2" color="gray" sx={{ fontSize: 12 }}>
                        Valid till: {new Date(promo.valid_to).toLocaleDateString()}
                      </Typography>

                      {applicable && (
                        <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold', mt: 1 }}>
                          You'll save ₹{discountAmount}
                        </Typography>
                      )}
                    </Box>

                    <Box>
                      {!applicable && (
                        <Chip
                          size="small"
                          label="Not Applicable"
                          color="error"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );

  // Empty Cart Component
  const EmptyCart = () => (
    <Paper
      elevation={0}
      sx={{
        px: 4,
        mb: 2,
        mt:10,
        py: 15,
        // bgcolor: '#f5f5f5',
        bgcolor: '#eaeef2',
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
      <Box sx={{ bgcolor: 'white', minHeight: '100vh', p: 3, maxWidth: 1200, margin: '100px auto' }}>
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
    <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
      {cartItems.length > 0 ? (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '100px auto' }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontSize={16} sx={{ mb: 3 }}>Choose professional</Typography>
              <Box sx={{ mb: 4 }}>
                <ServiceStaffSelect staffData={staffData} selectedStaff={setSelectedStaff} />
              </Box>

              <Calendar selectedSlotDate={setSelectedDate} />
              <AvailableTimesComponent selectedSlot={setSelectedTime} />
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

                  {/* Selected Promo Code Display */}
                  {selectedPromoCode && (
                    <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#e8f5e8', borderRadius: '16px', border: '1px solid #4caf50' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <LocalOfferIcon sx={{ color: '#4caf50' }} />
                          <Box>
                            <Typography fontSize={16} fontWeight="bold" color="#4caf50">
                              {selectedPromoCode.code} Applied
                            </Typography>
                            <Typography variant="caption" color="#4caf50" fontSize={12}>
                              You saved ₹{discount}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          size="small"
                          onClick={handleRemovePromoCode}
                          sx={{ color: '#d32f2f', minWidth: 'auto' }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Paper>
                  )}

                  {/* Promo Code Selection */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: '#dce1e6',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#d5dae0' }
                    }}
                    onClick={() => setPromoModalOpen(true)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box component="img" src={DiscountTicket} alt="Promo" sx={{ width: 40, height: 20, pl: "0.28rem" }} />
                        <Box sx={{ pl: "0.28rem" }}>
                          <Typography fontSize={18}>
                            {selectedPromoCode ? 'Change Promo Code' : 'Select offers/Use Promo Code'}
                          </Typography>
                          <Typography variant="caption" color="#1b4d69" fontSize={10} fontWeight="bold">
                            {promoCode.length > 0
                              ? `${promoCode.length} promo codes available`
                              : 'Get special discounts'
                            }
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
                      <Typography color="#ff716d">-₹{discount}</Typography>
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
        </Box>
      ) : (
        <Box sx={{ bgcolor: 'white', minHeight: '100vh', p: 3 }}>
          <EmptyCart />
        </Box>
      )}

      <PromoCodeModal />
    </Box>
  );
});

export default BookingInterface;
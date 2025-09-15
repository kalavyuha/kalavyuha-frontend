import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import sampleimage from "../../assets/image (9).png";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Skeleton,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import StarIcon from "@mui/icons-material/Star";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DiscountTicket from "../../assets/cart/discount-ticket.png";

import CartList from "./CartList";
import ServiceStaffSelect from "./StaffMember";
import { showSuccess, showError } from "../../components/toast";
import { apipost, apipatch, apiget } from "../service/api";
import { notifyCartUpdate, updateCartAndNotify } from "../../utils";
import { storeCheckoutData, clearCheckoutData } from "../../utils/checkoutUtils";
import Calendar from "./CalenderData";
import AvailableTimesComponent from "./TimeSlots";
import SuccessCart from "./SuccessCart";

const BookingInterface = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Try to get businessId from location.state, else fallback to URL param or localStorage
  const staffData = location?.state?.staff || [];
  const buisnes_id = location?.state?._id || params.businessId || localStorage.getItem('businessId') || "";

  // Utility functions for localStorage business data management
  const getStoredBusinessData = () => {
    try {
      if (!buisnes_id) {
        return null;
      }
      const key = `businessData_${buisnes_id}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error parsing stored business data:', error);
      return null;
    }
  };

  const storeBusinessData = (businessData) => {
    if (businessData && buisnes_id) {
      const key = `businessData_${buisnes_id}`;
      localStorage.setItem(key, JSON.stringify(businessData));
    }
  };

  const clearBusinessData = () => {
    if (buisnes_id) {
      const key = `businessData_${buisnes_id}`;
      localStorage.removeItem(key);
    }
  };

  // Try to get business data from localStorage first, then from navigation state
  const passedBusinessData = location?.state?.businessData || getStoredBusinessData();
  
  const [cartItems, setCartItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [userId, setUserId] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(true);
  const [promoCode, setPromoCode] = useState([]);
  const [selectedPromoCode, setSelectedPromoCode] = useState(null);
  const [manualPromoCode, setManualPromoCode] = useState("");
  const [selectedDropdownPromo, setSelectedDropdownPromo] = useState("");
  const [businessInfo, setBusinessInfo] = useState(passedBusinessData);
  const [loadingBusinessInfo, setLoadingBusinessInfo] = useState(!passedBusinessData);
  const [successCartOpen, setSuccessCartOpen] = useState(false);

  const fetchPromoCode = async () => {
    try {
      if (!buisnes_id) return;
      const result = await apiget(`api/v1/PromoCode/list/${buisnes_id}`);

      if (result && result?.data?.Status === 200) {
        setPromoCode(result?.data?.Data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBusinessInfo = async () => {
    // If business data is already set, don't fetch again
    if (businessInfo) {
      setLoadingBusinessInfo(false);
      return;
    }

    // Check if we have business data in localStorage
    if (buisnes_id) {
      const storedData = getStoredBusinessData();
      if (storedData) {
        setBusinessInfo(storedData);
        setLoadingBusinessInfo(false);
        return;
      }
    }

    // Check if business data was passed from navigation state
    if (location?.state?.businessData) {
      setBusinessInfo(location.state.businessData);
      setLoadingBusinessInfo(false);
      return;
    }
    
    try {
      if (!buisnes_id) return;
      setLoadingBusinessInfo(true);
      const result = await apiget(`api/v1/BussinessDetails/alldetails/${buisnes_id}`);
      
      if (result && result?.data?.Status === 200) {
        const businessData = result?.data?.Data?.BusinessInfo;
        setBusinessInfo(businessData);
        // Store in localStorage for future use
        storeBusinessData(businessData);
      }
    } catch (err) {
      console.log("Error fetching business info:", err);
    } finally {
      setLoadingBusinessInfo(false);
    }
  };

  useEffect(() => {
    fetchPromoCode();
    // Always call fetchBusinessInfo - it will handle the logic internally
    fetchBusinessInfo();
  }, []);

  // Handle business data retrieval when business ID becomes available
  useEffect(() => {
    if (buisnes_id && !businessInfo) {
      const storedData = getStoredBusinessData();
      if (storedData) {
        setBusinessInfo(storedData);
        setLoadingBusinessInfo(false);
      } else {
        // Don't call fetchBusinessInfo here as it will be called from the main useEffect
      }
    }
  }, [buisnes_id]);

  // Store business data whenever it changes
  useEffect(() => {
    if (businessInfo && buisnes_id) {
      storeBusinessData(businessInfo);
    }
  }, [businessInfo, buisnes_id]);

  // Clear business data when cart becomes empty
  useEffect(() => {
    if (cartItems.length === 0) {
      clearBusinessData();
    }
  }, [cartItems.length]);

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
    const cartServiceIds = cartItems.map((item) => parseInt(item._id));
    const hasApplicableService = promo.applicable_services.some((serviceId) =>
      cartServiceIds.includes(serviceId)
    );

    return hasApplicableService;
  };

  // Function to calculate discount based on promo code
  const calculateDiscount = (promo) => {
    if (!promo || !isPromoCodeApplicable(promo)) {
      return 0;
    }

    if (promo.discount_type === "flat") {
      return promo.discount_value;
    } else if (promo.discount_type === "percentage") {
      return (subtotal * promo.discount_value) / 100;
    } else if (promo.discount_type === "Upto") {
      // For "Upto" type, treat it as a percentage with a maximum cap
      const percentageDiscount = (subtotal * promo.discount_value) / 100;
      return Math.min(percentageDiscount, promo.discount_value);
    }

    return 0;
  };

  // Handle promo code selection
  const handlePromoCodeSelect = (promo) => {
    if (isPromoCodeApplicable(promo)) {
      setSelectedPromoCode(promo);
      const discountAmount = calculateDiscount(promo);
      setDiscount(discountAmount);
      showSuccess(`Promo code ${promo.code} applied successfully!`);
    } else {
      showError("This promo code is not applicable for your current cart");
    }
  };

  // Handle applying promo code from dropdown or manual input
  const handleApplyPromoCode = () => {
    let promoToApply = null;
    
    // Check if a promo code from dropdown is selected
    if (selectedDropdownPromo) {
      promoToApply = promoCode.find(promo => promo._id === selectedDropdownPromo);
    } 
    // Check if manual promo code is entered
    else if (manualPromoCode.trim()) {
      promoToApply = promoCode.find(promo => promo.code.toLowerCase() === manualPromoCode.trim().toLowerCase());
      if (!promoToApply) {
        showError("Invalid promo code entered");
        return;
      }
    } else {
      showError("Please select a promo code or enter one manually");
      return;
    }

    if (promoToApply && isPromoCodeApplicable(promoToApply)) {
      setSelectedPromoCode(promoToApply);
      const discountAmount = calculateDiscount(promoToApply);
      setDiscount(discountAmount);
      showSuccess(`Promo code ${promoToApply.code} applied successfully!`);
      // Clear the input fields
      setSelectedDropdownPromo("");
      setManualPromoCode("");
    } else {
      showError("This promo code is not applicable for your current cart");
    }
  };

  // Handle removing promo code
  const handleRemovePromoCode = () => {
    setSelectedPromoCode(null);
    setDiscount(0);
    setSelectedDropdownPromo("");
    setManualPromoCode("");
    showSuccess("Promo code removed");
  };

  const generateDateOptions = () => {
    const options = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

      options.push({
        day: dayNames[date.getDay()],
        date: date.getDate(),
        fullDate: date,
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
          const result = await apiget(
            `api/v1/addToCart/service/cart/${userDetail._id}`
          );

          if (
            result &&
            result.status === 200 &&
            result?.data &&
            result?.data?.Data
          ) {
            const cartData = result?.data?.Data;
            setCartId(cartData._id);
            // Transform API cart items to match local format
            const apiCartItems = cartData.services.map((service) => ({
              _id: service.service_id,
              serviceName: service.service_name,
              duration: service.duration,
              price: service.price,
              img: service.img || service.image, 
            }));

            setCartItems(apiCartItems);
          } else {
            // If no cart from API, try localStorage
            const savedCartItems = JSON.parse(
              localStorage.getItem("cartItems") || "[]"
            );
            setCartItems(savedCartItems);
          }
        } else {
          // If user is not logged in, get cart from localStorage
          const savedCartItems = JSON.parse(
            localStorage.getItem("cartItems") || "[]"
          );
          setCartItems(savedCartItems);
        }
      } catch (error) {
        console.error("Error initializing cart:", error);
        // Fallback to localStorage
        const savedCartItems = JSON.parse(
          localStorage.getItem("cartItems") || "[]"
        );
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
        const updatedServices = newCartItems.map((item) => ({
          service_id: item._id,
          service_name: item.serviceName,
          duration: item.duration,
          price: item.price,
          image: item.img,
        }));

        await apipatch(`api/v1/addToCart/service/update/${cartId}`, {
          services: updatedServices,
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
  // Navigate to services page
  const handleAddServices = () => {
    // Always navigate with businessId in URL for persistence
    if (buisnes_id) {
      navigate(`/detail/${buisnes_id}`, { state: { staff: staffData, _id: buisnes_id } });
    } else {
      navigate(-1);
    }
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
      window.dispatchEvent(new CustomEvent('open-login-modal'));
      return;
    }

    // Prepare booking data for localStorage storage
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    let targetDate = new Date(currentYear, currentMonth, selectedDate);
    if (targetDate < today) {
      targetDate = new Date(currentYear, currentMonth + 1, selectedDate);
    }
    const formattedDate = targetDate.toISOString().split("T")[0];

    // Transform services to match API format
    const services = cartItems.map((item) => ({
      ServiceId: String(item._id),
      ServiceName: item.serviceName,
      Duration: item.duration || item.Duration,
      Price: Number(item.price),
    }));

    // Transform staff to match API format - handle both single staff ID and array of staff objects
    let assignedStaffs = [];
    
    if (selectedStaff && selectedStaff !== 'any') {
      if (Array.isArray(selectedStaff)) {
        // If it's already an array of staff objects
        assignedStaffs = selectedStaff.map((staff) => ({
          StaffId: String(staff.StaffId || staff._id),
          StaffName: staff.StaffName || staff.name || staff.staffName,
        }));
      } else {
        // If it's a single staff ID, find the staff from staffData
        const selectedStaffData = staffData.find(staff => staff._id === selectedStaff);
        if (selectedStaffData) {
          assignedStaffs = [{
            StaffId: String(selectedStaffData._id),
            StaffName: selectedStaffData.StaffName,
          }];
        }
      }
    }

    // Prepare complete checkout data for localStorage
    const checkoutData = {
      BusinessId: Number(buisnes_id),
      CustomerId: Number(userId._id),
      AssignedStaffs: assignedStaffs,
      SelectedDate: formattedDate,
      SelectedTime: selectedTime,
      Services: services,
      TotalPrice: subtotal - discount, // Apply discount to total
      OriginalPrice: subtotal,
      Discount: discount,
      PromoCode: selectedPromoCode,
      CartId: cartId,
      BusinessInfo: businessInfo, // Store business info for payment page
      PaymentMethod: null, // Will be set on payment page
      PaymentStatus: "pending",
      SendSms: true
    };

    // Store checkout data in localStorage
    storeCheckoutData(checkoutData);
    
    // Clear business data before navigating to payment (since booking is in progress)
    clearBusinessData();
    
    // Navigate to payment page - you'll need to create this route
    navigate("/cart/payment", { state: { checkoutData } });
  };

  // Promo Code Modal Component
  // Empty Cart Component
  const EmptyCart = () => (
    <Paper
      elevation={0}
      sx={{
        px: 4,
        mb: 2,
        mt: 10,
        py: 15,
        // bgcolor: '#f5f5f5',
        bgcolor: "#eaeef2",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "250px",
        textAlign: "center",
      }}
    >
      <ShoppingCartIcon sx={{ fontSize: 60, color: "#aab4be", mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 1, color: "#555" }}>
        Your cart is empty
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "#777" }}>
        Add some services to continue with booking
      </Typography>
      <Button
        variant="contained"
        onClick={handleAddServices}
        sx={{
          bgcolor: "#1b4d69",
          borderRadius: 2,
          px: 3,
          "&:hover": {
            bgcolor: "#143a50",
          },
        }}
      >
        Add Services
      </Button>
    </Paper>
  );

  // Skeleton loader for the entire component
  if (loadingCart) {
    return (
      <Box
        sx={{
          bgcolor: "white",
          minHeight: "100vh",
          p: 3,
          maxWidth: 1200,
          margin: "100px auto",
        }}
      >
        <Grid container spacing={6}>
          {/* Left column skeletons */}
          <Grid item xs={12} md={4}>
            <Skeleton variant="text" width="60%" height={30} sx={{ mb: 3 }} />
            <Box sx={{ mb: 4 }}>
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: 2 }}
              />
            </Box>

            <Skeleton variant="text" width="70%" height={30} sx={{ mb: 2 }} />
            <Skeleton
              variant="rectangular"
              height={150}
              sx={{ borderRadius: 3, mb: 2 }}
            />
            <Skeleton
              variant="rectangular"
              height={250}
              sx={{ borderRadius: 3 }}
            />
          </Grid>

          {/* Right column skeletons */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Skeleton
                  variant="text"
                  width="80%"
                  height={30}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Skeleton
                  variant="text"
                  width="60%"
                  height={30}
                  sx={{ mb: 3, ml: "auto" }}
                />
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
                <Skeleton
                  variant="text"
                  width="40%"
                  height={30}
                  sx={{ my: 3 }}
                />
                <Skeleton
                  variant="rectangular"
                  height={90}
                  sx={{ borderRadius: 4 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Skeleton
                  variant="text"
                  width="50%"
                  height={30}
                  sx={{ my: 3 }}
                />
                <Skeleton
                  variant="rectangular"
                  height={240}
                  sx={{ borderRadius: 4 }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#eaeef2", minHeight: "100vh" }}>
      {cartItems.length > 0 ? (
        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, margin: { xs: "80px auto", sm: "100px auto" } }}>
          <Box
            sx={{
              maxWidth: 1200,
              width: "100%",
              mx: "auto",
              borderRadius: 2,
              marginBottom: 6,
            }}
          >
            {/* Mobile Layout - Full width image with overlay rating */}
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              {/* Image with rating overlay for mobile */}
              <Box sx={{ position: "relative", mb: 3 }}>
                {loadingBusinessInfo ? (
                  <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height={150} 
                    sx={{ borderRadius: "14px" }} 
                  />
                ) : (
                  <Box
                    component="img"
                    src={businessInfo?.ProfileImage || sampleimage}
                    alt="Business Image"
                    sx={{ 
                      width: "100%", 
                      height: 150, 
                      borderRadius: "14px", 
                      objectFit: 'cover'
                    }}
                  />
                )}
                
                {/* Rating overlay on top-right corner */}
                {!loadingBusinessInfo && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#1b4d69",
                      px: 1,
                      py: 0.2,
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    }}
                  >
                    <Typography variant="h6" fontSize={12} fontWeight="bold" sx={{ color: "white", mr: 1 }}>
                      {businessInfo?.AverageRating || "4.5"}
                    </Typography>
                    <StarIcon sx={{ color: "#ffb400", fontSize: 16 }} />
                  </Box>
                )}
                
                {/* Loading rating skeleton */}
                {loadingBusinessInfo && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                    }}
                  >
                    <Skeleton 
                      variant="rectangular" 
                      width={60} 
                      height={30} 
                      sx={{ borderRadius: 2 }} 
                    />
                  </Box>
                )}
              </Box>

              {/* Business name and address below image for mobile */}
              <Box sx={{ width: "100%" }}>
                {loadingBusinessInfo ? (
                  <>
                    <Skeleton variant="text" width="90%" height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={24} />
                  </>
                ) : (
                  <>
                    <Typography 
                      variant="h6" 
                      fontSize={24}
                      sx={{ 
                        lineHeight: 1.2,
                        wordBreak: "break-word",
                        mb: 1,
                        fontWeight: "bold"
                      }}
                    >
                      {businessInfo?.BusinessName || "Business Name"}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      fontSize={16}
                      sx={{ 
                        lineHeight: 1.4,
                        wordBreak: "break-word"
                      }}
                    >
                      {businessInfo?.ShopNumber || ""}{" "}
                      {businessInfo?.StreetAddress || ""}{", "}
                      {businessInfo?.Region || ""}{", "}
                      {businessInfo?.ZipCode || ""}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>

            {/* Desktop/Tablet Layout - Side by side layout */}
            <Box 
              sx={{ 
                display: { xs: "none", sm: "flex" },
                justifyContent: "space-between",
                alignItems: "top",
                gap: 3,
              }}
            >
              <Box sx={{ 
                display: "flex", 
                alignItems: "top", 
                gap: 4,
                flex: 1
              }}>
                {loadingBusinessInfo ? (
                  <Skeleton 
                    variant="rectangular" 
                    width={150} 
                    height={130} 
                    sx={{ borderRadius: "14px", flexShrink: 0 }} 
                  />
                ) : (
                  <Box
                    component="img"
                    src={businessInfo?.ProfileImage || sampleimage}
                    alt="Business Image"
                    sx={{ 
                      width: 150, 
                      height: 130, 
                      borderRadius: "14px", 
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                )}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {loadingBusinessInfo ? (
                    <>
                      <Skeleton variant="text" width="90%" height={40} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="80%" height={24} />
                    </>
                  ) : (
                    <>
                      <Typography 
                        variant="h6" 
                        fontSize={{ sm: 28, md: 36 }}
                        sx={{ 
                          lineHeight: 1.3,
                          wordBreak: "break-word"
                        }}
                      >
                        {businessInfo?.BusinessName || "Business Name"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize={{ sm: 16, md: 18 }}
                        sx={{ 
                          lineHeight: 1.4,
                          wordBreak: "break-word"
                        }}
                      >
                        {businessInfo?.ShopNumber || ""}{" "}
                        {businessInfo?.StreetAddress || ""}{", "}
                        {businessInfo?.Region || ""}{", "}
                        {businessInfo?.ZipCode || ""}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
              <Box sx={{ alignSelf: "flex-start" }}>
                {loadingBusinessInfo ? (
                  <Skeleton 
                    variant="rectangular" 
                    width={60} 
                    height={30} 
                    sx={{ borderRadius: 2 }} 
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#1b4d69",
                      px: 1,
                      py: 0.5,
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" fontSize={12} fontWeight="bold" sx={{ color: "white", mr: 1 }}>
                      {businessInfo?.AverageRating || "4.5"}
                    </Typography>
                    <StarIcon sx={{ color: "#ffb400", fontSize: 16 }} />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          <Grid container spacing={{ xs: 3, sm: 4, md: 6 }}>
            <Grid item xs={12} md={4}>
              <Typography 
                variant="h6" 
                fontSize={{ xs: 14, sm: 16 }} 
                sx={{ mb: 3 }}
              >
                Choose professional
              </Typography>
              <Box sx={{ mb: 4 }}>
                <ServiceStaffSelect
                  staffData={staffData}
                  selectedStaff={setSelectedStaff}
                />
              </Box>

              <Calendar selectedSlotDate={setSelectedDate} />
              <AvailableTimesComponent selectedSlot={setSelectedTime} />
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={8} sm={6}>
                  <Typography 
                    variant="h6" 
                    fontSize={{ xs: 14, sm: 16 }} 
                    sx={{ mb: 3 }}
                  >
                    {cartItems.length}{" "}
                    {cartItems.length === 1 ? "service" : "services"} selected
                  </Typography>
                </Grid>
                <Grid item xs={4} sm={6} textAlign="right">
                  <Typography
                    variant="h6"
                    onClick={() => navigate(-1)}
                    fontSize={{ xs: 12, sm: 14 }}
                    fontWeight="bold"
                    sx={{ 
                      mb: 3, 
                      color: "#1b4d69", 
                      cursor: "pointer",
                      textAlign: { xs: "center", sm: "right" }
                    }}
                  >
                    Add other services
                  </Typography>
                </Grid>
              </Grid>

              <CartList cartItems={cartItems} onRemove={handleRemove} />

              <Grid container spacing={{ xs: 2, md: 4 }}>
                <Grid item xs={12} md={6}>
                  <Typography 
                    variant="h6" 
                    fontSize={{ xs: 14, sm: 16 }} 
                    sx={{ my: 3 }}
                  >
                    Offers
                  </Typography>

                  {/* Selected Promo Code Display */}
                  {selectedPromoCode && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: "#e8f5e8",
                        borderRadius: "16px",
                        border: "1px solid #4caf50",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <LocalOfferIcon sx={{ color: "#4caf50" }} />
                          <Box>
                            <Typography
                              fontSize={16}
                              fontWeight="bold"
                              color="#4caf50"
                            >
                              {selectedPromoCode.code} Applied
                            </Typography>
                            <Typography
                              variant="caption"
                              color="#4caf50"
                              fontSize={12}
                            >
                              You saved ₹{discount}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          size="small"
                          onClick={handleRemovePromoCode}
                          sx={{ color: "#d32f2f", minWidth: "auto" }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Paper>
                  )}

                  {/* Promo Code Selection */}
                  {!selectedPromoCode && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 2,
                        bgcolor: "#d7dbdf",
                        borderRadius: "16px",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Box
                          component="img"
                          src={DiscountTicket}
                          alt="Promo"
                          sx={{ width: 40, height: 20 }}
                        />
                        <Typography fontSize={18} fontWeight="500">
                          Apply Promo Code
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {/* Dropdown for selecting promo code */}
                        <FormControl fullWidth size="small">
                          <InputLabel 
                            id="promo-select-label"
                            sx={{
                              "&.Mui-focused": { color: "#1b4d69" }
                            }}
                          >
                            Select Promo Code
                          </InputLabel>
                          <Select
                            labelId="promo-select-label"
                            value={selectedDropdownPromo}
                            label="Select Promo Code"
                            onChange={(e) => setSelectedDropdownPromo(e.target.value)}
                            sx={{ 
                              bgcolor: "white", 
                              borderRadius: 2,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                              "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": {
                                  borderColor: "#1b4d69",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#1b4d69",
                                  borderWidth: "2px",
                                },
                              }
                            }}
                          >
                            <MenuItem value="">
                              <em>Choose from available promo codes</em>
                            </MenuItem>
                            {promoCode.map((promo) => (
                              <MenuItem key={promo._id} value={promo._id}>
                                <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                  <Typography variant="body1" fontWeight="bold">
                                    {promo.code}
                                  </Typography>
                                  <Typography variant="caption" color="gray">
                                    {promo.discount_type === "flat"
                                      ? `Flat ₹${promo.discount_value} off`
                                      : promo.discount_type === "Upto"
                                      ? `Upto ${promo.discount_value}% off`
                                      : `${promo.discount_value}% off`} - 
                                    Min order: ₹{promo.min_order_value}
                                  </Typography>
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        {/* OR divider */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Divider sx={{ flex: 1 }} />
                          <Typography variant="body2" color="gray">OR</Typography>
                          <Divider sx={{ flex: 1 }} />
                        </Box>

                        {/* Manual promo code input */}
                        <TextField
                          size="small"
                          label="Enter Promo Code"
                          value={manualPromoCode}
                          onChange={(e) => setManualPromoCode(e.target.value.toUpperCase())}
                          placeholder="Enter promo code manually"
                          sx={{ 
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "white",
                              borderRadius: 2,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                              "&:hover fieldset": {
                                borderColor: "#1b4d69",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#1b4d69",
                                borderWidth: "2px",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              "&.Mui-focused": { color: "#1b4d69" }
                            },
                            "& .MuiOutlinedInput-input": {
                              fontWeight: "500",
                              letterSpacing: "0.5px"
                            }
                          }}
                        />

                        {/* Apply button */}
                        <Button
                          variant="contained"
                          onClick={handleApplyPromoCode}
                          disabled={!selectedDropdownPromo && !manualPromoCode.trim()}
                          sx={{
                            bgcolor: "#1b4d69",
                            "&:hover": { bgcolor: "#0f3a54" },
                            borderRadius: 1,
                            py: 1,
                          }}
                        >
                          Apply Promo Code
                        </Button>
                        
                        {promoCode.length > 0 && (
                          <Typography
                            variant="caption"
                            color="#1b4d69"
                            fontSize={10}
                            fontWeight="bold"
                            textAlign="center"
                          >
                            {promoCode.length} promo codes available
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontSize={16} sx={{ my: 3 }}>
                    Price Details
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{ 
                      py: 2, 
                      px: { xs: 2, sm: 4 }, 
                      bgcolor: "#d7dbdf", 
                      borderRadius: 4 
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography 
                        color="gray" 
                        fontSize={{ xs: 14, sm: 16 }}
                      >
                        Sub Total
                      </Typography>
                      <Typography 
                        color="gray" 
                        fontSize={{ xs: 14, sm: 16 }}
                      >
                        ₹{subtotal}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography 
                        color="gray" 
                        fontSize={{ xs: 14, sm: 16 }}
                      >
                        Discount
                      </Typography>
                      <Typography 
                        color="#ff716d" 
                        fontSize={{ xs: 14, sm: 16 }}
                      >
                        -₹{discount}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography 
                        fontWeight="bold" 
                        fontSize={{ xs: 16, sm: 18 }}
                      >
                        Total
                      </Typography>
                      <Typography 
                        fontWeight="bold" 
                        fontSize={{ xs: 16, sm: 18 }}
                      >
                        ₹{subtotal - discount}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ 
                        display: "flex", 
                        justifyContent: "center", 
                        mt: { xs: 3, sm: 5 }
                      }}
                    >
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          bgcolor: "black",
                          borderRadius: 2,
                          py: { xs: 1.5, sm: 1 },
                          fontSize: { xs: 14, sm: 16 },
                          maxWidth: { xs: "100%", sm: "200px" },
                          "&:disabled": {
                            bgcolor: "gray",
                            color: "white",
                            minWidth: "50px",
                          },
                        }}
                        onClick={handleCheckout}
                        disabled={
                          cartItems.length === 0 ||
                          !selectedTime ||
                          !selectedDate ||
                          isLoading
                        }
                      >
                        {isLoading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Checkout"
                        )}
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box sx={{ 
          bgcolor: "white", 
          minHeight: "100vh", 
          p: { xs: 2, sm: 3 } 
        }}>
          <EmptyCart />
        </Box>
      )}

      <SuccessCart open={successCartOpen} onClose={() => { setSuccessCartOpen(false); navigate("/"); }} />
    </Box>
  );
});

export default BookingInterface;

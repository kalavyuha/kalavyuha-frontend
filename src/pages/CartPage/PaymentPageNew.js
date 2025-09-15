import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MoneyIcon from "@mui/icons-material/Money";
import { 
  getCheckoutData, 
  updateCheckoutPaymentMethod, 
  prepareBookingPayload, 
  sendBookingToAPI,
  clearCheckoutData 
} from "../../utils/checkoutUtils";
import { showSuccess, showError } from "../../components/toast";
import { updateCartAndNotify } from "../../utils";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [checkoutData, setCheckoutData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get checkout data from localStorage or navigation state
    const storedData = getCheckoutData();
    const passedData = location.state?.checkoutData;
    
    if (storedData) {
      setCheckoutData(storedData);
    } else if (passedData) {
      setCheckoutData(passedData);
    } else {
      // No checkout data found, redirect to cart
      showError("No checkout data found. Please try again.");
      navigate("/cart");
    }
  }, [navigate, location.state]);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePayNow = async () => {
    if (!checkoutData) {
      showError("Checkout data not found");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Update payment method in localStorage
      const updatedCheckoutData = updateCheckoutPaymentMethod(paymentMethod);
      
      if (!updatedCheckoutData) {
        throw new Error("Failed to update payment method");
      }

      // Prepare payload for booking API
      const bookingPayload = prepareBookingPayload(updatedCheckoutData);
      
      if (!bookingPayload) {
        throw new Error("Failed to prepare booking payload");
      }

      console.log("Sending booking payload:", bookingPayload);

      // Send booking to API
      const result = await sendBookingToAPI(bookingPayload);

      // Handle successful booking
      if (result) {
        showSuccess("Booking created successfully!");
        
        // Clear cart from localStorage and notify navbar
        updateCartAndNotify([]);
        
        // Clear checkout data
        clearCheckoutData();
        
        // Navigate to success page or booking confirmation
        navigate("/booking/success", { 
          state: { 
            bookingResult: result,
            bookingData: updatedCheckoutData 
          } 
        });
      }
    } catch (error) {
      console.error("Booking failed:", error);
      setError(error.message || "Failed to create booking. Please try again.");
      showError("Failed to create booking. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoBack = () => {
    navigate("/cart");
  };

  if (!checkoutData) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  const finalTotal = checkoutData.TotalPrice;

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Box sx={{ maxWidth: 800, mx: "auto", px: 3 }}>
        {/* Header */}
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}>
          Complete Your Booking
        </Typography>

        <Grid container spacing={3}>
          {/* Payment Method Selection */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
              <FormControl component="fieldset" sx={{ width: "100%" }}>
                <FormLabel component="legend" sx={{ mb: 3, fontSize: 18, fontWeight: "bold" }}>
                  Select Payment Method
                </FormLabel>
                <RadioGroup
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                  sx={{ gap: 2 }}
                >
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      border: paymentMethod === "online" ? "2px solid #1976d2" : "1px solid #e0e0e0",
                      borderRadius: 2
                    }}
                  >
                    <FormControlLabel
                      value="online"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <PaymentIcon sx={{ color: "#1976d2" }} />
                          <Box>
                            <Typography variant="h6">Online Payment</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Pay securely using UPI, Card, or Net Banking
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ margin: 0, width: "100%" }}
                    />
                  </Paper>

                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      border: paymentMethod === "wallet" ? "2px solid #1976d2" : "1px solid #e0e0e0",
                      borderRadius: 2
                    }}
                  >
                    <FormControlLabel
                      value="wallet"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <AccountBalanceWalletIcon sx={{ color: "#4caf50" }} />
                          <Box>
                            <Typography variant="h6">Digital Wallet</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Pay using PayTM, PhonePe, Google Pay, etc.
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ margin: 0, width: "100%" }}
                    />
                  </Paper>

                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      border: paymentMethod === "cash" ? "2px solid #1976d2" : "1px solid #e0e0e0",
                      borderRadius: 2
                    }}
                  >
                    <FormControlLabel
                      value="cash"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <MoneyIcon sx={{ color: "#ff9800" }} />
                          <Box>
                            <Typography variant="h6">Pay at Store</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Pay in cash when you visit the store
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ margin: 0, width: "100%" }}
                    />
                  </Paper>
                </RadioGroup>
              </FormControl>

              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}
            </Paper>
          </Grid>

          {/* Booking Summary */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, position: "sticky", top: 20 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
                Booking Summary
              </Typography>

              {/* Business Info */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {checkoutData.BusinessInfo?.BusinessName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {checkoutData.SelectedDate} at {checkoutData.SelectedTime}
                </Typography>
              </Box>

              {/* Services */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                  Services:
                </Typography>
                {checkoutData.Services.map((service, index) => (
                  <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">{service.ServiceName}</Typography>
                    <Typography variant="body2">₹{service.Price}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Staff */}
              {checkoutData.AssignedStaffs.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                    Staff:
                  </Typography>
                  {checkoutData.AssignedStaffs.map((staff, index) => (
                    <Typography key={index} variant="body2">
                      {staff.StaffName}
                    </Typography>
                  ))}
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Pricing */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">₹{checkoutData.OriginalPrice}</Typography>
                </Box>
                {checkoutData.Discount > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="success.main">Discount:</Typography>
                    <Typography variant="body2" color="success.main">-₹{checkoutData.Discount}</Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>Total:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>₹{finalTotal}</Typography>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePayNow}
                  disabled={isProcessing}
                  sx={{
                    bgcolor: "#1b4d69",
                    "&:hover": { bgcolor: "#143a50" },
                    py: 1.5,
                  }}
                >
                  {isProcessing ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    `Pay Now ₹${finalTotal}`
                  )}
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleGoBack}
                  disabled={isProcessing}
                  sx={{ py: 1.5 }}
                >
                  Go Back to Cart
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PaymentPage;

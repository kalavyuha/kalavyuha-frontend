import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

const BookingSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { bookingResult, bookingData } = location.state || {};

  const handleClose = () => {
    navigate("/appointment-history");
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Box sx={{ maxWidth: 600, mx: "auto", px: 3 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, position: "relative" }}>
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              bgcolor: "#f0f0f0",
              "&:hover": {
                bgcolor: "#e0e0e0",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ textAlign: "center" }}>
            <CheckCircleIcon 
              sx={{ 
                fontSize: 80, 
                color: "#4caf50", 
                mb: 2 
              }} 
            />
            
            <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#4caf50" }}>
              Booking Confirmed!
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
              Your appointment has been successfully booked. You will receive a confirmation SMS shortly.
            </Typography>
          </Box>

          {bookingData && (
            <Box sx={{ mb: 4, textAlign: "left" }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Booking Details:
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Business:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {bookingData.BusinessInfo?.BusinessName}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date & Time:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {bookingData.SelectedDate} at {bookingData.SelectedTime}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Services:
                  </Typography>
                  {bookingData.Services.map((service, index) => (
                    <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body1">{service.ServiceName}</Typography>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        ₹{service.Price}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
                
                {bookingData.AssignedStaffs.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Staff Assigned:
                    </Typography>
                    {bookingData.AssignedStaffs.map((staff, index) => (
                      <Typography key={index} variant="body1">
                        {staff.StaffName}
                      </Typography>
                    ))}
                  </Grid>
                )}
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Total Paid:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#4caf50" }}>
                  ₹{bookingData.TotalPrice}
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default BookingSuccessPage;

import React from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Button, 
  Divider, 
  Grid,
  Paper,
  IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import sample from "../../assets/image (9).png";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";
import RescheduleIcon from "@mui/icons-material/Schedule";

const AppointmentHistoryDetail = () => {
  const navigate = useNavigate();

  const appointmentData = {
    id: "APT123456",
    businessName: "Batbox | Indoor Cricket Nets",
    businessAddress: "Grab Mall, Sector 18, Chandigarh",
    businessPhone: "+91 98765 43210",
    businessEmail: "batbox@gmail.com",
    rating: 4.8,
    appointmentDate: "December 15, 2024",
    appointmentTime: "10:00 AM - 11:00 AM",
    status: "Pending",
    services: [
      {
        name: "5 Over Plan",
        duration: "60 minutes",
        price: 800,
        description: "Complete cricket practice session with 5 overs"
      },
      {
        name: "Hair Cut",
        duration: "30 minutes", 
        price: 300,
        description: "Professional hair styling service"
      },
      {
        name: "Equipment Rental",
        duration: "60 minutes",
        price: 200,
        description: "Cricket bat and protective gear rental"
      }
    ],
    subtotal: 1300,
    tax: 100,
    discount: 0,
    total: 1400,
    bookingDate: "December 10, 2024",
    paymentMethod: "Online Payment",
    paymentStatus: "Paid"
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "#eaeef2",
        minHeight: "100vh",
        py: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          margin: "0 auto",
          px: { xs: 2, sm: 6, md: 6, lg: 12 },
          mt: 12,
        }}
      >
        {/* Header with Back Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            gap: 2,
          }}
        >
          <IconButton 
            onClick={handleBack}
            sx={{
              bgcolor: "#1b4d69",
              color: "white",
              "&:hover": {
                bgcolor: "#0f3a52",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#333",
              fontSize: { xs: "1.4rem", md: "1.7rem" },
            }}
          >
            Appointment Details
          </Typography>
        </Box>

        {/* Business Info Card */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            overflow: "hidden",
            // minHeight: 230,
            // alignItems: "center",
            // display: "flex",
            // justifyContent: "space-between",
            // backgroundColor: "#000",
            // height: "100%",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "flex-start" },
                justifyContent: "space-between",
                p: 3,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 3,
                  width: "100%",
                }}
              >
                {/* Business Image */}
                <Box
                  sx={{
                    width: { xs: "100%", sm: 150, md: 180 },
                    height: { xs: 150, sm: 150, md: 180 },
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={sample}
                    alt={appointmentData.businessName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </Box>

                {/* Business Details */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      color: "#333",
                      mb: 1,
                      fontSize: { xs: "1.2rem", md: "1.5rem" },
                    }}
                  >
                    {appointmentData.businessName}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
                    <LocationOnIcon sx={{ color: "#666", fontSize: "1rem" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                      }}
                    >
                      {appointmentData.businessAddress}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
                    <PhoneIcon sx={{ color: "#666", fontSize: "1rem" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                      }}
                    >
                      {appointmentData.businessPhone}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
                    <EmailIcon sx={{ color: "#666", fontSize: "1rem" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                      }}
                    >
                      {appointmentData.businessEmail}
                    </Typography>
                  </Box>

                  <Chip
                    label={appointmentData.status}
                    sx={{
                      backgroundColor: appointmentData.status === "Pending" ? "#fff3cd" : "#d4edda",
                      color: appointmentData.status === "Pending" ? "#856404" : "#155724",
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                    }}
                  />
                </Box>
              </Box>

              {/* Rating */}
              <Box
                sx={{
                  bgcolor: "#1b4d69",
                  color: "#fff",
                  px: 1,
                  py: 0.5,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "fit-content",
                }}
              >
                <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
                  {appointmentData.rating}
                </Typography>
                <StarOutlinedIcon sx={{ color: "#fdd835", fontSize: 16 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Left Column - Appointment & Services */}
          <Grid item xs={12} md={8}>
            {/* Appointment Info */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#1b4d69",
                    mb: 2,
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                  }}
                >
                  Appointment Information
                </Typography>
                
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarTodayIcon sx={{ color: "#8eabbb", fontSize: "1.1rem" }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: "#666", fontSize: "0.8rem" }}>
                        Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
                        {appointmentData.appointmentDate}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon sx={{ color: "#8eabbb", fontSize: "1.1rem" }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: "#666", fontSize: "0.8rem" }}>
                        Time
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
                        {appointmentData.appointmentTime}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" sx={{ color: "#666", fontSize: "0.8rem" }}>
                      ID: 
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
                      {appointmentData.id}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Services Details */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#1b4d69",
                    mb: 2,
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                  }}
                >
                  Booked Services
                </Typography>

                {appointmentData.services.map((service, index) => (
                  <Box key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "500",
                            color: "#333",
                            fontSize: "1rem",
                          }}
                        >
                          {service.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#666",
                            fontSize: "0.85rem",
                            mb: 0.5,
                          }}
                        >
                          {service.description}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#8eabbb",
                            fontSize: "0.8rem",
                            fontWeight: "500",
                          }}
                        >
                          Duration: {service.duration}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "bold",
                          color: "#1b4d69",
                          fontSize: "1rem",
                        }}
                      >
                        ₹{service.price}
                      </Typography>
                    </Box>
                    {index < appointmentData.services.length - 1 && (
                      <Divider sx={{ my: 2 }} />
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Payment & Actions */}
          <Grid item xs={12} md={4}>
            {/* Payment Summary */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#1b4d69",
                    mb: 2,
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                  }}
                >
                  Payment Summary
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Subtotal
                    </Typography>
                    <Typography variant="body2">₹{appointmentData.subtotal}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Tax & Fees
                    </Typography>
                    <Typography variant="body2">₹{appointmentData.tax}</Typography>
                  </Box>
                  {appointmentData.discount > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Discount
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#28a745" }}>
                        -₹{appointmentData.discount}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold", color: "#333" }}>
                      Total Amount
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold", color: "#1b4d69" }}>
                      ₹{appointmentData.total}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                    Payment Method: {appointmentData.paymentMethod}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                    Payment Status: 
                    <Chip
                      label={appointmentData.paymentStatus}
                      size="small"
                      sx={{
                        ml: 1,
                        backgroundColor: "#d4edda",
                        color: "#155724",
                        fontSize: "0.7rem",
                      }}
                    />
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Booking Date: {appointmentData.bookingDate}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#1b4d69",
                    mb: 2,
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                  }}
                >
                  Quick Actions
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    sx={{
                      backgroundColor: "#1b4d69",
                      color: "white",
                      textTransform: "none",
                      fontWeight: "500",
                      "&:hover": {
                        backgroundColor: "#0f3a52",
                      },
                    }}
                  >
                    Print Invoice
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    sx={{
                      borderColor: "#1b4d69",
                      color: "#1b4d69",
                      textTransform: "none",
                      fontWeight: "500",
                      "&:hover": {
                        borderColor: "#0f3a52",
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    Download PDF
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<RescheduleIcon />}
                    sx={{
                      borderColor: "#8eabbb",
                      color: "#8eabbb",
                      textTransform: "none",
                      fontWeight: "500",
                      "&:hover": {
                        borderColor: "#6c8b9a",
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    Reschedule
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    sx={{
                      borderColor: "#dc3545",
                      color: "#dc3545",
                      textTransform: "none",
                      fontWeight: "500",
                      "&:hover": {
                        borderColor: "#c82333",
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    Cancel Appointment
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AppointmentHistoryDetail;

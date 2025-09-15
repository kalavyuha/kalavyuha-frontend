import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Button,
  Chip,
  Grid,
} from "@mui/material";
import { AccessTime as ClockIcon } from "@mui/icons-material";
import sample from "../../assets/image (9).png";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
// Import the test function to make it available
import "../../utils";

const AppointmentHistory = () => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const months = [
    "All Months",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    // Load appointments from localStorage
    const loadAppointments = () => {
      const storedAppointments = JSON.parse(localStorage.getItem("userAppointments") || "[]");
      setAppointments(storedAppointments);
    };

    loadAppointments();

    // Listen for storage changes to update appointments when new ones are added
    const handleStorageChange = () => {
      loadAppointments();
    };

    // Listen for new appointment events
    const handleNewAppointment = (event) => {
      loadAppointments(); // Reload appointments when a new one is added
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("appointmentAdded", handleNewAppointment);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("appointmentAdded", handleNewAppointment);
    };
  }, []);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleAppointmentDetailsClick = (appointment) => {
    navigate("/appointment-history-details", { state: { appointment } });
  };

  // Filter appointments by selected month
  const filteredAppointments = appointments.filter(appointment => {
    if (selectedMonth === "All Months") {
      return true;
    }
    const appointmentDate = new Date(appointment.SelectedDate);
    const monthName = appointmentDate.toLocaleString('default', { month: 'long' });
    return monthName === selectedMonth;
  });

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'confirmed':
        return { backgroundColor: "#d4edda", color: "#155724" };
      case 'pending':
        return { backgroundColor: "#fff3cd", color: "#856404" };
      case 'cancelled':
        return { backgroundColor: "#f8d7da", color: "#721c24" };
      default:
        return { backgroundColor: "#e2e3e5", color: "#383d41" };
    }
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
      <Box sx={{ margin: "0 auto", px: { xs: 2, sm: 6, md: 6, lg: 12 } }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 10,
            mb: 4,
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#333",
              fontSize: { xs: "1.4rem", md: "1.7rem" },
            }}
          >
            Appointment History
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={selectedMonth}
                onChange={handleMonthChange}
                renderValue={(value) => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ClockIcon sx={{ color: "#000", fontSize: "1rem" }} />
                    {value}
                  </Box>
                )}
                sx={{
                  backgroundColor: "#eaeef2",
                  borderRadius: 2,
                  height: 30,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#888",
                  },
                }}
              >
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Appointment Cards */}
        {filteredAppointments.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#666", mb: 2 }}
            >
              No appointments found for {selectedMonth}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#888" }}
            >
              Your booked appointments will appear here
            </Typography>
          </Box>
        ) : (
          filteredAppointments.map((appointment, index) => (
            <Box
              key={appointment.BookingId || index}
              sx={{
                border: "1px solid #999",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                mb: 3,
              }}
            >
              <Grid container sx={{ minHeight: 200 }}>
                {/* Left Section - 75% */}
                <Grid item xs={12} md={8} lg={8}>
                  <Box
                    sx={{
                      p: { xs: 2, md: 3 },
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 2, sm: 3 },
                    }}
                  >
                    {/* Image */}
                    <Box
                      sx={{
                        width: { xs: "100%", sm: 120, md: 150 },
                        height: { xs: 120, sm: 120, md: 150 },
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
                        alt="Business"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>

                    {/* Content */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        flex: 1,
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#333",
                          fontSize: { xs: "1.1rem", md: "1.52rem", lg: "1.85rem" },
                        }}
                      >
                        Business Appointment
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
                          fontSize: { xs: "0.9rem", md: "1rem" },
                        }}
                      >
                        Booking ID: #{appointment.BookingId}
                      </Typography>

                      <Chip
                        label={appointment.PaymentStatus || 'Pending'}
                        sx={{
                          ...getStatusColor(appointment.PaymentStatus),
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                          width: 'fit-content',
                          px: 2,
                          minWidth: 100,
                        }}
                      />
                      
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        {appointment.Services?.slice(0, 3).map((service, serviceIndex) => (
                          <Box
                            key={serviceIndex}
                            sx={{
                              border: "1px solid black",
                              minWidth: 100,
                              borderRadius: 4,
                              textAlign: "center",
                              p: 0.5,
                            }}
                          >
                            <Typography sx={{ fontSize: 13 }}>
                              {service.ServiceName}
                            </Typography>
                          </Box>
                        ))}
                        {appointment.Services?.length > 3 && (
                          <Box
                            sx={{
                              border: "1px solid black",
                              minWidth: 100,
                              borderRadius: 4,
                              textAlign: "center",
                              p: 0.5,
                            }}
                          >
                            <Typography sx={{ fontSize: 13 }}>
                              +{appointment.Services.length - 3} more
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                {/* Right Section - 25% */}
                <Grid item xs={12} md={4} lg={4}>
                  <Box
                    sx={{
                      backgroundColor: "#8eabbb",
                      height: "100%",
                      p: { xs: 2, md: 2 },
                      color: "white",
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      minWidth: "300px",
                    }}
                  >
                    {/* Appointment Details */}
                    <Box
                      sx={{ mb: 0, display: "flex", gap: 1, alignItems: "center" }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.8rem", color: "#555" }}
                      >
                        Appointment Date:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "0.8rem", color: "#000" }}
                      >
                        {formatDate(appointment.SelectedDate)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ mb: 0, display: "flex", gap: 1, alignItems: "center" }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.8rem", color: "#555" }}
                      >
                        Time:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "0.8rem", color: "#000" }}
                      >
                        {appointment.SelectedTime}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ mb: 0, display: "flex", gap: 1, alignItems: "center" }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.8rem", color: "#555" }}
                      >
                        Status:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "0.8rem", color: "#000" }}
                      >
                        {appointment.PaymentStatus || 'Pending'}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ mb: 1, display: "flex", gap: 1, alignItems: "center" }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.8rem", color: "#555" }}
                      >
                        Total Amount:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "0.8rem", color: "#000" }}
                      >
                        ₹{appointment.TotalPrice}
                      </Typography>
                    </Box>

                    {/* Action Buttons */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          justifyContent: "center",
                          mb: 1,
                          alignItems: "flex-start",
                          width: "50%",
                        }}
                      >
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleAppointmentDetailsClick(appointment)}
                          sx={{
                            textTransform: "none",
                            color: "#0a6b9e",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <EventNoteOutlinedIcon
                            sx={{ fontSize: "1rem", mr: 0.5 }}
                          />
                          Appointment Details
                        </Button>

                        <Button
                          variant="text"
                          size="small"
                          sx={{
                            textTransform: "none",
                            color: "#0a6b9e",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <ClockIcon sx={{ fontSize: "1rem", mr: 0.5 }} />
                          Reschedule
                        </Button>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          justifyContent: "center",
                          mb: 1,
                          alignItems: "flex-start",
                          width: "50%",
                        }}
                      >
                        <Button
                          variant="text"
                          size="small"
                          sx={{
                            textTransform: "none",
                            color: "#0a6b9e",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <LocalPrintshopOutlinedIcon
                            sx={{ fontSize: "1rem", mr: 0.5 }}
                          />
                          Download Bill
                        </Button>

                        <Button
                          variant="text"
                          size="small"
                          sx={{
                            textTransform: "none",
                            color: "#dc3545",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <EventBusyOutlinedIcon
                            sx={{ fontSize: "1rem", mr: 0.5 }}
                          />
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default AppointmentHistory;

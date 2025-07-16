import React, { useState } from "react";
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

const AppointmentHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState("January");
  const navigate = useNavigate();

  const months = [
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

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleAppointmentDetailsClick = () => {
    navigate("/appointment-history-details");
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

        {/* Appointment Card */}
        <Box
          sx={{
            // backgroundColor: '',
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
                  //   height: '100%',
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
                    alt="Batbox Cricket Nets"
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
                      // fontWeight: 'bold',
                      color: "#333",
                      fontSize: { xs: "1.1rem", md: "1.52rem", lg: "1.85rem" },
                    }}
                  >
                    Batbox | Indoor Cricket Nets
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    }}
                  >
                    Grab Mall, Sector 18, Chandigarh
                  </Typography>

                  <Chip
                    label='Pending'
                    sx={{
                      backgroundColor: "#fff3cd",
                      color: "#856404",
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                       width: 'fit-content',
                       px: 2,
                       minWidth: 100,
                    // mt: 1
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        border: "1px solid black",
                        minWidth: 100,
                        borderRadius: 4,
                        textAlign: "center",
                        p: 0.5,
                      }}
                    >
                      <Typography sx={{ fontSize: 13 }}>Hair cut</Typography>
                    </Box>
                    <Box
                      sx={{
                        border: "1px solid black",
                        minWidth: 100,
                        borderRadius: 4,
                        textAlign: "center",
                        p: 0.5,
                      }}
                    >
                      <Typography sx={{ fontSize: 13 }}>5 over plan</Typography>
                    </Box>
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
                    Dec 15, 2024
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
                    Pending
                  </Typography>
                </Box>

                <Box
                  sx={{ mb: 0, display: "flex", gap: 1, alignItems: "center" }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.8rem", color: "#555" }}
                  >
                    Appointment ID:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "0.8rem", color: "#000" }}
                  >
                    #APT123456
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
                    ₹1,500
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    // gap: 1,
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
                      onClick={handleAppointmentDetailsClick}
                      sx={{
                        textTransform: "none",
                        // backgroundColor: 'white',
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
                        // backgroundColor: 'rgba(255,255,255,0.2)',
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
                        // backgroundColor: 'white',
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
                      Print Invoice
                    </Button>

                    <Button
                      variant="text"
                      size="small"
                      sx={{
                        textTransform: "none",
                        // backgroundColor: 'rgba(255,255,255,0.2)',
                        color: "#0a6b9e",
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
      </Box>
    </Box>
  );
};

export default AppointmentHistory;

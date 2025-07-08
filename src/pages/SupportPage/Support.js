import React, { useState } from "react";
import {
  Box,
  Container,
  useMediaQuery,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
  Button,
  Collapse,
} from "@mui/material";

import FAQSection from "../BusniessPage/faqSection";


// responsive
import { useTheme } from "@mui/material/styles";

const Support = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedOption, setSelectedOption] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSendEmail = () => {
    // Handle email sending logic here
    console.log("Email:", email);
    console.log("Reason:", reason);
    console.log("Description:", description);
    // Add your email sending logic here
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#fff" }}>
      {/* Email Us Section */}
      <Box
        sx={{
          margin: "auto",
          paddingX: { xs: 2, sm: 3, md: 4 },
          // overflow: "hidden",
          minHeight: "45rem",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          maxWidth: { xs: "100%", sm: 600, md: 800 }, // Responsive max width
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: "bold",
            mt: { xs: 15, sm: 15, md: 15 },
            mb: { xs: 3, sm: 4, md: 4 },
            fontSize: { xs: "2.5rem", sm: "2rem", md: "2.5rem" },
            textAlign: "center",
          }}
        >
          Email Us
        </Typography>

        <Box sx={{ 
          maxWidth: { xs: "100%", sm: 450, md: 500 }, 
          width: "100%",
          mx: "auto",
          // px: { xs: 1, sm: 2 }
        }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              mb: { xs: 1, sm: 1.5 },
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
              textAlign: "left",
              fontWeight: 600,
            }}
          >
            How can we help?
          </Typography>

          <FormControl fullWidth>
            <Select
              labelId="help-select-label"
              id="help-select"
              value={selectedOption}
              onChange={handleSelectChange}
              displayEmpty
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                height: { xs: 45, sm: 40 },
                width: "100%",
                bgcolor: "#eaeef2",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              <MenuItem value="" disabled>
                Please Select
              </MenuItem>
              <MenuItem value="business-support">
                I already have a business account and need support
              </MenuItem>
              <MenuItem value="join-business">
                I'm interested in joining Kalavyuha as a business
              </MenuItem>
              <MenuItem value="appointment-booked">
                I booked an appointment with a business on Kalavyuha
              </MenuItem>
            </Select>
          </FormControl>

          {/* Business Support Form */}
          <Collapse in={selectedOption === "business-support"} timeout={500}>
            <Box sx={{ mt: { xs: 2, sm: 3 }, width: "100%" }}>
              {/* Email Field */}
              <Box sx={{ mb: { xs: 2, sm: 2 } }}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontWeight: 600,
                  }}
                >
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleEmailChange}
                  type="email"
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      height: { xs: 45, sm: 40 },
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    },
                  }}
                />
              </Box>

              {/* Reason for Contact */}
              <Box sx={{ mb: { xs: 2, sm: 2 } }}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontWeight: 600,
                  }}
                >
                  Reason for contacting support
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={reason}
                    onChange={handleReasonChange}
                    displayEmpty
                    sx={{
                      borderRadius: 2,
                      height: { xs: 45, sm: 40 },
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Please select a reason
                    </MenuItem>
                    <MenuItem value="account-issues">
                      Account login or access issues
                    </MenuItem>
                    <MenuItem value="payment-billing">
                      Payment and billing inquiries
                    </MenuItem>
                    <MenuItem value="technical-problems">
                      Technical problems with the platform
                    </MenuItem>
                    <MenuItem value="business-profile">
                      Business profile and listing updates
                    </MenuItem>
                    <MenuItem value="other-support">
                      Other support requests
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Description Field */}
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontWeight: 600,
                  }}
                >
                  Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Please describe your issue in detail..."
                  value={description}
                  onChange={handleDescriptionChange}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    },
                  }}
                />
              </Box>

              {/* Send Email Button */}
              <Button
                variant="contained"
                fullWidth
                onClick={handleSendEmail}
                disabled={!email || !reason || !description}
                sx={{
                  backgroundColor: "#1b4d69",
                  color: "white",
                  height: { xs: 48, sm: 45 },
                  borderRadius: 2,
                  fontWeight: 500,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#22424d",
                  },
                  "&:disabled": {
                    backgroundColor: "#ccc",
                  },
                }}
              >
                Send Email
              </Button>
            </Box>
          </Collapse>

          {/* Join Business Form */}
          <Collapse in={selectedOption === "join-business"} timeout={500}>
            <Box sx={{ 
              mt: { xs: 2, sm: 6 }, 
              width: "100%", 
              textAlign: "center",
              px: { xs: 1, sm: 0 }
            }}>
              {/* Main Heading */}
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: "bold",
                  mb: { xs: 2, sm: 2, md: 3 },
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                  color: "#1b4d69",
                  lineHeight: { xs: 1.3, sm: 1 },
                }}
              >
                Great! We are excited to help you.
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  mb: { xs: 3, sm: 4 },
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.15rem" },
                  fontWeight: 500,
                  color: "#555",
                  lineHeight: { xs: 1.2, sm: 1.3 },
                }}
              >
                Let's create a business account
              </Typography>

              {/* Register Business Button */}
              <Button
                variant="contained"
                fullWidth
                onClick={() => window.open('/kalavyuha-frontend/business-page', '_blank')}
                sx={{
                  backgroundColor: "#1b4d69",
                  color: "white",
                  height: { xs: 40, sm: 42, md: 45 },
                  borderRadius: 2,
                  fontWeight: 500,
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "0.9rem" },
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#22424d",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Register Your Business
              </Button>
            </Box>
          </Collapse>

          {/* Appointment Booked Form - Placeholder for future implementation */}
          <Collapse in={selectedOption === "appointment-booked"} timeout={500}>
            <Box sx={{ 
              mt: { xs: 2, sm: 3 }, 
              width: "100%", 
              textAlign: "center",
              px: { xs: 1, sm: 0 }
            }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: "bold",
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                  color: "#1b4d69",
                }}
              >
                We're here to help with your appointment!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: { xs: 3, sm: 4 },
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  color: "#555",
                }}
              >
                Please contact us directly for appointment-related inquiries.
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </Box>

      {/* section FAQ */}
       <Box sx={{ flexGrow: 1, backgroundColor: "#eaeef2" }}>
      <Container 
        style={{ maxWidth: "none" }} 
        sx={{ 
          mt: { xs: 3, sm: 4, md: 5 },
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Container 
          maxWidth="lg"
          sx={{ 
            px: { xs: 1, sm: 2, md: 3 }
          }}
        >
          <FAQSection />
        </Container>
      </Container>
      </Box>
    </Box>
  );
};

export default Support;

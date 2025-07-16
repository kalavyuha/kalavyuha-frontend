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
  Popper,
  Paper,
  Fade,
  ListItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { styled } from "@mui/system";

import FAQSection from "../BusniessPage/faqSection";


// responsive
import { useTheme } from "@mui/material/styles";

// Styled components for custom dropdown
const CustomDropdownButton = styled(Button)({
  color: "#333",
  textTransform: "none",
  fontSize: "1rem",
  borderRadius: "8px",
  padding: "12px 16px",
  backgroundColor: "#eaeef2",
  border: "1px solid #ddd",
  width: "100%",
  justifyContent: "space-between",
  "&:hover": {
    backgroundColor: "#ddd",
  },
});

const DropdownItem = styled(ListItem)({
  padding: "12px 16px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
});

const Support = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedOption, setSelectedOption] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  
  // Join business form states
  const [joinBusinessEmail, setJoinBusinessEmail] = useState("");
  const [joinBusinessQuery, setJoinBusinessQuery] = useState("");
  const [joinBusinessScreenshot, setJoinBusinessScreenshot] = useState(null);
  
  // Dropdown state
  const [anchorEl, setAnchorEl] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  
  const open = Boolean(anchorEl);
  
  const dropdownOptions = [
    { value: "business-support", label: "I already have a business account and need support" },
    { value: "join-business", label: "Having difficulty in joining Kalavyuha as a business" },
    { value: "appointment-booked", label: "I booked an appointment with a business on Kalavyuha" },
  ];
  
  const getSelectedLabel = () => {
    const option = dropdownOptions.find(opt => opt.value === selectedOption);
    return option ? option.label : "Please Select";
  };

  const handleClick = (event) => {
    if (open) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleOptionSelect = (value) => {
    setSelectedOption(value);
    setAnchorEl(null);
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

  const handleJoinBusinessEmailChange = (event) => {
    setJoinBusinessEmail(event.target.value);
  };

  const handleJoinBusinessQueryChange = (event) => {
    setJoinBusinessQuery(event.target.value);
  };

  const handleScreenshotUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setJoinBusinessScreenshot(file);
    }
  };

  const handleJoinBusinessSubmit = () => {
    // Handle join business form submission
    console.log("Join Business Email:", joinBusinessEmail);
    console.log("Join Business Query:", joinBusinessQuery);
    console.log("Screenshot:", joinBusinessScreenshot);
    // Add your email sending logic here
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#eaeef2" }}>
      {/* Email Us Section */}
      <Box
        sx={{
          margin: "auto",
          paddingX: { xs: 3, sm: 3, md: 4 },
          // overflow: "hidden",
          minHeight: "20rem",
          // alignItems: "center",
          display: "flex",
          flexDirection: {xs:"column", md:"row"},
          maxWidth: { xs: "100%", sm: 600, md: 800 }, // Responsive max width
        }}
      >
        <Box>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: "bold",
            mt: { xs: 15, sm: 15, md: 15 },
            mb: { xs: 3, sm: 4, md: 4 },
            fontSize: { xs: "2.5rem", sm: "2rem", md: "2.5rem" },
            // textAlign: "center",
          }}
        >
          Email Us
        </Typography>
          </Box>

        <Box sx={{ 
           mt: { xs: 2, sm: 2, md: 15 },
          maxWidth: { xs: "100%", sm: 450, md: 500 }, 
          width: "100%",
          mx: "auto",
          px: { xs: 0, sm: 2 }
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

          <Box sx={{ position: "relative", width: "100%" }}>
            <CustomDropdownButton
              endIcon={<KeyboardArrowDownIcon />}
              onClick={handleClick}
              sx={{
                height: { xs: 45, sm: 40 },
                fontSize: { xs: "0.7rem", sm: "1rem" },
                color: selectedOption ? "#333" : "#999",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {getSelectedLabel()}
            </CustomDropdownButton>

            <Popper
              open={open}
              anchorEl={anchorEl}
              placement="bottom-start"
              transition
              sx={{ zIndex: 1300, width: anchorEl ? anchorEl.clientWidth : "auto" }}
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={200}>
                  <Paper
                    sx={{
                      mt: 1,
                      borderRadius: "8px",
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                      minWidth: anchorEl ? anchorEl.clientWidth : "200px",
                      maxWidth: "500px",
                    }}
                  >
                    {dropdownOptions.map((option) => (
                      <DropdownItem
                        key={option.value}
                        onClick={() => handleOptionSelect(option.value)}
                        sx={{
                          color: "#333",
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                        }}
                      >
                        {option.label}
                      </DropdownItem>
                    ))}
                  </Paper>
                </Fade>
              )}
            </Popper>
          </Box>

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
            <Box sx={{ mt: { xs: 2, sm: 3 }, width: "100%" }}>
              {/* Title */}
              {/* <Typography
                variant="h5"
                component="h2"
                sx={{
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                  color: "#1b4d69",
                  fontWeight: "bold",
                }}
              >
                We are here to help you join Kalavyuha
              </Typography> */}

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
                  value={joinBusinessEmail}
                  onChange={handleJoinBusinessEmailChange}
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

              {/* Query Field */}
              <Box sx={{ mb: { xs: 2, sm: 2 } }}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontWeight: 600,
                  }}
                >
                  Query
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Please describe your difficulty in joining Kalavyuha as a business..."
                  value={joinBusinessQuery}
                  onChange={handleJoinBusinessQueryChange}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    },
                  }}
                />
              </Box>

              {/* Screenshot Upload */}
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontWeight: 600,
                  }}
                >
                  Screenshot
                </Typography>
                <Box
                  sx={{
                    border: "2px dashed #ddd",
                    borderRadius: 2,
                    padding: { xs: 2, sm: 3 },
                    textAlign: "center",
                    backgroundColor: "#f0f4f8",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#1b4d69",
                      backgroundColor: "#f9f9f9",
                    },
                  }}
                  onClick={() => document.getElementById('screenshot-upload').click()}
                >
                  <input
                    id="screenshot-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    style={{ display: "none" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: joinBusinessScreenshot ? "#1b4d69" : "#666",
                      fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    }}
                  >
                    {joinBusinessScreenshot 
                      ? `Selected: ${joinBusinessScreenshot.name}`
                      : "Click to upload a screenshot or drag and drop"
                    }
                  </Typography>
                </Box>
              </Box>

              {/* Send Email Button */}
              <Button
                variant="contained"
                fullWidth
                onClick={handleJoinBusinessSubmit}
                disabled={!joinBusinessEmail || !joinBusinessQuery}
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

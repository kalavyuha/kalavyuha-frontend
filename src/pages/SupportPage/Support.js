import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { styled } from "@mui/system";

import FAQSection from "../BusniessPage/faqSection";
import LoginPage from "../Auth/Login";
import Signup from "../Auth/Signup";
import { useAuth } from "../../Context/AuthContext";

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
  const { isAuthenticated, user: authUser, login } = useAuth();
  
  const [selectedOption, setSelectedOption] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  // Join business form states
  const [joinBusinessEmail, setJoinBusinessEmail] = useState("");
  const [joinBusinessQuery, setJoinBusinessQuery] = useState("");
  const [joinBusinessScreenshot, setJoinBusinessScreenshot] = useState(null);

  // Loading and alert states
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

  // Authentication states
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  // Dropdown state
  const [anchorEl, setAnchorEl] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const open = Boolean(anchorEl);

  // Update email fields when user changes
  useEffect(() => {
    if (authUser && (authUser.Email || authUser.email)) {
      setEmail(authUser.Email || authUser.email);
      setJoinBusinessEmail(authUser.Email || authUser.email);
    }
  }, [authUser]);

  // Function to check if user is authenticated
  const checkAuthentication = () => {
    if (!isAuthenticated || !authUser) {
      setLoginOpen(true);
      return false;
    }
    return true;
  };

  const dropdownOptions = [
    {
      value: "business-support",
      label: "I already have a business account and need support",
    },
    {
      value: "join-business",
      label: "Having difficulty in joining Kalavyuha as a business",
    },
    {
      value: "appointment-booked",
      label: "I booked an appointment with a business on Kalavyuha",
    },
  ];

  const getSelectedLabel = () => {
    const option = dropdownOptions.find((opt) => opt.value === selectedOption);
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

  // Function to upload image and get URL
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // You'll need to replace this with your actual image upload endpoint
      const response = await fetch('YOUR_IMAGE_UPLOAD_ENDPOINT', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const result = await response.json();
      return result.imageUrl; // Adjust based on your API response structure
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Function to submit support request
  const submitSupportRequest = async (requestData) => {
    try {
      const response = await fetch('https://api.slotwel.in/api/v1/HelpSupportService/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit support request');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting support request:', error);
      throw error;
    }
  };

  const handleSendEmail = async () => {
    // Check authentication first
    if (!checkAuthentication()) {
      return;
    }

    setIsLoading(true);
    setAlert({ show: false, type: 'success', message: '' });

    try {
      const requestData = {
        UserType: "merchant",
        Name: authUser.Name || authUser.PhoneNumber || "Unknown User",
        Email: email,
        PhoneNumber: authUser.PhoneNumber || "",
        Subject: reason,
        Description: description,
        ImageUrl: "", // No image for business support form
        Category: "Business Support",
        CreatedBy: authUser._id || authUser.id || 0
      };

      await submitSupportRequest(requestData);
      
      setAlert({ 
        show: true, 
        type: 'success', 
        message: 'Support request submitted successfully!' 
      });
      
      // Auto-hide success alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, type: 'success', message: '' });
      }, 3000);
      
      // Reset form
      setEmail("");
      setReason("");
      setDescription("");
      
    } catch (error) {
      setAlert({ 
        show: true, 
        type: 'error', 
        message: 'Failed to submit support request. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
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

  // Authentication modal handlers
  const handleUserAction = (userData) => {
    login(userData); // Use AuthContext login method
    // Update email fields with user's email if available
    if (userData.Email || userData.email) {
      setEmail(userData.Email || userData.email);
      setJoinBusinessEmail(userData.Email || userData.email);
    }
    // Close auth modals
    setLoginOpen(false);
    setSignupOpen(false);
  };

  const handleCloseAuthModals = () => {
    setLoginOpen(false);
    setSignupOpen(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseAuthModals();
    }
  };

  // Lock body scroll when modals are open
  useEffect(() => {
    if (loginOpen || signupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loginOpen, signupOpen]);

  const handleJoinBusinessSubmit = async () => {
    // Check authentication first
    if (!checkAuthentication()) {
      return;
    }

    setIsLoading(true);
    setAlert({ show: false, type: 'success', message: '' });

    try {
      let imageUrl = "";
      
      // Upload image if provided
      if (joinBusinessScreenshot) {
        imageUrl = await uploadImage(joinBusinessScreenshot);
      }

      const requestData = {
        UserType: "merchant",
        Name: authUser.Name || authUser.PhoneNumber || "Unknown User",
        Email: joinBusinessEmail,
        PhoneNumber: authUser.PhoneNumber || "",
        Subject: "Difficulty in joining Kalavyuha as a business",
        Description: joinBusinessQuery,
        ImageUrl: imageUrl,
        Category: "Join Business",
        CreatedBy: authUser._id || authUser.id || 0
      };

      await submitSupportRequest(requestData);
      
      setAlert({ 
        show: true, 
        type: 'success', 
        message: 'Support request submitted successfully!' 
      });
      
      // Auto-hide success alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, type: 'success', message: '' });
      }, 3000);
      
      // Reset form
      setJoinBusinessEmail("");
      setJoinBusinessQuery("");
      setJoinBusinessScreenshot(null);
      
    } catch (error) {
      setAlert({ 
        show: true, 
        type: 'error', 
        message: 'Failed to submit support request. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#eaeef2" }}>
      {/* Email Us Section */}
      <Container
        style={{ maxWidth: "none" }}
        sx={{
          mt: { xs: 3, sm: 4, md: 5 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <Box sx={{ margin: 'auto', padding: { xs: 2, md: 4 }, overflow: 'hidden' }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                  }}
                >
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: "bold",
                      mt: { xs: 15, sm: 15, md: 15 },
                      mb: { xs: 2, sm: 2, md: 4 },
                      fontSize: { xs: "2rem", sm: "2rem", md: "2.5rem" },
                      textAlign: "left",
                    }}
                  >
                    Email Us
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <Box
                  sx={{
                    mt: { xs: 2, sm: 2, md: 15 },
                    width: "100%",
                    alignItems:"flex-start"
                  }}
                >
              {/* Alert Message */}
              {alert.show && (
                <Alert 
                  severity={alert.type} 
                  sx={{ mb: 2 }}
                  onClose={() => setAlert({ show: false, type: 'success', message: '' })}
                >
                  {alert.message}
                </Alert>
              )}

              {/* User Status - Only show if not logged in */}
              {/* {!user && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  You need to be logged in to submit support requests.{" "}
                  <Button
                    size="small"
                    onClick={() => setSignupOpen(true)}
                    sx={{ textTransform: "none", ml: 1 }}
                  >
                    Sign Up / Login
                  </Button>
                </Alert>
              )} */}

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
                  sx={{
                    zIndex: 1300,
                    width: anchorEl ? anchorEl.clientWidth : "auto",
                  }}
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
              <Collapse
                in={selectedOption === "business-support"}
                timeout={500}
              >
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
                    disabled={!email || !reason || !description || isLoading}
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
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Send Email"
                    )}
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
                      onClick={() =>
                        document.getElementById("screenshot-upload").click()
                      }
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
                          : "Click to upload a screenshot or drag and drop"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Send Email Button */}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleJoinBusinessSubmit}
                    disabled={!joinBusinessEmail || !joinBusinessQuery || isLoading}
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
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Send Email"
                    )}
                  </Button>
                </Box>
              </Collapse>

              {/* Appointment Booked Form - Placeholder for future implementation */}
              <Collapse
                in={selectedOption === "appointment-booked"}
                timeout={500}
              >
                <Box
                  sx={{
                    mt: { xs: 2, sm: 3 },
                    width: "100%",
                    textAlign: "center",
                    px: { xs: 1, sm: 0 },
                  }}
                >
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
                    Please contact us directly for appointment-related
                    inquiries.
                  </Typography>
                </Box>
              </Collapse>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Container>

      {/* section FAQ */}
      <Box sx={{ flexGrow: 1, backgroundColor: "#eaeef2" }}>
        <Container
          style={{ maxWidth: "none" }}
          sx={{
            mt: { xs: 3, sm: 4, md: 5 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              px: { xs: 1, sm: 2, md: 3 },
            }}
          >
            <FAQSection />
          </Container>
        </Container>
      </Box>

      {/* Authentication Modals - Navbar Style */}
      {(loginOpen || signupOpen) && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
          }}
          onClick={handleBackdropClick}
        >
          <Box
            sx={{
              position: "relative",
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              minWidth: "300px",
              background: "transparent",
              zIndex: 1500,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {signupOpen && (
              <Signup
                setLoginOpen={setLoginOpen}
                setSignupOpen={setSignupOpen}
                setUserAction={handleUserAction}
              />
            )}

            {loginOpen && (
              <LoginPage
                setLoginOpen={setLoginOpen}
                setSignupOpen={setSignupOpen}
                setUserAction={handleUserAction}
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Support;

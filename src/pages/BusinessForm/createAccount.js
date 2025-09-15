import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  Divider,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { constant } from "../../constant.js";

import LeftPanel from "./components/leftpanel.js";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1b4d69",
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    h4: {
      fontSize: "1.75rem",
      "@media (max-width:600px)": {
        fontSize: "1.5rem",
      },
      "@media (max-width:480px)": {
        fontSize: "1.25rem",
      },
    },
    subtitle1: {
      fontSize: "1rem",
      "@media (max-width:600px)": {
        fontSize: "0.9rem",
      },
      "@media (max-width:480px)": {
        fontSize: "0.8rem",
      },
    },
    body2: {
      fontSize: "0.875rem",
      "@media (max-width:480px)": {
        fontSize: "0.8rem",
      },
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            height: "56px",
            "@media (max-width:600px)": {
              height: "52px",
            },
            "@media (max-width:480px)": {
              height: "48px",
            },
          },
          "& .MuiInputBase-input": {
            fontSize: "1rem",
            "@media (max-width:600px)": {
              fontSize: "0.9rem",
            },
            "@media (max-width:480px)": {
              fontSize: "0.85rem",
            },
          },
          "& .MuiInputLabel-root": {
            fontSize: "1rem",
            "@media (max-width:600px)": {
              fontSize: "0.9rem",
            },
            "@media (max-width:480px)": {
              fontSize: "0.85rem",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          height: "56px",
          "@media (max-width:600px)": {
            height: "52px",
          },
          "@media (max-width:480px)": {
            height: "48px",
          },
          "& .MuiSelect-select": {
            fontSize: "1rem",
            "@media (max-width:600px)": {
              fontSize: "0.9rem",
            },
            "@media (max-width:480px)": {
              fontSize: "0.85rem",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          padding: "12px 16px",
          "@media (max-width:600px)": {
            fontSize: "0.9rem",
            padding: "10px 14px",
          },
          "@media (max-width:480px)": {
            fontSize: "0.85rem",
            padding: "8px 12px",
          },
        },
      },
    },
  },
});

export default function CreateBusniessAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    password: "",
    agreeTerms: false,
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    phone: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone number validation function
  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;

    // Validate email if the email field is being changed
    if (name === "email") {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email:
          value && !validateEmail(value)
            ? "Please enter a valid email address"
            : "",
      }));
    }

    // Validate phone number if the phone field is being changed
    if (name === "phone") {
      // Only allow numeric input
      const numericValue = value.replace(/\D/g, "");

      // Limit to 10 digits
      const limitedValue = numericValue.slice(0, 10);

      setFormErrors((prevErrors) => ({
        ...prevErrors,
        phone:
          limitedValue && !validatePhone(limitedValue)
            ? "Phone number must be exactly 10 digits"
            : "",
      }));

      // Update with the cleaned numeric value
      setFormData((prevData) => {
        const updatedData = {
          ...prevData,
          [name]: limitedValue,
        };
        localStorage.setItem("formData", JSON.stringify(updatedData));
        return updatedData;
      });
      return; // Exit early for phone number handling
    }

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: name === "agreeTerms" ? checked : value,
      };
      localStorage.setItem("formData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  useEffect(() => {
    const isValidEmail = formData.email ? validateEmail(formData.email) : true; // Allow empty email but validate if present
    const isValidPhone = formData.phone ? validatePhone(formData.phone) : false; // Phone is required
    const isValid =
      formData.firstName &&
      formData.lastName &&
      formData.phone &&
      formData.password &&
      formData.agreeTerms &&
      isValidEmail &&
      isValidPhone &&
      !formErrors.email &&
      !formErrors.phone;

    setIsFormValid(isValid);
  }, [formData, formErrors]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate email before submission
    if (formData.email && !validateEmail(formData.email)) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email address",
      }));
      return;
    }

    // Validate phone before submission
    if (!formData.phone || !validatePhone(formData.phone)) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        phone: "Phone number must be exactly 10 digits",
      }));
      return;
    }

    const optSendUrl = `${constant.baseUrl}api/v1/otp/send/`;

    try {
      const response = await fetch(optSendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          PhoneNumber: `${formData.countryCode}${formData.phone}`,
          UserType: "merchant",
        }),
      });

      if (response.status === 200) {
        navigate("/otp-verification", { state: formData });
      } else {
        throw new Error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while sending the OTP.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          overflow: "hidden",
          display: "flex",
          bgcolor: "background.default",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            display: "flex",
            flexGrow: 1,
            px: { xs: 1, sm: 2, md: 0 },
          }}
        >
          <Grid container sx={{ width: "100%" }}>
            {/* Left Panel */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                order: { xs: 1, md: 1 },
                minHeight: { xs: "auto", md: "100vh" },
              }}
            >
              <LeftPanel
                firstName={formData.firstName}
                lastName={formData.lastName}
                email={formData.email}
                countryCode={formData.countryCode}
                phone={formData.phone}
              />
            </Grid>

            {/* Right Panel - Form */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: { xs: "auto", md: "100vh" },
                py: { xs: 2, sm: 4, md: 8 },
                px: { xs: 2, sm: 4, md: 6 },
                order: { xs: 2, md: 2 },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: { xs: "100%", sm: "500px", md: "450px" },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{
                    mb: { xs: 1, sm: 2 },
                    fontWeight: "bold",
                    color: "#1b4d69",
                    textAlign: "center",
                  }}
                >
                  Create an Account :)
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: { xs: 2, sm: 3 },
                    textAlign: "center",
                    px: { xs: 1, sm: 0 },
                  }}
                >
                  Let's get started your 90 days free trial
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{
                    width: "100%",
                    mt: { xs: 1, sm: 2 },
                  }}
                >
                  <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="firstName"
                        required
                        fullWidth
                        label="First Name"
                        autoFocus
                        value={formData.firstName}
                        onChange={handleChange}
                        sx={{
                          borderRadius: "10px",
                          borderColor: "#d9d9d9",
                          background: "#fbfbfb",
                        }}
                        InputProps={{
                          style: {
                            borderRadius: "10px",
                            background: "#fbfbfb",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="lastName"
                        required
                        fullWidth
                        label="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        sx={{
                          borderRadius: "10px",
                          borderColor: "#d9d9d9",
                          background: "#fbfbfb",
                        }}
                        InputProps={{
                          style: {
                            borderRadius: "10px",
                            background: "#fbfbfb",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        sx={{
                          borderRadius: "10px",
                          borderColor: "#d9d9d9",
                          background: "#fbfbfb",
                        }}
                        InputProps={{
                          style: {
                            borderRadius: "10px",
                            background: "#fbfbfb",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={{ xs: 0.5, sm: 1 }}>
                        <Grid item xs={3.5} sm={3}>
                          <Select
                            value={formData.countryCode}
                            onChange={handleChange}
                            fullWidth
                            name="countryCode"
                            sx={{
                              borderRadius: "10px",
                              borderColor: "#d9d9d9",
                              background: "#fbfbfb",
                            }}
                          >
                            <MenuItem value="+91">+91</MenuItem>
                            <MenuItem value="+1">+1</MenuItem>
                            <MenuItem value="+44">+44</MenuItem>
                          </Select>
                        </Grid>
                        <Grid item xs={8.5} sm={9}>
                          <TextField
                            required
                            fullWidth
                            name="phone"
                            label="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            error={!!formErrors.phone}
                            helperText={formErrors.phone}
                            inputProps={{
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                              maxLength: 10,
                            }}
                            sx={{
                              borderRadius: "10px",
                              borderColor: "#d9d9d9",
                              background: "#fbfbfb",
                            }}
                            InputProps={{
                              style: {
                                borderRadius: "10px",
                                background: "#fbfbfb",
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sx={{ my: 0, mx: { xs: 0.5, sm: 1 }, py: 0 }}
                    >
                      <Typography
                        sx={{
                          m: 0,
                          p: 0,
                          fontSize: { xs: 11, sm: 12 },
                          lineHeight: 1.3,
                        }}
                      >
                        We will send a verification code to{" "}
                        <b>
                          {formData.countryCode}{" "}
                          {formData.phone || "- - - - - - - - - -"}
                        </b>
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        sx={{
                          borderRadius: "10px",
                          borderColor: "#d9d9d9",
                          background: "#fbfbfb",
                        }}
                        InputProps={{
                          style: {
                            borderRadius: "10px",
                            background: "#fbfbfb",
                          },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                sx={{
                                  mx: "2px",
                                  p: { xs: 1, sm: 1.5 },
                                }}
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            color="primary"
                            sx={{
                              p: { xs: 0.2, sm: 1 },
                            }}
                          />
                        }
                        label={
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: "0.65rem", sm: "0.875rem" },
                              lineHeight: 1.4,
                            }}
                          >
                            I agree to the{" "}
                            <Link
                              href="/kalavyuha-frontend/terms&conditions"
                              underline="always"
                            >
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/kalavyuha-frontend/privacy" underline="always">
                              Privacy Policy
                            </Link>
                          </Typography>
                        }
                        sx={{
                          alignItems: "center",
                          ml: 0,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: { xs: 2, sm: 3 },
                      mb: 2,
                      bgcolor: "#1b4d69",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      height: { xs: "44px", sm: "48px", md: "52px" },
                      fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                      "&:hover": { bgcolor: "#17394d" },
                    }}
                    disabled={!isFormValid}
                  >
                    Create Account
                  </Button>

                  <Divider sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: "bold",
                        color: "gray",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      or
                    </Typography>
                  </Divider>

                  {/* <Button fullWidth
                    startIcon={<Box component="img" src={GoogleG} sx={{ width: 20, height: 20 }} />}
                    variant="outlined"
                    sx={{
                      mb: 2, textTransform: "capitalize", fontWeight: "bold", padding: 1.2,
                    }}
                  >
                    Sign Up with Google
                  </Button> */}

                  <Grid container justifyContent="center">
                    <Grid item>
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: "center",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Already have an account?&nbsp;
                        <Link
                          href="/kalavyuha-frontend/login-business"
                          underline="always"
                          sx={{
                            color: "#1b4d69",
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          Login
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

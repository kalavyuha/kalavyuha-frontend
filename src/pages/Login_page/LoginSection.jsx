import {
  Grid2,
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  Button,
  Divider,
  Stack,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Link,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { assets } from "../../assets/images/assets";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { constant } from "../../constant";
// import { ENDPOINTS } from "../../constants/apiHandling";

const LoginSection = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  // const [showOtpOptions, setShowOtpOptions] = useState(false);
  // const [otpOption, setOtpOption] = useState("phone");
  // const [showOtpVerify, setShowOtpVerify] = useState(false);
  // const [otp, setOtp] = useState(["", "", "", ""]);
  // const [timer, setTimer] = useState(60);
  // const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode] = useState("+91");
  // const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [merchantId, setMerchantId] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // const handleOtpChange = (e, idx) => {
  //   const value = e.target.value.replace(/[^0-9]/g, "");
  //   if (value.length > 1) return;
  //   const newOtp = [...otp];
  //   newOtp[idx] = value;
  //   setOtp(newOtp);

  //   // Move to next input if value entered
  //   if (value && idx < 3) {
  //     document.getElementById(`otp-input-${idx + 1}`).focus();
  //   }
  //   // Move to previous input if value deleted
  //   if (!value && idx > 0) {
  //     document.getElementById(`otp-input-${idx - 1}`).focus();
  //   }
  // };

  // useEffect(() => {
  //   let interval;
  //   if (showOtpVerify && timer > 0) {
  //     // Changed from step === 2 to showOtpVerify
  //     interval = setInterval(() => {
  //       setTimer((prev) => prev - 1);
  //     }, 1000);
  //   }
  //   return () => clearInterval(interval);
  // }, [showOtpVerify, timer]);

  // const maskEmail = (email) => {
  //   const [username, domain] = email.split("@");
  //   const maskedUsername =
  //     username[0] +
  //     "*".repeat(username.length - 2) +
  //     username[username.length - 1];
  //   return `${maskedUsername}@${domain}`;
  // };

  const maskPhone = (phone) => {
    return phone.replace(/(\+\d{2} )(\d{2})(\d{4})(\d{4})/, "$1**-****-$4");
  };

  // const validateEmail = (email) => {
  //   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return regex.test(email);
  // };

  const validatePhone = (phone) => {
    const phoneNumber = phone.replace("+91 ", "");
    return phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);
  };

  const handleLogin = async () => {
    try {
      const formattedPhone = phone.replace(/\s/g, "");
      const response = await fetch(
        `${constant.baseUrl}/api/v1/BussinessMember/member/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            PhoneNumber: formattedPhone,
            Password: password,
          }),
        }
      );
      const data = await response.json();
      setMerchantId(data.Data?.MerchantId); // Use correct path for ID
      if (response.ok && data.Status === 1) {
        setSnackbar({
          open: true,
          message: data.Message || "Login successful!",
          severity: "success",
        });
        setTimeout(() => {
          window.location.replace(`http://localhost:3001/?id=${data.Data?.MerchantId}`);
        }, 1200);
      } else {
        setSnackbar({
          open: true,
          message: data.Message || "Failed to authenticate, please retry.",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Network error, please try again.",
        severity: "error",
      });
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Grid2 item size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // bgcolor: "red",
          }}
        >
          {/* LOGIN PAGE */}
          {/* {!showOtpOptions && !showOtpVerify && ( */}
          <>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 2,
                fontWeight: "bold",
                color: "#1b4d69",
                fontSize: { xs: 20, sm: 26, md: 32 },
              }}
            >
              Login to Kalavyuha
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", mt: 4 }}
              component="form"
              noValidate
            >
              {/* <TextField
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(!validateEmail(e.target.value));
                  }}
                  fullWidth
                  error={emailError}
                  sx={{
                    width: { xs: "290px", sm: "400px" },
                    bgcolor: "white",
                    border: "none",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: emailError ? "red" : "rgba(0, 0, 0, 0.23)",
                      },
                      "&:hover fieldset": {
                        borderColor: emailError ? "red" : "rgba(0, 0, 0, 0.23)",
                      },
                    },
                  }}
                  InputProps={{
                    sx: {
                      height: 36,
                      padding: 0,
                      fontSize: 16,
                      border: "white",
                    },
                    style: {
                      // borderRadius: "10px",
                      background: "#fbfbfb",
                    },
                  }}
                /> */}
              <TextField
                type="text"
                label="Phone Number"
                // placeholder="Phone Number"
                value={phone}
                onChange={(e) => {
                  let input = e.target.value;
                  if (!input.startsWith("+91 ")) {
                    input = "+91 " + input;
                  }
                  // Remove any non-digit characters after the prefix
                  const phoneNumber = input.slice(4).replace(/\D/g, "");
                  // Limit to 10 digits
                  const trimmedPhoneNumber = phoneNumber.slice(0, 10);
                  const formattedInput = "+91 " + trimmedPhoneNumber;
                  setPhone(formattedInput);
                  setPhoneError(!validatePhone(formattedInput));
                }}
                fullWidth
                error={phoneError}
                sx={{
                  width: { xs: "290px", sm: "400px" },
                  bgcolor: "white",
                  border: "none",
                  borderRadius: 4,
                  mt: 3,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: phoneError ? "red" : "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover fieldset": {
                      borderColor: phoneError ? "red" : "rgba(0, 0, 0, 0.23)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: phoneError ? "red" : "#1b4d69",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    "&.Mui-focused": {
                      color: phoneError ? "red" : "#1b4d69",
                    },
                  },
                }}
                InputProps={{
                  sx: {
                    height: 50,
                    padding: 0,
                    fontSize: 16,
                    border: "none",
                    borderRadius: 2.5,
                  },
                  style: {
                    // borderRadius: "10px",
                    background: "#fbfbfb",
                  },
                }}
              />

              {/* <Typography
                sx={{
                  mt: 3,
                  ml: 1,
                  p: 0,
                  fontSize: { xs: 11, sm: 12 },
                  lineHeight: 1.3,
                }}
              >
                We will send a verification code to{" "}
                <b>
                  {countryCode}{" "}
                  {phone.replace("+91 ", "") || "- - - - - - - - - -"}
                </b>
              </Typography> */}

              <TextField
                type={showPassword ? "text" : "password"}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                sx={{
                  width: { xs: "290px", sm: "400px" },
                  bgcolor: "white",
                  // border: "1px solid rgba(0, 0, 0, 0.23)",
                  // borderRadius: 2.5,
                  mt: 3,
                  "& .MuiOutlinedInput-root": {
                    background: "#fbfbfb",
                    borderRadius: 2.5,
                    "&.Mui-focused fieldset": {
                      borderColor: "#1b4d69",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    "&.Mui-focused": {
                      color: "#1b4d69",
                    },
                  },
                }}
                InputProps={{
                  sx: {
                    height: 50,
                    paddingRight: 2,
                    fontSize: 16,
                    borderRadius: 2.5,
                    marginBottom: 2,
                    border: "none",
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        sx={{
                          color: "#666",
                          // "&:hover": {
                          //   color: "#1b4d69",
                          // },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    color="primary"
                    sx={{
                      p: { xs: 0.2, sm: 1 },
                      "&.Mui-checked": {
                        color: "#1b4d69",
                      },
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
                      color="#1b4d69"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/kalavyuha-frontend/privacy" underline="always" color="#1b4d69">
                      Privacy Policy
                    </Link>
                  </Typography>
                }
                sx={{
                  alignItems: "center",
                  ml: 0,
                }}
              />

              <Button
                sx={{
                  bgcolor: "#1b4d69",
                  color: "white",
                  mt: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  height: { xs: "44px", sm: "48px", md: "52px" },
                  fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                  borderRadius: 1,
                  "&:disabled": {
                    bgcolor: "#e0e0e0",
                  },
                }}
                disabled={!phone || !password || !agreeTerms}
                // disabled={!email || !phone || !password}
                // onClick={() => setShowOtpOptions(true)}
                //  onClick={() => navigate("/")}
                onClick={handleLogin}
              >
                Log In
              </Button>
              <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <MuiAlert
                  elevation={6}
                  variant="filled"
                  severity={snackbar.severity}
                  sx={{ width: "100%" }}
                >
                  {snackbar.message}
                </MuiAlert>
              </Snackbar>
              <Divider sx={{ mb: 1, mt: 3 }}>
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
              <Box
                sx={{
                  width: { xs: "290px", sm: "400px" },
                  height: 40,
                  // mt: 2,
                  justifyContent: "space-between",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Stack direction={"row"} gap={0.5}>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    Don't have an account?&nbsp;
                    <Link
                      href="/kalavyuha-frontend/business/account"
                      underline="always"
                      sx={{
                        color: "#1b4d69",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      Sign-Up
                    </Link>
                  </Typography>
                 
                </Stack>
                <Typography
                  sx={{
                   fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    textDecoration: "underline",
                    // fontWeight: 600,
                    cursor: "pointer",
                    color: "#1b4d69",
                  }}
                  onClick={onForgotPassword}
                >
                  Forgot Password?
                </Typography>
              </Box>
             
            </Box>
          </>
        

          {/* OTP OPTION PAGE */}
          {/* {showOtpOptions && !showOtpVerify && (
            <>
              <Typography
                component="h1"
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: "bold",
                  color: "#1b4d69",
                  fontSize: { xs: 18, sm: 22, md: 28 },
                  textAlign: "center",
                }}
              >
                Select an option for OTP
              </Typography>
              <Box
                sx={{
                  width: { xs: "290px", sm: "400px" },
                  bgcolor: "white",
                  borderRadius: 2,
                  mt: 3,
                  // p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    width: "100%",
                    mt: 3,
                  }}
                >
                 
                  <Box sx={{ display: "flex" }}>
                    <input
                      type="radio"
                      value="email"
                      checked={otpOption === "email"}
                      onChange={() => setOtpOption("email")}
                      style={{ marginRight: 8 }}
                    />
                    
                    <Typography>Email</Typography>
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    <input
                      type="radio"
                      value="phone"
                      checked={otpOption === "phone"}
                      onChange={() => setOtpOption("phone")}
                      style={{ marginRight: 8 }}
                    />
                    <Typography>Phone Number</Typography>
                  </Box>
                </Box>
                <Typography sx={{ mt: 1, fontSize: 13, color: "grey" }}>
                  We will send a verification code to
                </Typography>
                <Typography sx={{ mt: 1, fontSize: 16, color: "black" }}>
                  {otpOption === "email" ? maskEmail(email) : maskPhone(phone)}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    width: "80%",
                    gap: 2,
                    marginBottom: 4,
                    mt: 2,
                  }}
                >
                  <Button
                    sx={{
                      color: "black",
                      border: "1px solid black",
                      bgcolor: "rgba(255,0,0,0.25)",
                      // mt: 1,
                      textTransform: "none",
                      width: "100%",
                      borderRadius: 1,
                      transition: "background 0.2s",
                      "&:hover": {
                        color: "white",
                        bgcolor: "rgba(255,0,0,0.85)",
                        border: "1px solid #d32f2f",
                      },
                    }}
                    onClick={() => setShowOtpOptions(false)}
                  >
                    <KeyboardArrowLeftIcon />
                    Back
                  </Button>
                  <Button
                    sx={{
                      bgcolor: "#1b4d69",
                      color: "white",
                      textTransform: "none",
                      width: "100%",
                      borderRadius: 1,
                    }}
                    onClick={() => {
                      setShowOtpVerify(true);
                      setTimer(60);
                    }}
                  >
                    Send OTP
                  </Button>
                </Box>
              </Box>
            </>
          )} */}
          {/* OTP VERIFY PAGE */}
          {/* {showOtpVerify && (
            <>
              <Typography
                component="h1"
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: "bold",
                  color: "#1b4d69",
                  fontSize: { xs: 18, sm: 22, md: 28 },
                  textAlign: "center",
                }}
              >
                Verify OTP
              </Typography>
              <Box
                sx={{
                  width: { xs: "290px", sm: "400px" },
                  // bgcolor: "white",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  mt: 3,
                  // p: 3,
                }}
              >
                <Typography sx={{ fontSize: 13, color: "grey", mb: 2, mt: 3 }}>
                  Enter the 4-digit code sent to your{" "}
                  {otpOption === "email" ? "email" : "phone"}
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={otp[idx]}
                      onChange={(e) => handleOtpChange(e, idx)}
                      style={{
                        width: 60,
                        height: 60,
                        fontSize: 24,
                        textAlign: "center",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                      }}
                    />
                  ))}
                </Box>
                <Typography
                  sx={{ mb: 3, fontSize: { xs: 12, sm: 14 }, color: "grey" }}
                >
                  Did not received a code?
                  {timer > 0 ? (
                    <span style={{ marginLeft: 8 }}>
                      {`Resend in 0:${timer < 10 ? `0${timer}` : timer}`}
                    </span>
                  ) : (
                    <Button
                      size="small"
                      sx={{
                        ml: 1,
                        textTransform: "none",
                        color: "#1b4d69",
                        // bgcolor: "#f0f0f0",
                        borderRadius: 1,
                        fontWeight: 600,
                        fontSize: 13,
                        minWidth: 0,
                        px: 0,
                        py: 0.5,
                      }}
                      onClick={() => setTimer(60)}
                    >
                      Resend
                    </Button>
                  )}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    width: "80%",
                    gap: 2,
                    marginBottom: 2,
                    mt: 2,
                  }}
                >
                  <Button
                    sx={{
                      color: "black",
                      border: "1px solid black",
                      bgcolor: "rgba(255,0,0,0.25)",
                      // mt: 1,
                      textTransform: "none",
                      width: "100%",
                      borderRadius: 1,
                      transition: "background 0.2s",
                      "&:hover": {
                        color: "white",
                        bgcolor: "rgba(255,0,0,0.85)",
                        border: "1px solid #d32f2f",
                      },
                    }}
                    onClick={() => {
                      setShowOtpVerify(false);
                      setShowOtpOptions(true);
                    }}
                  >
                    <KeyboardArrowLeftIcon /> Back
                  </Button>
                  <Button
                    sx={{
                      bgcolor: "#1b4d69",
                      color: "white",
                      textTransform: "none",
                      borderRadius: 1,
                      width: "100%",
                      "&.Mui-disabled": {
                        bgcolor: "rgba(27, 77, 105, 0.5)",
                        // color: "#888888",
                        cursor: "not-allowed",
                        // opacity: 0.7,
                        border: "1px solid #cccccc",
                      },
                    }}
                    disabled={otp.some((digit) => digit === "")}
                    onClick={() => navigate("/")}
                  >
                    Verify
                  </Button>
                </Box>
              </Box>
            </>
          )} */}
        </Box>
      </Grid2>
    </>
  );
};

export default LoginSection;

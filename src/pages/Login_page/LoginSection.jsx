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
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { assets } from "../../assets/images/assets";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
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
  // const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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
    return phone.replace(/(\+\d{2}-)(\d{2})(\d{4})(\d{4})/, "$1**-****-$4");
  };

  // const validateEmail = (email) => {
  //   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return regex.test(email);
  // };

  const validatePhone = (phone) => {
    const phoneNumber = phone.replace("+91-", "");
    return phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/BussinessMember/member/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ PhoneNumber: phone.replace("+91-", ""), Password: password }),
      });
      if (response.ok) {
        setSnackbar({ open: true, message: "Login successful!", severity: "success" });
        setTimeout(() => navigate("/"), 1200);
      } else {
        setSnackbar({ open: true, message: "Failed to authenticate, please retry.", severity: "error" });
      }
    } catch (err) {
      setSnackbar({ open: true, message: "Network error, please try again.", severity: "error" });
    }
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
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => {
                    let input = e.target.value;
                    if (!input.startsWith("+91-")) {
                      input = "+91-" + input;
                    }
                    // Remove any non-digit characters after the prefix
                    const phoneNumber = input.slice(4).replace(/\D/g, "");
                    // Limit to 10 digits
                    const trimmedPhoneNumber = phoneNumber.slice(0, 10);
                    const formattedInput = "+91-" + trimmedPhoneNumber;
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
                <TextField
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  sx={{
                    width: { xs: "290px", sm: "400px" },
                    bgcolor: "white",
                    // border: "1px solid rgba(0, 0, 0, 0.23)",
                    // borderRadius: 2.5,
                    mt: 3,
                  }}
                  InputProps={{
                    sx: {
                      height: 50,
                      padding: 0,
                      fontSize: 16,
                      borderRadius: 2.5,
                      border: "none",
                      // "& .MuiOutlinedInput-notchedOutline": {
                      //   border: "none",
                      // },
                    },
                    style: {
                      // borderRadius: "10px",
                      background: "#fbfbfb",
                    },
                  }}
                />
                <Button
                  sx={{
                    bgcolor: "#1b4d69",
                    color: "white",
                    mt: 6,
                    textTransform: "none",
                    borderRadius: 1,
                    "&:disabled": {
                      bgcolor: "#e0e0e0",
                    },
                  }}
                  disabled={!phone || !password}
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
                  <MuiAlert elevation={6} variant="filled" severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                  </MuiAlert>
                </Snackbar>
                {/* <Divider sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", color: "gray" }}
                  >
                    OR
                  </Typography>
                </Divider> */}
                {/* <Box
                  sx={{
                    width: { xs: "290px", sm: "400px" },
                    height: 60,
                    mt: 2,
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    display: "flex",
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <img
                      src={assets.google}
                      alt=""
                      style={{ width: 50, height: 50, cursor: "pointer" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <img
                      src={assets.facebook}
                      alt=""
                      style={{ width: 50, height: 50, cursor: "pointer" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <img
                      src={assets.twitter}
                      alt=""
                      style={{ width: 50, height: 50, cursor: "pointer" }}
                    />
                  </Box>
                </Box> */}
                <Box
                  sx={{
                    width: { xs: "290px", sm: "400px" },
                    height: 40,
                    mt: 2,
                    justifyContent: "space-between",
                    alignItems: "center",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                  }}
                >
                  <Stack direction={"row"} gap={0.5}>
                    <Typography
                      sx={{ fontSize: 11, color: "grey", fontWeight: 600 }}
                    >
                      Not a Customer?
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 11,
                        textDecoration: "underline",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Get Started for free
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: 11,
                      textDecoration: "underline",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onClick={onForgotPassword}
                  >
                    Forgot Password?
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: { xs: "300px", sm: "400px" },

                    height: 40,
                    mt: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Stack direction={"row"} gap={0.5}>
                    <Typography sx={{ fontSize: 9, color: "grey" }}>
                      By continuing, you agree to our
                    </Typography>
                    <Typography
                      sx={{ fontSize: 9.5, fontWeight: 600, cursor: "pointer" }}
                      onClick={() => navigate("/privacy")}
                    >
                      Privacy Policy
                    </Typography>
                    <Typography sx={{ fontSize: 9, color: "grey" }}>
                      and
                    </Typography>
                    <Typography
                      sx={{ fontSize: 9.5, fontWeight: 600, cursor: "pointer" }}
                      onClick={() => navigate("/terms&conditions")}
                    >
                      Terms of Service
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </>
          {/* )} */}

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

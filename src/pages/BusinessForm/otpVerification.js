import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import LeftPanel from "./components/leftpanel.js";
import { constant } from "../../constant.js";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1b4d69",
    },
    background: {
      default: "#fff",
    },
  },
});

export default function OTPVerification() {
  const inputRefs = useRef([]);
  const [otpValue, setOtpValue] = useState(Array(6).fill(""));
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const previousData = useLocation();
  const navigate = useNavigate();
  const { firstName, lastName, email, countryCode, phone } = previousData.state || {};

  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);

  const handleChange = (event, index) => {
    const newOtpValue = [...otpValue];
    newOtpValue[index] = event.target.value;

    if (
      event.target.value.length === 1 &&
      index < inputRefs.current.length - 1
    ) {
      inputRefs.current[index + 1].focus();
    }

    setOtpValue(newOtpValue);
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otpValue[index] && index > 0) {
      inputRefs.current[index - 1].focus();
      const newOtpValue = [...otpValue];
      newOtpValue[index - 1] = "";
      setOtpValue(newOtpValue);
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    setMessage("");

    const enteredOtp = otpValue.join("");

    try {
      const verifyResponse = await fetch(
        `${constant.baseUrl}/api/v1/otp/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_number: `${previousData.state.countryCode}${previousData.state.phone}`,
            otp: enteredOtp,
            user_type: "merchant",
            email: previousData.state.email || null,
            password: previousData.state.password || null,
          }),
        }
      );

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.detail || verifyData.message || "Invalid OTP");
      }

      const token = verifyData?.data?.token;

      if (!token) {
        throw new Error("Authentication failed. Token not received.");
      }

      // save token
      localStorage.setItem("authToken", token);

      const { firstName, lastName } = previousData.state;

      // create business member
      const memberResponse = await fetch(
        `${constant.baseUrl}/api/v1/business-member/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            business_phone_number: `${previousData.state.countryCode}${previousData.state.phone}`,
            business_email: previousData.state.email,
            is_agree: true,
          }),
        }
      );

      const memberData = await memberResponse.json();

      if (!memberResponse.ok || memberData.status !== 200) {
        throw new Error(memberData.message || "Account creation failed");
      }

      // save business member ID
      localStorage.setItem(
        "businessMemberID",
        memberData?.data?.id
      );

      setMessage("Account created successfully!");

      setTimeout(() => {
        navigate("/business/role-selection", {
          state: { ...previousData.state },
        });
      }, 1500);

    } catch (error) {
      setMessage(error.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
      setOpen(true);
    }
  };


  const handleResendOTP = async () => {
    setResendDisabled(true);
    setCountdown(30);
    setMessage("");

    try {
      const response = await fetch(
        `${constant.baseUrl}/api/v1/otp/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_number: `${countryCode}${previousData.state.phone}`,
            user_type: "merchant",
            reset:true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to resend OTP");
      }
      setMessage("New OTP sent successfully!");

    } catch (error) {
      setMessage(error.message || "Failed to resend OTP");
    } finally {
      setOpen(true);
    }
  };


  const editNumber = () => {
    navigate("/business/account", { state: previousData.state });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          overflow: "hidden",
          bgcolor: "background.default",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{ display: "flex", flexGrow: 1 }}
        >
          <Grid container>
            {/* Left side  */}
            <Grid item xs={12} md={4}>
              <LeftPanel
                firstName={firstName}
                lastName={lastName}
                email={email}
                countryCode={countryCode}
                phone={phone}
                formData={previousData.state}
              />
            </Grid>

            {/* Right side  */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{ alignContent: "center", height: "100vh", overflow: "auto" }}
            >
              <Box
                sx={{
                  my: 8,
                  mx: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    color: "#1b4d69",
                    fontSize: { xs: "1.6rem", sm: "2rem", md: "2.5rem" },
                  }}
                >
                  Enter The Code
                </Typography>

                <Typography variant="subtitle1" sx={{ mb: 3 , fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },}}>
                  Enter the OTP code that we sent to your phone number{" "}
                  <b>
                    {countryCode} {phone}
                  </b>
                  . <br /> Be careful not to share the code with anyone.
                </Typography>

                <Box sx={{ mt: 1, maxWidth: {xs: "100%", sm: 450 } }}>
                  <Grid
                    container
                    spacing={{ xs: 1, sm: 2 }}
                    justifyContent="center"
                    sx={{ my: 3 }}
                  >
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <Grid item key={index}>
                        <TextField
                          variant="outlined"
                          inputProps={{
                            maxLength: 1,
                            style: { textAlign: "center" },
                            "aria-label": `Input ${index + 1}`,
                          }}
                          InputProps={{
                            sx: {
                              height: {xs:50, sm:76},
                              fontWeight: "bold",
                              fontSize: {xs: "0.9rem", sm: "1.5rem", md: "1.7rem" },
                              borderRadius: 2,
                            },
                          }}
                          sx={{ width: {xs:35, sm:56}, background: "#fbfbfb" }}
                          placeholder="-"
                          inputRef={(el) => (inputRefs.current[index] = el)}
                          onChange={(event) => handleChange(event, index)}
                          onKeyDown={(event) => handleKeyDown(event, index)}
                          value={otpValue[index]}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 2,
                      mb: 2,
                      py: { xs: 0.9, sm: 1.5},
                      borderRadius: "10px",
                      textTransform: "capitalize",
                    }}
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otpValue.join("").length !== 6}
                  >
                    {isLoading ? <CircularProgress size={24} /> : "Verify OTP"}
                  </Button>

                  <Grid container spacing={4}>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="text"
                        sx={{
                          mb: 2,
                          textTransform: "capitalize",
                          borderRadius: "8px",
                          background: "#dfecf4",
                          "&:hover": {
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          },
                          fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                        }}
                        onClick={handleResendOTP}
                        disabled={resendDisabled}
                      >
                        <b>
                          {resendDisabled
                            ? `Resend OTP in ${countdown}s`
                            : "Resend OTP"}
                        </b>
                      </Button>
                    </Grid>

                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="text"
                        sx={{
                          mb: 2,
                          borderRadius: "8px",
                          background: "#dfecf4",
                          textTransform: "capitalize",
                          "&:hover": {
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          },
                           fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                        }}
                        onClick={editNumber}
                      >
                        <b>Edit Number</b>
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="center" sx={{ my: 0.5 }}>
                    <Grid item>
                      <b>One more step to get started</b>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Dialog for OTP Verification Result */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: "15px",
            },
          }}
        >
          <DialogTitle>OTP Verification</DialogTitle>
          <DialogContent sx={{ py: 0 }}>
            <Typography>{message}</Typography>
          </DialogContent>
          <DialogActions sx={{ mx: 2, mt: 1 }}>
            <Button onClick={() => setOpen(false)} color="primary">
              <b>Close</b>
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

import React, { useState, useEffect } from "react";
import {
  Grid2,
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { constant } from "../../constant";

const ForgotPassword = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    // Move to next input if value entered
    if (value && idx < 5) {
      document.getElementById(`otp-input-${idx + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    // Handle backspace
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[idx] === "" && idx > 0) {
        // If current field is empty and backspace is pressed, move to previous field
        document.getElementById(`otp-input-${idx - 1}`).focus();
      } else {
        // Clear current field
        newOtp[idx] = "";
        setOtp(newOtp);
      }
    }
  };

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendReset = async () => {
    setLoading(true);
    setOtpError("");

    try {
      const res = await fetch(`${constant.baseUrl}/api/v1/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: `+91${phoneNumber}`,
          user_type: "merchant",
          reset: true,
        }),
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok || data?.status !== 200) {
        throw new Error(data?.message || "Failed to send reset request");
      }

      setStep(2);
      setTimer(60);

      setOtp(["", "", "", "", "", ""]);

    } catch (err) {
      setOtpError(
        err.message || "Failed to send reset request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyOtp = async () => {
    setLoading(true);
    setOtpError("");

    try {
      const enteredOtp = otp.join("");

      if (enteredOtp.length !== 6) {
        setOtpError("Please enter complete OTP");
        return;
      }

      const res = await fetch(`${constant.baseUrl}/api/v1/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: `+91${phoneNumber}`,
          otp: enteredOtp,
          user_type: "merchant",
        }),
      });

      const data = await res.json();

      if (!res.ok || data?.status !== 1) {
        throw new Error(data?.message || "Invalid OTP");
      }

      setStep(3);
    } catch (err) {
      setOtpError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    setOtpError("");
    try {
      const res = await fetch(`${constant.baseUrl}/api/v1/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: `+91${phoneNumber}`,
          otp: otp.join(""),
          user_type: "merchant",
          password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.status !== 1) {
        throw new Error(data?.message || "Failed to reset password");
      }
      setOpenDialog(true);
    } catch (err) {
      setOtpError(err.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value.replace("+91 ", "");
    const value = inputValue.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
      setIsPhoneValid(value.length === 10);
    }
  };

  return (
    <>
      <Grid2 item size={{ xs: 12, sm: 12, md: 9, lg: 9 }}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {otpError && (
            <Box sx={{ mb: 2, width: "100%" }}>
              <Typography sx={{ color: "red", textAlign: "center" }}>
                {otpError}
              </Typography>
            </Box>
          )}
          {step === 1 ? (
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
                Reset your Password
              </Typography>
              <Box
                sx={{
                  width: { xs: "290px", sm: "400px" },
                  borderRadius: 2,
                  mt: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    mt: 2,
                    mb: 4,
                    width: "100%",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{ mb: 1, fontSize: { xs: 12, sm: 14 }, color: "grey" }}
                  >
                    Enter your registered phone number.
                  </Typography>
                  <Typography
                    sx={{ mt: 0, fontSize: { xs: 11, sm: 13 }, color: "grey" }}
                  >
                    We will send a verification code.
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "left", width: "100%" }}>
                  {/* <Typography sx={{ color: "grey" }}>Email</Typography> */}
                </Box>
                <Box sx={{ textAlign: "left", width: "100%" }}>
                  {/* <Typography sx={{ color: "grey" }}>Phone Number</Typography> */}
                </Box>
                <TextField
                  type="text"
                  label="Phone Number"
                  fullWidth
                  value={`+91 ${phoneNumber}`}
                  onChange={handlePhoneChange}
                  error={!isPhoneValid && phoneNumber.length > 0}
                  helperText={
                    !isPhoneValid && phoneNumber.length > 0
                      ? "Please enter 10 digits"
                      : ""
                  }
                  sx={{
                    width: { xs: "290px", sm: "400px" },
                    // bgcolor: "white",
                    border: "none",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor:
                          !isPhoneValid && phoneNumber.length > 0
                            ? "red"
                            : "#dadada",
                      },
                      "&:hover fieldset": {
                        borderColor:
                          !isPhoneValid && phoneNumber.length > 0
                            ? "red"
                            : "#1b4d69",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor:
                          !isPhoneValid && phoneNumber.length > 0
                            ? "red"
                            : "#1b4d69",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      "&.Mui-focused": {
                        color:
                          !isPhoneValid && phoneNumber.length > 0
                            ? "red"
                            : "#1b4d69",
                      },
                    },
                  }}
                  InputProps={{
                    sx: {
                      height: 50,
                      padding: 0,
                      fontSize: 16,
                      border: "none",
                      "& .MuiOutlinedInput-notchedOutline": {
                        border:
                          !isPhoneValid && phoneNumber.length > 0
                            ? "1px solid red"
                            : "1px solid #dadada",
                      },
                    },
                    style: {
                      borderRadius: "10px",
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
                    fontWeight: "bold",
                    width: "100%",
                    height: { xs: "44px", sm: "48px", md: "52px" },
                    fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                    "&.Mui-disabled": {
                      bgcolor: "#e0e0e0",
                      cursor: "not-allowed",
                      border: "1px solid #cccccc",
                    },
                  }}
                  disabled={!phoneNumber || !isPhoneValid || loading}
                  onClick={handleSendReset}
                >
                  {loading ? "Sending..." : "Continue"}
                </Button>
              </Box>
            </>
          ) : step === 2 ? (
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
                Enter Your Code
              </Typography>
              <Box
                sx={{
                  width: { xs: "290px", sm: "400px" },
                  borderRadius: 2,
                  mt: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography
                  sx={{ mb: 3, fontSize: { xs: 12, sm: 14 }, color: "grey" }}
                >
                  Please enter the code you received on your device.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 1, sm: 2 },
                    mb: 3,
                  }}
                >
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <TextField
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          "& fieldset": {
                            borderColor: "#dadada",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1b4d69",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1b4d69",
                          },
                        },
                      }}
                      inputProps={{
                        maxLength: 1,
                        style: {
                          textAlign: "center",
                          fontSize: "22px",
                          width: "30px",
                          height: "30px",
                          background: "#fbfbfb",
                        },
                      }}
                      value={otp[idx]}
                      onChange={(e) => handleOtpChange(e, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
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
                        borderRadius: 1,
                        fontWeight: 600,
                        fontSize: 13,
                        minWidth: 0,
                        px: 0,
                        py: 0.5,
                      }}
                      onClick={async () => {
                        await handleSendReset();
                        setOtp(["", "", "", "", "", ""]);
                      }}
                    >
                      Resend
                    </Button>
                  )}
                </Typography>
                <Button
                  sx={{
                    bgcolor: "#1b4d69",
                    color: "white",
                    mt: 1,
                    textTransform: "none",
                    borderRadius: 1,
                    fontWeight: "bold",
                    width: "100%",
                    height: { xs: "44px", sm: "48px", md: "52px" },
                    fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                    "&.Mui-disabled": {
                      bgcolor: "#e0e0e0",
                      cursor: "not-allowed",
                      border: "1px solid #cccccc",
                    },
                  }}
                  disabled={otp.some((digit) => digit === "") || loading}
                  onClick={handleVerifyOtp}
                >
                  {loading ? "Verifying..." : "Verify"}
                </Button>
              </Box>
            </>
          ) : (
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
                Enter New Password
              </Typography>
              <Box
                sx={{
                  width: { xs: "290px", sm: "400px" },
                  borderRadius: 2,
                  mt: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography
                  sx={{ mb: 3, fontSize: { xs: 12, sm: 14 }, color: "grey" }}
                >
                  New password should be different from previously used
                  password.
                </Typography>
                <TextField
                  type="password"
                  label="New Password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  sx={{
                    width: { xs: "290px", sm: "400px" },
                    bgcolor: "white",
                    // border: "1px solid #dadada",
                    borderRadius: 2.5,
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#1b4d69",
                      },
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
                      padding: 0,
                      fontSize: 16,
                      border: "none",
                      "& .MuiOutlinedInput-notchedOutline": {
                        // border: "none",
                      },
                    },
                    style: {
                      borderRadius: "10px",
                      background: "#fbfbfb",
                    },
                  }}
                />
                <TextField
                  type="password"
                  label="Confirm Password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  sx={{
                    width: { xs: "290px", sm: "400px" },
                    bgcolor: "white",
                    // border: "1px solid #dadada",
                    borderRadius: 2.5,
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#1b4d69",
                      },
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
                      padding: 0,
                      fontSize: 16,
                      // border: "none",
                      "& .MuiOutlinedInput-notchedOutline": {
                        // border: "none",
                      },
                    },
                    style: {
                      borderRadius: "10px",
                      background: "#fbfbfb",
                    },
                  }}
                />
                {confirmPassword.length > 0 && (
                  <Typography
                    sx={{
                      // mt: 2,
                      fontSize: 14,
                      color: newPassword === confirmPassword ? "green" : "red",
                      fontWeight: 500,
                    }}
                  >
                    {newPassword === confirmPassword
                      ? "Passwords match"
                      : "Passwords doesn't match"}
                  </Typography>
                )}
                <Button
                  sx={{
                    bgcolor: "#1b4d69",
                    color: "white",
                    mt: 2,
                    textTransform: "none",
                    borderRadius: 1,
                    fontWeight: "bold",
                    width: "100%",
                    height: { xs: "44px", sm: "48px", md: "52px" },
                    fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                    "&.Mui-disabled": {
                      bgcolor: "#e0e0e0",
                      cursor: "not-allowed",
                      border: "1px solid #cccccc",
                    },
                  }}
                  disabled={
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword ||
                    loading
                  }
                  onClick={handlePasswordChange}
                >
                  {loading ? "Resetting..." : "Change Password"}
                </Button>
              </Box>
              <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    width: { xs: "290px", sm: "400px" },
                    p: 0,
                  },
                }}
              >
                <DialogTitle
                  sx={{ bgcolor: "#1b4d69", color: "white", py: 0.5, px: 2 }}
                >
                  Password Reset
                </DialogTitle>
                <DialogContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      //   gap: 1,
                      mt: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: 14, sm: 16 },
                        color: "black",
                        fontWeight: 500,
                        textAlign: "center",
                      }}
                    >
                      Your password has been reset.
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: 12, sm: 14 },
                        color: "grey",
                        fontWeight: 500,
                        textAlign: "center",
                      }}
                    >
                      Login to your account.
                    </Typography>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button
                    sx={{
                      bgcolor: "#1b4d69",
                      color: "white",
                      textTransform: "none",
                      borderRadius: 1,
                      width: 80,
                      height: 25,
                      "&:hover": {
                        bgcolor: "#153d54",
                      },
                    }}
                    onClick={() => {
                      setOpenDialog(false);
                      onBack();
                      // Add navigation to login page here
                      // Example: navigate('/login')
                    }}
                  >
                    Login
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Box>
      </Grid2>
    </>
  );
};

export default ForgotPassword;

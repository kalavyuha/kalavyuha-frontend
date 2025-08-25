import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apipost, apipatch } from "../service/api";
import { showSuccess, showError } from "../../components/toast";
import SuccessCart from "./SuccessCart";
import {
  Grid,
  Button,
  Typography,
  Paper,
  Modal,
  Box,
  IconButton,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const dummyOrder = {
  id: "ORD123456",
  services: [
    { name: "Haircut", price: 300 },
    { name: "Facial", price: 500 },
    { name: "Manicure", price: 250 },
  ],
};

const dummyCards = [
  { id: "card1", name: "Visa •••• 1234" },
  { id: "card2", name: "Mastercard •••• 5678" },
];
const dummyUPIs = [
  { id: "upi1", name: "user@upi" },
  { id: "upi2", name: "demo@okaxis" },
];

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [selectedUPI, setSelectedUPI] = useState("");
  const [openCardModal, setOpenCardModal] = useState(false);
  const [openUPIModal, setOpenUPIModal] = useState(false);
  const [newCard, setNewCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [newUPI, setNewUPI] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [successCartOpen, setSuccessCartOpen] = useState(false);

  // Get booking data from navigation state
  const bookingData = location.state || {};
  const discount = bookingData.Discount || 0;
  const totalAmount = bookingData.TotalPrice || 0;
  const finalAmount = totalAmount - discount;
  // Handle Pay Now click
  const handlePayNow = async () => {
    if (!paymentType || (paymentType === "card" && !selectedCard) || (paymentType === "upi" && !selectedUPI)) {
      showError("Please select a payment method");
      return;
    }
    setIsPaying(true);
    try {
      // Prepare payload for booking API
      const payload = {
        ...bookingData,
        PaymentMethod: paymentType,
        PaymentStatus: "paid",
      };
      // Call booking API
      const result = await apipost("api/v1/booking/book/", payload);
      if (result && result.status === 200) {
        // Clear cart in backend if cartId exists
        if (bookingData.CartId) {
          await apipatch(`api/v1/addToCart/service/update/${bookingData.CartId}`, { services: [] });
        }
        // Clear local cart
        localStorage.removeItem("cartItems");
        // Show success popup
        setSuccessCartOpen(true);
      } else {
        showError("Payment failed. Please try again.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.response?.data?.details || "Payment failed. Please try again.";
      showError(errorMessage);
    } finally {
      setIsPaying(false);
    }
  };

  // Responsive modal style
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: 300,
    maxWidth: 400,
    // width: { xs: "95%", sm: "100%" },
    bgcolor: "background.paper",
    borderRadius: 2,
    // boxShadow: 24,
    p: { xs: 0, sm: 1 },
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: 10, mb: 5 }}>
      <Grid
        item
        xs={12}
        sm={12}
        md={10}
        lg={10}
        sx={{ width: "100%", p: { xs: 1, sm: 2, md: 3 }, alignItems: "center", display: "flex", flexDirection: "column", maxWidth: 1200 }}
      >
        {/* Back to Cart Button */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, width: "100%", justifyContent: "flex-start", maxWidth: 1200 }}>
          {/* <IconButton sx={{ color: '#1b4d69', mr: 1, borderRadius: 2 }}>
            <ArrowBackIcon />
          </IconButton> */}
          {/* <Typography variant="body1" sx={{ color: '#1b4d69', fontWeight: 500, letterSpacing: 0.5 }}>Back to Cart</Typography> */}
          <Typography
            variant="body1"
            sx={{
              color: "#000",
              fontWeight: 500,
              letterSpacing: 0.5,
              fontSize: "1.75rem",
              ml: 1,
            }}
          >
            Payment
          </Typography>
        </Box>

        {/* Main Grid */}
        <Grid container spacing={3} sx={{ width: "100%", maxWidth: 1200 }}>
          {/* Order Summary */}
          <Grid item xs={12} sm={6}>
            <Box
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 4,
                boxShadow: "0 2px 16px 0 rgba(27,77,105,0.08)",
                background: "#fff",
                minHeight: { xs: "auto", sm: "400px" },
                display: "flex",
                flexDirection: "column",
                // height: '100%',
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#000", letterSpacing: 0.5 }}
              >
                Order Summary
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: "#789" }}>
                Merchant: <b style={{ color: "#000" }}>YT Studio</b>
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: "#789" }}>
                Order ID: <b style={{ color: "#000" }}>{dummyOrder.id}</b>
              </Typography>
              <Box sx={{ mb: 2 }}>
                {dummyOrder.services.map((service, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1,
                      borderBottom:
                        idx !== dummyOrder.services.length - 1
                          ? "1px solid #f0f0f0"
                          : "none",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#222", fontWeight: 400 }}
                    >
                      {service.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#1b4d69", fontWeight: 500 }}
                    >
                      ₹{service.price}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: "auto" }}>
                {/* Discount Section */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#388e3c", fontWeight: 500 }}
                  >
                    Discount
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#388e3c", fontWeight: 500 }}
                  >
                    -₹{discount}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #e0e0e0",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: "#000" }}
                  >
                    Total
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: "#000" }}
                  >
                    ₹{finalAmount}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Payment Options */}
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 4,
                boxShadow: "0 2px 16px 0 rgba(27,77,105,0.08)",
                background: "#fff",
                minHeight: { xs: "auto", sm: "400px" },
                display: "flex",
                flexDirection: "column",
                // height: '100%',
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#000", letterSpacing: 0.5 }}
              >
                Payment Options
              </Typography>
              <FormControl component="fieldset" sx={{ width: "100%" }}>
                <FormLabel
                  component="legend"
                  sx={{ color: "#789", fontWeight: 500, mb: 1 }}
                >
                  Select Payment Method
                </FormLabel>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  {["card", "upi", "wallet"].map((type) => (
                    <Button
                      key={type}
                      variant={paymentType === type ? "contained" : "outlined"}
                      onClick={() => {
                        setPaymentType(type);
                        setSelectedCard("");
                        setSelectedUPI("");
                      }}
                      sx={{
                        bgcolor: paymentType === type ? "#1b4d69" : "#fff",
                        color: paymentType === type ? "#fff" : "#1b4d69",
                        borderColor: "#1b4d69",
                        fontWeight: 500,
                        borderRadius: 2,
                        boxShadow: 0,
                        px: 2,
                        textTransform: "none",
                        py: 0.2,
                        "&:hover": {
                          bgcolor: paymentType === type ? "#14506b" : "#e3f2fd",
                          borderColor: "#14506b",
                        },
                        transition: "all 0.2s",
                      }}
                    >
                      {type === "card"
                        ? "Card"
                        : type === "upi"
                        ? "UPI"
                        : "Wallet"}
                    </Button>
                  ))}
                </Box>
              </FormControl>

              {/* Card Options */}
              {paymentType === "card" && (
                <Box sx={{ mt: 2 }}>
                  <FormLabel sx={{ color: "#789", fontWeight: 500 }}>
                    Select Card
                  </FormLabel>
                  <RadioGroup
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.target.value)}
                  >
                    {dummyCards.map((card) => (
                      <FormControlLabel
                        key={card.id}
                        value={card.id}
                        control={
                          <Radio
                            sx={{
                              color: "#1b4d69",
                              "&.Mui-checked": {
                                color: "#1b4d69",
                              },
                            }}
                          />
                        }
                        label={
                          <span style={{ color: "#1b4d69", fontWeight: 500 }}>
                            {card.name}
                          </span>
                        }
                      />
                    ))}
                  </RadioGroup>
                  <Button
                    variant="outlined"
                    sx={{
                      mt: 1,
                      color: "#1b4d69",
                      borderColor: "#1b4d69",
                      textTransform: "none",
                      fontWeight: 500,
                      borderRadius: 2,
                      boxShadow: 0,
                      "&:hover": { bgcolor: "#e3f2fd", borderColor: "#14506b" },
                    }}
                    onClick={() => setOpenCardModal(true)}
                  >
                    + Add New Card
                  </Button>
                </Box>
              )}

              {/* UPI Options */}
              {paymentType === "upi" && (
                <Box sx={{ mt: 2 }}>
                  <FormLabel sx={{ color: "#789", fontWeight: 500 }}>
                    Select UPI
                  </FormLabel>
                  <RadioGroup
                    value={selectedUPI}
                    onChange={(e) => setSelectedUPI(e.target.value)}
                  >
                    {dummyUPIs.map((upi) => (
                      <FormControlLabel
                        key={upi.id}
                        value={upi.id}
                        control={
                          <Radio
                            sx={{
                              color: "#1b4d69",
                              "&.Mui-checked": {
                                color: "#1b4d69",
                              },
                            }}
                          />
                        }
                        label={
                          <span style={{ color: "#1b4d69", fontWeight: 500 }}>
                            {upi.name}
                          </span>
                        }
                      />
                    ))}
                  </RadioGroup>
                  <Button
                    variant="outlined"
                    sx={{
                      mt: 1,
                      color: "#1b4d69",
                      borderColor: "#1b4d69",
                      textTransform: "none",
                      fontWeight: 500,
                      borderRadius: 2,
                      boxShadow: 0,
                      "&:hover": { bgcolor: "#e3f2fd", borderColor: "#14506b" },
                    }}
                    onClick={() => setOpenUPIModal(true)}
                  >
                    + Add New UPI
                  </Button>
                </Box>
              )}

              {/* Wallet Option (dummy) */}
              {paymentType === "wallet" && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "#e3f2fd",
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#1b4d69", fontWeight: 500 }}
                  >
                    Wallet balance: ₹1000
                  </Typography>
                </Box>
              )}

              {/* Pay Now Button */}
              <Box sx={{ mt: { xs: 5, sm: "auto" } }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: "#1b4d69",
                    color: "#fff",
                    fontWeight: 500,
                    textTransform: "none",
                    borderRadius: 3,
                    boxShadow: "0 2px 8px 0 rgba(27,77,105,0.10)",
                    letterSpacing: 0.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "#14506b",
                      boxShadow: "0 4px 16px 0 rgba(27,77,105,0.15)",
                    },
                  }}
                  disabled={
                    (paymentType === "card" && !selectedCard) ||
                    (paymentType === "upi" && !selectedUPI) ||
                    (paymentType === "wallet" && false) ||
                    !paymentType || isPaying
                  }
                  onClick={handlePayNow}
                >
                  {isPaying ? "Processing..." : "Pay Now"}
                </Button>
      {/* Success Popup */}
      <SuccessCart open={successCartOpen} onClose={() => { setSuccessCartOpen(false); navigate("/"); }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Add New Card Modal */}
        <Modal open={openCardModal} onClose={() => setOpenCardModal(false)}>
          <Box
            sx={{
              ...modalStyle,
              borderRadius: 4,
            }}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 2 }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  color: "#1b4d69",
                  fontWeight: 700,
                  textAlign: "left",
                  fontSize: "1.25rem",
                }}
              >
                Add New Card
              </Typography>
              <Typography sx={{ color: "#1b4d69", mb: 0.5, fontSize: "1rem" }}>
                Card Number
              </Typography>
              <TextField
                placeholder="1234 5678 1234 0000"
                fullWidth
                sx={{
                  mb: 0,
                  bgcolor: "#f7fafd",
                  borderRadius: 2,
                  "& .MuiInputBase-root": {
                    fontSize: "1.05rem",
                    letterSpacing: 2,
                    px: 0,
                    py: 0,
                    height: 35,
                  },
                  boxShadow: "0 1px 4px 0 rgba(27,77,105,0.07)",
                }}
                value={newCard.number}
                onChange={(e) => {
                  const val = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 16);
                  setNewCard({ ...newCard, number: val });
                }}
                inputProps={{ maxLength: 16 }}
              />
              <Typography
                sx={{
                  //   fontWeight: 600,
                  color: "#1b4d69",
                  mb: 0.5,
                  fontSize: "1rem",
                }}
              >
                Name on Card
              </Typography>
              <TextField
                placeholder="Name as on card"
                fullWidth
                sx={{
                  bgcolor: "#f7fafd",
                  borderRadius: 2,
                  "& .MuiInputBase-root": {
                    fontSize: "1.05rem",
                    // px: 2,
                    // py: 0.7,
                    height: 35,
                  },
                  boxShadow: "0 1px 4px 0 rgba(27,77,105,0.07)",
                }}
                value={newCard.name}
                onChange={(e) =>
                  setNewCard({ ...newCard, name: e.target.value })
                }
              />
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      //   fontWeight: 600,
                      color: "#1b4d69",
                      mb: 0.5,
                      fontSize: "1rem",
                    }}
                  >
                    Expiry (MM/YY)
                  </Typography>
                  <TextField
                    placeholder="MM/YY"
                    fullWidth
                    sx={{
                      bgcolor: "#f7fafd",
                      borderRadius: 2,
                      "& .MuiInputBase-root": {
                        fontSize: "1.05rem",
                        // px: 2,
                        // py: 0.7,
                        height: 35,
                      },
                      boxShadow: "0 1px 4px 0 rgba(27,77,105,0.07)",
                    }}
                    value={newCard.expiry}
                    onChange={(e) => {
                      let val = e.target.value
                        .replace(/[^0-9\/]/g, "")
                        .slice(0, 5);
                      if (val.length === 2 && !val.includes("/"))
                        val = val + "/";
                      setNewCard({ ...newCard, expiry: val });
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      //   fontWeight: 600,
                      color: "#1b4d69",
                      mb: 0.5,
                      fontSize: "1rem",
                    }}
                  >
                    CVV
                  </Typography>
                  <TextField
                    placeholder="CVV"
                    fullWidth
                    sx={{
                      bgcolor: "#f7fafd",
                      borderRadius: 2,
                      "& .MuiInputBase-root": {
                        fontSize: "1.05rem",
                        // px: 2,
                        // py: 0.7,
                        height: 35,
                      },
                      boxShadow: "0 1px 4px 0 rgba(27,77,105,0.07)",
                    }}
                    value={newCard.cvv}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 3);
                      setNewCard({ ...newCard, cvv: val });
                    }}
                  />
                </Box>
              </Box>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#1b4d69",
                  color: "#fff",
                  //   fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  mt: 2,
                  "&:hover": { bgcolor: "#14506b" },
                  py: 1,
                  fontSize: "1rem",
                  boxShadow: "0 2px 8px 0 rgba(27,77,105,0.10)",
                }}
                onClick={() => setOpenCardModal(false)}
              >
                Add Card
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Add New UPI Modal */}
        <Modal open={openUPIModal} onClose={() => setOpenUPIModal(false)}>
          <Box
            sx={{
              ...modalStyle,
              borderRadius: 4,
              //   boxShadow: "0 2px 24px 0 rgba(27,77,105,0.18)",
              //   maxWidth: 400,
              //   width: "100%",
            }}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 2 }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  color: "#1b4d69",
                  fontWeight: 700,
                  textAlign: "left",
                  fontSize: "1.25rem",
                }}
              >
                Add New UPI
              </Typography>
              <Typography
                sx={{
                  //   fontWeight: 600,
                  color: "#1b4d69",
                  mb: 0.5,
                  fontSize: "1rem",
                }}
              >
                UPI ID
              </Typography>
              <TextField
                placeholder="yourupi@bank"
                fullWidth
                sx={{
                  bgcolor: "#f7fafd",
                  borderRadius: 2,
                  "& .MuiInputBase-root": {
                    fontSize: "1.05rem",
                    // px: 2,
                    // py: 0.7,
                    height: 35,
                  },
                  boxShadow: "0 1px 4px 0 rgba(27,77,105,0.07)",
                }}
                value={newUPI}
                onChange={(e) => setNewUPI(e.target.value)}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#1b4d69",
                  color: "#fff",
                  //   fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  mt: 2,
                  "&:hover": { bgcolor: "#14506b" },
                  py: 1,
                  fontSize: "1rem",
                  boxShadow: "0 2px 8px 0 rgba(27,77,105,0.10)",
                }}
                onClick={() => setOpenUPIModal(false)}
              >
                Add UPI
              </Button>
            </Box>
          </Box>
        </Modal>
      </Grid>
    </Grid>
  );
};

export default PaymentPage;

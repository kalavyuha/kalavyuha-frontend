import React from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MobileScreen from "../../assets/images/Index_Images/mobile_screen_full.png"
import GiftBox from "../../assets/images/Index_Images/gift_box.png"
import GetAppButton from "../../components/AppStoreButton";

const BookingAppLanding = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        my:10,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 0, md: 8, lg: 0 } }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" component="h2" sx={{  mb: 1, fontSize: { xs: "h5.fontSize", sm: "h4.fontSize"} }}>
            Kalavyuha, the all-in-one
          </Typography>
          <Typography variant="h4" component="h2" sx={{  mb: 2, fontSize: { xs: "h5.fontSize", sm: "h4.fontSize" } }}>
            booking app
          </Typography>
          <Typography variant="h6" component="div" sx={{ color: "text.secondary", fontSize: { xs: "0.8rem", sm: "1rem", md: "1.1rem" } }}>
            <strong style={{ color: "#1b4d69" }}><u>Download</u></strong> now and save big on your first 2 bookings!
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", justifyContent: "center", gap: 2, position: "relative", my: 4 }}>
        <Paper
        elevation={0}
        sx={{
            padding: 3,
            borderRadius: 4,
            backgroundColor: "#d0dce2", 
            backdropFilter: "blur(10px)", 
            border: "5px solid rgba(255, 255, 255, 0.7)", 
            boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.4)", 
            width: { md: "280px" },
            textAlign: "center",
            zIndex: 1,
            marginTop: { xs: 0, md: "120px" },
            transition: "transform 0.3s ease-in-out",
            "&:hover": { transform: "scale(1.02)" },
        }}
        >
            <SearchIcon sx={{ fontSize: 35, color: "text.primary", mb: 1 }} />
            <Typography variant="h6" fontWeight={600} mb={1}>
                Search & Find the Best Services
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Get instant confirmation for your bookings
            </Typography>
        </Paper>

          <Box sx={{ position: "relative", zIndex: 2, mx: { xs: 0, md: 2 }, my: { xs: 4, md: 0 }, transform: { xs: "scale(0.9)", md: "scale(1)" } }}>
            <Box component="img" src={MobileScreen} alt="Kalavyuha App" sx={{ height: { xs: "250px", md: "300px" }, objectFit: "contain" }} />
          </Box>

          <Paper
            elevation={0}
            sx={{
                padding: 3,
                borderRadius: 4,
                backgroundColor: "#d0dce2",
                backdropFilter: "blur(10px)",
                border: "5px solid rgba(255, 255, 255, 0.7)",
                boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.4)",
                width: {md: "280px" },
                textAlign: "center",
                zIndex: 1,
                marginTop: { xs: 0, md: "40px" },
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.02)" },
            }}
            >   
            <Box
                component="img"
                src={GiftBox}
                alt="Gift Box"
                sx={{
                width: 50, 
                height: 50,
                mb: 1,
                }}
            />
            <Typography variant="h6" fontWeight={600} mb={1}>
                Earn Cashback, Bonuses & Gifts
            </Typography>
            <Stack spacing={1} mt={2} sx={{alignItems: "left"}}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircleOutlineIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary" textAlign="left">
                    Exclusive welcome rewards
                </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircleOutlineIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary" textAlign="left">
                    Instant cashback on repeat bookings
                </Typography>
                </Box>
            </Stack>
            </Paper>

        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <GetAppButton/>
        </Box>
      </Container>
    </Box>
  );
};

export default BookingAppLanding;

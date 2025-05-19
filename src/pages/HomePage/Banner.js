import React, { useState, useEffect } from "react";
import { Box, Typography, Container, useMediaQuery, useTheme } from "@mui/material";
import Slider from "react-slick";
import SearchUI from "./search";
import BannerImg1 from "../../assets/images/Index_Images/health.jpeg";
import BannerImg2 from "../../assets/images/Index_Images/BannerImg2.jpg";
import BannerImg3 from "../../assets/images/Index_Images/fitness.jpg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
  const [index, setIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const content = [
    {
      heading: "Effortlessly Book Your Salon & Spa Appointments",
      subheading: "Personalized Services • Easy Online Booking • 24/7 Availability",
    },
    {
      heading: "Health and Wellness Appointments Made Easy",
      subheading: "Professional Care • Safe & Secure Payments • Around-the-Clock Support",
    },
    {
      heading: "Book Your Fitness Sessions with Just a Tap",
      subheading: "Personalized Training • Flexible Scheduling • Secure Payments",
    },
  ];
  const images = [BannerImg1, BannerImg2, BannerImg3];

  useEffect(() => {
    setIndex(Math.floor(Math.random() * content.length));
  }, []);

  const imageSliderSettings = {
    fade: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    speed: 1000,
    afterChange: (current) => setCurrentSlide(current),
  };

  return (
    <Box
      position="relative"
      sx={{
        overflow: "hidden",
        mt: { xs: 8, sm: 12, md: 20 },
        pb: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Box
        height="45%"
        bgcolor="black"
        color="white"
        display={{ xs: "none", md: "flex" }}
        alignItems="start"
        justifyContent="start"
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        zIndex="-1"
      />

      <Container maxWidth="xl">
        {isMobile ? (
          <Box sx={{ display: "flex", flexDirection: "column", px: 2,mt:4 }}>
            <Box sx={{ borderRadius: "1em", overflow: "hidden", height: "15rem", width: "100%", mb: 3 }}>
              <img
                src={images[currentSlide] || "/placeholder.svg"}
                alt={`Banner ${currentSlide + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>

            <Box textAlign="center" mb={3}>
              <Typography variant="h5" fontWeight="bold" color="black" fontFamily="sans-serif">
                {content[index]?.heading}
              </Typography>
              <Typography variant="body2" color="#919191" fontFamily="sans-serif" sx={{ mt: 1 }}>
                {content[index]?.subheading}
              </Typography>
            </Box>

            <Box sx={{ width: "100%" }}>
              <SearchUI />
            </Box>
          </Box>
        ) : (
          <>
          <Box
              sx={{
                position: "relative",
                bottom: "1rem",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "0.5rem",
              }}
            >
              {images.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: currentSlide === idx ? "#1E293B" : "#CBD5E1",
                    transition: "background-color 0.3s ease",
                  }}
                />
              ))}
            </Box>
            
            <Box textAlign="center" mb={4}>
              <Typography variant={isTablet ? "h4" : "h3"} fontWeight="bold" color="black" fontFamily="Times New Roman">
                {content[index]?.heading}
              </Typography>
              <Typography variant={isTablet ? "body1" : "h6"} color="#919191" fontFamily="Antic" marginBottom="6rem">
                {content[index]?.subheading}
              </Typography>
            </Box>

            <Box sx={{ mb: { sm: 8, md: 13 }, display: "flex", justifyContent: "center", width: "100%" }}>
              <SearchUI />
            </Box>

            <Box
              sx={{
                border: "5px solid #fff",
                borderRadius: { sm: "2em", md: "3em" },
                overflow: "hidden",
                height: { sm: "25em", md: "40em" },
                mx: "auto",
                maxWidth: "90%",
                background: "#545454",
              }}
            >
              <Slider {...imageSliderSettings}>
                {images.map((img, idx) => (
                  <div key={idx} style={{ position: "relative" }}>
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Banner ${idx + 1}`}
                      style={{ width: "100%",height:"40em", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </Slider>
            </Box>

          </>
        )}
      </Container>
    </Box>
  );
};

export default Banner;

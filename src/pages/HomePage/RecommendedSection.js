import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Button,
  Container,
} from "@mui/material";
import { NavigateBefore, NavigateNext, LocationOn } from "@mui/icons-material";
import RecommendedImgPath from "../../assets/images/recommended/recommended.png";
import { useMediaQuery } from "@mui/material";
import TypeOneCard from "../../components/cardtypeone";
import { constant } from "../../constant";

const ServicesRecommendations = ({ category = "Beauty" }) => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // const latitude = localStorage.getItem('latitude') || '28.6767965';
        // const longitude = localStorage.getItem('longitude') || '78.9897978';
        const latitude = localStorage.getItem("latitude");
        const longitude = localStorage.getItem("longitude");

        const response = await fetch(
          `${constant.baseUrl}/api/v1/Service/popularServiceAndBusinesses/?search_for=Businesses&category=${category}&latitude=${latitude}&longitude=${longitude}&page=1`,
          {
            headers: {
              Authorization: "Bearer VIRoHdqUAtpklgKg",
              // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        // Map the API response to match the TypeOneCard component structure
        const mappedData =
          data.Data?.items?.map((item, index) => ({
            id: item._id || index + 1,
            Business: {
              Name: item.BusinessName || "Unknown Business",
              Address:
                // item.Region || `${item.City}, ${item.State}` || "Location",
                item.Region || `${item.City}` || "Location",
              Rating: item.Rating || 4.8,
              Image: item.ProfileImage || RecommendedImgPath,
              Distance: item.Distance ? `${item.Distance} Km` : "0.0 Km",
            },
            Service: {
              Type: item.BussinessType || "Service",
              DiscountedPrice: 50, // Default price as not provided in API
              OriginalPrice: 50, // Default price as not provided in API
            },
          })) || [];

        setSalons(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to empty array on error
        setSalons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const carouselRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (!container) return;

    const cardWidth = 300 + 32;
    const scrollAmount = direction === "next" ? cardWidth : -cardWidth;
    const newPosition = scrollPosition + scrollAmount;

    const maxScroll = container.scrollWidth - container.clientWidth;
    const validPosition = Math.max(0, Math.min(newPosition, maxScroll));

    setScrollPosition(validPosition);
    container.scrollTo({ left: validPosition, behavior: "smooth" });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ px: { xs: 4, sm: 8, md: 8, lg: 4 }, my: 10 }}
    >
      <Box>
        <Box
          sx={{
            display: isSmallScreen ? "block" : "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: isSmallScreen ? 2 : 4,
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" }, mb: 2 }}
          >
            Recommended for you - {category}
          </Typography>
        </Box>

        <Box
          ref={carouselRef}
          sx={{
            display: "flex",
            gap: 7,
            position: "relative",
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollBehavior: "smooth",
          }}
        >
          {loading ? (
            <Typography>Loading...</Typography>
          ) : salons.length > 0 ? (
            salons.map((salon) => (
              <TypeOneCard
                key={salon.id}
                salon={salon}
                isSmallScreen={isSmallScreen}
              />
            ))
          ) : (
            <Typography>No services found for {category}</Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 0,
            gap: 4,
          }}
        >
          <IconButton
            sx={{
              height: "26px",
              width: "26px",
              bgcolor: "#e2e6ea",
              boxShadow: 2,
              "&:hover": { bgcolor: "white" },
            }}
            onClick={() => scroll("prev")}
          >
            <NavigateBefore />
          </IconButton>

          <IconButton
            sx={{
              height: "26px",
              width: "26px",
              bgcolor: "#cdddec",
              boxShadow: 2,
              "&:hover": { bgcolor: "white" },
            }}
            onClick={() => scroll("next")}
          >
            <NavigateNext sx={{ color: "#1b4d69" }} />
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
};

export default ServicesRecommendations;

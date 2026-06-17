import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Typography,
  Box,
  Button,
  IconButton,
  Container,
  Skeleton,
  Alert,
} from "@mui/material";

import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

import { useMediaQuery } from "@mui/material";

import TypeOneCard from "../../components/cardtypeone";
import { fetchRecommendedServices } from "../../Services/home/api/recommendedServices.api";

// Constants
const CARD_WIDTH = 300;
const CARD_GAP = 32;
const TOTAL_CARD_WIDTH = CARD_WIDTH + CARD_GAP;
const SCROLL_DEBOUNCE_DELAY = 150;

// Custom hook for carousel scroll management
const useCarouselScroll = (itemsLength) => {
  const carouselRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  const updateScrollState = useCallback(() => {
    const container = carouselRef.current;
    if (!container) return;

    const currentScroll = container.scrollLeft;
    const maxScrollValue = Math.max(0, container.scrollWidth - container.clientWidth);
    
    setScrollPosition(currentScroll);
    setMaxScroll(maxScrollValue);
    setIsAtStart(currentScroll <= 1); // Small threshold for floating point precision
    setIsAtEnd(currentScroll >= maxScrollValue - 1);
    setIsScrollable(maxScrollValue > 1); // Check if scrolling is needed
  }, []);

  const scrollTo = useCallback((position, behavior = "smooth") => {
    const container = carouselRef.current;
    if (!container) return;

    const validPosition = Math.max(0, Math.min(position, maxScroll));
    
    setScrollPosition(validPosition);
    container.scrollTo({
      left: validPosition,
      behavior,
    });
  }, [maxScroll]);

  const scrollBy = useCallback((direction) => {
    const container = carouselRef.current;
    if (!container) return;
    
    const currentScroll = container.scrollLeft;
    const newPosition = currentScroll + (direction === "next" ? TOTAL_CARD_WIDTH : -TOTAL_CARD_WIDTH);
    scrollTo(newPosition);
  }, [scrollTo]);

  const scrollToStart = useCallback(() => scrollTo(0), [scrollTo]);
  const scrollToEnd = useCallback(() => scrollTo(maxScroll), [scrollTo, maxScroll]);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    // Initial update
    updateScrollState();

    // Update on resize
    const resizeObserver = new ResizeObserver(() => {
      updateScrollState();
    });
    
    resizeObserver.observe(container);

    let debounceTimer;
    const handleScroll = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updateScrollState, SCROLL_DEBOUNCE_DELAY);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      clearTimeout(debounceTimer);
    };
  }, [updateScrollState]);

  // Update scroll state when items change
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      updateScrollState();
    }, 50);
    
    return () => clearTimeout(timer);
  }, [itemsLength, updateScrollState]);

  return {
    carouselRef,
    scrollPosition,
    maxScroll,
    isAtStart,
    isAtEnd,
    isScrollable,
    scrollBy,
    scrollToStart,
    scrollToEnd,
    updateScrollState,
  };
};

// Loading skeleton component
const LoadingSkeleton = ({ count = 3, isSmallScreen }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <Box
        key={`skeleton-${index}`}
        sx={{
          minWidth: CARD_WIDTH,
          maxWidth: CARD_WIDTH,
          flexShrink: 0,
        }}
      >
        <Skeleton
          variant="rounded"
          height={isSmallScreen ? 280 : 320}
          sx={{
            borderRadius: 2,
            bgcolor: 'rgba(0,0,0,0.1)',
          }}
        />
      </Box>
    ))}
  </>
);

// Empty state component
const EmptyState = ({ category }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 300,
      width: '100%',
    }}
  >
    <Typography variant="body1" color="text.secondary">
      No services found for {category}
    </Typography>
  </Box>
);

// Navigation buttons component
const NavigationButtons = ({ onPrev, onNext, isAtStart, isAtEnd, isScrollable }) => {
  // Hide both buttons if not scrollable
  if (!isScrollable) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        mt: 2,
        gap: 4,
      }}
    >
      {/* Hide left button when at start */}
      {!isAtStart && (
        <IconButton
          aria-label="Previous"
          sx={{
            height: { xs: 32, sm: 36 },
            width: { xs: 32, sm: 36 },
            boxShadow: 1,
            transition: 'all 0.2s ease',
            "&:hover": {
              bgcolor: "white",
              transform: 'scale(1.05)',
            },
          }}
          onClick={onPrev}
        >
          <WestIcon sx={{ color: "#1b4d69" }}/>
        </IconButton>
      )}

      {!isAtEnd && (
        <IconButton
          aria-label="Next"
          sx={{
            height: { xs: 32, sm: 36 },
            width: { xs: 32, sm: 36 },
            boxShadow: 1,
            transition: 'all 0.2s ease',
            "&:hover": {
              bgcolor: "#fff",
              transform: 'scale(1.05)',
            },
          }}
          onClick={onNext}
        >
          <EastIcon sx={{ color: "#1b4d69" }} />
        </IconButton>
      )}
    </Box>
  );
};

// Main component
const ServicesRecommendations = ({ category = "Beauty" }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isMediumScreen = useMediaQuery("(max-width: 960px)");

  // Get number of visible cards for better UX
  const visibleCardsCount = useMemo(() => {
    if (isSmallScreen) return 1;
    if (isMediumScreen) return 2;
    return 3;
  }, [isSmallScreen, isMediumScreen]);

  const {
    carouselRef,
    isAtStart,
    isAtEnd,
    isScrollable,
    scrollBy,
  } = useCarouselScroll(services.length);

  // Load services
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const latitude = localStorage.getItem("latitude");
      const longitude = localStorage.getItem("longitude");

      if (!latitude || !longitude) {
        console.warn("Location not found in localStorage");
      }

      const data = await fetchRecommendedServices({
        category,
        latitude: latitude || null,
        longitude: longitude || null,
        page: 1,
        limit: 20,
      });

      setServices(data || []);
    } catch (error) {
      console.error("Failed to load recommended services:", error);
      setError(error.message || "Failed to load recommendations");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Load data on mount and category change
  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // Handle scroll buttons
  const handlePrev = useCallback(() => scrollBy("prev"), [scrollBy]);
  const handleNext = useCallback(() => scrollBy("next"), [scrollBy]);

  // Render content based on state
  const renderContent = useMemo(() => {
    if (loading) {
      return (
        <LoadingSkeleton 
          count={visibleCardsCount} 
          isSmallScreen={isSmallScreen} 
      />
      );
    }

    if (error) {
      return (
        <Box sx={{ width: '100%', py: 4 }}>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={loadServices}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      );
    }

    if (services.length === 0) {
      return <EmptyState category={category} />;
    }

    return services.map((service) => (
      <TypeOneCard
        key={service.id}
        salon={service}
        isSmallScreen={isSmallScreen}
      />
    ));
  }, [loading, error, services, category, isSmallScreen, visibleCardsCount, loadServices]);

  // Show navigation only when needed
  const showNavigation = useMemo(() => {
    return !loading && !error && services.length > 0;
  }, [loading, error, services.length]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        px: { xs: 2, sm: 3, md: 4, lg: 4 },
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            mb: { xs: 2, sm: 3, md: 4 },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontSize: {
                xs: "1.25rem",
                sm: "1.5rem",
                md: "2rem",
              },
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Recommended for you - {category}
          </Typography>

          {showNavigation && (
            <NavigationButtons
              onPrev={handlePrev}
              onNext={handleNext}
              isAtStart={isAtStart}
              isAtEnd={isAtEnd}
              isScrollable={isScrollable}
            />
          )}
        </Box>

        {/* Carousel Section */}
        <Box
          ref={carouselRef}
          sx={{
            display: "flex",
            gap: `${CARD_GAP}px`,
            position: "relative",
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollBehavior: "smooth",
            py: 1,
            px: 0.5,
          }}
        >
          {renderContent}
        </Box>

        {/* Mobile Navigation (below carousel) */}
        {showNavigation && isSmallScreen && (
          <NavigationButtons
            onPrev={handlePrev}
            onNext={handleNext}
            isAtStart={isAtStart}
            isAtEnd={isAtEnd}
            isScrollable={isScrollable}
          />
        )}
      </Box>
    </Container>
  );
};

ServicesRecommendations.displayName = "ServicesRecommendations";

export default React.memo(ServicesRecommendations);
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Container,
  Skeleton
} from '@mui/material';

import { fetchNearbyServices } from '../../Services/home/api/nearbyServices.api';

const ServiceCard = React.memo(({ service }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(service.link);
  }, [navigate, service.link]);

  return (
    <Card
      sx={{
        width: { xs: 160, sm: 190, md: 210 },
        minWidth: { xs: 160, sm: 190, md: 210 },
        mx: { xs: 0.5, sm: 1 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        alignItems: 'center',
        my: { xs: 1, sm: 2 }
      }}
    >
      <CardMedia
        component="img"
        image={service.image}
        alt={service.title}
        loading="lazy"
        sx={{
          height: { xs: 80, sm: 100, md: 120 },
          width: { xs: 100, sm: 120, md: 150 },
          borderRadius: 2,
          mb: 1,
          objectFit: 'cover'
        }}
      />

      <CardContent sx={{ p: { xs: 0.5, sm: 1 } }}>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            color: 'white',
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.1rem' },
            textAlign: 'center'
          }}
        >
          {service.title}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          p: { xs: 0.5, sm: 1 },
          mt: 'auto',
          justifyContent: 'center'
        }}
      >
        <Button
          sx={{
            color: '#2196f3',
            p: 0,
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
            '&:hover': {
              bgcolor: 'transparent',
              color: '#90caf9'
            }
          }}
          onClick={handleClick}
        >
          {service.action}
        </Button>
      </CardActions>
    </Card>
  );
});

ServiceCard.displayName = 'ServiceCard';

// Skeleton loader for better UX
const ServiceCardSkeleton = () => (
  <Card
    sx={{
      width: { xs: 160, sm: 190, md: 210 },
      minWidth: { xs: 160, sm: 190, md: 210 },
      mx: { xs: 0.5, sm: 1 },
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      my: { xs: 1, sm: 2 },
      bgcolor: 'transparent',
      boxShadow: 'none'
    }}
  >
    <Skeleton
      variant="rounded"
      sx={{
        height: { xs: 80, sm: 100, md: 120 },
        width: { xs: 100, sm: 120, md: 150 },
        borderRadius: 2,
        mb: 1,
        bgcolor: 'rgba(255,255,255,0.1)'
      }}
    />
    <Skeleton
      variant="text"
      sx={{
        width: '80%',
        bgcolor: 'rgba(255,255,255,0.1)'
      }}
    />
    <Skeleton
      variant="text"
      sx={{
        width: '60%',
        bgcolor: 'rgba(255,255,255,0.1)'
      }}
    />
  </Card>
);

const ServiceDirectory = () => {
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadServices = useCallback(async (latitude, longitude) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchNearbyServices({
        searchFor: 'Service',
        latitude,
        longitude,
        page: 1
      });

      setServices([...data, ...data]);
    } catch (err) {
      console.error(err);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      loadServices(28.6767965, 78.9897978);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadServices(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Location access denied:', error);
        loadServices(28.6767965, 78.9897978);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }, [loadServices]);

  // Start auto-scroll
  const startAutoScroll = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (scrollContainer && !isManualScrolling) {
        scrollContainer.scrollLeft += 1;

        if (
          scrollContainer.scrollLeft + scrollContainer.clientWidth >=
          scrollContainer.scrollWidth
        ) {
          scrollContainer.scrollLeft = 0;
        }
      }
    }, 10);
  }, [isManualScrolling]);

  const stopAutoScroll = useCallback(() => {
    setIsManualScrolling(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsManualScrolling(false);
    }, 1);
  }, []);

  useEffect(() => {
    getUserLocation();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [getUserLocation]);

  // auto-scroll setup
  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (!scrollContainer || services.length === 0) return;

    if (!isManualScrolling) {
      startAutoScroll();
    }

    scrollContainer.addEventListener('scroll', stopAutoScroll);
    scrollContainer.addEventListener('touchstart', stopAutoScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', stopAutoScroll);
      scrollContainer.removeEventListener('touchstart', stopAutoScroll);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isManualScrolling, startAutoScroll, stopAutoScroll, services.length]);

  // Memoize skeleton loaders
  const skeletonLoaders = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => <ServiceCardSkeleton key={`skeleton-${i}`} />),
  []);

  const serviceCards = useMemo(() => 
    services.map((service, index) => (
      <ServiceCard
        key={`${service.title}-${index}`}
        service={service}
      />
    )),
    [services]
  );

  return (
    <Box
      sx={{
        bgcolor: 'black',
        pt: { xs: 8, sm: 10, md: 12 },
        pb: { xs: 3, sm: 4 },
        mb: 10,
        overflow: 'hidden'
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 4, sm: 8, md: 8, lg: 4 }
        }}
      >
        <Box
          sx={{
            mb: { xs: 3, sm: 4, md: 6 },
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: { xs: 'flex-start', sm: 'flex-end' },
            flexDirection: 'column'
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              color: 'white',
              fontSize: {
                xs: '1.2rem',
                sm: '1.5rem',
                md: '2rem'
              },
              mb: { xs: 1, sm: 2 },
              width: '100%'
            }}
          >
            Your One-Stop Destination for Local Experts
          </Typography>

          <Typography
            sx={{
              color: 'white',
              opacity: 0.8,
              fontSize: {
                xs: '0.7rem',
                sm: '0.8rem',
                md: '1rem'
              },
              width: '100%'
            }}
          >
            Book Expert Services Online – Anytime, Anywhere
          </Typography>
        </Box>

        {/* SERVICES */}
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            gap: { xs: 0.5, sm: 1 },
            pb: 1
          }}
        >
          {loading && skeletonLoaders}

          {error && (
            <Typography sx={{ color: 'white', p: 2 }}>
              {error}
            </Typography>
          )}

          {!loading && !error && services.length === 0 && (
            <Typography sx={{ color: 'white', p: 2 }}>
              No services found.
            </Typography>
          )}

          {!loading && !error && services.length > 0 && serviceCards}
        </Box>
      </Container>
    </Box>
  );
};

export default React.memo(ServiceDirectory);
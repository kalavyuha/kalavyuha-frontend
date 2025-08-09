import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Container
} from '@mui/material';

import MusiceTherapy from '../../assets/images/nearby/music_therapy.jpeg';
import Makeup from '../../assets/images/nearby/makeup_service.jpeg';
import SkinIssue from '../../assets/images/nearby/skin_issue.jpeg';
import DisPersonFitness from '../../assets/images/nearby/disabled_person_fitness.jpeg';

const services = [
  {
    title: "Hair fall, skin issue or allergy",
    image: MusiceTherapy,
    action: "CONSULT NOW",
    link: "/consult"
  },
  {
    title: "Cycling, dance or gym",
    image: Makeup,
    action: "GET MEMBERSHIP",
    link: "/membership"
  },
  {
    title: "Hair cut, tattoos or pre-bridal",
    image: SkinIssue,
    action: "BOOK NOW",
    link: "/book"
  },
  {
    title: "Spa, Massage or Therapy",
    image: DisPersonFitness,
    action: "BOOK NOW",
    link: "/spa"
  },
  {
    title: "Spa, Therapy",
    image: SkinIssue,
    action: "BOOK NOW",
    link: "/therapy"
  }
];

// Duplicate services for seamless infinite scroll
const extendedServices = [...services, ...services];

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        width: { xs: 160, sm: 200, md: 280 },
        minWidth: { xs: 160, sm: 200, md: 280 },
        mx: { xs: 0.5, sm: 1 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        alignItems: "center",
        my: { xs: 1, sm: 2 }
      }}
    >
      <CardMedia
        component="img"
        image={service.image}
        alt={service.title}
        sx={{
          height: { xs: 80, sm: 100, md: 120 },
          width: { xs: 100, sm: 120, md: 150 },
          borderRadius: 2,
          mb: 1,
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
      <CardActions sx={{ p: { xs: 0.5, sm: 1 }, mt: 'auto', justifyContent: "center" }}>
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
          onClick={() => navigate(service.link)}
        >
          {service.action}
        </Button>
      </CardActions>
    </Card>
  );
};

const ServiceDirectory = () => {
  const scrollRef = useRef(null);
  const [isManualScrolling, setIsManualScrolling] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 1;
    let interval;

    const startAutoScroll = () => {
      if (isManualScrolling) return;

      interval = setInterval(() => {
        if (scrollContainer) {
          scrollContainer.scrollLeft += scrollAmount;
          if (
            scrollContainer.scrollLeft + scrollContainer.clientWidth >=
            scrollContainer.scrollWidth
          ) {
            scrollContainer.scrollLeft = 0;
          }
        }
      }, 10);
    };

    const stopAutoScroll = () => {
      setIsManualScrolling(true);
      clearInterval(interval);
      setTimeout(() => setIsManualScrolling(false), 0); 
    };

    if (!isManualScrolling) startAutoScroll();

    scrollContainer?.addEventListener("scroll", stopAutoScroll, { passive: true });
    scrollContainer?.addEventListener("touchstart", stopAutoScroll, { passive: true });
    scrollContainer?.addEventListener("touchend", () => {
      setTimeout(() => setIsManualScrolling(false), 1000);
    }, { passive: true });

    
    return () => {
      clearInterval(interval);
      scrollContainer?.removeEventListener("scroll", stopAutoScroll, { passive: true });
      scrollContainer?.removeEventListener("touchstart", stopAutoScroll, { passive: true });
      scrollContainer?.removeEventListener("touchend", () => {
        setTimeout(() => setIsManualScrolling(false), 1000);
      }, { passive: true });
    };
  }, [isManualScrolling]);


  return (
    <Box sx={{ bgcolor: 'black', pt: { xs: 8, sm: 10, md: 12 }, pb: { xs: 3, sm: 4 }, overflow: 'hidden' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 4, sm:8, md: 8, lg:4 } }}>
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
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }, 
              mb: { xs: 1, sm: 2 },
              width: '100%'
            }}
          >
            Your One-Stop Destination for Local Experts
          </Typography>
          <Typography
            variant="h7"
            sx={{ 
              color: 'white', 
              opacity: 0.8, 
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1rem' },
              width: '100%'
            }}
          >
            Book Expert Services Online – Anytime, Anywhere
          </Typography>
        </Box>

        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            gap: { xs: 0.5, sm: 1 },
            pb: 1
          }}
        >
          {extendedServices.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </Box>

      </Container>
    </Box>
  );
};

export default ServiceDirectory;
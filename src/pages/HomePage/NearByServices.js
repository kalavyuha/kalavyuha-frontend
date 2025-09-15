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
import { constant } from '../../constant';

import MusiceTherapy from '../../assets/images/nearby/music_therapy.jpeg';
import Makeup from '../../assets/images/nearby/makeup_service.jpeg';
import SkinIssue from '../../assets/images/nearby/skin_issue.jpeg';
import DisPersonFitness from '../../assets/images/nearby/disabled_person_fitness.jpeg';

// Dynamic services will be fetched from API and stored here
// We keep these images as possible fallbacks if the API doesn't return an image
const FALLBACK_IMAGE = MusiceTherapy;

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
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  // Configure API details
  const API_URL = `${constant.baseUrl}api/v1/Service/popularServiceAndBusinesses/?SearchFor=Service&latitude=78.9897978&longitude=28.6767965&page=1`;
  const AUTH_TOKEN = 'VIRoHdqUAtpklgKg';

  useEffect(() => {
    let mounted = true;

    const headerVariants = [
      { 'Authorization': `Bearer ${AUTH_TOKEN}` },
    ];

    const tryFetchWithHeaders = async (headers) => {
      try {
        const resp = await fetch(API_URL, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', ...headers },
          // mode: 'cors' // browser will select; uncomment to force if needed
        });
        const text = await resp.text();
        let json;
        try { json = JSON.parse(text); } catch (e) { json = text; }
        return { resp, body: json };
      } catch (err) {
        return { error: err };
      }
    };

    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      setDebugInfo(null);
      try {
        let finalJson = null;
        let finalStatus = null;
        // iterate header variants until we get items or exhaust options
        for (const hdr of headerVariants) {
          const { resp, body, error: fetchErr } = await tryFetchWithHeaders(hdr);
          if (fetchErr) {
            // network error, try next
            continue;
          }
          finalStatus = resp?.status;
          // prefer structured JSON
          const items = body?.Data?.items || (body && body.Data && body.Data.items) || [];
          if (Array.isArray(items) && items.length > 0) {
            finalJson = body;
            // map items and break
            const mapped = items.map(it => ({
              title: it.ServiceName  || 'Service',
              image: it.ServiceImage || FALLBACK_IMAGE,
              action: 'BOOK NOW',
              link: `/business/${it.BussinessId || ''}`
            }));
            if (mounted) setServices([...mapped, ...mapped]);
            setDebugInfo({ usedHeaders: hdr, status: finalStatus, itemCount: items.length });
            return;
          }

          // keep last response for debug if none returned items
          setDebugInfo({ triedHeaders: hdr, status: finalStatus, body });
        }

        // If we got here, no header variant returned items
        setError('No services available.');
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchServices();

    return () => { mounted = false; };
  }, []);

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
          {loading && (
            <Typography sx={{ color: 'white', p: 2 }}>Loading services...</Typography>
          )}
          {error && (
            <Typography sx={{ color: 'white', p: 2 }}>{error}</Typography>
          )}

          {!loading && !error && services.length === 0 && (
            <Typography sx={{ color: 'white', p: 2 }}>No services found.</Typography>
          )}

          {!loading && !error && services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </Box>

      </Container>
    </Box>
  );
};

export default ServiceDirectory;
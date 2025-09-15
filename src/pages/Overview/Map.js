import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material'
import LocationOn from "@mui/icons-material/LocationOn";

const Map = ({
  latitude = 39.3350139,
  longitude = 78.0446632,
  businessName = "Business Location",
  region = "",
  streetAddress = "",
  showBusinessInfo = true,
  businessData = null,
}) => {
  // If we have business data from search results, use the first business location
  const firstBusiness = businessData && businessData.length > 0 ? businessData[0] : null;
  const displayLatitude = firstBusiness?.Latitude || latitude;
  const displayLongitude = firstBusiness?.Longitude || longitude;
  const displayBusinessName = firstBusiness?.BusinessName || businessName;
  const displayRegion = firstBusiness?.Region || region;
  const displayStreetAddress = firstBusiness?.StreetAddress || streetAddress;
  
  const GOOGLE_API_KEY = 'AIzaSyCYmK7_q9luqg3YaFAxxWjNW4-zzoWF3KI';
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_API_KEY}&q=${displayLatitude},${displayLongitude}&zoom=15`;
  const googleMapsEmbedUrlNoKey = `https://maps.google.com/maps?q=${displayLatitude},${displayLongitude}&z=15&output=embed`;

  const openDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${displayLatitude},${displayLongitude}`,
      "_blank"
    );
  };

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/taxi+near+${displayLatitude},${displayLongitude}`,
      "_blank"
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      {showBusinessInfo ? (
        <Grid container spacing={0}>
          <Grid item xs={12} sm={12} md={12}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                background: "transparent",
                boxShadow: "none",
                height: {
                  xs: "12rem",
                  sm: "12rem",
                  md: "15rem",
                  lg: "15rem",
                },
              }}
            >
              <CardContent
                sx={{
                  padding: "0",
                  width: "100%",
                  height: {
                    xs: "12rem",
                    sm: "12rem",
                    md: "15rem",
                    lg: "15rem",
                  },
                }}
              >
                <iframe
                  title="Google Maps Location"
                  src={googleMapsEmbedUrlNoKey}
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '16px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ height: '30vh', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              flex: 1,
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <iframe
              title="Google Maps Location"
              src={googleMapsEmbedUrlNoKey}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Map

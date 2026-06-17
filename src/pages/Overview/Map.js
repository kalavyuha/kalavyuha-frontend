import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

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
  const firstBusiness =
    businessData && businessData.length > 0 ? businessData[0] : null;

  const displayLatitude = firstBusiness?.Latitude || latitude;
  const displayLongitude = firstBusiness?.Longitude || longitude;
  const displayBusinessName =
    firstBusiness?.BusinessName || businessName;
  const displayRegion = firstBusiness?.Region || region;
  const displayStreetAddress =
    firstBusiness?.StreetAddress || streetAddress;

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
    <Box
      sx={{
        mt: 3,
        p: 0,
        lineHeight: 0, 
      }}
    >
      {showBusinessInfo ? (
        <Grid
          container
          spacing={0}
          sx={{
            p: 0,
            m: 0,
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              p: 0,
              m: 0,
            }}
          >
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                background: "transparent",
                boxShadow: "none",
                p: 0,
                m: 0,
              }}
            >
              <CardContent
                sx={{
                  p: 0,
                  "&:last-child": {
                    pb: 0, // remove MUI default bottom padding
                  },
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
                  style={{
                    border: 0,
                    borderRadius: "16px",
                    display: "block", // removes bottom gap
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Box
          sx={{
            height: "30vh",
            display: "flex",
            flexDirection: "column",
            p: 0,
            m: 0,
            lineHeight: 0,
          }}
        >
          <Box
            sx={{
              flex: 1,
              borderRadius: "16px",
              overflow: "hidden",
              p: 0,
              m: 0,
            }}
          >
            <iframe
              title="Google Maps Location"
              src={googleMapsEmbedUrlNoKey}
              width="100%"
              height="100%"
              style={{
                border: 0,
                display: "block", // removes bottom gap
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Map;
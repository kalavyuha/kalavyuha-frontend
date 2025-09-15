import React from "react";
import {
  Grid,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Button,
  Skeleton,
} from "@mui/material";
import Done from "@mui/icons-material/Done";
import Clear from "@mui/icons-material/Clear";
import LocationOn from "@mui/icons-material/LocationOn";
import Circle from "@mui/icons-material/Circle";

// Skeleton component for loading state
const AboutUsSkeleton = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="80%" height={20} sx={{ mb: 3 }} />

      <Grid container spacing={20}>
        <Grid item xs={12} sm={7}>
          <Skeleton variant="text" width={150} height={30} sx={{ mb: 2 }} />
          <Box sx={{ columnCount: { xs: 1, sm: 2 }, columnGap: 2 }}>
            {[...Array(8)].map((_, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                  breakInside: "avoid",
                }}
              >
                <Skeleton
                  variant="circular"
                  width={24}
                  height={24}
                  sx={{ mr: 1 }}
                />
                <Skeleton variant="text" width={120} height={20} />
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} sm={5}>
          <Skeleton variant="text" width={150} height={30} sx={{ mb: 2 }} />
          {[...Array(7)].map((_, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <Skeleton
                variant="circular"
                width={12}
                height={12}
                sx={{ mr: 1 }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Skeleton variant="text" width={80} height={20} />
                <Skeleton variant="text" width={100} height={20} />
              </Box>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12} sm={7}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={{ xs: "40vw", sm: "20vw", lg: "15vw" }}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <Box
                sx={{
                  background: "#e2e6ea",
                  height: { xs: "max-content", sm: "20vw", lg: "15vw" },
                  padding: { xs: "7px", sm: "unset", md: "unset" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box display="flex" alignItems="flex-start">
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    sx={{ mr: 2 }}
                  />
                  <Box>
                    <Skeleton
                      variant="text"
                      width={200}
                      height={30}
                      sx={{ mb: 1 }}
                    />
                    <Skeleton
                      variant="text"
                      width={150}
                      height={20}
                      sx={{ mb: 1 }}
                    />
                    <Skeleton
                      variant="text"
                      width={180}
                      height={20}
                      sx={{ mb: 3 }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row", md: "row" },
                        gap: 1,
                      }}
                    >
                      <Skeleton variant="rectangular" width={120} height={32} />
                      <Skeleton variant="rectangular" width={120} height={32} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

const AboutUs = ({
  facilities,
  timing,
  timingData,
  latitude = 30.7333,
  longitude = 76.7794,
  description = "",
  region,
  StreetAddress,
  buisnessName,
  isLoading = false,
}) => {
  const GOOGLE_API_KEY = "AIzaSyBdWs3MgBKaIDNzkk5pvlfqO2SeobfsWCk";

  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_API_KEY}&q=${latitude},${longitude}&zoom=15`;
  const googleMapsEmbedUrlNoKey = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  const openDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      "_blank"
    );
  };

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/taxi+near+${latitude},${longitude}`,
      "_blank"
    );
  };

  // Transform API data if provided
  const formatTimingData = (timingDataArray) => {
    if (!timingDataArray || !Array.isArray(timingDataArray)) return [];

    return timingDataArray.map((dayData) => {
      // Handle new API response with AlwaysOpen and Closed fields
      if (typeof dayData.AlwaysOpen !== 'undefined' && typeof dayData.Closed !== 'undefined') {
        if (dayData.Closed) {
          return {
            day: dayData.Day,
            time: "Closed",
          };
        }
        if (dayData.AlwaysOpen) {
          return {
            day: dayData.Day,
            time: "24 Hours",
          };
        }
        // If not always open and not closed, check for custom time
        if (dayData.CustomeTime && dayData.CustomeTime.StartTime && dayData.CustomeTime.CloseTime) {
          return {
            day: dayData.Day,
            time: `${dayData.CustomeTime.StartTime} - ${dayData.CustomeTime.CloseTime}`,
          };
        }
      }
      // Support status/enabled format (fallback)
      if (dayData.status) {
        if (dayData.status === "closed" || dayData.enabled === false) {
          return {
            day: dayData.day || dayData.Day,
            time: "Closed",
          };
        }
        if (dayData.status === "24hours") {
          return {
            day: dayData.day || dayData.Day,
            time: "24 Hours",
          };
        }
        if (dayData.status === "appointment") {
          return {
            day: dayData.day || dayData.Day,
            time: "By appointments only",
          };
        }
        if (dayData.status === "open") {
          return {
            day: dayData.day || dayData.Day,
            time: `${dayData.startTime || ""} - ${dayData.endTime || ""}`,
          };
        }
      }
      // Fallback to old format
      if (dayData.Closed || !dayData.CustomeTime) {
        return {
          day: dayData.Day,
          time: "Closed",
        };
      }
      if (dayData.AlwaysOpen) {
        return {
          day: dayData.Day,
          time: "24 Hours",
        };
      }
      const startTime = dayData.CustomeTime?.StartTime;
      const closeTime = dayData.CustomeTime?.CloseTime;
      return {
        day: dayData.Day,
        time: `${startTime || ""} - ${closeTime || ""}`,
      };
    });
  };

  // Use timingData if provided, otherwise use timing prop
  const processedTiming = timingData ? formatTimingData(timingData) : timing;

  const facilityLabels = {
    ACCooler: "AC Cooler",
    Accessibility: "Accessibility",
    AtHomeService: "At-Home Service",
    ExtraAmenities: "Extra Amenities",
    FreeWiFi: "Free WiFi",
    InstantConfirmation: "Instant Confirmation",
    Internet: "Internet",
    Parking: "Parking",
    ParkingFacility: "Parking Facility",
    PetFriendly: "Pet Friendly",
    SpaAvailable: "Spa Available",
    ValetParking: "Valet Parking",
    VirtualConsultation: "Virtual Consultation",
    Water: "Water",
    GymInside: "Gym Inside",
  };

  const flatFacilities = [];

  if (facilities) {
    Object.entries(facilities).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          flatFacilities.push({
            key: subKey,
            label: facilityLabels[subKey] || subKey,
            available: subValue,
          });
        });
      } else if (typeof value === "boolean") {
        flatFacilities.push({
          key,
          label: facilityLabels[key] || key,
          available: value,
        });
      }
    });
  }

  // Show skeleton while loading
  if (isLoading) {
    return <AboutUsSkeleton />;
  }

  // Check if we have any data to show
  const hasData =
    buisnessName ||
    description ||
    (facilities && Object.keys(facilities).length > 0) ||
    (processedTiming && processedTiming.length > 0);

  // Don't render component if no data available
  if (!hasData) {
    return null;
  }

  return (
    <Box sx={{ padding: { xs: 0, sm: 4 } }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          fontSize: { xs: "20px", sm: "24px", md: "28px" },
        }}
      >
        About
      </Typography>
      {description && (
        <Typography
          variant="body1"
          paragraph
          sx={{ fontSize: { xs: "0.7rem", sm: "0.8", md: "0.9rem" } }}
        >
          {description}
        </Typography>
      )}
      <Grid container spacing={20}>
        {flatFacilities.length > 0 && (
          <Grid item xs={12} sm={7}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1rem", sm: "1.2rem" },
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Accessibility
            </Typography>
            <List
              sx={{
                columnCount: { xs: 1, sm: 2 },
                columnGap: 2,
              }}
            >
              {flatFacilities &&
                flatFacilities.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      display: "flex",
                      breakInside: "avoid",
                      padding: 0,
                      alignItems: "flex-start",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {item.available ? (
                        <Done color="success" />
                      ) : (
                        <Clear color="error" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: { xs: "10px", sm: "12px", md: "13px" },
                        fontWeight: 600,
                      }}
                    />
                  </ListItem>
                ))}
            </List>
          </Grid>
        )}

        {processedTiming && processedTiming.length > 0 && (
          <Grid item xs={12} sm={flatFacilities.length > 0 ? 5 : 12}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1rem", sm: "1.2rem" },
                fontWeight: "bold",
              }}
            >
              Opening times
            </Typography>
            <List>
              {processedTiming.map((schedule, index) => (
                <ListItem key={index} sx={{ padding: "0px" }}>
                  <ListItemIcon sx={{ minWidth: "32px" }}>
                    {schedule.time === "Closed" ? (
                      <Circle
                        fontSize="small"
                        sx={{ height: "auto", width: "12px" }}
                        color="error"
                      />
                    ) : (
                      <Circle
                        sx={{ height: "auto", width: "12px" }}
                        fontSize="small"
                        color={"success"}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: { xs: "10px", sm: "12px", md: "13px" },
                            fontWeight: 600,
                          }}
                        >
                          {schedule.day}
                        </Box>
                        <Box
                          sx={{
                            color: "grey.500",
                            fontSize: { xs: "10px", sm: "12px", md: "13px" },
                          }}
                        >
                          {schedule.time}
                        </Box>
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        )}

        <Grid item xs={12}>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={12} md={6}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  // flexWrap: { xs: "wrap", sm: "nowrap" },
                  background: "transparent",
                  boxShadow: "none",
                  height: {
                    xs: "12rem",
                    sm: "12rem",
                    md: "15rem",
                    lg: "15rem",
                  }, //-----CHANGED HEIGHT
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
                    }, //-----CHANGED HEIGHT
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
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
              <Box
                display="flex"
                sx={{
                  background: "#e2e6ea",
                  alignItems: "center",
                  justifyContent: "center",
                  height: {
                    xs: "12rem",
                    sm: "12rem",
                    md: "15rem",
                    lg: "15rem",
                  },
                  // height: { xs: "15vw", sm: "15vw", lg: "15vw" },
                  padding: { xs: "5px", sm: "unset", md: "unset" },
                }}
              >
                <Box display="flex" alignItems="flex-start">
                  <LocationOn
                    sx={{
                      marginRight: 2,
                      fontSize: { xs: "1.5rem", sm: "2rem", lg: "2.5rem" },
                    }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontSize: { xs: "1rem", sm: "1.2rem", lg: "1.5rem" },
                      }}
                    >
                      {buisnessName}
                    </Typography>
                    <Typography
                      variant="body2"
                      paragraph
                      sx={{
                        fontSize: { xs: "0.8rem", sm: "0.9rem", lg: "1rem" },
                        marginBottom: "0",
                      }}
                    >
                      {region || ""}
                    </Typography>
                    <Typography
                      variant="body2"
                      paragraph
                      sx={{
                        fontSize: { xs: "0.8rem", sm: "0.9rem", lg: "1rem" },
                      }}
                    >
                      {StreetAddress || ""}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row", md: "row" },
                        gap: 1,
                        marginTop: { xs: "20px", sm: "40px" },
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={openDirections}
                        sx={{
                          background: "#1b4d69",
                          fontSize: { xs: "8px", sm: "10px", lg: "10px" },
                          fontWeight: 600,
                        }}
                      >
                        How to get there?
                      </Button>
                      <Button
                        variant="contained"
                        onClick={openGoogleMaps}
                        sx={{
                          background: "#1b4d69",
                          fontSize: { xs: "8px", sm: "10px", lg: "10px" },
                          fontWeight: 600,
                        }}
                      >
                        Get there by taxi!
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutUs;

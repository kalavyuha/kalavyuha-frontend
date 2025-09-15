import React, { useRef, useState, useEffect } from "react";
import { Box, Container, Typography, Button, Grid } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ArrowLeft } from "lucide-react";
import { message } from "antd";

import { useLocation, useNavigate } from "react-router-dom";
import ServiceFormBox from "./components/serviceMenu";
import LeftPanel from "./components/leftpanel";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1b4d69",
    },
    background: {
      default: "#fff",
    },
  },
});

export default function BusinessServiceInfo() {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialData = () => {
    try {
      const storedData = localStorage.getItem("formData");
      return storedData ? JSON.parse(storedData) : {};
    } catch (error) {
      console.error("Error parsing stored data:", error);
      return {};
    }
  };

  const previousData = location.state || getInitialData();
  const {
    firstName,
    lastName,
    email,
    countryCode,
    phone,
    teamSize,
    teamMembers,
  } = previousData || {};

  const defaultServices = [
    {
      id: "cat-1",
      name: "Category Name",
      expanded: true,
      services: [
        {
          id: Date.now().toString(),
          name: "",
          description: "",
          price: "",
          duration: "",
          durationType: "mins",
          staff: [],
          uploaded: false,
          image: null,
        },
      ],
    },
  ];

  const [services, setServices] = useState(
    previousData.services?.length > 0 ? previousData.services : defaultServices
  );

  useEffect(() => {
    const updateLocalStorage = () => {
      try {
        const combinedData = {
          ...previousData,
          services: services,
        };
        localStorage.setItem("formData", JSON.stringify(combinedData));
      } catch (error) {
        console.error("Error updating localStorage:", error);
      }
    };
    updateLocalStorage();
  }, [services, previousData]);

  const handleBackTeamPresence = () => {
    navigate("/business/team-presence", {
      state: { ...previousData, services },
    });
  };

  const handleNextDocumentUpload = () => {
    const validServicesCount = services.reduce((count, category) => {
      return (
        count +
        category.services.filter((service) => service.name.trim() !== "").length
      );
    }, 0);

    if (validServicesCount < 2) {
      message.error(
        "Please add at least 2 valid services (with non-empty names) across all categories."
      );
      return;
    }
    const formData = {
      ...previousData,
      services: services.map((category) => ({
        id: category.id,
        name: category.name,
        expanded: category.expanded,
        services: category.services.map((service) => ({
          id: service.id,
          name: service.name.trim(),
          description: service.description,
          price: service.price,
          duration: service.duration,
          durationType: service.durationType,
          staff: service.staff,
          uploaded: service.uploaded,
          image: service.image instanceof File ? null : service.image,
        })),
      })),
    };

    localStorage.setItem("formData", JSON.stringify(formData));
    navigate("/business/hours", { state: formData });
  };

  const handleServicesChange = (updatedCategories) => {
    setServices(updatedCategories);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          overflow: "hidden",
          bgcolor: "background.default",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{ display: "flex", flexGrow: 1 }}
        >
          <Grid container>
            {/* Left */}
            <Grid item xs={12} md={4} square>
              <LeftPanel
                firstName={firstName}
                lastName={lastName}
                email={email}
                countryCode={countryCode}
                phone={phone}
                isSignIn={true}
                formData={previousData}
              />
            </Grid>

            {/* Right */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{ 
                height: "100vh", 
                overflow: "auto",
                maxWidth: "100%",
                wordWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              <Box
                sx={{
                  mx: {xs:2, sm:3, md:4},
                  px: {xs:1, sm:1.5, md:2},
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mt:{xs:6},
                  maxWidth: "100%",
                  overflow: "hidden",
                  // bgcolor:"red"
                }}
              >
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    color: "#1b4d69",
                    textAlign: "center",
                    fontSize: {
                      xs: "1.65rem",
                      sm: "1.8rem",
                      md: "2rem",
                      lg: "2.2rem",
                    },
                  }}
                >
                  Detailed Service Information
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{ 
                    mb: {xs:6, md:4}, 
                    textAlign: "center",
                    maxWidth: "100%",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    px: { xs: 1, sm: 2 },
                    fontSize: {
                      xs: "0.8rem",
                      sm: "0.9rem",
                      md: "1rem",
                      lg: "1.1rem",
                    },
                  }}
                >
                  Showcase your service offerings with details on pricing,{" "}
                  <br />
                  duration, and available staff.
                </Typography>

                <ServiceFormBox
                  onServicesChange={handleServicesChange}
                  services={services}
                  teamMembers={teamMembers || []}
                />

                <Box sx={{ 
                  mt: 2, 
                  maxWidth: 600, 
                  width: "100%", 
                  mx: { xs: 1, sm: 2, md: 3 },
                  px: { xs: 0.5, sm: 1, md: 1.5 },
                  overflow: "hidden",
                }}>
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Grid
                      container
                      sx={{ justifyContent: "space-between" }}
                      spacing={2}
                    >
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          sx={{
                            mt: 3,
                            mb: 2,
                            borderRadius: "24px",
                            color: "black",
                            textTransform: "none",
                            borderColor: "#d9d9d9",
                            background: "#fbfbfb",
                          }}
                          onClick={handleBackTeamPresence}
                        >
                          <ArrowLeft
                            className="mr-2"
                            style={{ width: "26px", height: "16px" }}
                          />
                          <b>Go Back</b>
                        </Button>
                      </Grid>

                      <Grid item xs={6}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{
                            mt: 3,
                            mb: 2,
                            textTransform: "none",
                            borderRadius: "24px",
                            bgcolor: "black",
                            color: "white",
                            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.8)" },
                          }}
                          onClick={handleNextDocumentUpload}
                          disabled={
                            services.reduce(
                              (total, cat) => total + cat.services.length,
                              0
                            ) < 2
                          }
                        >
                          Next step
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

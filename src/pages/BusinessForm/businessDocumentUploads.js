import React, { useRef, useState, useEffect } from "react";
import { Box, Container, Typography, Button, Grid } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentUpload from "../../components/documentUploads";
import LeftPanel from "./components/leftpanel";
import { createBusinessDetails } from "./Apis/businessDetailsApi.js";
import { createStaff } from "./Apis/staffApi.js";
import { createServices } from "./Apis/servicesApi.js";
import { uploadDocuments } from "./Apis/documentsApi.js";
import { createBusinessHours } from "./Apis/businessHoursApi.js";

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

export default function BusinessDocumentUploads() {
  const authToken = "VIRoHdqUAtpklgKg";

  const location = useLocation();
  const storedData = localStorage.getItem("formData");
  const previousData =
    location.state || (storedData ? JSON.parse(storedData) : {});
  const navigate = useNavigate();

  const [fileList, setFileList] = useState(
    localStorage.getItem("documentUploads")
      ? JSON.parse(localStorage.getItem("documentUploads"))
      : {}
  );

  const {
    firstName,
    lastName,
    email,
    countryCode,
    phone,
    teamSize,
    teamMembers,
    services,
  } = previousData || {};

  const handleBackTeamPresence = () => {
    localStorage.setItem(
      "formData",
      JSON.stringify({
        ...previousData,
        documentUploads: fileList,
      })
    );
    navigate("/business-hours", {
      state: {
        ...previousData,
        documentUploads: fileList,
      },
    });
  };

  // backend integration
  const handleSubmit = async () => {
    try {
      const requiredDocuments = [
        "Pan Card (Owner)",
        "GST Certificate",
        "Utility Bills",
      ];

      const missingDocuments = requiredDocuments.filter((doc) => {
        return !fileList[doc] || fileList[doc].length === 0;
      });

      if (missingDocuments.length > 0) {
        alert(
          `Please upload all required documents: ${missingDocuments.join(", ")}`
        );
        return;
      }

      // Debug: Log the previousData structure
      console.log("Previous Data:", previousData);
      console.log("MerchantAccountID:", previousData.MerchantAccountID);
      console.log("Business Role:", previousData.businessRole);
      console.log("Form Data:", previousData.formData);

      // 1. Submit busniessDetails
      const businessPayload = {
        BussinessUserId: Number(previousData.MerchantAccountID),
        BussinessType: previousData.businessRole,
        BusinessName: previousData.formData.businessName,
        ProfileImage: previousData.formData.profilePicture?.s3Url?.url || null,
        Introduction: previousData.formData.introduction ?? null,
        ShopNumber: previousData.formData.shopNumber ?? null,
        StreetAddress: previousData.formData.streetAddress,
        Nearby: null,
        ZipCode: previousData.formData.zipCode,
        Region: `${previousData.formData.city}, ${previousData.formData.state}`,
        Latitude: parseFloat(previousData.formData.adrsLatitude) || 0.0,
        Longitude: parseFloat(previousData.formData.adrsLongitude) || 0.0,
        LikesCount: 0,
        website: previousData.formData.website ?? null,
        VisitCount: 310,
        OpeningTime: previousData.formData.openingTime ?? "00:00",
        ClosingTime: previousData.formData.closingTime ?? "00:00",
        TotalStaff: Number(previousData.teamSize) || previousData.teamMembers?.length || 1,
        CreatedBy: 1,
        UpdatedBy: 1, 
      };

      // Validate required fields
      const requiredFields = ['BussinessUserId', 'BussinessType', 'BusinessName', 'StreetAddress', 'ZipCode', 'Region', 'TotalStaff'];
      const missingFields = requiredFields.filter(field => !businessPayload[field]);
      
      if (missingFields.length > 0) {
        alert(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Additional validation for specific fields
      if (isNaN(businessPayload.BussinessUserId) || businessPayload.BussinessUserId <= 0) {
        alert('Invalid BussinessUserId (MerchantAccountID)');
        return;
      }

      if (isNaN(businessPayload.TotalStaff) || businessPayload.TotalStaff <= 0) {
        alert('Invalid TotalStaff count');
        return;
      }

      if (isNaN(businessPayload.Latitude) || isNaN(businessPayload.Longitude)) {
        alert('Invalid latitude or longitude coordinates');
        return;
      }

      console.log("Business Payload:", businessPayload);
      console.log("Payload validation:", {
        BussinessUserId: typeof businessPayload.BussinessUserId,
        BussinessType: typeof businessPayload.BussinessType,
        BusinessName: typeof businessPayload.BusinessName,
        StreetAddress: typeof businessPayload.StreetAddress,
        ZipCode: typeof businessPayload.ZipCode,
        Region: typeof businessPayload.Region,
        TotalStaff: typeof businessPayload.TotalStaff,
        Latitude: typeof businessPayload.Latitude,
        Longitude: typeof businessPayload.Longitude,
      });

      const businessData = await createBusinessDetails(businessPayload);
      const businessId = Number(businessData.Data?._id);

      // 2. Submit Staff Data
      const staffPayload = previousData.teamMembers.map((member) => ({
        BussinessId: businessId,
        StaffName: member.name,
        StaffNumber: Number(member.id),
        Gender: member.gender,
        Experience: String(member.experience),
        Specialization: Array.isArray(member.role)
          ? member.role.join(", ")
          : "General",
          Role: member.role,
        ProfileImage: member.profileImage?.url || null,
      }));

      try {
        console.log(staffPayload);
        const staffData = await createStaff(staffPayload, authToken);
        console.log("StaffResponse:", staffData);
      } catch (error) {
        console.error("Error creating staff:", error);
      }

      // 3. Submit Services
      const staffMap = new Map(
        previousData.teamMembers.map((member) => [
          member.name,
          Number(member.id),
        ])
      );

      const formatDuration = (duration, type) => {
        const suffixMap = {
          days: "d",
          hours: "h",
          minutes: "m",
          months: "mo",
          mints: "m",
        };

        if (!duration || isNaN(duration)) {
          console.warn(`Invalid duration: ${duration}`);
          return "0m";
        }

        return suffixMap[type]
          ? `${duration}${suffixMap[type]}`
          : `${duration}m`;
      };

      const prepareServicePayload = (
        servicesData,
        businessId,
        staffMap,
        createdBy
      ) => {
        return {
          BussinessId: businessId,
          CreatedBy: createdBy,
          Categories: servicesData.map((category) => ({
            Id: category.id || null,
            Name: category.name,
            Expanded: category.expanded ?? true,
            Services: category.services.map((service) => ({
              Name: service.name.trim(),
              Description: service.description || "",
              Price: parseFloat(service.price) || 0,
              Duration: formatDuration(service.duration, service.durationType),
              DurationType: service.durationType || "mints",
              BookingCount: 0, // Add the missing BookingCount field
              Staff: service.staff
                .map((staffName) => staffMap.get(staffName))
                .filter(Boolean),
              Image: service.imageUrl || null,
              Uploaded: service.uploaded || false,
              IsDiscount: service.isDiscount || false,
              DiscountProvider: service.DiscountProvider || null,
              DiscountPercentage: service.DiscountPercentage || null,
            })),
          })),
        };
      };

      try {
        // Validate services data before sending
        if (!previousData.services || !Array.isArray(previousData.services)) {
          throw new Error('Services data is missing or invalid');
        }

        if (previousData.services.length === 0) {
          throw new Error('No services data found');
        }

        // Check if services have required fields
        const invalidServices = [];
        previousData.services.forEach((category, categoryIndex) => {
          if (!category.name) {
            invalidServices.push(`Category ${categoryIndex + 1}: missing name`);
          }
          if (!category.services || !Array.isArray(category.services)) {
            invalidServices.push(`Category ${categoryIndex + 1}: missing or invalid services array`);
          } else {
            category.services.forEach((service, serviceIndex) => {
              if (!service.name) {
                invalidServices.push(`Category ${categoryIndex + 1}, Service ${serviceIndex + 1}: missing name`);
              }
            });
          }
        });

        if (invalidServices.length > 0) {
          throw new Error(`Invalid services data: ${invalidServices.join(', ')}`);
        }

        const servicePayload = prepareServicePayload(
          previousData.services,
          businessId,
          staffMap,
          458
        );
        console.log("Service Payload:", servicePayload);
        console.log("Service Payload Structure:", {
          BussinessId: servicePayload.BussinessId,
          CreatedBy: servicePayload.CreatedBy,
          Categories: servicePayload.Categories?.map(cat => ({
            Name: cat.Name,
            Services: cat.Services?.map(service => ({
              Name: service.Name,
              Price: service.Price,
              Duration: service.Duration,
              BookingCount: service.BookingCount,
              Staff: service.Staff
            }))
          }))
        });
        
        // Additional validation for the prepared payload
        if (!servicePayload.BussinessId || isNaN(servicePayload.BussinessId)) {
          throw new Error('Invalid BussinessId in service payload');
        }

        if (!servicePayload.Categories || !Array.isArray(servicePayload.Categories)) {
          throw new Error('Invalid Categories in service payload');
        }

        const response = await createServices(servicePayload, authToken);
        console.log("API Response:", response);
      } catch (error) {
        console.error("Service creation failed:", error);
        throw error;
      }

      // 4. Business Hours Uploads

      const businessHoursPayload = {
        BusinessId: businessId,
        Day: previousData.formData.day || "Monday",
        AlwaysOpen: previousData.formData.alwaysOpen || false,
        Closed: previousData.formData.closed || false,
        CustomeTime: {
          StartTime: previousData.formData.startTime || "09:00",
          CloseTime: previousData.formData.closeTime || "21:00",
        },
        CreatedBy: 1,
        UpdatedBy: 1,
      };
      console.log("Business Hours Payload:", businessHoursPayload);

      try {
        const businessHoursData = await createBusinessHours(businessHoursPayload, authToken);
        console.log("Business Hours Response:", businessHoursData);
      } catch (error) {
        console.error("Error creating business hours:", error);
        // Don't throw error here to allow other uploads to continue
      }

      // 5. Documents Uploads
      await uploadDocuments(businessId, fileList, authToken);
      alert("All data uploaded successfully!");

      localStorage.removeItem("documentUploads");
      localStorage.removeItem("formData");
      window.open("/kalavyuha-frontend/business-page", "_blank");
    } catch (error) {
      console.error("Error during submission:", error);
      localStorage.setItem("documentUploads", JSON.stringify(fileList));

      if (error.message === "Document upload failed") {
        alert(
          "Document upload failed! Please reselect the documents and try again."
        );
        setFileList({});
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("documentUploads", JSON.stringify(fileList));
  }, [fileList]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          bgcolor: "background.default",
          overflow: "hidden",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{ display: "flex", flexGrow: 1, margin: 0 }}
        >
          <Grid container>
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
              sx={{ alignContent: "center", height: "100vh", overflow: "auto" }}
            >
              <Box
                sx={{
                  mt: 10,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 0,
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
                      xs: "1.2rem",
                      sm: "1.5rem",
                      md: "1.8rem",
                      lg: "2rem",
                    },
                  }}
                >
                  Final Step! Verify Your Business
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{ mb: 3, textAlign: "center" }}
                >
                  Complete your business profile by submitting essential
                  <br /> documents for verification.
                </Typography>

                <DocumentUpload
                  setFileListParent={(files) => {
                    setFileList(files);
                  }}
                  initialFiles={fileList}
                />

                <Box sx={{ mt: 1, maxWidth: 600, width: "100%", mx: 4 }}>
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
                          onClick={handleSubmit}
                        >
                          Upload
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

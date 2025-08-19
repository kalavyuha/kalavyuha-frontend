// Business Hours Upload - Single API Call for all days is handled HERE in businessDocumentUploads.js via createBusinessHours from businessHoursApi.js
import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  LinearProgress,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentUpload from "../../components/documentUploads";
import LeftPanel from "./components/leftpanel";
import { createBusinessDetails } from "./Apis/businessDetailsApi.js";
import { createStaff } from "./Apis/staffApi.js";
import { createServices } from "./Apis/servicesApi.js";
import { constant } from "../../constant.js";
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

  const [fileList, setFileList] = useState(() => {
    const saved = localStorage.getItem("documentUploads");
    return saved ? JSON.parse(saved) : {};
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState("");

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

  console.log("Previous Data:", previousData.businessHours);

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
      setIsUploading(true);
      setUploadProgress(0);
      setUploadStage("Initializing upload...");

      // Validate auth token
      if (!authToken) {
        throw new Error("Auth token is missing");
      }

      const requiredDocuments = [
        "Pan Card (Owner)",
        "GST Certificate",
        "Utility Bills",
      ];
      // -----------------------------
      const missingDocuments = requiredDocuments.filter((doc) => {
        return !fileList[doc] || fileList[doc].length === 0;
      });

      if (missingDocuments.length > 0) {
        alert(
          `Please upload all required documents: ${missingDocuments.join(", ")}`
        );
        setIsUploading(false);
        return;
      }
      // Progress update
      setUploadProgress(5);
      setUploadStage("Creating business profile...");

      // 1. Submit busniessDetails
      const businessPayload = {
        BussinessUserId: Number(previousData.MerchantAccountID),
        BussinessType: previousData.businessRole,
        BusinessName: previousData.formData.businessName,
        ProfileImage: previousData.formData.profilePicture?.s3Url?.url || null,
        Introduction: previousData.formData.introduction ?? null,
        ShopNumber: previousData.formData.shopNumber ?? null,
        StreetAddress: previousData.formData.streetAddress,
        City: previousData.formData.city,
        State: previousData.formData.state,
        ZipCode: previousData.formData.zipCode,
        Country: previousData.formData.country,
        Latitude: parseFloat(previousData.formData.adrsLatitude) || 0.0,
        Longitude: parseFloat(previousData.formData.adrsLongitude) || 0.0,
        LikesCount: 0,
        website: previousData.formData.website ?? null,
        VisitCount: 310,
        OpeningTime: previousData.formData.openingTime ?? "00:00",
        ClosingTime: previousData.formData.closingTime ?? "00:00",
        TotalStaff:
          Number(previousData.teamSize) ||
          previousData.teamMembers?.length ||
          1,
        CreatedBy: 1,
        UpdatedBy: 1,
      };

      // Validate required fields
      const requiredFields = [
        "BussinessUserId",
        "BussinessType",
        "BusinessName",
        "StreetAddress",
        "ZipCode",
        "TotalStaff",
      ];
      const missingFields = requiredFields.filter(
        (field) => !businessPayload[field]
      );

      if (missingFields.length > 0) {
        alert(`Missing required fields: ${missingFields.join(", ")}`);
        return;
      }

      // Additional validation for specific fields
      if (
        isNaN(businessPayload.BussinessUserId) ||
        businessPayload.BussinessUserId <= 0
      ) {
        alert("Invalid BussinessUserId (MerchantAccountID)");
        return;
      }

      if (
        isNaN(businessPayload.TotalStaff) ||
        businessPayload.TotalStaff <= 0
      ) {
        alert("Invalid TotalStaff count");
        return;
      }

      if (isNaN(businessPayload.Latitude) || isNaN(businessPayload.Longitude)) {
        alert("Invalid latitude or longitude coordinates");
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
      console.log("Business Creation Response:", businessData);

      // Progress update
      setUploadProgress(20);
      setUploadStage("Processing business details...");

      // Handle large integer IDs properly
      const businessId = businessData.Data?._id;
      console.log("Raw Business ID:", businessId);
      console.log("Business ID type:", typeof businessId);

      if (!businessId) {
        throw new Error("No business ID returned from business creation");
      }

      // Convert to number carefully for large integers
      const businessIdNum =
        typeof businessId === "string"
          ? parseInt(businessId)
          : Number(businessId);
      console.log("Converted Business ID:", businessIdNum);

      if (isNaN(businessIdNum)) {
        throw new Error("Invalid business ID returned from business creation");
      }

      // Progress update
      setUploadProgress(30);
      setUploadStage("Adding team members...");

      // 2. Submit Staff Data
      if (previousData.teamMembers && previousData.teamMembers.length > 0) {
        console.log("Raw team members data:", previousData.teamMembers);

        const staffPayload = previousData.teamMembers.map((member, index) => {
          console.log(`Processing member ${index + 1}:`, member);
          console.log(`Member role type:`, typeof member.role);
          console.log(`Member role value:`, member.role);

          // Convert role to string safely
          let roleString = "General";
          if (Array.isArray(member.role)) {
            roleString = member.role.join(", ");
          } else if (typeof member.role === "string") {
            roleString = member.role;
          } else if (member.role && typeof member.role === "object") {
            // Handle object case - try to extract meaningful value
            if (member.role.value) {
              roleString = member.role.value;
            } else if (member.role.label) {
              roleString = member.role.label;
            } else {
              roleString = JSON.stringify(member.role);
            }
          }

          return {
            BussinessId: String(businessIdNum), // Send as string to avoid precision issues
            StaffName: member.name || "Unknown",
            StaffNumber: Number(member.id) || index + 1, // Use index+1 as fallback
            Gender: member.gender || "Other",
            Experience: String(member.experience) || "0",
            Specialization: roleString,
            Role: roleString,
            ProfileImage: member.profileImage?.url || null,
          };
        });

        console.log("Staff Payload:", staffPayload);
        console.log(
          "Staff Payload Validation:",
          staffPayload.map((staff) => ({
            BussinessId: `${typeof staff.BussinessId} (${staff.BussinessId})`,
            StaffName: `${typeof staff.StaffName} (${staff.StaffName})`,
            StaffNumber: `${typeof staff.StaffNumber} (${staff.StaffNumber})`,
            Gender: `${typeof staff.Gender} (${staff.Gender})`,
            Experience: `${typeof staff.Experience} (${staff.Experience})`,
            Specialization: `${typeof staff.Specialization} (${
              staff.Specialization
            })`,
            Role: `${typeof staff.Role} (${staff.Role})`,
            ProfileImage: `${typeof staff.ProfileImage} (${
              staff.ProfileImage
            })`,
          }))
        );

        try {
          const staffData = await createStaff(staffPayload, authToken);
          console.log("StaffResponse:", staffData);

          // Progress update
          setUploadProgress(45);
          setUploadStage("Staff added successfully...");
        } catch (error) {
          console.error("Error creating staff:", error);
          console.error(
            "Staff payload that caused error:",
            JSON.stringify(staffPayload, null, 2)
          );
          throw new Error(`Staff creation failed: ${error.message}`);
        }
      } else {
        console.warn("No team members data found, skipping staff creation");
      }

      // Progress update
      setUploadProgress(50);
      setUploadStage("Setting up services...");

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
          // mints: "m",
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
          BussinessId: businessIdNum,
          CreatedBy: createdBy,
          Categories: servicesData.map((category) => ({
            Id: category.id || null,
            Name: category.name,
            Expanded: category.expanded ?? true,
            Services: category.services.map((service) => {
              const imageUrl =
                service.image?.s3Url?.url || service.imageUrl || null;
              console.log(`Transforming service "${service.name}":`, {
                originalImage: service.image,
                extractedImageUrl: imageUrl,
                uploaded: service.uploaded,
              });

              return {
                Name: service.name.trim(),
                Description: service.description || "",
                Price: parseFloat(service.price) || 0,
                Duration: formatDuration(
                  service.duration,
                  service.durationType
                ),
                DurationType: service.durationType || "mints",
                BookingCount: 0, // Add the missing BookingCount field
                Staff: service.staff
                  .map((staffName) => staffMap.get(staffName))
                  .filter(Boolean),
                Image: imageUrl,
                Uploaded: service.uploaded || false,
                IsDiscount: service.isDiscount || false,
                DiscountProvider: service.DiscountProvider || null,
                DiscountPercentage: service.DiscountPercentage || null,
              };
            }),
          })),
        };
      };

      try {
        // Validate services data before sending
        if (!previousData.services || !Array.isArray(previousData.services)) {
          throw new Error("Services data is missing or invalid");
        }

        if (previousData.services.length === 0) {
          throw new Error("No services data found");
        }

        // Check if services have required fields
        const invalidServices = [];
        previousData.services.forEach((category, categoryIndex) => {
          if (!category.name) {
            invalidServices.push(`Category ${categoryIndex + 1}: missing name`);
          }
          if (!category.services || !Array.isArray(category.services)) {
            invalidServices.push(
              `Category ${categoryIndex + 1}: missing or invalid services array`
            );
          } else {
            category.services.forEach((service, serviceIndex) => {
              if (!service.name) {
                invalidServices.push(
                  `Category ${categoryIndex + 1}, Service ${
                    serviceIndex + 1
                  }: missing name`
                );
              }
            });
          }
        });

        if (invalidServices.length > 0) {
          throw new Error(
            `Invalid services data: ${invalidServices.join(", ")}`
          );
        }

        const servicePayload = prepareServicePayload(
          previousData.services,
          businessIdNum,
          staffMap,
          458
        );
        console.log("Service Payload:", servicePayload);
        console.log("Service Payload Structure:", {
          BussinessId: servicePayload.BussinessId,
          CreatedBy: servicePayload.CreatedBy,
          Categories: servicePayload.Categories?.map((cat) => ({
            Name: cat.Name,
            Services: cat.Services?.map((service) => ({
              Name: service.Name,
              Price: service.Price,
              Duration: service.Duration,
              BookingCount: service.BookingCount,
              Staff: service.Staff,
            })),
          })),
        });

        // Additional validation for the prepared payload
        if (!servicePayload.BussinessId || isNaN(servicePayload.BussinessId)) {
          throw new Error("Invalid BussinessId in service payload");
        }

        if (
          !servicePayload.Categories ||
          !Array.isArray(servicePayload.Categories)
        ) {
          throw new Error("Invalid Categories in service payload");
        }

        const response = await createServices(servicePayload, authToken);
        console.log("API Response:", response);

        // Progress update
        setUploadProgress(65);
        setUploadStage("Services configured successfully...");
      } catch (error) {
        console.error("Service creation failed:", error);
        throw error;
      }

      // Progress update
      setUploadProgress(70);
      setUploadStage("Configuring business hours...");

      // 4. Business Hours Upload - Single API Call for all days

      const weekDays = [
        { id: 1, name: "Monday" },
        { id: 2, name: "Tuesday" },
        { id: 3, name: "Wednesday" },
        { id: 4, name: "Thursday" },
        { id: 5, name: "Friday" },
        { id: 6, name: "Saturday" },
        { id: 7, name: "Sunday" },
      ];

      // Helper function to convert 24-hour format to 12-hour format
      const convertTo12Hour = (time24) => {
        if (!time24) return null;

        let [hours, minutes] = time24.split(":");
        hours = parseInt(hours);

        if (hours === 0) {
          return `12:${minutes} AM`;
        } else if (hours < 12) {
          return `${hours.toString().padStart(2, "0")}:${minutes} AM`;
        } else if (hours === 12) {
          return `12:${minutes} PM`;
        } else {
          const hour12 = hours - 12;
          return `${hour12.toString().padStart(2, "0")}:${minutes} PM`;
        }
      };

      // Helper function to convert 12-hour format to 24-hour format for internal processing
      const convertTo24Hour = (time12, meridian) => {
        if (!time12) return "00:00";

        let [hours, minutes] = time12.split(":");
        hours = parseInt(hours);

        if (meridian === "PM" && hours !== 12) {
          hours += 12;
        } else if (meridian === "AM" && hours === 12) {
          hours = 0;
        }

        return `${hours.toString().padStart(2, "0")}:${minutes}`;
      };

      // Process business hours for all days in a single payload
      try {
        const scheduleType =
          previousData.businessHours?.scheduleType || "selected_hours";
        console.log("Raw business hours data:", previousData.businessHours);
        console.log("Schedule type:", scheduleType);

        // Validate business hours data exists
        if (!previousData.businessHours) {
          console.warn("No business hours data found, using default 'closed' for all days");
        }

        // Map schedule types to new API format
        let apiScheduleType;
        switch (scheduleType) {
          case "always_open":
            apiScheduleType = "always_open";
            break;
          case "selected_hours":
          default:
            apiScheduleType = "open_hours";
            break;
        }

        const businessIdForHours = String(businessIdNum);
        console.log(
          "BusinessId for hours:",
          businessIdForHours,
          "Type:",
          typeof businessIdForHours
        );
        console.log(
          "Original businessIdNum:",
          businessIdNum,
          "MAX_SAFE_INTEGER:",
          Number.MAX_SAFE_INTEGER
        );

        // Build array for all days
        const businessHoursArr = weekDays.map((day) => {
          const dayData = previousData.businessHours?.daysStatus?.[day.id];
          let status = "closed";
          let startTime = null;
          let endTime = null;
          let enabled = false;

          if (scheduleType === "always_open") {
            if (dayData?.isOpen) {
              enabled = true;
              status = "24hours";
            } else {
              status = "closed";
              enabled = false;
            }
          } else {
            if (dayData?.isOpen) {
              enabled = true;
              status = "open";
              startTime = `${dayData.startTime} ${dayData.startMeridian}`;
              endTime = `${dayData.endTime} ${dayData.endMeridian}`;
            } else {
              enabled = false;
              status = "closed";
            }
          }

          return {
            day: day.name,
            enabled,
            status,
            startTime: status === "open" ? startTime : null,
            endTime: status === "open" ? endTime : null,
          };
        });

        const payload = {
          BusinessId: businessIdForHours,
          ScheduleType: apiScheduleType,
          BusinessHours: businessHoursArr,
        };

        console.log(
          "Sending business hours payload:",
          JSON.stringify(payload, null, 2)
        );
        try {
          const businessHoursData = await createBusinessHours(
            payload,
            authToken
          );
          console.log("Business Hours Response:", businessHoursData);
        } catch (error) {
          console.error("Error creating business hours:", error);
          throw new Error(`Business hours creation failed: ${error.message}`);
        }
      } catch (error) {
        console.error("Error creating business hours:", error);
        throw new Error(`Business hours creation failed: ${error.message}`);
      }

      // Progress update
      setUploadProgress(80);
      setUploadStage("Business hours configured...");

      // 5. Documents Uploads
      setUploadProgress(85);
      setUploadStage("Uploading documents...");

      await uploadDocuments(businessIdNum, fileList, authToken);

      // Progress update
      setUploadProgress(95);
      setUploadStage("Finalizing setup...");

      // localStorage.setItem("businessId", JSON.stringify(businessIdNum));
      localStorage.removeItem("formData");

      // Clear browser history to prevent back navigation
      window.history.pushState(null, null, window.location.href);
      window.history.pushState(null, null, window.location.href);
      window.onpopstate = function () {
        window.history.go(1);
      };

      // Final progress update
      setUploadProgress(100);
      setUploadStage("Upload complete! Redirecting...");

      // Small delay to show completion
      setTimeout(() => {
        // window.location.replace(`http://localhost:3001/?id=${businessIdNum}`);
        // localStorage.setItem("businessId", JSON.stringify(businessIdNum));
        window.location.replace(`${constant.merchantUrl}`);
      }, 1000);
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStage("");
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
    const filesToSave = {};
    Object.keys(fileList).forEach((docType) => {
      filesToSave[docType] = fileList[docType].map((file) => ({
        name: file.name,
        type: file.type,
        lastModified: file.lastModified,
        size: file.size,
      }));
    });
    localStorage.setItem("documentUploads", JSON.stringify(filesToSave));
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
        {/* Upload Progress Overlay */}
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
          open={isUploading}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: {
                xs: 2,
                sm: 3,
                md: 4,
              },
              backgroundColor: "white",
              borderRadius: 3,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              minWidth: {
                xs: "300px",
                sm: "350px",
                md: "400px",
              },
              maxWidth: {
                xs: "320px",
                sm: "400px",
                md: "500px",
              },
              mx: {
                xs: 2,
                sm: 0,
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#1b4d69",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: {
                  xs: "1.1rem",
                  sm: "1.25rem",
                  md: "1.25rem",
                },
                lineHeight: {
                  xs: 1.3,
                  sm: 1.6,
                },
              }}
            >
              Processing Your Business Registration
            </Typography>

            <Box sx={{ width: "100%", mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                  height: {
                    xs: 6,
                    sm: 8,
                  },
                  borderRadius: 4,
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#1b4d69",
                    borderRadius: 4,
                  },
                }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{
                mb: 2,
                color: "#666",
                textAlign: "center",
                minHeight: "20px",
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.875rem",
                },
                px: {
                  xs: 1,
                  sm: 0,
                },
              }}
            >
              {uploadStage}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  color: "#1b4d69",
                  fontWeight: "bold",
                  fontSize: {
                    xs: "1.8rem",
                    sm: "2rem",
                    md: "2.125rem",
                  },
                }}
              >
                {uploadProgress}%
              </Typography>
              <CircularProgress
                size={24}
                sx={{
                  color: "#1b4d69",
                }}
              />
            </Box>

            <Typography
              variant="caption"
              sx={{
                mt: 2,
                color: "#999",
                textAlign: "center",
                fontStyle: "italic",
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.75rem",
                },
                px: {
                  xs: 1,
                  sm: 0,
                },
                lineHeight: {
                  xs: 1.3,
                  sm: 1.5,
                },
              }}
            >
              Please don't close this window while we set up your business
              profile
            </Typography>
          </Box>
        </Backdrop>

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
                  mx: 2,
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
                      xs: "1.7rem",
                      sm: "1.7rem",
                      md: "1.8rem",
                      lg: "2rem",
                    },
                  }}
                >
                  Final Step! Verify Your Business
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 4,
                    textAlign: "center",
                    fontSize: {
                      xs: "0.9rem",
                      sm: "0.9rem",
                      md: "0.9rem",
                      lg: "1rem",
                    },
                  }}
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

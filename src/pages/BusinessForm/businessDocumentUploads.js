import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  LinearProgress,
  Fade,
  Zoom,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentUpload from "../../components/documentUploads";
import LeftPanel from "./components/leftpanel";
import UploadErrorDialog from "../../components/UploadErrorDialog";
import { createBusinessFlow } from "../../Services/businessForm/orchestrators/createBusinessFlow.js";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CelebrationRoundedIcon from "@mui/icons-material/Celebration";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";

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
  const authToken = localStorage.getItem("authToken");
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
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [uploadStage, setUploadStage] = useState("");
  const [errorDialog, setErrorDialog] = useState({ open: false, error: null });
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    message: "",
    status: "success",
  });

  const {
    firstName,
    lastName,
    email,
    countryCode,
    phone,
  } = previousData || {};

  const handleBackTeamPresence = () => {
    localStorage.setItem(
      "formData",
      JSON.stringify({
        ...previousData,
        documentUploads: fileList,
      })
    );
    navigate("/business/hours", {
      state: {
        ...previousData,
        documentUploads: fileList,
      },
    });
  };

  // backend integration
  const handleSubmit = async () => {
    if (!previousData || Object.keys(previousData).length === 0) {
      setErrorDialog({
        open: true,
        error: {
          title: "Missing data",
          message: "Please complete the previous steps before uploading documents.",
          type: "SERVER_ERROR",
        },
      });
      return;
    }

    if (!fileList || Object.keys(fileList).length === 0) {
      setErrorDialog({
        open: true,
        error: {
          title: "No documents uploaded",
          message: "Please upload the required documents before submitting.",
          type: "FILE_TOO_LARGE",
        },
      });
      return;
    }

    try {
      setLoading(true);
      setIsUploading(true);
      setUploadProgress(5);
      setUploadStage("Data is uploading...");

      const result = await createBusinessFlow(
        previousData,
        fileList,
        authToken,
        (p, stage) => {
          setUploadProgress(p);
          setUploadStage(stage);
        }
      );

      setUploadProgress(100);
      setUploadStage("Upload complete");

      if (result.status === "success") {
        localStorage.removeItem("accountData");
        localStorage.removeItem("formData");
        localStorage.removeItem("documentUploads");
        setFileList({});
      }

      setConfirmationDialog({
        open: true,
        status: result.status,
        message:
          result.status === "success"
            ? "Your business submission is complete and under review. Our team will connect with you soon."
            : "Some information could not be saved, but your submission is under review. Our team will connect with you soon.",
      });
    } catch (err) {
      setErrorDialog({
        open: true,
        error: {
          title: "Upload failed",
          message:
            err?.message ||
            "Something went wrong while saving your business details.",
          type: "SERVER_ERROR",
          technicalDetails:
            process.env.NODE_ENV === "development"
              ? JSON.stringify(err?.response || err, null, 2)
              : null,
        },
      });
    } finally {
      setLoading(false);
      setIsUploading(false);
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
            zIndex: (theme) => theme.zIndex.drawer + 999,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(8px)",
          }}
          open={isUploading}
        >
          <Box
            sx={{
              width: {
                xs: "90%",
                sm: 420,
              },
              bgcolor: "#fff",
              borderRadius: "30px",
              p: {
                xs: 3,
                sm: 4,
              },
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
              animation: "popup 0.4s ease",
              "@keyframes popup": {
                "0%": {
                  opacity: 0,
                  transform: "scale(0.8) translateY(40px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "scale(1) translateY(0px)",
                },
              },
            }}
          >
            {/* Background Glow */}
            <Box
              sx={{
                position: "absolute",
                top: -100,
                left: "50%",
                transform: "translateX(-50%)",
                width: 250,
                height: 250,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(0,200,83,0.18) 0%, rgba(255,255,255,0) 70%)",
              }}
            />

            {/* Animated Upload Circle */}
            <Box
              sx={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                mx: "auto",
                mb: 3,
                background:
                  "linear-gradient(135deg, #00c853 0%, #43a047 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 2,
                boxShadow: "0 15px 40px rgba(0,200,83,0.45)",
                animation: "pulse 1.8s infinite",
                "@keyframes pulse": {
                  "0%": {
                    transform: "scale(1)",
                    boxShadow: "0 0 0 0 rgba(0,200,83,0.45)",
                  },
                  "70%": {
                    transform: "scale(1.05)",
                    boxShadow: "0 0 0 25px rgba(0,200,83,0)",
                  },
                  "100%": {
                    transform: "scale(1)",
                    boxShadow: "0 0 0 0 rgba(0,200,83,0)",
                  },
                },
              }}
            >
              <CloudUploadRoundedIcon
                sx={{
                  color: "#fff",
                  fontSize: 55,
                }}
              />
            </Box>

            {/* Heading */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#111827",
                mb: 1,
                position: "relative",
                zIndex: 2,
              }}
            >
              Setting Up Your Business
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="body1"
              sx={{
                color: "#6b7280",
                mb: 4,
                lineHeight: 1.7,
                position: "relative",
                zIndex: 2,
              }}
            >
              Please wait while we securely upload and verify
              your business documents.
            </Typography>

            {/* Progress Area */}
            <Box
              sx={{
                width: "100%",
                mb: 2,
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* Percentage */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#374151",
                    fontWeight: 600,
                  }}
                >
                  Upload Progress
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#16a34a",
                    fontWeight: 700,
                  }}
                >
                  {uploadProgress}%
                </Typography>
              </Box>

              {/* Premium Progress Bar */}
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                  height: 14,
                  borderRadius: 999,
                  backgroundColor: "#e5e7eb",
                  overflow: "hidden",

                  "& .MuiLinearProgress-bar": {
                    borderRadius: 999,
                    background:
                      "linear-gradient(90deg, #00c853, #00e676)",
                    transition: "transform 0.4s ease",
                    position: "relative",

                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                      animation: "shine 1.5s infinite",
                    },
                  },

                  "@keyframes shine": {
                    "0%": {
                      transform: "translateX(-100%)",
                    },
                    "100%": {
                      transform: "translateX(100%)",
                    },
                  },
                }}
              />
            </Box>

            {/* Upload Stage */}
            <Typography
              variant="body2"
              sx={{
                color: "#4b5563",
                fontWeight: 500,
                minHeight: 24,
                mb: 3,
                position: "relative",
                zIndex: 2,
              }}
            >
              {uploadStage}
            </Typography>

            {/* Bottom Loader */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                position: "relative",
                zIndex: 2,
              }}
            >
              <CircularProgress
                size={20}
                thickness={5}
                sx={{
                  color: "#00c853",
                }}
              />

              <Typography
                variant="caption"
                sx={{
                  color: "#6b7280",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                }}
              >
                Please don’t close this window
              </Typography>
            </Box>
          </Box>
        </Backdrop>

        <Container
          maxWidth={false}
          disableGutters
          sx={{ display: "flex", flexGrow: 1, margin: 0 }}
        >
          <Grid container>
            <Grid item xs={12} md={4}>
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
                  component="div"
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
                          disabled={loading}
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
                          {loading ? "Uploading..." : "Upload"}
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

      {/* Enhanced Error Dialog */}
      <UploadErrorDialog
        open={errorDialog.open}
        error={errorDialog.error}
        onClose={() => setErrorDialog({ open: false, error: null })}
        onRetry={() => {
          setErrorDialog({ open: false, error: null });
          handleSubmit();
        }}
        showTechnicalDetails={process.env.NODE_ENV === "development"}
      />

      <Dialog
        open={confirmationDialog.open}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
            background:
              "linear-gradient(to bottom, #ffffff, #f8fff9)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          },
        }}
      >
        <DialogContent
          sx={{
            textAlign: "center",
            py: 5,
            px: 4,
            position: "relative",
          }}
        >
          {/* Celebration Background Glow */}
          <Box
            sx={{
              position: "absolute",
              top: -60,
              left: "50%",
              transform: "translateX(-50%)",
              width: 150,
              height: 150,
              borderRadius: "50%",
              zIndex: 0,
            }}
          />

          {/* Animated Circle Tick */}
          <Zoom in timeout={500}>
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                width: 50,
                height: 50,
                mx: "auto",
                mb: 3,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #1b4d69 0%, #2b5871 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 15px 25px #0e496b6b",
                animation: "bounce 1.2s ease",
                "@keyframes bounce": {
                  "0%": {
                    transform: "scale(0.5)",
                    opacity: 0,
                  },
                  "60%": {
                    transform: "scale(1.15)",
                  },
                  "100%": {
                    transform: "scale(1)",
                    opacity: 1,
                  },
                },
              }}
            >
              <CheckCircleRoundedIcon
                sx={{
                  fontSize: 40,
                  color: "#fff",
                }}
              />
            </Box>
          </Zoom>

          {/* Celebration Icon */}
          {/* <CelebrationRoundedIcon
            sx={{
              position: "absolute",
              top: 40,
              right: 40,
              color: "#ffb300",
              fontSize: 34,
              animation: "rotate 4s linear infinite",
              "@keyframes rotate": {
                from: {
                  transform: "rotate(0deg)",
                },
                to: {
                  transform: "rotate(360deg)",
                },
              },
            }}
          /> */}

          <Typography
            variant="h6"
            fontWeight="500"
            sx={{
              mb: 2,
              color: "#1b1b1b",
              position: "relative",
              zIndex: 2,
            }}
          >
            Submission Successful 🎉
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: "#2e7d32",
              position: "relative",
              zIndex: 2,
              lineHeight: 1.5,
            }}
          >
            Your business profile is now under review.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#666",
              mb: 4,
              position: "relative",
              zIndex: 2,
              lineHeight: 1.5,
              fontSize: 12,

            }}
          >
            Our verification team will review your details and
            connect with you shortly.
          </Typography>

          {/* Continue Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => {
              setConfirmationDialog({
                open: false,
                message: "",
                status: "success",
              });
              navigate("/");
            }}
            sx={{
              py: 1.7,
              borderRadius: "16px",
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "none",
              background:
                "linear-gradient(90deg, #1b4d69, #1b4d69)",
              boxShadow: "0 10px 25px #1b4c697b",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #1b4d69, #1b4d69)",
                transform: "translateY(-2px)",
                boxShadow: "0 14px 28px #1b4c697b",
              },
              transition: "all 0.3s ease",
            }}
          >
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}

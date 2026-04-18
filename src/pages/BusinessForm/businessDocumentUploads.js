import React, { useState, useEffect } from "react";
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
import UploadErrorDialog from "../../components/UploadErrorDialog";
import { createBusinessFlow } from "../../Services/businessForm/orchestrators/createBusinessFlow.js";

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
    try {
      setLoading(true);

      const id = await createBusinessFlow(
        previousData,
        fileList,
        authToken,
        (p, stage) => {
          setUploadProgress(p);
          setUploadStage(stage);
        }
      );

      navigate("/kalavyuha-frontend");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
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
              component="div"
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
              component="div"
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

      {/* Enhanced Error Dialog */}
      <UploadErrorDialog
        open={errorDialog.open}
        error={errorDialog.error}
        onClose={() => setErrorDialog({ open: false, error: null })}
        onRetry={() => {
          setErrorDialog({ open: false, error: null });
          handleSubmit();
        }}
        showTechnicalDetails={process.env.NODE_ENV === 'development'}
      />
    </ThemeProvider>
  );
}

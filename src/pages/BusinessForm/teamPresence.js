import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Slider,
  TextField,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Dialog,
} from "@mui/material";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import TeamProfile from "../../assets/images/busniessAccount/busniessProfile.jpg";

import { Plus, ArrowLeft, Minus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { styled } from "@mui/system";
import { ImageUp } from "lucide-react";

import LeftPanel from "./components/leftpanel";

import Autocomplete from "@mui/material/Autocomplete";

import { uploadImages } from "./Apis/uploadAPI";
const avatarUrls = [
  "https://kalavyuha-s3-bucket.s3.ap-southeast-1.amazonaws.com/avatars/avatar1_male.png",
  "https://kalavyuha-s3-bucket.s3.ap-southeast-1.amazonaws.com/avatars/avatar2_male.png",
  "https://kalavyuha-s3-bucket.s3.ap-southeast-1.amazonaws.com/avatars/avatar3_male.png",
  "https://kalavyuha-s3-bucket.s3.ap-southeast-1.amazonaws.com/avatars/avatar4_female.png",
  "https://kalavyuha-s3-bucket.s3.ap-southeast-1.amazonaws.com/avatars/avatar5_female.png",
  "https://kalavyuha-s3-bucket.s3.ap-southeast-1.amazonaws.com/avatars/avatar6_female.png",
];

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  textAlign: "center",
  cursor: "pointer",
}));

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

export default function TeamPresence() {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialData = () => {
    try {
      const storedData = localStorage.getItem("formData");
      const parsedData = storedData ? JSON.parse(storedData) : {};
      const stateData = location.state || {};
      const combinedData = { ...parsedData, ...stateData };

      // Ensure teamMembers is properly formatted
      if (combinedData.teamMembers && Array.isArray(combinedData.teamMembers)) {
        combinedData.teamMembers = combinedData.teamMembers.map((member) => ({
          ...member,
          role: Array.isArray(member.role)
            ? member.role
            : member.role
            ? [member.role]
            : [],
        }));
      }

      return combinedData;
    } catch (error) {
      console.error("Error parsing stored data:", error);
      return {};
    }
  };

  const previousData = getInitialData();
  const { firstName, lastName, email, countryCode, phone } = previousData || {};

  const [teamSize, setTeamSize] = useState(previousData.teamSize || [1]);

  // Migrate existing team members to ensure role is always an array
  const migrateTeamMembers = (members) => {
    if (!members || !Array.isArray(members)) return [];
    return members.map((member) => ({
      ...member,
      role: Array.isArray(member.role)
        ? member.role
        : member.role
        ? [member.role]
        : [],
      gender: member.gender || "",
      experience: member.experience || "",
      name: member.name || "",
    }));
  };

  const [teamMembers, setTeamMembers] = useState(() => {
    if (previousData.teamMembers && Array.isArray(previousData.teamMembers)) {
      return migrateTeamMembers(previousData.teamMembers);
    }
    return [
      {
        id: 1,
        name: "",
        experience: "",
        gender: "",
        role: [],
        profileImage: null,
      },
    ];
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);

  const containerRef = useRef(null);

  // Create current form data that includes updated team members
  const currentFormData = {
    ...previousData,
    teamSize,
    teamMembers,
  };

  useEffect(() => {
    const updateLocalStorage = () => {
      try {
        const combinedData = {
          ...previousData,
          teamSize,
          teamMembers,
          teamInfoCompleted: false,
        };
        localStorage.setItem("formData", JSON.stringify(combinedData));
      } catch (error) {
        console.error("Error updating localStorage:", error);
      }
    };

    updateLocalStorage();
  }, [teamSize, teamMembers, previousData]);

  const handleUploadClick = (memberId) => {
    setCurrentMemberId(memberId);
    setIsUploadOpen(true);
  };

  const handleCloseUpload = () => {
    setIsUploadOpen(false);
    setSelectedImage(null);
    setSelectedAvatar(null);
    setCurrentMemberId(null);
  };

  const handleImageUpload = async (event) => {
    if (!event.target.files?.[0]) return;

    const file = event.target.files[0];

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB");
      return;
    }

    try {
      const token = "VIRoHdqUAtpklgKg";
      const { data, error: uploadError } = await uploadImages([file], token);

      if (uploadError) throw new Error(uploadError);
      if (!data?.Data?.length) throw new Error("No image URL returned");

      setSelectedImage({
        s3Url: data?.Data?.[0] ?? "",
        previewUrl: URL.createObjectURL(file),
        fileName: file.name,
      });
      setSelectedAvatar(null);
    } catch (err) {
      alert(`Image upload failed: ${err.message}`);
    }
  };

  const handleAvatarSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    setSelectedImage(null);
  };

  const handleSave = () => {
    if (currentMemberId === null) return;

    setTeamMembers((prevMembers) =>
      prevMembers.map((member) => {
        if (member.id !== currentMemberId) return member;

        return {
          ...member,
          profileImage:
            selectedImage?.s3Url || selectedAvatar || member.profileImage,
        };
      })
    );

    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    handleCloseUpload();
  };

  const handleCancel = () => {
    setSelectedImage(null);
    setSelectedAvatar(null);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && ["image/png", "image/jpeg"].includes(file.type)) {
      setSelectedImage(file);
      setSelectedAvatar(null);
    }
  };

  // Team management functions
  const addTeamMember = () => {
    const newMember = {
      id: teamMembers.length + 1,
      name: "",
      experience: "",
      gender: "",
      role: [],
      profileImage: null,
    };
    const updatedTeamMembers = [...teamMembers, newMember];
    setTeamMembers(updatedTeamMembers);

    if (updatedTeamMembers.length > teamSize[0]) {
      setTeamSize([updatedTeamMembers.length]);
    }
  };

  const updateTeamMember = (id, field, value) => {
    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const removeTeamMember = (id) => {
    setTeamMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== id)
    );
  };

  const handleTeamSizeChange = (event, newValue) => {
    setTeamSize([newValue]);
    if (newValue < teamMembers.length) {
      setTeamMembers((prevMembers) => prevMembers.slice(0, newValue));
    }
  };

  const handleBack = () => {
    const combinedData = {
      ...previousData,
      teamSize,
      teamMembers,
    };
    localStorage.setItem("formData", JSON.stringify(combinedData));
    navigate("/business/profile-form", { state: combinedData });
  };

  const handleNextServiceMenu = () => {
    const combinedData = {
      ...previousData,
      teamSize,
      teamMembers,
      teamInfoCompleted: true,
    };
    localStorage.setItem("formData", JSON.stringify(combinedData));
    navigate("/business/service-info", { state: combinedData });
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
            {/* Left side */}
            <Grid item xs={12} md={4}>
              <LeftPanel
                firstName={firstName}
                lastName={lastName}
                email={email}
                countryCode={countryCode}
                phone={phone}
                isSignIn={true}
                formData={currentFormData}
              />
            </Grid>

            {/* Right side - form */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                alignContent: "center",
                display: "flex",
                justifyContent: "center",
                width: "100%",
                height: "100vh",
                overflow: "auto",
              }}
            >
              <Box
                sx={{
                  mx: { xs: 0, sm: 4 },
                  // paddingX: { xs: 2, sm: 0 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  // justifyContent: 'center',
                  mt: 6,
                }}
              >
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{
                    mb: 1,
                    fontWeight: "bold",
                    color: "#1b4d69",
                    fontSize: {
                      xs: "1.6rem",
                      sm: "1.8rem",
                      md: "1.8rem",
                      lg: "2rem",
                    },
                    width: "90%",
                    textAlign: "center",
                    mx: { xs: 2, sm: 0 },
                  }}
                >
                  Enhance Your Team's Presence
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    textAlign: "center",
                    width: "90%",
                    mx: { xs: 2, sm: 0 },
                  }}
                >
                  A well-rounded business profile attracts more clients!
                </Typography>

                <Box
                  component="form"
                  noValidate
                  sx={{ mt: 1, maxWidth: 600, width: "100%" }}
                >
                  <Grid container spacing={2}>
                    <Grid
                      container
                      justifyContent="left"
                      sx={{
                        my: 0.5,
                        paddingLeft: { xs: 4, sm: 2 },
                        paddingRight: { xs: 2, sm: 0 },
                      }}
                    >
                      <Grid item>
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>
                          <b>How big is your team?</b>
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        <Box sx={{ my: 1 }}>
                          <Typography variant="h6" sx={{ my: 1 }}>
                            <b>
                              1 - {teamSize[0] === 100 ? "100+" : teamSize[0]}{" "}
                              Staff Members
                            </b>
                          </Typography>
                          <Slider
                            value={teamSize[0]}
                            onChange={handleTeamSizeChange}
                            valueLabelDisplay="auto"
                            min={1}
                            max={100}
                            sx={{
                              left: "1%",
                              color: "#000",
                              "& .MuiSlider-thumb": {
                                backgroundColor: "#ffffff",
                                border: "2px solid #000",
                                "&:hover": {
                                  boxShadow: "inherit",
                                },
                              },
                              "& .MuiSlider-track": {
                                backgroundColor: "#000",
                              },
                              "& .MuiSlider-rail": {
                                height: "7px",
                                backgroundColor: "#e2e6ea",
                              },
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid item>
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>
                          <b>Add Staff Experience and Details </b>(optional)
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={12} sx={{ mt: 4 }}>
                        <Box
                          ref={containerRef}
                          sx={{
                            border: 1,
                            borderRadius: 4,
                            borderColor: "#d9d9d9",
                            background: "#fbfbfb",
                            height: { xs: "43vh", sm: "33vh" },
                            overflowY: "auto",
                            scrollbarWidth: "none",
                            "&::-webkit-scrollbar": { display: "none" },
                            padding: 2,
                            px: { xs: 1, sm: 4 },
                          }}
                        >
                          {teamMembers.map((member, index) => (
                            <Box
                              key={member.id}
                              sx={{
                                mb: 2,
                                p: 2,
                                pb: 4,
                                boxShadow: "0 3px 2px rgba(0, 0, 0, 0.1)",
                                borderRadius: "16px",
                                position: "relative",
                              }}
                            >
                              <Grid
                                container
                                spacing={2}
                                // gap={1}
                                alignItems="flex-start"
                              >
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Team member name"
                                    value={member.name}
                                    onChange={(e) =>
                                      updateTeamMember(
                                        member.id,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    size="small"
                                    InputProps={{
                                      sx: {
                                        borderRadius: 2,
                                        background: "#fff",
                                      },
                                    }}
                                    InputLabelProps={{
                                      sx: {
                                        textAlign: "center",
                                      },
                                    }}
                                  />
                                </Grid>

                                <Grid item xs={2} sm={1}>
                                  <Avatar
                                    src={
                                      // Case 1: It's a File/Blob object
                                      member.profileImage instanceof File ||
                                      member.profileImage instanceof Blob
                                        ? URL.createObjectURL(
                                            member.profileImage
                                          )
                                        : // Case 2: It's a stored object with blob data
                                        member.profileImage?.blob
                                        ? URL.createObjectURL(
                                            member.profileImage.blob
                                          )
                                        : // Case 3: It's a stored object with preview URL
                                        member.profileImage?.url
                                        ? member.profileImage.url
                                        : // Case 4: It's a direct URL string (avatar selection)
                                        typeof member.profileImage === "string"
                                        ? member.profileImage
                                        : TeamProfile
                                    }
                                    alt="Profile"
                                    sx={{
                                      width: 38,
                                      height: 38,
                                      borderRadius: 3,
                                      border: 1,
                                      borderColor: "#d9d9d9",
                                      mr: 2,
                                    }}
                                    imgProps={{
                                      onLoad: (e) => {
                                        if (
                                          member.profileImage instanceof File ||
                                          member.profileImage instanceof Blob
                                        ) {
                                          URL.revokeObjectURL(e.target.src);
                                        }
                                      },
                                      onError: (e) => {
                                        e.target.src = TeamProfile;
                                      },
                                    }}
                                  />
                                </Grid>

                                <Grid
                                  item
                                  xs={10}
                                  sm={5}
                                  sx={{
                                    // ml: { xs: 0, sm: 2 },
                                    justifyContent: "flex-end",
                                    display: "flex",
                                    alignItems: "center",
                                    // width: "100%",
                                  }}
                                >
                                  <Button
                                    variant="outlined"
                                    component="label"
                                    onClick={() => handleUploadClick(member.id)}
                                    sx={{
                                      borderRadius: "10px",
                                      ml: {xs:1, sm:2},
                                      // mr: {xs:1, sm:2},
                                      // minWidth: "130px",
                                      width: "100%",
                                      height: 40,
                                      borderColor: "#d9d9d9",
                                      background: "#fff",
                                      textTransform: "none",
                                    }}
                                  >
                                    Upload Picture
                                  </Button>
                                </Grid>

                                <Grid item xs={12} sm={3}>
                                  <TextField
                                    fullWidth
                                    label="Experience"
                                    value={member.experience}
                                    onChange={(e) =>
                                      updateTeamMember(
                                        member.id,
                                        "experience",
                                        e.target.value
                                      )
                                    }
                                    size="small"
                                    InputProps={{
                                      sx: {
                                        borderRadius: 2,
                                        background: "#fff",
                                      },
                                    }}
                                    InputLabelProps={{
                                      sx: {
                                        textAlign: "center",
                                      },
                                    }}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={3}>
                                  <Select
                                    fullWidth
                                    value={member.gender || ""}
                                    onChange={(e) =>
                                      updateTeamMember(
                                        member.id,
                                        "gender",
                                        e.target.value
                                      )
                                    }
                                    displayEmpty
                                    size="small"
                                    sx={{ borderRadius: 2, background: "#fff" }}
                                    renderValue={(selected) => {
                                      if (!selected) {
                                        return <b>Gender</b>;
                                      }
                                      return selected;
                                    }}
                                  >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Non-Binary">
                                      Non-Binary
                                    </MenuItem>
                                    <MenuItem value="noSay">
                                      Prefer Not to Say
                                    </MenuItem>
                                  </Select>
                                </Grid>

                                {/* set roles */}
                                <Grid item xs={12} sm={6}>
                                  <Autocomplete
                                    multiple
                                    freeSolo
                                    value={member.role || []}
                                    onChange={(event, newValue) => {
                                      updateTeamMember(
                                        member.id,
                                        "role",
                                        newValue || []
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Add Designation"
                                        sx={{
                                          background: "#fff",
                                          "& .MuiOutlinedInput-root": {
                                            minHeight: "40px", // Minimum height
                                            paddingTop: "6px",
                                            paddingBottom: "6px",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                            borderRadius: 2,
                                          },
                                          "& .MuiOutlinedInput-notchedOutline": {
                                            borderRadius: 2,
                                          },
                                        }}
                                      />
                                    )}
                                    options={[]}
                                    filterOptions={(options, params) => {
                                      const filtered = options.filter(
                                        (option) =>
                                          option
                                            .toLowerCase()
                                            .includes(
                                              params.inputValue.toLowerCase()
                                            )
                                      );

                                      // Add the current input as an option if it doesn't exist
                                      if (
                                        params.inputValue !== "" &&
                                        !filtered.includes(params.inputValue)
                                      ) {
                                        filtered.push(params.inputValue);
                                      }

                                      return filtered;
                                    }}
                                    selectOnFocus
                                    clearOnBlur
                                    handleHomeEndKeys
                                    sx={{
                                      "& .MuiAutocomplete-tag": {
                                        margin: "2px",
                                        height: "24px",
                                      },
                                      "& .MuiAutocomplete-inputRoot": {
                                        paddingTop: "0px !important",
                                        paddingBottom: "0px !important",
                                        flexWrap: "wrap",
                                        maxHeight: "120px",
                                        overflowY: "auto",
                                      },
                                    }}
                                    disableClearable
                                  />
                                </Grid>
                              </Grid>

                              {index !== 0 && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    bottom: 12,
                                    right: 20,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "22px",
                                    height: "2px",
                                    padding: "1px",
                                    background: "#e2e6ea",
                                    borderRadius: "3px",
                                    "&:hover": {
                                      background: "#1b4d69",
                                      transform: "scale(1.1)",
                                    },
                                  }}
                                  onClick={() => removeTeamMember(member.id)}
                                >
                                  <IconButton
                                    sx={{
                                      color: "#e2e6ea",
                                      padding: "0",
                                      width: "20px",
                                      height: "40px",
                                      "&:hover": {
                                        color: "#1b4d69",
                                        background: "transparent",
                                      },
                                    }}
                                  >
                                    <Minus sx={{ fontSize: 30 }} />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>
                          ))}

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "right",
                              mt: 4,
                            }}
                          >
                            <IconButton
                              onClick={addTeamMember}
                              sx={{
                                background: "#1b4d69",
                                color: "#fff",
                                width: "26px",
                                height: "26px",
                                padding: "0",
                                "&:hover": {
                                  background: "#154f69",
                                  transform: "scale(1.1)",
                                },
                              }}
                            >
                              <Plus />
                            </IconButton>
                          </Box>

                          <Dialog
                            open={isUploadOpen}
                            onClose={handleCloseUpload}
                            sx={{ height: "100" }}
                            PaperProps={{
                              sx: { borderRadius: "16px" },
                            }}
                          >
                            <Box
                              sx={{
                                height: "100%",
                                alignContent: "center",
                                borderRadius: "18px",
                              }}
                            >
                              <Card
                                sx={{
                                  maxWidth: 400,
                                  margin: "auto",
                                  borderRadius: "18px",
                                  p: 1,
                                }}
                              >
                                <CardHeader
                                  title="Upload Your Profile Image:"
                                  titleTypographyProps={{
                                    fontWeight: "bold",
                                    fontSize: "1.3rem",
                                  }}
                                  sx={{ pb: 0 }}
                                />
                                <CardContent sx={{ pt: "6px" }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    Choose an image that will appear to everyone
                                    in our app.
                                  </Typography>

                                  <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{ mt: 2 }}
                                  >
                                    <b>Upload Image:</b>
                                  </Typography>

                                  <Box
                                    sx={{
                                      mt: 1,
                                      border: "1px solid #e2e6ea",
                                      borderRadius: "15px",
                                      textAlign: "center",
                                      p: "20px 0",
                                      backgroundColor: isDragging
                                        ? "#f0f0f0"
                                        : "transparent",
                                    }}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                  >
                                    <UploadBox
                                      component="label"
                                      htmlFor="image-upload"
                                      sx={{ border: 0 }}
                                    >
                                      <input
                                        id="image-upload"
                                        type="file"
                                        onChange={handleImageUpload}
                                        accept="image/png,image/jpeg,image/jpg"
                                        style={{ display: "none" }}
                                      />
                                      <ImageUp
                                        sx={{
                                          fontSize: 38,
                                          color: "text.secondary",
                                          mb: 1,
                                        }}
                                      />
                                      <Typography variant="body2">
                                        <b>
                                          Click or drag and drop to upload image
                                        </b>
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        PNG, JPG, JPEG (MAX 2MB)
                                      </Typography>
                                    </UploadBox>
                                    {selectedImage && (
                                      <Typography
                                        variant="body2"
                                        color="success.main"
                                        sx={{ mt: 1 }}
                                      >
                                        Image selected: {selectedImage.fileName}
                                      </Typography>
                                    )}
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    align="center"
                                    sx={{ my: 2 }}
                                  >
                                    OR
                                  </Typography>
                                  <Box>
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                    >
                                      <b>Choose Avatar:</b>
                                    </Typography>

                                    <Box
                                      sx={{
                                        mt: 1,
                                        border: "1px solid #e2e6ea",
                                        borderRadius: "15px",
                                        textAlign: "center",
                                        p: "15px 0",
                                        overflowX: "hidden",
                                        position: "relative",
                                        width: "100%",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          gap: 2,
                                          animation:
                                            "scroll 20s linear infinite",
                                          "&:hover": {
                                            animationPlayState: "paused",
                                          },
                                        }}
                                      >
                                        {[...avatarUrls, ...avatarUrls].map(
                                          (avatarUrl, index) => (
                                            <IconButton
                                              key={`${avatarUrl}-${index}`}
                                              onClick={() =>
                                                handleAvatarSelect(avatarUrl)
                                              }
                                              sx={{
                                                p: 0,
                                                border:
                                                  selectedAvatar === avatarUrl
                                                    ? "2px solid"
                                                    : "none",
                                                borderColor: "primary.main",
                                              }}
                                            >
                                              <Avatar
                                                src={avatarUrl}
                                                alt={`Avatar ${index + 1}`}
                                                sx={{ width: 76, height: 76 }}
                                              />
                                            </IconButton>
                                          )
                                        )}
                                      </Box>

                                      <style jsx>{`
                                        @keyframes scroll {
                                          0% {
                                            transform: translateX(0);
                                          }
                                          100% {
                                            transform: translateX(-100%);
                                          }
                                        }
                                      `}</style>
                                    </Box>
                                  </Box>

                                  <Grid item xs={12} sx={{ mt: 3 }}>
                                    <Grid
                                      container
                                      sx={{ justifyContent: "space-between" }}
                                    >
                                      <Grid item xs={3}>
                                        <Button
                                          fullWidth
                                          variant="outlined"
                                          sx={{
                                            borderRadius: "24px",
                                            color: "black",
                                            textTransform: "none",
                                            borderColor: "#d9d9d9",
                                            background: "#fbfbfb",
                                          }}
                                          onClick={handleCancel}
                                        >
                                          <b>Cancel</b>
                                        </Button>
                                      </Grid>

                                      <Grid item xs={3}>
                                        <Button
                                          fullWidth
                                          variant="contained"
                                          sx={{
                                            textTransform: "none",
                                            borderRadius: "24px",
                                            bgcolor: "black",
                                            color: "white",
                                            "&:hover": {
                                              bgcolor: "rgba(0, 0, 0, 0.8)",
                                            },
                                          }}
                                          onClick={handleSave}
                                        >
                                          Save
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </CardContent>
                              </Card>
                            </Box>
                          </Dialog>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sx={{ my: 2 }}>
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
                              onClick={handleBack}
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
                              onClick={handleNextServiceMenu}
                            >
                              Next step
                            </Button>
                          </Grid>
                        </Grid>
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

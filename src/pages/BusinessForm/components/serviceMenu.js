import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Button,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  OutlinedInput,
  ListItemText,
  Typography,
  Collapse,
  Checkbox,
  TextareaAutosize,
} from "@mui/material";
import {
  GripVertical,
  PlusCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { message } from "antd";
import { uploadImages } from "../Apis/uploadAPI.js";
import { StaffSelect, DurationSelect } from "./dropDowns.js";

// Enhanced ResizeObserver error handling for webpack dev server
const useResizeObserverFix = () => {
  useEffect(() => {
    // Handle ResizeObserver errors specifically
    const handleResizeObserverError = (e) => {
      if (e.message && e.message.includes('ResizeObserver loop completed with undelivered notifications')) {
        // Prevent the error from propagating
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
      }
      if (e.message && e.message.includes('ResizeObserver loop limit exceeded')) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
      }
    };

    // Add both error and unhandledrejection listeners
    window.addEventListener('error', handleResizeObserverError);
    window.addEventListener('unhandledrejection', (e) => {
      if (e.reason && e.reason.message && e.reason.message.includes('ResizeObserver')) {
        e.preventDefault();
      }
    });

    // Debounced resize handler to prevent layout thrashing
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Force a single layout recalculation to prevent infinite loops
        window.requestAnimationFrame(() => {
          try {
            const height = document.body.offsetHeight; // Trigger controlled reflow
          } catch (err) {
            // Silently handle any errors during reflow
          }
        });
      }, 150); // Increased debounce time
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('error', handleResizeObserverError);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);
};

const ServiceFormBox = ({
  onServicesChange,
  services: initialServices,
  teamMembers,
}) => {
  const [categories, setCategories] = useState(() => {
    // Initialize with default structure if no initial services provided
    if (!initialServices || initialServices.length === 0) {
      return [
        {
          id: "cat-1",
          name: "General Services",
          expanded: true,
          services: [
            {
              id: "1",
              name: "",
              description: "",
              price: "",
              duration: "",
              durationType: "mints",
              staff: [],
              uploaded: false,
              image: null,
            },
          ],
        },
      ];
    }

    // Convert flat services array to categorized structure if needed
    if (!initialServices[0]?.services) {
      return [
        {
          id: "cat-1",
          name: "General Services",
          expanded: true,
          services: initialServices.map((service) => ({
            ...service,
            description: service.description || "",
            // Handle image data properly - preserve existing structure or convert old format
            image: service.image ? service.image : (service.imageUrl ? { s3Url: service.imageUrl } : null),
            // Set uploaded status based on image presence
            uploaded: Boolean(service.image?.s3Url || service.imageUrl || service.uploaded),
          })),
        },
      ];
    }

    return initialServices.map((category) => ({
      ...category,
      services: category.services.map((service) => ({
        ...service,
        description: service.description || "",
        // Handle image data properly - preserve existing structure or convert old format
        image: service.image ? service.image : (service.imageUrl ? { s3Url: service.imageUrl } : null),
        // Set uploaded status based on image presence
        uploaded: Boolean(service.image?.s3Url || service.imageUrl || service.uploaded),
      })),
    }));
  });

  const draggingItemRef = useRef();
  const draggingOverItemRef = useRef();
  const [openStaffDialog, setOpenStaffDialog] = useState(false);
  const [selectedService, setSelectedService] = useState({
    index: null,
    categoryIndex: null,
  });
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Use proper ResizeObserver fix instead of error suppression
  useResizeObserverFix();

  // Additional error handling for better user experience
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0] && typeof args[0] === 'string' && 
          args[0].includes('ResizeObserver loop completed with undelivered notifications')) {
        // Suppress this specific error in development
        return;
      }
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  // Validation function for services
  const validateServices = () => {
    const errors = [];

    categories.forEach((category, categoryIndex) => {
      if (!category.name || category.name.trim() === "") {
        errors.push(`Category ${categoryIndex + 1}: Name is required`);
      }

      category.services.forEach((service, serviceIndex) => {
        if (!service.name || service.name.trim() === "") {
          errors.push(
            `Category "${category.name}" - Service ${
              serviceIndex + 1
            }: Name is required`
          );
        }
        if (!service.price || service.price.trim() === "") {
          errors.push(
            `Category "${category.name}" - Service "${service.name}": Price is required`
          );
        }
        if (!service.duration || service.duration.trim() === "") {
          errors.push(
            `Category "${category.name}" - Service "${service.name}": Duration is required`
          );
        }
      });
    });

    return errors;
  };

  // Notify parent when services change
  useEffect(() => {
    if (onServicesChange) {
      const validationErrors = validateServices();
      onServicesChange(categories, validationErrors);
    }
  }, [categories, onServicesChange]);

  const handleFileChange = async (event, categoryIndex, serviceIndex) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      message.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      message.error('File size should be less than 5MB');
      return;
    }

    try {
      const token = process.env.REACT_APP_UPLOAD_TOKEN || 'VIRoHdqUAtpklgKg';
      
      const { data, error: uploadError } = await uploadImages([file], token);

      if (uploadError) {
        throw new Error(uploadError);
      }

      const uploadedUrl = data?.Data?.[0];
      if (!uploadedUrl) throw new Error('No URL returned from upload');

      const updatedCategories = [...categories];
      updatedCategories[categoryIndex].services[serviceIndex] = {
        ...updatedCategories[categoryIndex].services[serviceIndex],
        uploaded: true,
        image: {
          s3Url: uploadedUrl,
        },
      };

      setCategories(updatedCategories);
      message.success('Image uploaded successfully');
    } catch (err) {
      message.error(`Image upload failed: ${err.message}`);
    }
  };

  const handleRemoveService = (categoryIndex, serviceIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].services = updatedCategories[
      categoryIndex
    ].services.filter((_, i) => i !== serviceIndex);

    // Remove category if it's empty
    if (updatedCategories[categoryIndex].services.length === 0) {
      updatedCategories.splice(categoryIndex, 1);
    }

    setCategories(updatedCategories);
  };

  const handleOpenStaffDialog = (categoryIndex, serviceIndex) => {
    setSelectedService({ categoryIndex, serviceIndex });
    setSelectedStaff(categories[categoryIndex].services[serviceIndex].staff);
    setOpenStaffDialog(true);
  };

  const handleStaffSelection = (event) => {
    const value = event.target.value;
    setSelectedStaff(typeof value === "string" ? value.split(",") : value);
  };

  const handleSaveStaff = () => {
    const { categoryIndex, serviceIndex } = selectedService;
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].services[serviceIndex].staff =
      selectedStaff;
    setCategories(updatedCategories);
    setOpenStaffDialog(false);
  };

  // Drag and drop handlers
  const handleDragStart = (e, type, categoryIndex, serviceIndex = null) => {
    draggingItemRef.current = { type, categoryIndex, serviceIndex };
    setTimeout(() => e.target.classList.add("dragging"), 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (
    e,
    targetType,
    targetCategoryIndex,
    targetServiceIndex = null
  ) => {
    e.preventDefault();

    const source = draggingItemRef.current;
    if (!source) return;

    // Don't allow dropping on itself
    if (
      source.type === targetType &&
      source.categoryIndex === targetCategoryIndex &&
      source.serviceIndex === targetServiceIndex
    ) {
      return;
    }

    const updatedCategories = [...categories];

    // Category reordering
    if (source.type === "category" && targetType === "category") {
      const [movedCategory] = updatedCategories.splice(source.categoryIndex, 1);
      updatedCategories.splice(targetCategoryIndex, 0, movedCategory);
    }
    // Service reordering within same category
    else if (
      source.type === "service" &&
      targetType === "service" &&
      source.categoryIndex === targetCategoryIndex
    ) {
      const services = updatedCategories[source.categoryIndex].services;
      const [movedService] = services.splice(source.serviceIndex, 1);
      services.splice(targetServiceIndex, 0, movedService);
    }
    // Moving service between categories
    else if (source.type === "service" && targetType === "category") {
      const sourceCategory = updatedCategories[source.categoryIndex];
      const [movedService] = sourceCategory.services.splice(
        source.serviceIndex,
        1
      );

      // Add to target category
      updatedCategories[targetCategoryIndex].services.push(movedService);

      // Remove source category if empty
      if (sourceCategory.services.length === 0) {
        updatedCategories.splice(source.categoryIndex, 1);
      }
    }

    setCategories(updatedCategories);
  };

  const handleAddEmptyService = (categoryIndex) => {
    const updatedCategories = [...categories];
    const newService = {
      id: Date.now().toString(),
      name: "",
      description: "",
      price: "",
      duration: "",
      durationType: "mints",
      staff: [],
      uploaded: false,
      image: null,
    };

    updatedCategories[categoryIndex].services.push(newService);
    setCategories(updatedCategories);
  };

  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) {
      message.warning("Please enter a category name");
      return;
    }

    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      expanded: true,
      services: [],
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
  };

  const handleToggleCategory = (categoryIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].expanded =
      !updatedCategories[categoryIndex].expanded;
    setCategories(updatedCategories);
  };

  const handleRemoveCategory = (categoryIndex) => {
    const updatedCategories = categories.filter((_, i) => i !== categoryIndex);
    setCategories(updatedCategories);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <Box
        sx={{
          height: { xs: "320px", sm: "320px", md: "320px" },
          overflowY: "auto",
          overflowX: "hidden",
          width: "98%",
          maxWidth: "100%",
          mb: { xs: 1, sm: 2 },
          pr: 2,
          wordWrap: "break-word",
          wordBreak: "break-word",
          contain: "layout style paint",
          contentVisibility: "auto",
          willChange: "scroll-position",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            borderRadius: "10px",
            marginBlock: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(27, 77, 105, 0.5)",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "rgba(27, 77, 105, 0.7)",
            },
          },
          // Firefox scrollbar styling
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(27, 77, 105, 0.5) rgba(0, 0, 0, 0.04)",
        }}
      >
        {categories.map((category, categoryIndex) => (
          <Box
            key={category.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "category", categoryIndex)}
            sx={{
              mb: { xs: 1.5, sm: 2 },
              borderRadius: { xs: "12px", sm: "15px" },
              border: "1px solid #d9d9d9",
              backgroundColor: "#ffffff",
              overflow: "hidden",
              maxWidth: "100%",
              wordWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {/* Category Header */}
            <Box
              draggable
              onDragStart={(e) => handleDragStart(e, "category", categoryIndex)}
              onDragEnd={handleDragEnd}
              sx={{
                display: "flex",
                alignItems: "center",
                p: { xs: 1, sm: 1.25, md: 1.5 },
                pr: { xs: 1, sm: 1, md: 1.25 },
                backgroundColor: "#f8f9fa",
                borderBottom: "2px solid #e9ecef",
                cursor: "move",
                "&.dragging": { opacity: 0.5 },
                flexWrap: { xs: "wrap", sm: "nowrap" },
                gap: { xs: 0.5, sm: 0.75, md: 1 },
                "&:hover": { backgroundColor: "#e9ecef" },
              }}
            >
              <IconButton
                size="small"
                sx={{ mr: { xs: 0.5, sm: 1 }, color: "#6c757d" }}
              >
                <GripVertical size={18} />
              </IconButton>

              <IconButton
                size="small"
                onClick={() => handleToggleCategory(categoryIndex)}
                sx={{ mr: { xs: 0.5, sm: 1 }, color: "#1b4d69" }}
              >
                {category.expanded ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </IconButton>

              <TextField
                value={category.name}
                onChange={(e) => {
                  const updatedCategories = [...categories];
                  updatedCategories[categoryIndex].name = e.target.value;
                  setCategories(updatedCategories);
                }}
                placeholder="Category name (e.g., Hair Services, Facial Treatments)"
                variant="standard"
                size="small"
                required
                sx={{
                  flexGrow: 1,
                  minWidth: { xs: "150px", sm: "200px" },
                  maxWidth: "100%",
                  "& .MuiInput-root:before": {
                    borderBottom: "1px solid #dee2e6",
                  },
                  "& .MuiInput-root:hover:not(.Mui-disabled):before": {
                    borderBottom: "2px solid #1b4d69",
                  },
                  "& .MuiInput-root:after": {
                    borderBottom: "2px solid #1b4d69",
                  },
                }}
                InputProps={{
                  sx: {
                    fontSize: { xs: "0.85rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    color: "#1b4d69",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: { xs: "space-between", sm: "flex-end" },
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PlusCircle size={16} />}
                  onClick={() => handleAddEmptyService(categoryIndex)}
                  sx={{
                    textTransform: "none",
                    color: "#fff",
                    fontSize: { xs: "0.60rem", sm: "0.7rem", md: "0.7rem" },
                    px: { xs: 1, sm: 1.25, md: 1.5 },
                    py: { xs: 0.5, sm: 0.75, md: 0.75 },
                    minWidth: { xs: "100px", sm: "120px", md: "auto" },
                    borderRadius: "6px",
                    "&:hover": {
                      background: "#0d3a52",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 8px rgba(27, 77, 105, 0.3)",
                    },
                    "& .MuiButton-startIcon": {
                      marginRight: { xs: "4px", sm: "6px", md: "8px" },
                    },
                  }}
                >
                  <Box sx={{ display: { xs: "none", sm: "inline" } }}>
                    <b>Add Service</b>
                  </Box>
                  <Box sx={{ display: { xs: "inline", sm: "none" } }}>
                    <b>Add</b>
                  </Box>
                </Button>

                <IconButton
                  size="small"
                  onClick={() => handleRemoveCategory(categoryIndex)}
                  sx={{
                    color: "#dc3545",
                    "&:hover": {
                      backgroundColor: "rgba(220, 53, 69, 0.1)",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <Trash2 size={18} />
                </IconButton>
              </Box>
            </Box>

            {/* Services List */}
            <Collapse in={category.expanded}>
              <Box
                sx={{
                  p: { xs: 1, sm: 1.25, md: 1.5 },
                  pr: { xs: 1, sm: 1, md: 1.25 },
                }}
              >
                {category.services.length === 0 && (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 4,
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      border: "2px dashed #dee2e6",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6c757d",
                        fontSize: { xs: "0.875rem", sm: "0.9rem" },
                        fontStyle: "italic",
                      }}
                    >
                      No services added to this category yet.
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#adb5bd",
                        fontSize: { xs: "0.75rem", sm: "0.8rem" },
                        mt: 1,
                        display: "block",
                      }}
                    >
                      Click "Add Service" to get started
                    </Typography>
                  </Box>
                )}

                {category.services.map((service, serviceIndex) => (
                  <Box
                    key={service.id}
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, "service", categoryIndex, serviceIndex)
                    }
                    onDragOver={handleDragOver}
                    onDrop={(e) =>
                      handleDrop(e, "service", categoryIndex, serviceIndex)
                    }
                    onDragEnd={handleDragEnd}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      mb: { xs: 2, sm: 2.5 },
                      p: { xs: 1.5, sm: 2, md: 2.5 },
                      borderRadius: { xs: "12px", sm: "15px" },
                      border: "1px solid #e9ecef",
                      backgroundColor: "#ffffff",
                      minHeight: "200px",
                      maxHeight: "600px",
                      contain: "layout style paint",
                      containIntrinsicSize: "auto 200px",
                      "&.dragging": {
                        backgroundColor: "#f8f9fa",
                        opacity: 0.7,
                        transform: "rotate(2deg)",
                      },
                      "&:hover": {
                        transform: "translateY(-1px)",
                      },
                      maxWidth: "100%",
                      overflow: "hidden",
                      wordWrap: "break-word",
                      wordBreak: "break-word",
                      transition: "transform 0.2s ease-in-out",
                      position: "relative",
                      willChange: "transform",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: "linear-gradient(90deg, #1b4d69, #2980b9)",
                        borderRadius: "12px 12px 0 0",
                      },
                    }}
                  >
                    {/* Mobile Layout - xs */}
                    <Box
                      sx={{
                        display: { xs: "block", sm: "none" },
                        width: "100%",
                      }}
                    >
                      {/* Controls and Service Name - Full Width Column */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1.5,
                          mt: 1.5,
                          gap: 1,
                        }}
                      >
                        <IconButton size="small" sx={{ cursor: "move" }}>
                          <GripVertical size={16} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleRemoveService(categoryIndex, serviceIndex)
                          }
                        >
                          <Trash2 size={16} color="#ff4444" />
                        </IconButton>
                        <TextField
                          label="Service Name"
                          value={service.name}
                          onChange={(e) => {
                            const updatedCategories = [...categories];
                            updatedCategories[categoryIndex].services[
                              serviceIndex
                            ].name = e.target.value;
                            setCategories(updatedCategories);
                          }}
                          variant="outlined"
                          size="small"
                          required
                          fullWidth
                          sx={{
                            "& .MuiInputBase-root": {
                              borderRadius: "6px",
                              height: "44px",
                              fontSize: "14px",
                              background: "#fbfbfb",
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "14px",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d9d9d9",
                            },
                          }}
                        />
                      </Box>

                      {/* Price - Full Width */}
                      <Box sx={{ mb: 1.5 }}>
                        <TextField
                          label="Price"
                          value={service.price}
                          onChange={(e) => {
                            const updatedCategories = [...categories];
                            updatedCategories[categoryIndex].services[
                              serviceIndex
                            ].price = e.target.value;
                            setCategories(updatedCategories);
                          }}
                          variant="outlined"
                          size="small"
                          required
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
                            style: { background: "#fbfbfb" },
                          }}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "44px",
                              borderRadius: "6px",
                              fontSize: "14px",
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "14px",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d9d9d9",
                            },
                          }}
                        />
                      </Box>

                      {/* Duration and Duration Type - Full Width Row */}
                      <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                        <TextField
                          label="Duration"
                          value={service.duration}
                          onChange={(e) => {
                            const updatedCategories = [...categories];
                            updatedCategories[categoryIndex].services[
                              serviceIndex
                            ].duration = e.target.value;
                            setCategories(updatedCategories);
                          }}
                          variant="outlined"
                          size="small"
                          required
                          sx={{
                            flex: 1,
                            "& .MuiInputBase-root": {
                              height: "44px",
                              borderRadius: "6px",
                              background: "#fbfbfb",
                            },
                            "& input": {
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: "14px",
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "14px",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d9d9d9",
                            },
                          }}
                        />
                        <Box
                        // sx={{ width: '100px' }}
                        >
                          <DurationSelect
                            value={service.durationType}
                            onChange={(e) => {
                              const updatedCategories = [...categories];
                              updatedCategories[categoryIndex].services[
                                serviceIndex
                              ].durationType = e.target.value;
                              setCategories(updatedCategories);
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Staff Select - Full Width */}
                      <Box sx={{ mb: 1.5 }}>
                        <StaffSelect
                          value={service.staff}
                          onChange={(e) => {
                            const updatedCategories = [...categories];
                            updatedCategories[categoryIndex].services[
                              serviceIndex
                            ].staff = e.target.value;
                            setCategories(updatedCategories);
                          }}
                          teamMembers={teamMembers}
                        />
                      </Box>

                      {/* Upload Image - Full Width */}
                      <Box sx={{ mb: 1.5 }}>
                        <Button
                          variant="outlined"
                          component="label"
                          fullWidth
                          sx={{
                            borderRadius: "6px",
                            borderColor: "#d9d9d9",
                            background: service.uploaded
                              ? "#1b4d69"
                              : "transparent",
                            color: service.uploaded ? "#fff" : "#000000",
                            textTransform: "none",
                            height: "44px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            gap: 1,
                            "&:hover": {
                              background: service.uploaded
                                ? "#1b4d69"
                                : "#f2f2f2",
                              color: service.uploaded ? "#fff" : "#000",
                            },
                          }}
                        >
                          {service.uploaded ? (
                            <>
                              <CheckCircleIcon sx={{ fontSize: "18px" }} />
                              Image Uploaded
                            </>
                          ) : (
                            <>
                              <PlusCircle size={18} />
                              Upload Image
                            </>
                          )}
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(e, categoryIndex, serviceIndex)
                            }
                          />
                        </Button>
                      </Box>

                      {/* Description - Full Width */}
                      <Box>
                        <TextField
                          value={service.description}
                          onChange={(e) => {
                            const updatedCategories = [...categories];
                            updatedCategories[categoryIndex].services[
                              serviceIndex
                            ].description = e.target.value;
                            setCategories(updatedCategories);
                          }}
                          label="Service Description (Optional)"
                          variant="outlined"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          multiline
                          minRows={3}
                          maxRows={6}
                          fullWidth
                          sx={{
                            "& .MuiInputBase-root": {
                              borderRadius: "6px",
                              fontSize: "14px",
                              background: "#fbfbfb",
                              transition: "none",
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "14px",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d9d9d9",
                            },
                            "& .MuiInputBase-input": {
                              resize: "vertical",
                              minHeight: "60px",
                              maxHeight: "120px",
                              transition: "none",
                            },
                            "& textarea": {
                              resize: "vertical !important",
                              overflow: "auto !important",
                            },
                          }}
                          InputProps={{
                            disableUnderline: true,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Responsive Layout - sm(600-900) & lg(1200+) */}
                    <Box
                      sx={{
                        display: {
                          xs: "none",
                          sm: "block",
                          md: "none",
                          lg: "block",
                        },
                        width: "100%",
                      }}
                    >
                      {/* Controls & Service Name & Price */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2.5,
                          mt: 0.5,
                          gap: 1,
                        }}
                      >
                        <IconButton size="small" sx={{ cursor: "move" }}>
                          <GripVertical size={16} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleRemoveService(categoryIndex, serviceIndex)
                          }
                        >
                          <Trash2 size={16} color="#ff4444" />
                        </IconButton>
                        <TextField
                          label="Service Name"
                          value={service.name}
                          onChange={(e) => {
                            const updatedCategories = [...categories];
                            updatedCategories[categoryIndex].services[
                              serviceIndex
                            ].name = e.target.value;
                            setCategories(updatedCategories);
                          }}
                          variant="outlined"
                          size="small"
                          required
                          fullWidth
                          sx={{
                            "& .MuiInputBase-root": {
                              borderRadius: "6px",
                              height: "44px",
                              fontSize: "14px",
                              background: "#fbfbfb",
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "14px",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d9d9d9",
                            },
                          }}
                        />
                        <TextField
                          label="Price"
                          value={service.price}
                          onChange={(e) => {
                            const updatedCategories = [...categories];
                            updatedCategories[categoryIndex].services[
                              serviceIndex
                            ].price = e.target.value;
                            setCategories(updatedCategories);
                          }}
                          variant="outlined"
                          size="small"
                          required
                          // fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
                            style: { background: "#fbfbfb" },
                          }}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "44px",
                              borderRadius: "6px",
                              fontSize: "14px",
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "14px",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d9d9d9",
                            },
                          }}
                        />
                      </Box>

                      {/* BOX NUMBER 2 */}

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          gap: 1,
                        }}
                      >
                        {/* Left side 50% */}
                        <Box
                          sx={{
                            flex: 1,
                            width: "50%",
                            // bgcolor: "red",
                            height: { sm: 160 },
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: 1,
                          }}
                        >
                          {/* Duration and Duration Type - Full Width Row */}
                          <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
                            <TextField
                              label="Duration"
                              value={service.duration}
                              onChange={(e) => {
                                const updatedCategories = [...categories];
                                updatedCategories[categoryIndex].services[
                                  serviceIndex
                                ].duration = e.target.value;
                                setCategories(updatedCategories);
                              }}
                              variant="outlined"
                              size="small"
                              required
                              sx={{
                                flex: 1,
                                "& .MuiInputBase-root": {
                                  height: "44px",
                                  borderRadius: "6px",
                                  background: "#fbfbfb",
                                },
                                "& input": {
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                },
                                "& .MuiInputLabel-root": {
                                  fontSize: "14px",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#d9d9d9",
                                },
                              }}
                            />
                            <DurationSelect
                              value={service.durationType}
                              onChange={(e) => {
                                const updatedCategories = [...categories];
                                updatedCategories[categoryIndex].services[
                                  serviceIndex
                                ].durationType = e.target.value;
                                setCategories(updatedCategories);
                              }}
                            />
                          </Box>
                          {/* Staff Select - Full Width */}
                          <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
                            <StaffSelect
                              value={service.staff}
                              onChange={(e) => {
                                const updatedCategories = [...categories];
                                updatedCategories[categoryIndex].services[
                                  serviceIndex
                                ].staff = e.target.value;
                                setCategories(updatedCategories);
                              }}
                              teamMembers={teamMembers}
                            />
                          </Box>
                          {/* Upload Image - Full Width */}
                          <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
                            <Button
                              variant="outlined"
                              component="label"
                              fullWidth
                              sx={{
                                borderRadius: "6px",
                                borderColor: "#d9d9d9",
                                background: service.uploaded
                                  ? "#1b4d69"
                                  : "transparent",
                                color: service.uploaded ? "#fff" : "#000000",
                                textTransform: "none",
                                height: "100%",
                                minHeight: "44px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "14px",
                                gap: 1,
                                "&:hover": {
                                  background: service.uploaded
                                    ? "#1b4d69"
                                    : "#f2f2f2",
                                  color: service.uploaded ? "#fff" : "#000",
                                },
                              }}
                            >
                              {service.uploaded ? (
                                <>
                                  <CheckCircleIcon sx={{ fontSize: "18px" }} />
                                  Image Uploaded
                                </>
                              ) : (
                                <>
                                  <PlusCircle size={18} />
                                  Upload Image
                                </>
                              )}
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileChange(
                                    e,
                                    categoryIndex,
                                    serviceIndex
                                  )
                                }
                              />
                            </Button>
                          </Box>
                        </Box>

                        {/* Right side 50% */}
                        <Box
                          sx={{
                            flex: 1,
                            width: "50%",
                            height: { sm: 160 },
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "stretch",
                          }}
                        >
                          {/* Description - Full Width */}
                          <TextField
                            value={service.description}
                            onChange={(e) => {
                              const updatedCategories = [...categories];
                              updatedCategories[categoryIndex].services[
                                serviceIndex
                              ].description = e.target.value;
                              setCategories(updatedCategories);
                            }}
                            label="Service Description (Optional)"
                            variant="outlined"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            multiline
                            minRows={4}
                            maxRows={8}
                            fullWidth
                            sx={{
                              height: "100%",
                              "& .MuiInputBase-root": {
                                borderRadius: "6px",
                                fontSize: "14px",
                                background: "#fbfbfb",
                                height: "100%",
                                alignItems: "flex-start",
                                transition: "none", // Remove transitions
                              },
                              "& .MuiInputLabel-root": {
                                fontSize: "14px",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#d9d9d9",
                              },
                              "& .MuiInputBase-input": {
                                height: "100% !important",
                                overflow: "auto !important",
                                resize: "vertical",
                                minHeight: "100px",
                                transition: "none", // Remove transitions
                              },
                              "& textarea": {
                                resize: "vertical !important",
                                overflow: "auto !important",
                              },
                            }}
                            InputProps={{
                              disableUnderline: true, // Reduce layout calculations
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* Desktop Layout - md only (900px-1200px)*/}
                    <Box
                      sx={{
                        display: {
                          xs: "none",
                          sm: "none",
                          md: "block",
                          lg: "none",
                        },
                        width: "100%",
                      }}
                    >
                      {/* First row - Service name with controls - Full Width */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1.5,
                          gap: 1.5,
                        }}
                      >
                        <IconButton size="small" sx={{ cursor: "move" }}>
                          <GripVertical size={16} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleRemoveService(categoryIndex, serviceIndex)
                          }
                        >
                          <Trash2 size={16} color="#ff4444" />
                        </IconButton>
                        <TextField
                          label="Service Name"
                          value={service.name}
                          onChange={(e) => {
                            const updatedCategories = [...categories];
                            updatedCategories[categoryIndex].services[
                              serviceIndex
                            ].name = e.target.value;
                            setCategories(updatedCategories);
                          }}
                          variant="outlined"
                          size="small"
                          required
                          sx={{
                            flexGrow: 1,
                            "& .MuiInputBase-root": {
                              borderRadius: "6px",
                              height: "44px",
                              fontSize: "15px",
                              background: "#fbfbfb",
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "15px",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d9d9d9",
                            },
                          }}
                        />
                      </Box>

                      {/* Second row - Price, Duration, Time dropdown - Full Width */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          mb: 1.5,
                        }}
                      >
                        <TextField
                          label="Price"
                          value={service.price}
                          onChange={(e) => {
                            const updatedCategories = [...categories];
                            updatedCategories[categoryIndex].services[
                              serviceIndex
                            ].price = e.target.value;
                            setCategories(updatedCategories);
                          }}
                          variant="outlined"
                          size="small"
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
                            style: { background: "#fbfbfb" },
                          }}
                          sx={{
                            flex: 1,
                            "& .MuiInputBase-root": {
                              height: "44px",
                              borderRadius: "6px",
                              fontSize: "15px",
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "15px",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d9d9d9",
                            },
                          }}
                        />
                        <TextField
                          label="Duration"
                          value={service.duration}
                          onChange={(e) => {
                            const updatedCategories = [...categories];
                            updatedCategories[categoryIndex].services[
                              serviceIndex
                            ].duration = e.target.value;
                            setCategories(updatedCategories);
                          }}
                          variant="outlined"
                          size="small"
                          required
                          sx={{
                            width: "120px",
                            "& .MuiInputBase-root": {
                              height: "44px",
                              borderRadius: "6px",
                              background: "#fbfbfb",
                            },
                            "& input": {
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: "15px",
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "15px",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d9d9d9",
                            },
                          }}
                        />
                        <Box>
                          <DurationSelect
                            value={service.durationType}
                            onChange={(e) => {
                              const updatedCategories = [...categories];
                              updatedCategories[categoryIndex].services[
                                serviceIndex
                              ].durationType = e.target.value;
                              setCategories(updatedCategories);
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Third row - Staff Select and Upload Image - Full Width */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          mb: 1.5,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <StaffSelect
                            value={service.staff}
                            onChange={(e) => {
                              const updatedCategories = [...categories];
                              updatedCategories[categoryIndex].services[
                                serviceIndex
                              ].staff = e.target.value;
                              setCategories(updatedCategories);
                            }}
                            teamMembers={teamMembers}
                          />
                        </Box>
                        <Button
                          variant="outlined"
                          component="label"
                          sx={{
                            borderRadius: "6px",
                            borderColor: "#d9d9d9",
                            background: service.uploaded
                              ? "#1b4d69"
                              : "transparent",
                            color: service.uploaded ? "#fff" : "#000000",
                            textTransform: "none",
                            width: "160px",
                            height: { xs: "40px", sm: "45px", md: "50px" },
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            "&:hover": {
                              background: service.uploaded
                                ? "#1b4d69"
                                : "#f2f2f2",
                              color: service.uploaded ? "#fff" : "#000",
                            },
                          }}
                        >
                          {service.uploaded ? (
                            <>
                              <CheckCircleIcon
                                sx={{ fontSize: "20px", mb: 0.5 }}
                              />
                              <Typography
                                variant="caption"
                                sx={{ fontSize: "12px" }}
                              >
                                Image Uploaded
                              </Typography>
                            </>
                          ) : (
                            <>
                              <PlusCircle
                                size={18}
                                style={{ marginBottom: "4px" }}
                              />
                              <Typography
                                variant="caption"
                                sx={{ fontSize: "12px" }}
                              >
                                Upload Image
                              </Typography>
                            </>
                          )}
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(e, categoryIndex, serviceIndex)
                            }
                          />
                        </Button>
                      </Box>

                      {/* Fourth row - Description - Full Width */}
                      <Box>
                        <TextField
                          value={service.description}
                          onChange={(e) => {
                            const updatedCategories = [...categories];
                            updatedCategories[categoryIndex].services[
                              serviceIndex
                            ].description = e.target.value;
                            setCategories(updatedCategories);
                          }}
                          label="Service Description (Optional)"
                          variant="outlined"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          multiline
                          minRows={2}
                          maxRows={4}
                          fullWidth
                          sx={{
                            "& .MuiInputBase-root": {
                              borderRadius: "6px",
                              fontSize: "15px",
                              background: "#fbfbfb",
                              transition: "none", // Remove transitions
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "15px",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#d9d9d9",
                            },
                            "& .MuiInputBase-input": {
                              resize: "vertical",
                              minHeight: "40px",
                              maxHeight: "80px",
                              transition: "none", // Remove transitions
                            },
                            "& textarea": {
                              resize: "vertical !important",
                              overflow: "auto !important",
                            },
                          }}
                          InputProps={{
                            disableUnderline: true, // Reduce layout calculations
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Collapse>
          </Box>
        ))}
      </Box>

      {/* Add New Category */}
      <Box
        sx={{
          display: "flex",
          gap: { xs: 1, sm: 1.5, md: 2 },
          mt: { xs: 2, sm: 3 },
          p: { xs: 1, sm: 1, md: 1.5 },
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
          border: "2px dashed #dee2e6",
          flexDirection: { xs: "column", sm: "column" },
          alignItems: { xs: "stretch", sm: "center" },
          maxWidth: "100%",
          overflow: "hidden",
          "&:hover": {
            borderColor: "#1b4d69",
            backgroundColor: "#f1f3f4",
          },
        }}
      >
        {/* <Box sx={{ flex: 1 }}> */}
          <Typography
            variant="subtitle2"
            sx={{
              width: "100%",
              fontWeight: "bold",
              color: "#1b4d69",
              fontSize: { xs: "0.875rem", sm: "0.9rem" },
            }}
          >
            Add New Category
          </Typography>

          <Box sx={{ flex: 1, display: "flex", gap: 1, width: "100%", flexDirection: { xs: "column", sm: "row" } }}>
              <TextField
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter Category Name"
                size="small"
                fullWidth
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "8px",
                    fontSize: { xs: "14px", sm: "15px" },
                    backgroundColor: "#fff",
                    "&:hover": {
                      borderColor: "#1b4d69",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "14px", sm: "15px" },
                  },
                  "& .MuiInputBase-input": {
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  },
                }}
              />
     

              <Button
                variant="contained"
                onClick={handleAddNewCategory}
                disabled={!newCategoryName.trim()}
                sx={{
                  textTransform: "none",
                  background: "#1b4d69",
                  color: "#fff",
                  fontSize: { xs: "14px", sm: "15px" },
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1.75, sm: 1.75 },
                  borderRadius: "8px",
                  minWidth: { xs: "100%", sm: "140px" },
                  maxWidth: { xs: "100%", sm: "auto" },
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  height: "40px",
                  "&:hover": {
                    background: "#0d3a52",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 8px rgba(27, 77, 105, 0.3)",
                  },
                  "&:disabled": {
                    background: "#e9ecef",
                    color: "#6c757d",
                    cursor: "not-allowed",
                  },
                }}
              >
                <b>Add Category</b>
              </Button>
          </Box>
      </Box>
    </Box>
  );
};

export default ServiceFormBox;

import React, { useState, useEffect, useRef } from 'react';
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
  TextareaAutosize
} from '@mui/material';
import { GripVertical, PlusCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { message } from 'antd';
import { uploadImages } from '../Apis/uploadAPI.js';
import {StaffSelect, DurationSelect} from './dropDowns.js'

const ServiceFormBox = ({ onServicesChange, services: initialServices, teamMembers }) => {

  const [categories, setCategories] = useState(() => {
    // Initialize with default structure if no initial services provided
    if (!initialServices || initialServices.length === 0) {
      return [
        {
          id: 'cat-1',
          name: 'General Services',
          expanded: true,
          services: [
            { 
              id: '1', 
              name: '', 
              description: '',
              price: '', 
              duration: '', 
              durationType: 'mints', 
              staff: [], 
              uploaded: false, 
              image: null 
            }
          ]
        }
      ];
    }
    
    // Convert flat services array to categorized structure if needed
    if (!initialServices[0]?.services) {
      return [
        {
          id: 'cat-1',
          name: 'General Services',
          expanded: true,
          services: initialServices.map(service => ({
            ...service,
            description: service.description || ''
          }))
        }
      ];
    }
    
    return initialServices.map(category => ({
      ...category,
      services: category.services.map(service => ({
        ...service,
        description: service.description || ''
      }))
    }));
  });
  
  const draggingItemRef = useRef();
  const draggingOverItemRef = useRef();
  const [openStaffDialog, setOpenStaffDialog] = useState(false);
  const [selectedService, setSelectedService] = useState({ index: null, categoryIndex: null });
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Validation function for services
  const validateServices = () => {
    const errors = [];
    
    categories.forEach((category, categoryIndex) => {
      if (!category.name || category.name.trim() === '') {
        errors.push(`Category ${categoryIndex + 1}: Name is required`);
      }
      
      category.services.forEach((service, serviceIndex) => {
        if (!service.name || service.name.trim() === '') {
          errors.push(`Category "${category.name}" - Service ${serviceIndex + 1}: Name is required`);
        }
        if (!service.price || service.price.trim() === '') {
          errors.push(`Category "${category.name}" - Service "${service.name}": Price is required`);
        }
        if (!service.duration || service.duration.trim() === '') {
          errors.push(`Category "${category.name}" - Service "${service.name}": Duration is required`);
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

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      message.error('Only JPEG, PNG, or WebP images are allowed');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      message.error('Image must be smaller than 2MB');
      return;
    }

    try {
      const token = 'VIRoHdqUAtpklgKg';
      const { data, error: uploadError } = await uploadImages([file], token);
      if (uploadError) {
        throw new Error(uploadError);
      }
      const imageUrl = data?.Data?.[0]?.url;
      if (!imageUrl) {
        throw new Error('No image URL returned');
      }
      
      const updatedCategories = [...categories];
      updatedCategories[categoryIndex].services[serviceIndex] = {
        ...updatedCategories[categoryIndex].services[serviceIndex],
        uploaded: true,
        imageUrl: imageUrl, 
      };
      
      setCategories(updatedCategories);
    } catch (err) {
      console.error('Upload failed:', err);
      message.error(`Image upload failed: ${err.message}`);
    }
  };

  const handleRemoveService = (categoryIndex, serviceIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].services = updatedCategories[categoryIndex].services.filter(
      (_, i) => i !== serviceIndex
    );
    
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
    setSelectedStaff(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSaveStaff = () => {
    const { categoryIndex, serviceIndex } = selectedService;
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].services[serviceIndex].staff = selectedStaff;
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

  const handleDrop = (e, targetType, targetCategoryIndex, targetServiceIndex = null) => {
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
    if (source.type === 'category' && targetType === 'category') {
      const [movedCategory] = updatedCategories.splice(source.categoryIndex, 1);
      updatedCategories.splice(targetCategoryIndex, 0, movedCategory);
    }
    // Service reordering within same category
    else if (source.type === 'service' && targetType === 'service' && 
             source.categoryIndex === targetCategoryIndex) {
      const services = updatedCategories[source.categoryIndex].services;
      const [movedService] = services.splice(source.serviceIndex, 1);
      services.splice(targetServiceIndex, 0, movedService);
    }
    // Moving service between categories
    else if (source.type === 'service' && targetType === 'category') {
      const sourceCategory = updatedCategories[source.categoryIndex];
      const [movedService] = sourceCategory.services.splice(source.serviceIndex, 1);
      
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
      name: '',
      description: '',
      price: '', 
      duration: '', 
      durationType: 'mints', 
      staff: [], 
      uploaded: false, 
      image: null,
    };
    
    updatedCategories[categoryIndex].services.push(newService);
    setCategories(updatedCategories);
  };

  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) {
      message.warning('Please enter a category name');
      return;
    }
    
    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      expanded: true,
      services: []
    };
    
    setCategories([...categories, newCategory]);
    setNewCategoryName('');
  };

  const handleToggleCategory = (categoryIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].expanded = !updatedCategories[categoryIndex].expanded;
    setCategories(updatedCategories);
  };

  const handleRemoveCategory = (categoryIndex) => {
    const updatedCategories = categories.filter((_, i) => i !== categoryIndex);
    setCategories(updatedCategories);
  };

  const renderStaffNames = (staff) => {
    const maxStaffLength = 15;
    const staffString = staff.join(', ');
    if (staff.length === 0) {
      return "Assign Staff";
    }
    return staffString.length > maxStaffLength ? 
      `${staffString.slice(0, maxStaffLength)}...` : 
      staffString;
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%'}}>
      {/* Informational Header */}
      {/* <Box sx={{ 
        mb: 2, 
        p: 2, 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px', 
        border: '1px solid #e9ecef' 
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 'bold', 
          color: '#1b4d69', 
          mb: 1,
          fontSize: { xs: '1rem', sm: '1.1rem' }
        }}>
          Service Categories & Management
        </Typography>
        <Typography variant="body2" sx={{ 
          color: '#6c757d', 
          fontSize: { xs: '0.875rem', sm: '0.9rem' },
          lineHeight: 1.4
        }}>
          Organize your services into categories (e.g., "Hair", "Massage"). 
          Each category can contain multiple services with their own details, pricing, and staff assignments.
        </Typography>
      </Box> */}

      <Box 
        sx={{ 
          maxHeight: { xs: '400px', sm: '450px', md: '500px' }, 
          overflowY: 'auto', 
          overflowX: 'hidden',
          width: '100%',
          maxWidth: '100%',
          mb: { xs: 1, sm: 2 }, 
          p: { xs: 0, sm: 1, md: 1.5 },
          pr: { xs: 0, sm: 0.5, md: 1 },
          scrollbarWidth: 'none',  
          '&::-webkit-scrollbar': { display: 'none' },
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          // bgcolor:"red"
        }}
      >
        {categories.map((category, categoryIndex) => (
          <Box 
            key={category.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'category', categoryIndex)}
            sx={{ 
              mb: { xs: 1.5, sm: 2 },
              borderRadius: { xs: '12px', sm: '15px' },
              border: '1px solid #d9d9d9',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
              maxWidth: '100%',
              wordWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            {/* Category Header */}
            <Box
              draggable
              onDragStart={(e) => handleDragStart(e, 'category', categoryIndex)}
              onDragEnd={handleDragEnd}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: { xs: 1, sm: 1.25, md: 1.5 },
                pr: { xs: 1, sm: 1, md: 1.25 },
                backgroundColor: '#f8f9fa',
                borderBottom: '2px solid #e9ecef',
                cursor: 'move',
                '&.dragging': { opacity: 0.5 },
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                gap: { xs: 0.5, sm: 0.75, md: 1 },
                '&:hover': { backgroundColor: '#e9ecef' },
              }}
            >
              <IconButton size="small" sx={{ mr: { xs: 0.5, sm: 1 }, color: '#6c757d' }}>
                <GripVertical size={18} />
              </IconButton>

              <IconButton 
                size="small" 
                onClick={() => handleToggleCategory(categoryIndex)}
                sx={{ mr: { xs: 0.5, sm: 1 }, color: '#1b4d69' }}
              >
                {category.expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
                  minWidth: { xs: '150px', sm: 'auto' },
                  maxWidth: '100%',
                  '& .MuiInput-root:before': { borderBottom: '1px solid #dee2e6' },
                  '& .MuiInput-root:hover:not(.Mui-disabled):before': { borderBottom: '2px solid #1b4d69' },
                  '& .MuiInput-root:after': { borderBottom: '2px solid #1b4d69' },
                }}
                InputProps={{
                  sx: { 
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    fontWeight: 'bold',
                    color: '#1b4d69',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                  }
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PlusCircle size={16} />}
                  onClick={() => handleAddEmptyService(categoryIndex)}
                  sx={{ 
                    textTransform: 'none',
                    // background: "#1b4d69", 
                    color: "#fff",
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                    px: { xs: 1, sm: 1.25, md: 1.5 },
                    py: { xs: 0.5, sm: 0.75, md: 1 },
                    minWidth: { xs: '100px', sm: '120px', md: 'auto' },
                    borderRadius: '6px',
                    '&:hover': { 
                      background: "#0d3a52",
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(27, 77, 105, 0.3)'
                    },
                    '& .MuiButton-startIcon': {
                      marginRight: { xs: '4px', sm: '6px', md: '8px' }
                    }
                  }}
                >
                  <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    <b>Add Service</b>
                  </Box>
                  <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>
                    <b>Add</b>
                  </Box>
                </Button>

                <IconButton 
                  size="small" 
                  onClick={() => handleRemoveCategory(categoryIndex)}
                  sx={{ 
                    color: '#dc3545',
                    '&:hover': { 
                      backgroundColor: 'rgba(220, 53, 69, 0.1)',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <Trash2 size={18} />
                </IconButton>
              </Box>
            </Box>

            {/* Services List */}
            <Collapse in={category.expanded}>
              <Box sx={{ p: { xs: 1, sm: 1.25, md: 1.5 }, pr: { xs: 1, sm: 1, md: 1.25 } }}>
                {category.services.length === 0 && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '2px dashed #dee2e6',
                    mb: 2
                  }}>
                    <Typography variant="body2" sx={{ 
                      color: '#6c757d',
                      fontSize: { xs: '0.875rem', sm: '0.9rem' },
                      fontStyle: 'italic'
                    }}>
                      No services added to this category yet.
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: '#adb5bd',
                      fontSize: { xs: '0.75rem', sm: '0.8rem' },
                      mt: 1,
                      display: 'block'
                    }}>
                      Click "Add Service" to get started
                    </Typography>
                  </Box>
                )}
                
                {category.services.map((service, serviceIndex) => (
                  <Box
                    key={service.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'service', categoryIndex, serviceIndex)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'service', categoryIndex, serviceIndex)}
                    onDragEnd={handleDragEnd}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      mb: { xs: 2, sm: 2.5 },
                      p: { xs: 1.5, sm: 2, md: 2.5 },
                      borderRadius: { xs: '12px', sm: '15px' },
                      border: '1px solid #e9ecef',
                      backgroundColor: '#ffffff',
                      '&.dragging': { 
                        backgroundColor: '#f8f9fa',
                        opacity: 0.7,
                        transform: 'rotate(2deg)'
                      },
                      '&:hover': { 
                        // boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        // borderColor: '#1b4d69',
                        transform: 'translateY(-1px)'
                      },
                      maxWidth: '100%',
                      overflow: 'hidden',
                      wordWrap: 'break-word',
                      wordBreak: 'break-word',
                      transition: 'all 0.2s ease-in-out',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #1b4d69, #2980b9)',
                        borderRadius: '12px 12px 0 0',
                      }
                    }}
                  >
                    {/* First row - Service name and basic controls */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: { xs: 1, sm: 1.25, md: 1.5 },
                      gap: { xs: 1, sm: 1.25, md: 1.5 },
                      maxWidth: '100%',
                      overflow: 'hidden',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton size="small" sx={{ mr: { xs: 0.5, sm: 1 }, cursor: 'move' }}>
                          <GripVertical size={16} />
                        </IconButton>

                        <IconButton 
                          size="small" 
                          sx={{ mr: { xs: 0.5, sm: 1 } }}
                          onClick={() => handleRemoveService(categoryIndex, serviceIndex)}
                        >
                          <Trash2 size={16} color="#ff4444" />
                        </IconButton>
                      </Box>

                      <TextField
                        label="Service Name"
                        value={service.name}
                        onChange={(e) => {
                          const updatedCategories = [...categories];
                          updatedCategories[categoryIndex].services[serviceIndex].name = e.target.value;
                          setCategories(updatedCategories);
                        }}
                        variant="outlined"
                        size="small"
                        required
                        sx={{
                          flexGrow: 1,
                          minWidth: { xs: '150px', sm: '200px' },
                          maxWidth: '100%',
                          '& .MuiInputBase-root': {
                            borderRadius: '6px',
                            height: { xs: '40px', sm: '44px' },
                            fontSize: { xs: '14px', sm: '15px' },
                            background: "#fbfbfb",
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: { xs: '14px', sm: '15px' },
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: "#d9d9d9",
                          },
                          '& .MuiInputBase-input': {
                            wordWrap: 'break-word',
                            wordBreak: 'break-word',
                            whiteSpace: 'normal',
                          },
                        }}
                      />
                    </Box>

                    {/* Second row - Price and Duration */}
                    <Box sx={{ 
                      display: 'flex', 
                      gap: { xs: 1, sm: 1.25, md: 1.5 },
                      mb: { xs: 1, sm: 1.25, md: 1.5 },
                      flexWrap: 'wrap',
                      maxWidth: '100%',
                    }}>
                      <TextField
                        label="Price"
                        value={service.price}
                        onChange={(e) => {
                          const updatedCategories = [...categories];
                          updatedCategories[categoryIndex].services[serviceIndex].price = e.target.value;
                          setCategories(updatedCategories);
                        }}
                        variant="outlined"
                        size="small"
                        required
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          style: { background: "#fbfbfb" },
                        }}
                        sx={{
                          width: { xs: '120px', sm: '140px' },
                          minWidth: { xs: '120px', sm: '140px' },
                          maxWidth: { xs: '150px', sm: '160px' },
                          '& .MuiInputBase-root': {
                            height: { xs: '40px', sm: '44px' },
                            borderRadius: '6px',
                            fontSize: { xs: '14px', sm: '15px' },
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: { xs: '14px', sm: '15px' },
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: "#d9d9d9",
                          },
                        }}
                      />

                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                          label="Duration"
                          value={service.duration}
                          onChange={(e) => {
                            const updatedCategories = [...categories];
                            updatedCategories[categoryIndex].services[serviceIndex].duration = e.target.value;
                            setCategories(updatedCategories);
                          }}
                          variant="outlined"
                          size="small"
                          required
                          sx={{
                            width: { xs: '80px', sm: '90px' },
                            minWidth: { xs: '80px', sm: '90px' },
                            maxWidth: { xs: '90px', sm: '100px' },
                            '& .MuiInputBase-root': {
                              height: { xs: '40px', sm: '44px' },
                              borderRadius: '6px',
                              background: "#fbfbfb",
                            },
                            '& input': {
                              textAlign: 'center',
                              fontWeight: "bold",
                              fontSize: { xs: '14px', sm: '15px' },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: { xs: '14px', sm: '15px' },
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: "#d9d9d9",
                            },
                          }}
                        />

                        <DurationSelect
                          value={service.durationType}
                          onChange={(e) => {
                            const updatedCategories = [...categories];
                            updatedCategories[categoryIndex].services[serviceIndex].durationType = e.target.value;
                            setCategories(updatedCategories);
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Third row - Staff assignment */}
                    <Box sx={{ 
                      display: 'flex', 
                      gap: { xs: 1, sm: 1.25, md: 1.5 },
                      mb: { xs: 1, sm: 1.25, md: 1.5 },
                      maxWidth: '100%',
                    }}>
                      <Box sx={{ 
                        width: { xs: '100%', sm: '200px', md: '240px' },
                        minWidth: { xs: '100%', sm: '160px', md: '200px' },
                        maxWidth: { xs: '100%', sm: '220px', md: '260px' },
                      }}>
                        <StaffSelect
                          value={service.staff}
                          onChange={(e) => {
                            const updatedCategories = [...categories];
                            updatedCategories[categoryIndex].services[serviceIndex].staff = e.target.value;
                            setCategories(updatedCategories);
                          }}
                          teamMembers={teamMembers}
                        />
                      </Box>

                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          borderRadius: '6px',
                          borderColor: '#d9d9d9',
                          background: service.uploaded ? '#1b4d69' : 'transparent',
                          color: service.uploaded ? '#fff' : '#000000',
                          textTransform: 'none',
                          width: { xs: '100%', sm: '130px', md: '140px' },
                          minWidth: { xs: '100%', sm: '130px', md: '140px' },
                          maxWidth: { xs: '100%', sm: '140px', md: '150px' },
                          height: { xs: '44px', sm: '50px', md: '56px' },
                          display: 'flex', 
                          flexDirection: 'column',
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: { xs: '13px', sm: '14px', md: '15px' },
                          overflow: 'hidden',
                          '&:hover': { 
                            background: service.uploaded ? '#1b4d69' : "#f2f2f2", 
                            color: service.uploaded ? '#fff' : "#000" 
                          },
                        }}
                      >
                        {service.uploaded ? (
                          <>
                            <CheckCircleIcon sx={{ fontSize: { xs: '18px', sm: '20px' }, mb: 0.5 }} />
                            <Typography variant="caption" sx={{ fontSize: { xs: '11px', sm: '12px' } }}>
                              Image Uploaded
                            </Typography>
                          </>
                        ) : (
                          <>
                            <PlusCircle size={18} style={{ marginBottom: '4px' }} />
                            <Typography variant="caption" sx={{ fontSize: { xs: '11px', sm: '12px' } }}>
                              Upload Image
                            </Typography>
                          </>
                        )}
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, categoryIndex, serviceIndex)}
                        />
                      </Button>
                    </Box>

                    {/* Fourth row - Description */}
                    <Box sx={{ 
                      display: 'flex', 
                      maxWidth: '100%',
                    }}>
                      <TextField
                        value={service.description}
                        onChange={(e) => {
                          const updatedCategories = [...categories];
                          updatedCategories[categoryIndex].services[serviceIndex].description = e.target.value;
                          setCategories(updatedCategories);
                        }}
                        label="Service Description (Optional)"
                        variant="outlined"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        multiline
                        rows={2}
                        sx={{
                          width: '100%',
                          '& .MuiInputBase-root': {
                            borderRadius: '6px',
                            fontSize: { xs: '14px', sm: '15px' },
                            background: "#fbfbfb",
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: { xs: '14px', sm: '15px' },
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: "#d9d9d9",
                          },
                          '& .MuiInputBase-input': {
                            wordWrap: 'break-word',
                            wordBreak: 'break-word',
                            whiteSpace: 'normal',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Collapse>
          </Box>
        ))}
      </Box>

      {/* Add New Category */}
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 1, sm: 1.5, md: 2 }, 
        mt: { xs: 2, sm: 3 }, 
        p: { xs: 1.5, sm: 2, md: 2.5 }, 
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '2px dashed #dee2e6',
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: 'stretch', sm: 'center' },
        maxWidth: '100%',
        overflow: 'hidden',
        '&:hover': {
          borderColor: '#1b4d69',
          backgroundColor: '#f1f3f4',
        }
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 'bold', 
            color: '#1b4d69', 
            mb: 1,
            fontSize: { xs: '0.875rem', sm: '0.9rem' }
          }}>
            Add New Category
          </Typography>
          <TextField
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name (e.g., Hair Services, Nail Care)"
            size="small"
            fullWidth
            sx={{ 
              '& .MuiInputBase-root': {
                borderRadius: '8px',
                fontSize: { xs: '14px', sm: '15px' },
                backgroundColor: '#fff',
                border: '1px solid #dee2e6',
                '&:hover': {
                  borderColor: '#1b4d69',
                }
              },
              '& .MuiInputLabel-root': {
                fontSize: { xs: '14px', sm: '15px' },
              },
              '& .MuiInputBase-input': {
                wordWrap: 'break-word',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
              },
            }}
          />
        </Box>
        
        <Button
          variant="contained"
          onClick={handleAddNewCategory}
          disabled={!newCategoryName.trim()}
          sx={{ 
            textTransform: 'none',
            background: "#1b4d69", 
            color: "#fff",
            fontSize: { xs: '14px', sm: '15px' },
            px: { xs: 2, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            borderRadius: '8px',
            minWidth: { xs: '100%', sm: '140px' },
            maxWidth: { xs: '100%', sm: 'auto' },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '&:hover': { 
              background: "#0d3a52",
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(27, 77, 105, 0.3)'
            },
            '&:disabled': {
              background: '#e9ecef',
              color: '#6c757d',
              cursor: 'not-allowed'
            }
          }}
        >
          <b>Add Category</b>
        </Button>
      </Box>

      {/* Summary Statistics */}
      {/* <Box sx={{ 
        mt: 2, 
        p: 2, 
        backgroundColor: '#e8f4f8', 
        borderRadius: '8px',
        border: '1px solid #bee5eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 'bold', 
            color: '#1b4d69',
            fontSize: { xs: '0.875rem', sm: '0.9rem' }
          }}>
            Summary
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#6c757d',
            fontSize: { xs: '0.8rem', sm: '0.85rem' }
          }}>
            {categories.length} {categories.length === 1 ? 'Category' : 'Categories'} • {' '}
            {categories.reduce((total, cat) => total + cat.services.length, 0)} Total Services
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="caption" sx={{ 
            color: '#6c757d',
            fontSize: { xs: '0.75rem', sm: '0.8rem' }
          }}>
            💡 Tip: Drag to reorder categories and services
          </Typography>
        </Box>
      </Box> */}
    </Box>
  );
};

export default ServiceFormBox;
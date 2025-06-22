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

  // Notify parent when services change
  useEffect(() => {
    if (onServicesChange) {
      onServicesChange(categories);
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
    <Box>
      <Box 
        sx={{ 
          maxHeight: '500px', 
          overflowY: 'auto', 
          width:'54vw',
          mb: 2, 
          p: 2,
          scrollbarWidth: 'none',  
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {categories.map((category, categoryIndex) => (
          <Box 
            key={category.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'category', categoryIndex)}
            sx={{ 
              mb: 2,
              borderRadius: '15px',
              border: '1px solid #d9d9d9',
              backgroundColor: '#ffffff',
              overflow: 'hidden'
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
                p: 1,
                backgroundColor: '#f5f5f5',
                cursor: 'move',
                '&.dragging': { opacity: 0.5 },
              }}
            >
              <IconButton size="small" sx={{ mr: 1 }}>
                <GripVertical />
              </IconButton>

              <IconButton 
                size="small" 
                onClick={() => handleToggleCategory(categoryIndex)}
                sx={{ mr: 1 }}
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
                placeholder="Category name"
                variant="standard"
                size="small"
                sx={{ 
                  flexGrow: 1,
                  '& .MuiInput-root:before': { borderBottom: 'none' },
                  '& .MuiInput-root:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                  '& .MuiInput-root:after': { borderBottom: 'none' },
                }}
                InputProps={{
                  sx: { 
                    fontSize: '1rem',
                    fontWeight: 'bold',
                  }
                }}
              />

              <IconButton 
                size="small" 
                onClick={() => handleRemoveCategory(categoryIndex)}
                sx={{ mr: 1 }}
              >
                <Trash2 size={18} color="#ff4444" />
              </IconButton>

              <Button
                variant="contained"
                size="small"
                startIcon={<PlusCircle size={16} />}
                onClick={() => handleAddEmptyService(categoryIndex)}
                sx={{ 
                  textTransform: 'none',
                  background: "#f2f2f2", 
                  color: "#000",
                  '&:hover': { background: "#e0e0e0" }
                }}
              >
                <b>Add Service</b>
              </Button>
            </Box>

            {/* Services List */}
            <Collapse in={category.expanded}>
              <Box sx={{ p: 1 }}>
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
                      mb: 2,
                      p: 2,
                      borderRadius: '10px',
                      border: '1px solid #e0e0e0',
                      backgroundColor: '#ffffff',
                      '&.dragging': { backgroundColor: '#f2f2f2' },
                      '&:hover': { boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' },
                    }}
                  >
                    {/* First row - controls and basic info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <IconButton size="small" sx={{ mr: 1, cursor: 'move' }}>
                        <GripVertical />
                      </IconButton>

                      <IconButton 
                        size="small" 
                        sx={{ mr: 1 }}
                        onClick={() => handleRemoveService(categoryIndex, serviceIndex)}
                      >
                        <Trash2 size={18} color="#ff4444" />
                      </IconButton>

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
                        sx={{
                          flexGrow: 1,
                          mr: 1.5,
                          '& .MuiInputBase-root': {
                            borderRadius: '6px',
                            height: '40px',  
                            fontSize: "14px",
                            background: "#fbfbfb",
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: "#d9d9d9",
                          },
                        }}
                      />

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
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          style: { background: "#fbfbfb" },
                        }}
                        sx={{
                          width: '100px', 
                          mr: 1.5,
                          '& .MuiInputBase-root': {
                            height: '40px',
                            borderRadius: '6px',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: "#d9d9d9",
                          },
                        }}
                      />

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
                        sx={{
                          width: '80px',
                          mr: 1.5,
                          '& .MuiInputBase-root': {
                            height: '33px',
                            borderRadius: '6px',
                          },
                          '& input': {
                            textAlign: 'center',
                            fontWeight: "bold",
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '13px',
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

                    {/* Second row - description and image upload */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <StaffSelect
                        value={service.staff}
                        onChange={(e) => {
                          const updatedCategories = [...categories];
                          updatedCategories[categoryIndex].services[serviceIndex].staff = e.target.value;
                          setCategories(updatedCategories);
                        }}
                        teamMembers={teamMembers}
                      />

                      <TextField
                        value={service.description}
                        onChange={(e) => {
                          const updatedCategories = [...categories];
                          updatedCategories[categoryIndex].services[serviceIndex].description = e.target.value;
                          setCategories(updatedCategories);
                        }}
                        label="Service Description"
                        variant="outlined"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        multiline
                        rows={2}
                        sx={{
                          flexGrow: 1,
                          '& .MuiInputBase-root': {
                            borderRadius: '6px',
                          },
                        }}
                      />

                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          borderRadius: '6px',
                          borderColor: '#d9d9d9',
                          background: service.uploaded ? '#1b4d69' : 'transparent',
                          color: service.uploaded ? '#fff' : '#000000',
                          textTransform: 'none',
                          width: '120px',
                          height: '64px',
                          display: 'flex', 
                          flexDirection: 'column',
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          '&:hover': { 
                            background: service.uploaded ? '#1b4d69' : "#f2f2f2", 
                            color: service.uploaded ? '#fff' : "#000" 
                          },
                        }}
                      >
                        {service.uploaded ? (
                          <>
                            <CheckCircleIcon sx={{ fontSize: '20px', mb: 0.5 }} />
                            <Typography variant="caption">Image Uploaded</Typography>
                          </>
                        ) : (
                          <>
                            <PlusCircle size={20} style={{ marginBottom: '4px' }} />
                            <Typography variant="caption">Upload Image</Typography>
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
                  </Box>
                ))}
              </Box>
            </Collapse>
          </Box>
        ))}
      </Box>

      {/* Add New Category */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2, px: 3 }}>
        <TextField
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Enter new category name"
          size="small"
          sx={{ flexGrow: 1 }}
          InputProps={{
            sx: { borderRadius: '6px' }
          }}
        />
        <Button
          variant="contained"
          onClick={handleAddNewCategory}
          sx={{ 
            textTransform: 'none',
            background: "#f2f2f2", 
            color: "#000",
            '&:hover': { background: "#e0e0e0" },
            borderRadius: '6px'
          }}
        >
          <b>Add Category</b>
        </Button>
      </Box>
    </Box>
  );
};

export default ServiceFormBox;
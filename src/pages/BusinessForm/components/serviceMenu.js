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
  ListItemText 
} from '@mui/material';
import { GripVertical, PlusCircle, Trash2 } from 'lucide-react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { message } from 'antd';
import { uploadImages } from '../Apis/uploadAPI.js'

const DurationSelect = ({ value, onChange }) => (
  <Select
    value={value}
    onChange={onChange}
    size="small"
    sx={{
      width: '100px',
      height: '33px',
      px: "8px",
      borderRadius: "6px",
      '& .MuiSelect-select': {
        padding: '0',  
        display: 'flex',  
        alignItems: 'center',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: '1px solid #d9d9d9', 
      },
    }}
  >
    <MenuItem value="mints">mints</MenuItem>
    <MenuItem value="hours">hours</MenuItem>
    <MenuItem value="days">days</MenuItem>
    <MenuItem value="months">months</MenuItem>
  </Select>
);

const ServiceFormBox = ({ onServicesChange, services: initialServices, teamMembers }) => {
  const [services, setServices] = useState(initialServices || [
    { 
      id: '1', 
      name: 'Enter Service Name', 
      price: '-', 
      duration: '-', 
      durationType: 'mints', 
      staff: [], 
      uploaded: false, 
      image: null 
    },
  ]);
  
  useEffect(() => {
    setServices(initialServices || []); 
  }, [initialServices]);

  const draggingItemRef = useRef();
  const draggingOverItemRef = useRef();
  const [openStaffDialog, setOpenStaffDialog] = useState(false);
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState([]);

const handleFileChange = async (event, index) => {
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
      const updatedServices = services.map((service, i) =>
        i === index
          ? {
              ...service,
              uploaded: true,
              imageUrl: imageUrl, 
            }
          : service
      );
      setServices(updatedServices);
      onServicesChange(updatedServices);
    } catch (err) {
      console.error('Upload failed:', err);
      message.error(`Image upload failed: ${err.message}`);
    }
  };


  const handleRemoveService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
    onServicesChange(updatedServices);
  };

  const handleOpenStaffDialog = (index) => {
    setSelectedServiceIndex(index);
    setSelectedStaff(services[index].staff);
    setOpenStaffDialog(true);
  };

  const handleStaffSelection = (event) => {
    const value = event.target.value;
    setSelectedStaff(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSaveStaff = () => {
    const updatedServices = services.map((service, index) =>
      index === selectedServiceIndex ? { ...service, staff: selectedStaff } : service
    );
    setServices(updatedServices);
    setOpenStaffDialog(false);
    onServicesChange(updatedServices); 
  };

  const handleDragStart = (e, index) => {
    draggingItemRef.current = index;
    setTimeout(() => e.target.classList.add("dragging"), 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging");
  };

  const handleDragEnter = (e, index) => {
    draggingOverItemRef.current = index;
    const updatedServices = [...services];

    const draggedItemContent = updatedServices.splice(draggingItemRef.current, 1)[0];
    updatedServices.splice(draggingOverItemRef.current, 0, draggedItemContent);

    draggingItemRef.current = draggingOverItemRef.current;
    setServices(updatedServices);
    onServicesChange(updatedServices);
  };

  const handleAddEmptyService = () => {
    const newService = {
      id: (services.length + 1).toString(),
      name: '',
      price: '-',
      duration: '-',
      durationType: 'mints',
      staff: [],
      uploaded: false,
      image: null,
    };
    const updatedServices = [...services, newService];
    setServices(updatedServices);
    onServicesChange(updatedServices); 
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
          maxHeight: '400px', 
          overflowY: 'auto', 
          mb: 2, 
          p: 2,
          scrollbarWidth: 'none',  
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {services.map((service, index) => (
          <Box
            key={service.id}
            className="item"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              p: 1,
              borderRadius: '15px',
              border: '1px solid #d9d9d9',
              backgroundColor: '#ffffff',
              '&.dragging': { backgroundColor: '#f2f2f2' },
              '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' },
            }}
          >
            <IconButton size="small" sx={{ mr: 1, cursor: 'move' }}>
              <GripVertical />
            </IconButton>

            <IconButton 
              size="small" 
              sx={{ mr: 1 }}
              onClick={() => handleRemoveService(index)}
            >
              <Trash2 size={18} color="#ff4444" />
            </IconButton>

            <TextField
              value={service.name}
              onChange={(e) => {
                const updatedServices = services.map((s, i) => 
                  i === index ? { ...s, name: e.target.value } : s
                );
                setServices(updatedServices);
                onServicesChange(updatedServices);
              }}
              variant="outlined"
              size="small"  
              sx={{
                flexGrow: 1,
                mr: 1.5,
                '& .MuiInputBase-root': {
                  borderRadius: '6px',
                  height: '33px',  
                  fontSize: "14px"
                },
              }}
            />

            <TextField
              value={service.price}
              onChange={(e) => {
                const updatedServices = services.map((s, i) => 
                  i === index ? { ...s, price: e.target.value } : s
                );
                setServices(updatedServices);
                onServicesChange(updatedServices);
              }}
              variant="outlined"
              size="small"
              sx={{
                flexGrow: 1,
                mr: 1.5,
                width: '70px', 
                '& .MuiInputBase-root': {
                  height: '33px',  
                  borderRadius: '6px',
                  padding: '0 10px',
                },
                '& input': {
                  fontWeight: "bold",
                  padding: '0 0px',
                },
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{mr:0.2}}>₹</InputAdornment>,
              }}
            />

            <TextField
              value={service.duration}
              onChange={(e) => {
                const updatedServices = services.map((s, i) => 
                  i === index ? { ...s, duration: e.target.value } : s
                );
                setServices(updatedServices);
                onServicesChange(updatedServices);
              }}
              variant="outlined"
              size="small"
              sx={{
                flexGrow: 1,
                width: '70px',
                mr: 1.5,
                '& .MuiInputBase-root': {
                  height: '33px',  
                  borderRadius: '6px',
                  padding: '0 10px',
                },
                '& input': {
                  textAlign: 'center',
                  fontWeight: "bold",
                  padding: '0 0px',
                },
              }}
            />

            <DurationSelect
              value={service.durationType}
              onChange={(e) => {
                const updatedServices = services.map((s, i) => 
                  i === index ? { ...s, durationType: e.target.value } : s
                );
                setServices(updatedServices);
                onServicesChange(updatedServices);
              }}
            />

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '110px',
                ml: 1.5,
                cursor: 'pointer',
              }}
              onClick={() => handleOpenStaffDialog(index)}
            >
              <Chip 
                label={renderStaffNames(service.staff)} 
                size="small" 
                sx={{ 
                  width: "110px",
                  px: "8px",
                  height: "33px",
                  border: "1px solid #d9d9d9", 
                  borderRadius: "6px",
                  fontWeight: "bold",
                  background: "transparent",
                  '&:hover': { background: "#f2f2f2" },
                }} 
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
                width: '100px',
                height: '33px',
                mx: 1.5,
                px: 7,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                '&:hover': { background: "#f2f2f2", color: "#000" },
              }}
            >
              {service.uploaded ? (
                <>
                  Uploaded
                  <CheckCircleIcon sx={{ ml: 0.5, fontSize: '15px' }} />
                </>
              ) : (
                'Upload'
              )}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e, index)}
              />
            </Button>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'right', mt: 2, px: 3 }}>
         <Button
            variant="contained"
            startIcon={<PlusCircle />}
            onClick={handleAddEmptyService}
            sx={{ textTransform: 'none', width: '15%',background: "#f2f2f2", color:"#000", }}
          >
          <b>Add</b>
          </Button>
      </Box>

      {/* Staff Assignment Dialog */}
      <Dialog 
        open={openStaffDialog} 
        onClose={() => setOpenStaffDialog(false)} 
        PaperProps={{ 
          sx: { 
            borderRadius: "15px", 
          }
        }}  
      >
        <DialogTitle>Assign Staff</DialogTitle>
        <DialogContent sx={{ py: 0 }}>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel>Staff</InputLabel>
            <Select
              multiple
              value={selectedStaff}
              onChange={handleStaffSelection}
              input={<OutlinedInput label="Staff" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {(Array.isArray(teamMembers) && teamMembers.some(member => member.name)) ? (
                teamMembers.map((member) => (
                  member.name ? ( 
                    <MenuItem key={member.name} value={member.name}>
                      {/* <Checkbox checked={selectedStaff.indexOf(member.name) > -1} /> */}
                      <ListItemText primary={member.name} />
                    </MenuItem>
                  ) : null
                ))
              ) : (
                <MenuItem disabled value="">
                  <ListItemText primary="No staff available" />
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ mr: 2, mb: 1 }}>
          <Button onClick={() => setOpenStaffDialog(false)}><b>Cancel</b></Button>
          <Button onClick={handleSaveStaff}><b>Save</b></Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceFormBox;
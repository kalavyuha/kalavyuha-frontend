import React, { useState,useEffect, useRef } from 'react';
import { Box, Checkbox, TextField, Select, MenuItem, Chip, IconButton, Button, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, OutlinedInput, ListItemText, Checkbox as MuiCheckbox } from '@mui/material';
import { GripVertical, Copy, PlusCircle } from 'lucide-react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const staffList = ['Ankit', 'Varun', 'Pinkal', 'Jay', 'Babita', 'Sara'];

const DurationSelect = ({ value, onChange }) => (
    <Select
    value={value}
    onChange={onChange}
    size="small"
    sx={{
      width: '100px',
      height: '33px',
      px:"8px",
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

const ServiceFormBox = ({onServicesChange, services: initialServices, teamMembers}) => {
  console.log(teamMembers)
  const [services, setServices] = useState(initialServices || [
    { id: '1', name: 'Enter Service Name', price: '-', duration: '-', durationType: 'mints', staff: [], uploaded: false, checked: false, image: null },
  ]);
  
    useEffect(() => {
      setServices(initialServices || []); // Update services when initialServices prop changes
    }, [initialServices]);


    const draggingItemRef = useRef();
    const draggingOverItemRef = useRef();
  
    const [openStaffDialog, setOpenStaffDialog] = useState(false);
    const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState([]);
  
    const handleFileChange = (event, index) => {
      const file = event.target.files[0];
      if (file) {
        const updatedServices = services.map((service, i) => {
          if (i === index && service.checked) {
            return { ...service, uploaded: true, image: file };
          }
          return service; 
        });
        
        setServices(updatedServices);
        onServicesChange(updatedServices); 
      }
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
  
    const handleDuplicateService = () => {
      const lastService = services[services.length - 1];
      const newService = { ...lastService, id: (services.length + 1).toString() };
      setServices([...services, newService]);
      onServicesChange([...services, newService]);
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
  
    // Add a new empty service
    const handleAddEmptyService = () => {
      const newService = {
        id: (services.length + 1).toString(),
        name: '',
        price: '-',
        duration: '-',
        durationType: 'mints',
        staff: [],
        uploaded: false,
        checked: false,
      };
      const updatedServices = [...services, newService];
      setServices(updatedServices);
      onServicesChange(updatedServices); 
    };
  
    // Render staff names as a string
    const renderStaffNames = (staff) => {
      const maxStaffLength = 15;
      const staffString = staff.join(', ');
      if (staff.length === 0) {
        return "Assign Staff";
      }
      return staffString.length > maxStaffLength ? `${staffString.slice(0, maxStaffLength)}...` : staffString;
    };

  return (
    <Box>
        <Box 
          sx={{ 
            maxHeight: '400px', 
            overflowY: 'auto', 
            mb: 2, 
            p:2,
            scrollbarWidth: 'none',  
            '&::-webkit-scrollbar': { display: 'none' } ,
          }}>
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
            <Checkbox
                checked={service.checked}
                onChange={(e) => setServices(services.map((s, i) => i === index ? { ...s, checked: e.target.checked } : s))}
                disableRipple
                sx={{ mr: 1 , transform: 'scale(1.3)'}}
            />
            <TextField
                value={service.name}
                onChange={(e) => setServices(services.map((s, i) => i === index ? { ...s, name: e.target.value } : s))}
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
                onChange={(e) => setServices(services.map((s, i) => i === index ? { ...s, price: e.target.value } : s))}
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
                    fontWeight:"bold",
                    padding: '0 0px',
                    },
                }}
                
                InputProps={{
                startAdornment: <InputAdornment position="start" sx={{mr:0.2}}>₹</InputAdornment>,
                }}
            />

            <TextField
                value={service.duration}
                onChange={(e) => setServices(services.map((s, i) => i === index ? { ...s, duration: e.target.value } : s))}
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
                    fontWeight:"bold",
                    padding: '0 0px',
                    },
                }}
            />

            <DurationSelect
                value={service.durationType}
                onChange={(e) => setServices(services.map((s, i) => i === index ? { ...s, durationType: e.target.value } : s))}
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
                <Chip label={renderStaffNames(service.staff)} size="small" 
                    sx={{ 
                        width:"110px",
                        px:"8px",
                        height:"33px",
                        border: "1px solid #d9d9d9", 
                        borderRadius: "6px",
                        fontWeight:"bold",
                        background: "transparent",
                        '&:hover': {   background: "#f2f2f2" },
                    }} 
                />
            </Box>

                {/* upload image */}
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
                    px:7,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    '&:hover': {   background: "#f2f2f2", color: "#000" },

                }}
                >
                {service.uploaded ? (
                    <>
                        Uploaded
                        <CheckCircleIcon sx={{ ml: 0.5,  fontSize: '15px' }} />
                    </>
                ) : (
                    'Upload'
                )}
                <input
                    type="file"
                    hidden
                    onChange={(e) => handleFileChange(e, index)}
                />
            </Button>
            </Box>
            ))}
        </Box>

        {/* Buttons to add duplicate or empty service */}
        <Box sx={{ display: 'flex', justifyContent: 'right', mt: 2, px:3 }}>
            <Button
            variant="contained"
            startIcon={<Copy />}
            onClick={handleDuplicateService}
            sx={{ textTransform: 'none', width: '15%', background: "#f2f2f2", color:"#000", mr:3 }}
            >
            <b>Copy</b>
            </Button>
            <Button
            variant="contained"
            startIcon={<PlusCircle />}
            onClick={handleAddEmptyService}
            sx={{ textTransform: 'none', width: '15%',background: "#f2f2f2", color:"#000", }}
            >
            <b>Add</b>
            </Button>
        </Box>

        {/* Dialog for Assigning Staff */}
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
            <DialogContent sx={{py:0}}>
            {/* <FormControl sx={{ m: 1, width: 300}}>
                <InputLabel>Staff</InputLabel>
                <Select
                multiple
                value={selectedStaff}
                onChange={handleStaffSelection}
                input={<OutlinedInput label="Staff" />}
                renderValue={(selected) => selected.join(', ')}
                >
                {staffList.map((staff) => (
                    <MenuItem key={staff} value={staff}>
                    <MuiCheckbox checked={selectedStaff.indexOf(staff) > -1} />
                    <ListItemText primary={staff} />
                    </MenuItem>
                ))}
                </Select>
            </FormControl> */}
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
                        <MuiCheckbox checked={selectedStaff.indexOf(member.name) > -1} />
                        <ListItemText primary={member.name} />
                      </MenuItem>
                    ) : null
                  ))
                ) : (
                  <MenuItem disabled value="">
                    <ListItemText primary="ANY" />
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            </DialogContent>
            <DialogActions
                sx={{mr:2, mb:1}}
            >
            <Button onClick={() => setOpenStaffDialog(false)}><b>Cancel</b></Button>
            <Button onClick={handleSaveStaff}><b>Save</b></Button>
            </DialogActions>
        </Dialog>
    </Box>
  );
};

export default ServiceFormBox;

// SearchUI.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Tabs,
  Tab,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  MenuItem,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Popper,
  Paper,
  IconButton,
  Select,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router";
import { fetchFilteredBusinesses } from '../../Services/overview/api/filterBusinesses.api';
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { format } from 'date-fns';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const generateCalendar = (year, month) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const days = [];

  const startDay = (startDate.getDay() + 6) % 7;
  for (let i = 0; i < startDay; i++) days.push(null);

  for (let d = 1; d <= endDate.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
};

const CustomDatePicker = ({ anchorEl, open, onClose, onSelectDate }) => {
  const today = new Date();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentDate, setCurrentDate] = useState(today);
  const [selected, setSelected] = useState(null);
  const [selectedQuick, setSelectedQuick] = useState('24 Hours');
  const [selectedSlot, setSelectedSlot] = useState('24 Hours');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const slots = ['24 Hours', 'morning', 'afternoon', 'evening'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = generateCalendar(year, month);

  const isToday = (date) =>
    format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

  const isPastDate = (date) =>
    date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const isSelected = (date) =>
    selected && format(date, 'yyyy-MM-dd') === format(selected, 'yyyy-MM-dd');

  const allTimes = [
    '12:00 am', '1:00 am', '2:00 am', '3:00 am', '4:00 am', '5:00 am', '6:00 am',
    '7:00 am', '8:00 am', '9:00 am', '10:00 am', '11:00 am', '12:00 pm',
    '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm', '6:00 pm',
    '7:00 pm', '8:00 pm', '9:00 pm', '10:00 pm', '11:00 pm',
  ];

  const convertTo24Hour = (timeStr) => {
    const [time, meridian] = timeStr.split(' ');
    let [hour] = time.split(':').map(Number);
    if (meridian === 'pm' && hour !== 12) hour += 12;
    if (meridian === 'am' && hour === 12) hour = 0;
    return hour;
  };

  useEffect(() => {
    switch (selectedSlot) {
      case 'morning':
        setAvailableTimes(allTimes.filter(time => {
          const hour = convertTo24Hour(time);
          return hour >= 6 && hour <= 12;
        }));
        setStartTime('6:00 am');
        setEndTime('12:00 pm');
        break;
      case 'afternoon':
        setAvailableTimes(allTimes.filter(time => {
          const hour = convertTo24Hour(time);
          return hour >= 12 && hour <= 17;
        }));
        setStartTime('12:00 pm');
        setEndTime('5:00 pm');
        break;
      case 'evening':
        setAvailableTimes(allTimes.filter(time => {
          const hour = convertTo24Hour(time);
          return hour >= 17 || hour <= 6;
        }));
        setStartTime('5:00 pm');
        setEndTime('12:00 am');
        break;
      default:
        setAvailableTimes(allTimes);
        setStartTime('');
        setEndTime('');
    }
  }, [selectedSlot]);

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      disablePortal={false}
      placement={isMobile ? "bottom" : "bottom-start"}
      style={{ zIndex: 10000 }}
      modifiers={[
        {
          name: 'preventOverflow',
          options: {
            boundary: 'viewport',
            padding: { xs: 4, sm: 8 },
          },
        },
        {
          name: 'flip',
          options: {
            fallbackPlacements: isMobile ? ['top', 'bottom'] : ['top-start', 'bottom-end', 'top-end'],
          },
        },
        {
          name: 'offset',
          options: {
            offset: isMobile ? [0, 4] : [0, 8],
          },
        },
      ]}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 1, sm: 2 },
          borderRadius: 2,
          width: { xs: '95vw', sm: 400 },
          maxWidth: { xs: '320px', sm: '400px' },
          minWidth: { xs: '280px', sm: '350px' },
          maxHeight: { xs: '80vh', sm: 'auto' },
          overflowY: 'auto',
          position: 'relative',
          margin: { xs: '0 auto', sm: 'initial' },
          left: { xs: '50%', sm: 'initial' },
          transform: { xs: 'translateX(-50%)', sm: 'none' },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Box display="flex" gap={0.5} mb={2} flexWrap="wrap" justifyContent="center">
          {[
            {
              label: 'Any date', key: '24 Hours', action: () => {
                setSelected(null);
                setSelectedQuick('24 Hours');
              }
            },
            {
              label: 'Today', key: 'today', action: () => {
                setSelected(today);
                setSelectedQuick('today');
              }
            },
            {
              label: 'Tomorrow', key: 'tomorrow', action: () => {
                const tmr = new Date();
                tmr.setDate(today.getDate() + 1);
                setSelected(tmr);
                setSelectedQuick('tomorrow');
              }
            }
          ].map(({ label, key, action }) => (
            <Button
              key={key}
              size="small"
              onClick={action}
              sx={{
                fontSize: { xs: '10px', sm: '12px' },
                fontWeight: 600,
                p: { xs: "0 6px", sm: "0 10px" },
                borderRadius: '20px',
                backgroundColor: selectedQuick === key ? '#1b4d69' : '#f0f0f0',
                color: selectedQuick === key ? '#fff' : '#1b4e6c',
                border: selectedQuick === key ? 'none' : '1px solid #ccc',
                textTransform: 'none',
                minWidth: 'fit-content',
                '&:hover': {
                  backgroundColor: selectedQuick === key ? '#1b4d69' : '#e0e0e0',
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <IconButton
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            size="small"
            sx={{ p: { xs: 0.5, sm: 1 } }}
          >
            <ChevronLeftIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
          <Typography
            fontWeight="bold"
            fontSize={{ xs: '14px', sm: '16px' }}
            textAlign="center"
          >
            {format(currentDate, 'MMMM yyyy')}
          </Typography>
          <IconButton
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            size="small"
            sx={{ p: { xs: 0.5, sm: 1 } }}
          >
            <ChevronRightIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Box>

        <Grid container spacing={{ xs: 0.3, sm: 0.5 }}>
          {weekDays.map((day) => (
            <Grid item xs={1.7} key={day}>
              <Typography align="center" fontSize={{ xs: 9, sm: 12 }} color="grey">{day}</Typography>
            </Grid>
          ))}
          {days.map((day, idx) => (
            <Grid item xs={1.7} key={idx}>
              {day ? (
                <Button
                  onClick={() => {
                    if (!isPastDate(day)) {
                      setSelected(day);
                      setSelectedQuick('');
                    }
                  }}
                  fullWidth
                  disabled={isPastDate(day)}
                  sx={{
                    width: { xs: 24, sm: 36 },
                    height: { xs: 24, sm: 36 },
                    minWidth: 0,
                    p: 0,
                    borderRadius: '50%',
                    bgcolor: isSelected(day) ? '#1b4d69' : 'transparent',
                    color: isPastDate(day) ? '#ccc' : (isSelected(day) ? 'white' : 'black'),
                    border: isToday(day) ? '2px solid #1b4d69' : 'none',
                    cursor: isPastDate(day) ? 'not-allowed' : 'pointer',
                    fontSize: { xs: '10px', sm: '14px' },
                    '&:hover': {
                      bgcolor: isPastDate(day) ? 'transparent' : (isSelected(day) ? '#1b4d69' : '#eee'),
                    },
                    '&:disabled': {
                      bgcolor: 'transparent',
                      color: '#ccc',
                    },
                  }}
                >
                  {day.getDate()}
                </Button>
              ) : (
                <Box height={{ xs: 24, sm: 36 }} />
              )}
            </Grid>
          ))}
        </Grid>

        <Box sx={{ p: { xs: 1, sm: 2 }, fontFamily: 'Arial' }}>
          <Box sx={{ mb: 1.5, display: 'flex', flexWrap: 'wrap', gap: { xs: 0.3, sm: 0.5 }, justifyContent: 'center' }}>
            {slots.map(slot => (
              <Button
                key={slot}
                variant="outlined"
                onClick={() => setSelectedSlot(slot)}
                sx={{
                  fontSize: { xs: '9px', sm: '13px' },
                  fontWeight: 600,
                  p: { xs: "0 4px", sm: "0 10px" },
                  textTransform: 'capitalize',
                  borderRadius: '20px',
                  backgroundColor: selectedSlot === slot ? '#1b4d69' : '#f0f0f0',
                  color: selectedSlot === slot ? '#fff' : '#1b4e6c',
                  border: selectedSlot === slot ? 'none' : '1px solid #ccc',
                  minWidth: 'fit-content',
                  height: { xs: 24, sm: 'auto' },
                  '&:hover': {
                    backgroundColor: selectedSlot === slot ? '#1b4d69' : '#e0e0e0',
                  }
                }}
              >
                {slot.charAt(0).toUpperCase() + slot.slice(1)}
              </Button>
            ))}
          </Box>

          {selectedSlot !== '24 Hours' && (
            <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' }, mb: 1 }}>
              <Select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                displayEmpty
                fullWidth
                size="small"
                sx={{
                  px: { xs: 0.5, sm: 1 },
                  py: 0.5,
                  fontSize: { xs: '11px', sm: '14px' },
                  height: { xs: 28, sm: 36 },
                }}
              >
                <MenuItem value="" disabled>Start Time</MenuItem>
                {availableTimes.map(time => (
                  <MenuItem key={time} value={time} sx={{ fontSize: { xs: '11px', sm: '14px' } }}>{time}</MenuItem>
                ))}
              </Select>

              <Select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                displayEmpty
                fullWidth
                size="small"
                sx={{
                  px: { xs: 0.5, sm: 1 },
                  py: 0.5,
                  fontSize: { xs: '11px', sm: '14px' },
                  height: { xs: 28, sm: 36 },
                }}
              >
                <MenuItem value="" disabled>End Time</MenuItem>
                {availableTimes.map(time => (
                  <MenuItem key={time} value={time} sx={{ fontSize: { xs: '11px', sm: '14px' } }}>{time}</MenuItem>
                ))}
              </Select>
            </Box>
          )}

          <Box mt={{ xs: 1, sm: 2 }} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                const selectedData = {
                  date: selected,
                  slot: selectedSlot,
                  startTime: selectedSlot !== '24 Hours' ? startTime : null,
                  endTime: selectedSlot !== '24 Hours' ? endTime : null
                };
                onSelectDate(selectedData);
                onClose();
              }}
              sx={{
                backgroundColor: '#1B4E6C',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: '20px',
                px: { xs: 2, sm: 3 },
                py: { xs: 0.5, sm: 1 },
                fontSize: { xs: '11px', sm: '14px' },
                height: { xs: 28, sm: 'auto' },
                '&:hover': {
                  backgroundColor: '#154157',
                }
              }}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Paper>
    </Popper>
  );
};

export default function SearchUI() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));

  const [value, setValue] = useState(0);
  const [category, setCategory] = useState("beauty");
  const [serviceName, setServiceName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState('');
  const [time, setTime] = useState("");
  const [selectedDateData, setSelectedDateData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [locationAnchorEl, setLocationAnchorEl] = useState(null);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serviceAnchorEl, setServiceAnchorEl] = useState(null);
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const locationSuggestions = [
    "Mohali, Punjab",
    "Gurugram, Haryana",
    "Chandigarh",
    "Delhi, NCR",
    "Mumbai, Maharashtra",
    "Bangalore, Karnataka"
  ];

  const serviceSuggestions = [
    "Haircut",
    "Facial",
    "Massage",
    "Manicure",
    "Pedicure",
    "Yoga Class",
    "Gym Membership",
    "Spa Treatment",
    "Hair Color",
    "Makeup"
  ];

  const timeOptions = [
    { value: 'morning', label: 'Morning (6 AM - 12 PM)' },
    { value: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
    { value: 'evening', label: 'Evening (5 PM - 12 AM)' },
    { value: 'anytime', label: 'Anytime' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (serviceAnchorEl && !serviceAnchorEl.contains(event.target)) {
        setShowServiceSuggestions(false);
        setServiceAnchorEl(null);
      }
      if (locationAnchorEl && !locationAnchorEl.contains(event.target)) {
        setShowLocationSuggestions(false);
        setLocationAnchorEl(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [serviceAnchorEl, locationAnchorEl]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const categories = ["beauty", "fitness", "wellness", "health"];
    setCategory(categories[newValue]);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setServiceName(value);
    if (value.trim()) {
      setShowServiceSuggestions(true);
    } else {
      setShowServiceSuggestions(false);
    }
  };

  const handleServiceFocus = (event) => {
    setServiceAnchorEl(event.currentTarget);
    if (serviceName.trim()) {
      setShowServiceSuggestions(true);
    }
  };

  const handleServiceBlur = () => {
    setTimeout(() => {
      setShowServiceSuggestions(false);
    }, 150);
  };

  const handleServiceSelect = (selectedService) => {
    setServiceName(selectedService);
    setShowServiceSuggestions(false);
    setServiceAnchorEl(null);
  };

  const handleLocationChange = (event) => {
    const value = event.target.value;
    setLocation(value);
    if (value.trim()) {
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationFocus = (event) => {
    setLocationAnchorEl(event.currentTarget);
    if (location.trim()) {
      setShowLocationSuggestions(true);
    }
  };

  const handleLocationBlur = () => {
    setTimeout(() => {
      setShowLocationSuggestions(false);
    }, 150);
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setShowLocationSuggestions(false);
    setLocationAnchorEl(null);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const handleDateClick = (e) => {
    const newAnchorEl = anchorEl ? null : e.currentTarget;
    setAnchorEl(newAnchorEl);

    if (newAnchorEl) {
      const element = e.currentTarget;
      setTimeout(() => {
        if (element && isSmallScreen) {
          const rect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const calendarHeight = 450;
          const spaceBelow = viewportHeight - rect.bottom;

          if (spaceBelow < calendarHeight) {
            const scrollAmount = Math.max(0, calendarHeight - spaceBelow + 50);
            window.scrollBy({
              top: scrollAmount,
              behavior: 'smooth'
            });
          }
        }
      }, 100);
    }
  };

  const handleDateSelect = (dateData) => {
    setAnchorEl(null);
    setSelectedDateData(dateData);
    if (dateData?.date) {
      setDate(format(dateData.date, 'yyyy-MM-dd'));
    } else {
      setDate('');
    }
    if (dateData?.slot && dateData.slot !== '24 Hours') {
      setTime(dateData.slot);
    } else {
      setTime('');
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user's location if not provided
      let latitude = null;
      let longitude = null;

      if (!location.trim()) {
        // Try to get user's current location
        if (navigator.geolocation) {
          try {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            
            // Store in localStorage for future use
            localStorage.setItem('latitude', latitude);
            localStorage.setItem('longitude', longitude);
          } catch (geoError) {
            console.warn('Geolocation failed:', geoError);
          }
        }
      }

      const filterParams = {
        serviceName: serviceName.trim(),
        location: location.trim(),
        businessType: category,
        date: date || undefined,
        time: time || undefined,
        timeSlot: selectedDateData?.slot,
        startTime: selectedDateData?.startTime,
        endTime: selectedDateData?.endTime,
        latitude,
        longitude
      };

      const businesses = await fetchFilteredBusinesses(filterParams);

      navigate('/overview', {
        state: {
          data: businesses,
          search: {
            category,
            serviceName,
            location,
            date,
            time,
            selectedDateData,
            resultsCount: businesses.length
          },
        },
      });
    } catch (error) {
      console.error('Search filter API failed:', error);
      setError(error.message || "Failed to fetch results. Please try again.");
      setOpenSnackbar(true);
      
      // Navigate with empty results but preserve search params
      navigate('/overview', {
        state: {
          data: [],
          search: {
            category,
            serviceName,
            location,
            date,
            time,
            selectedDateData,
            error: error.message
          },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError(null);
  };

  const renderSuggestionDropdown = (anchorEl, show, suggestions, inputValue, onSelect, fieldName) => {
    const filteredSuggestions = suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
      <Popper
        open={show && inputValue.trim() && anchorEl && filteredSuggestions.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 10001 }}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 4],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              boundary: 'viewport',
            },
          },
        ]}
      >
        <Paper
          elevation={3}
          sx={{
            maxHeight: 200,
            overflow: 'auto',
            minWidth: anchorEl?.offsetWidth || 200,
            border: '1px solid #e0e0e0'
          }}
        >
          <List dense>
            {filteredSuggestions.map((suggestion, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelect(suggestion);
                  }}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <ListItemText
                    primary={suggestion}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '14px'
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Popper>
    );
  };

  // Mobile view
  if (isSmallScreen) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          margin: "auto",
          p: 2,
        }}
      >
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          {["beauty", "fitness", "wellness", "health"].map((cat, idx) => (
            <Button
              key={idx}
              variant={value === idx ? "contained" : "outlined"}
              onClick={() => {
                setValue(idx);
                setCategory(cat);
              }}
              sx={{
                borderRadius: "2rem",
                px: 2,
                py: 0.5,
                textTransform: "none",
                backgroundColor: value === idx ? "#1b4d69" : "white",
                color: value === idx ? "white" : "#1b4d69",
                border: "1px solid #e0e0e0",
                "&:hover": {
                  backgroundColor: value === idx ? "#1b4d69" : "rgba(27, 77, 105, 0.1)",
                },
              }}
            >
              {cat}
            </Button>
          ))}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 0.5, color: "text.secondary" }}>
                What are you looking for?
              </Typography>
              <TextField
                placeholder="Name of Services"
                variant="outlined"
                fullWidth
                value={serviceName}
                onChange={handleSearchChange}
                onFocus={handleServiceFocus}
                onBlur={handleServiceBlur}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white",
                    "& fieldset": {
                      borderColor: "#ccc",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1b4d69",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1b4d69 !important",
                    },
                  },
                }}
                size="small"
              />
              {renderSuggestionDropdown(
                serviceAnchorEl,
                showServiceSuggestions,
                serviceSuggestions,
                serviceName,
                handleServiceSelect,
                'service'
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 0.5, color: "text.secondary" }}>
                Where?
              </Typography>
              <TextField
                placeholder="City, Country"
                variant="outlined"
                fullWidth
                value={location}
                onChange={handleLocationChange}
                onFocus={handleLocationFocus}
                onBlur={handleLocationBlur}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white",
                    "& fieldset": {
                      borderColor: "#ccc",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1b4d69",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1b4d69 !important",
                    },
                  },
                }}
                size="small"
              />
              {renderSuggestionDropdown(
                locationAnchorEl,
                showLocationSuggestions,
                locationSuggestions,
                location,
                handleLocationSelect,
                'location'
              )}
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ mb: 0.5, color: "text.secondary" }}>
                Date
              </Typography>
              <TextField
                placeholder="Select Date"
                variant="outlined"
                fullWidth
                value={selectedDateData ?
                  (selectedDateData.date ?
                    format(selectedDateData.date, 'dd MMM yyyy')
                    : 'Anytime'
                  ) : ''
                }
                onClick={handleDateClick}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white",
                    "& fieldset": {
                      borderColor: "#ccc",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1b4d69",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1b4d69 !important",
                    },
                  },
                }}
                size="small"
                InputProps={{
                  readOnly: true,
                  style: { cursor: 'pointer' }
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" sx={{ mb: 0.5, color: "text.secondary" }}>
                Time
              </Typography>
              <TextField
                select
                variant="outlined"
                fullWidth
                value={selectedDateData?.slot || time}
                onChange={handleTimeChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white",
                    "& fieldset": {
                      borderColor: "#ccc",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1b4d69",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1b4d69 !important",
                    },
                  },
                }}
                size="small"
              >
                {timeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              borderRadius: "8px",
              backgroundColor: "black",
              color: "white",
              py: 1.5,
              "&:hover": {
                backgroundColor: "#1b4d69",
              },
            }}
            onClick={handleSearch}
            disabled={loading}
            startIcon={!loading && <SearchIcon />}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "SEARCH"}
          </Button>
        </Box>

        {Boolean(anchorEl) && isSmallScreen && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 9999,
            }}
            onClick={() => setAnchorEl(null)}
          />
        )}

        <CustomDatePicker
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          onSelectDate={handleDateSelect}
        />
      </Box>
    );
  }

  // Desktop view
  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          width: isExtraLargeScreen ? "60%" : "80%",
          maxWidth: 800,
          margin: "auto",
          position: "absolute",
          zIndex: 11,
          padding: 2,
        }}
      >
        <AppBar
          position="static"
          sx={{
            borderRadius: "20px 22px 0 0",
            overflow: "hidden",
            background: "transparent",
            width: "25rem",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            sx={{
              position: "relative",
              "& .MuiTab-root": {
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "16px 0 0 0",
                backgroundColor: "#1b4d69",
                color: "white",
                position: "relative",
                border: "2px solid #eaeef2",
                zIndex: 1,
                "&.Mui-selected": {
                  backgroundColor: "white",
                  color: "#1b4d69",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                },
                "&:not(.Mui-selected)": {
                  "&:hover": {
                    backgroundColor: "white",
                    color: "#1b4d69",
                  },
                },
                "&:not(:last-child)": {
                  marginRight: "-10px",
                },
              },
            }}
          >
            <Tab label="Beauty" />
            <Tab label="Fitness" />
            <Tab label="Wellness" />
            <Tab label="Health" />
          </Tabs>
        </AppBar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "white",
            p: 2,
            borderRadius: "0 16px 16px 16px",
            boxShadow: 3,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, mr: 2 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              What are you looking?
            </Typography>
            <TextField
              placeholder={`Name of Services (${category.toLowerCase()}...)`}
              variant="standard"
              fullWidth
              value={serviceName}
              onChange={handleSearchChange}
              onFocus={handleServiceFocus}
              onBlur={handleServiceBlur}
              InputProps={{
                disableUnderline: true,
              }}
            />
            {renderSuggestionDropdown(
              serviceAnchorEl,
              showServiceSuggestions,
              serviceSuggestions,
              serviceName,
              handleServiceSelect,
              'service'
            )}
          </Box>

          <Divider orientation="vertical" flexItem sx={{ mr: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, mr: 2 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Where?
            </Typography>
            <TextField
              placeholder="City, Country"
              variant="standard"
              fullWidth
              value={location}
              onChange={handleLocationChange}
              onFocus={handleLocationFocus}
              onBlur={handleLocationBlur}
              InputProps={{
                disableUnderline: true,
              }}
            />
            {renderSuggestionDropdown(
              locationAnchorEl,
              showLocationSuggestions,
              locationSuggestions,
              location,
              handleLocationSelect,
              'location'
            )}
          </Box>

          <Divider orientation="vertical" flexItem sx={{ mr: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, mr: 2 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              When?
            </Typography>
            <TextField
              placeholder="Anytime"
              variant="standard"
              fullWidth
              value={selectedDateData ?
                (selectedDateData.date ?
                  `${format(selectedDateData.date, 'dd MMM yyyy')}${selectedDateData.slot !== '24 Hours' ? ` - ${selectedDateData.slot}` : ''}`
                  : 'Anytime'
                ) : 'Anytime'
              }
              onClick={handleDateClick}
              InputProps={{
                disableUnderline: true,
                readOnly: true,
                style: { cursor: 'pointer' }
              }}
            />
          </Box>

          <Button
            variant="contained"
            sx={{
              minWidth: 100,
              borderRadius: "10px",
              backgroundColor: "black",
              py: 1,
              "&:hover": {
                backgroundColor: "#1b4d69",
              },
            }}
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "SEARCH"}
          </Button>
        </Box>

        <CustomDatePicker
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          onSelectDate={handleDateSelect}
        />
      </Box>
    </>
  );
}
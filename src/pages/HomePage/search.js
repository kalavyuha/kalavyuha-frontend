import React, { useState } from 'react';
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
  MenuItem ,
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
} from "@mui/material"
import { useNavigate } from "react-router"
import { apiget } from "../service/api"
import SearchIcon from "@mui/icons-material/Search"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
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

    React.useEffect(() => {
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
        <Popper open={open} anchorEl={anchorEl} disablePortal={true} placement="bottom-start" style={{ zIndex: 1300 }}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2, width: 400 }}>
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    size="small"
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
                <Box display="flex" gap={1} mb={2}>
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
                                fontSize: '12px',
                                fontWeight: 600,
                                p: "0 10px",
                                borderRadius: '20px',
                                backgroundColor: selectedQuick === key ? '#1B4E6C' : '#f0f0f0',
                                color: selectedQuick === key ? '#fff' : '#1B4E6C',
                                border: selectedQuick === key ? 'none' : '1px solid #ccc',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: selectedQuick === key ? '#154157' : '#e0e0e0',
                                },
                            }}
                        >
                            {label}
                        </Button>
                    ))}
                </Box>

                {/* Month Navigation */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <IconButton onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <Typography fontWeight="bold">{format(currentDate, 'MMMM yyyy')}</Typography>
                    <IconButton onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
                        <ChevronRightIcon />
                    </IconButton>
                </Box>

                {/* Calendar Grid */}
                <Grid container spacing={1}>
                    {weekDays.map((day) => (
                        <Grid item xs={1.7} key={day}>
                            <Typography align="center" fontSize={12} color="grey">{day}</Typography>
                        </Grid>
                    ))}
                    {days.map((day, idx) => (
                        <Grid item xs={1.7} key={idx}>
                            {day ? (
                                <Button
                                    onClick={() => {
                                        setSelected(day);
                                        setSelectedQuick('');
                                    }}
                                    fullWidth
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        minWidth: 0,
                                        p: 0,
                                        borderRadius: '50%',
                                        bgcolor: isSelected(day) ? '#1B4E6C' : 'transparent',
                                        color: isSelected(day) ? 'white' : 'black',
                                        border: isToday(day) ? '2px solid #1B4E6C' : 'none',
                                        '&:hover': {
                                            bgcolor: isSelected(day) ? '#1B4E6C' : '#eee',
                                        },
                                    }}
                                >
                                    {day.getDate()}
                                </Button>
                            ) : (
                                <Box height={36} />
                            )}
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ p: 2, fontFamily: 'Arial' }}>
                    <Box sx={{ mb: 2 }}>
                        {slots.map(slot => (
                            <Button
                                key={slot}
                                variant="outlined"
                                onClick={() => setSelectedSlot(slot)}
                                sx={{
                                    mr: '4px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    p: "0 10px",
                                    textTransform: 'capitalize',
                                    borderRadius: '20px',
                                    backgroundColor: selectedSlot === slot ? '#1B4E6C' : '#f0f0f0',
                                    color: selectedSlot === slot ? '#fff' : '#1B4E6C',
                                    border: selectedSlot === slot ? 'none' : '1px solid #ccc',
                                    '&:hover': {
                                        backgroundColor: selectedSlot === slot ? '#154157' : '#e0e0e0',
                                    }
                                }}
                            >
                                {slot.charAt(0).toUpperCase() + slot.slice(1)}
                            </Button>
                        ))}
                    </Box>

                    {/* Time Selection - Only show when not 24 Hours */}
                    {selectedSlot !== '24 Hours' && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Select
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                displayEmpty
                                fullWidth
                                size="small"
                                sx={{
                                    px: 1,
                                    py: 0.5,
                                    fontSize: '14px',
                                    height: 36,
                                }}
                            >
                                <MenuItem value="" disabled>Select Start Time</MenuItem>
                                {availableTimes.map(time => (
                                    <MenuItem key={time} value={time}>{time}</MenuItem>
                                ))}
                            </Select>

                            <Select
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                displayEmpty
                                fullWidth
                                size="small"
                                sx={{
                                    px: 1,
                                    py: 0.5,
                                    fontSize: '14px',
                                    height: 36,
                                }}
                            >
                                <MenuItem value="" >Select End Time</MenuItem>
                                {availableTimes.map(time => (
                                    <MenuItem key={time} value={time}>{time}</MenuItem>
                                ))}
                            </Select>
                        </Box>
                    )}

                    {/* Done Button */}
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                                // Pass the selected date and time when done is clicked
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
                                px: 3,
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
  const navigate = useNavigate()

  const [value, setValue] = useState(0)
  const [category, setCategory] = useState("Beauty")
  const [serviceName, setServiceName] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = React.useState('');
  const [time, setTime] = useState("")
  const [selectedDateData, setSelectedDateData] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [locationAnchorEl, setLocationAnchorEl] = useState(null)
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [serviceAnchorEl, setServiceAnchorEl] = useState(null)
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false)

  // Location suggestions
  const locationSuggestions = [
    "Mohali, Punjab",
    "Gurugram, Haryana"
  ]

  // Service suggestions
  const serviceSuggestions = [
    "Haircut",
    "Facial"
  ]

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"))
  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up("xl"))

  const timeOptions = [
    { value: 'morning', label: 'Morning' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'evening', label: 'Evening' },
    { value: 'anytime', label: 'Anytime' }
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue)
    setCategory(["Beauty", "Fitness", "Wellness"][newValue])
  }

  const handleSearchChange = (event) => {
    setServiceName(event.target.value)
    setShowServiceSuggestions(true)
  }

  const handleServiceFocus = (event) => {
    setServiceAnchorEl(event.currentTarget)
    setShowServiceSuggestions(true)
  }

  const handleServiceBlur = () => {
    // Delay hiding to allow for clicks on suggestions
    setTimeout(() => {
      setShowServiceSuggestions(false)
      setServiceAnchorEl(null)
    }, 200)
  }

  const handleServiceSelect = (selectedService) => {
    setServiceName(selectedService)
    setShowServiceSuggestions(false)
    setServiceAnchorEl(null)
  }

  const handleLocationChange = (event) => {
    setLocation(event.target.value)
    setShowLocationSuggestions(true)
  }

  const handleLocationFocus = (event) => {
    setLocationAnchorEl(event.currentTarget)
    setShowLocationSuggestions(true)
  }

  const handleLocationBlur = () => {
    // Delay hiding to allow for clicks on suggestions
    setTimeout(() => {
      setShowLocationSuggestions(false)
      setLocationAnchorEl(null)
    }, 200)
  }

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation)
    setShowLocationSuggestions(false)
    setLocationAnchorEl(null)
  }

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value)
  }

  const handleDateClick = (e) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
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
    setLoading(true)

    const result = await apiget(
      `api/v1/BussinessDetails/filter?ServiceName=${serviceName}&Location=${location}&BussinessType=${category}`,
    )

    console.log(result)

    if (result && result.status === 200) {
      navigate("/overview", {
        state: {
          data: result?.data?.Data,
          search: {
            category: category,
            serviceName: serviceName,
            location: location,
            date: date,
            time: time,
            selectedDateData: selectedDateData,
          },
        },
      })
    }
    setLoading(false)
  }

  // Mobile view that matches the image
  if (isSmallScreen) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          margin: "auto",
        }}
      >
        {/* Category tabs - simplified for mobile */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mb: 3,
          }}
        >
          {["Beauty", "Fitness", "Wellness"].map((cat, idx) => (
            <Button
              key={idx}
              variant={value === idx ? "contained" : "outlined"}
              onClick={() => {
                setValue(idx)
                setCategory(cat)
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
                  backgroundColor: value === idx ? "#1b4d69" : "rgba(7, 132, 7, 0.1)",
                },
              }}
            >
              {cat}
            </Button>
          ))}
        </Box>

        {/* Search fields in mobile layout */}
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
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
              
              {/* Service Suggestions Dropdown for Mobile */}
              <Popper 
                open={showServiceSuggestions && Boolean(serviceAnchorEl)} 
                anchorEl={serviceAnchorEl} 
                placement="bottom-start"
                style={{ zIndex: 1300, width: serviceAnchorEl?.offsetWidth }}
              >
                <Paper elevation={3} sx={{ maxHeight: 200, overflow: 'auto' }}>
                  <List dense>
                    {serviceSuggestions
                      .filter(suggestion => 
                        suggestion.toLowerCase().includes(serviceName.toLowerCase())
                      )
                      .map((suggestion, index) => (
                        <ListItem key={index} disablePadding>
                          <ListItemButton 
                            onClick={() => handleServiceSelect(suggestion)}
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
                      ))
                    }
                  </List>
                </Paper>
              </Popper>
            </Grid>

            <Grid item xs={12} sm={6}>
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
              
              {/* Location Suggestions Dropdown for Mobile */}
              <Popper 
                open={showLocationSuggestions && Boolean(locationAnchorEl)} 
                anchorEl={locationAnchorEl} 
                placement="bottom-start"
                style={{ zIndex: 1300, width: locationAnchorEl?.offsetWidth }}
              >
                <Paper elevation={3} sx={{ maxHeight: 200, overflow: 'auto' }}>
                  <List dense>
                    {locationSuggestions
                      .filter(suggestion => 
                        suggestion.toLowerCase().includes(location.toLowerCase())
                      )
                      .map((suggestion, index) => (
                        <ListItem key={index} disablePadding>
                          <ListItemButton 
                            onClick={() => handleLocationSelect(suggestion)}
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
                      ))
                    }
                  </List>
                </Paper>
              </Popper>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6} sm={6}>
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
                InputLabelProps={{
                  shrink: true,
                }}
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
            
            <Grid item xs={6} sm={6}>
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
                backgroundColor: "#008F6E",
              },
            }}
            onClick={handleSearch}
            disabled={loading}
            startIcon={<SearchIcon />}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "SEARCH"}
          </Button>
        </Box>

        {/* Custom Date Picker for Mobile */}
        <CustomDatePicker
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          onSelectDate={handleDateSelect}
        />
      </Box>
    )
  }

  // Desktop view - keep original layout
  return (
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
          width: "20rem",
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
          <Tab label="Beauty" onClick={() => setCategory("Beauty")} />
          <Tab label="Fitness" onClick={() => setCategory("Fitness")} />
          <Tab label="Wellness" onClick={() => setCategory("Wellness")} />
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
            placeholder={`Name of Services (${["beauty", "fitness", "wellness"][value]}...)`}
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
          
          {/* Service Suggestions Dropdown for Desktop */}
          <Popper 
            open={showServiceSuggestions && Boolean(serviceAnchorEl)} 
            anchorEl={serviceAnchorEl} 
            placement="bottom-start"
            style={{ zIndex: 1300, width: serviceAnchorEl?.offsetWidth }}
          >
            <Paper elevation={3} sx={{ maxHeight: 200, overflow: 'auto' }}>
              <List dense>
                {serviceSuggestions
                  .filter(suggestion => 
                    suggestion.toLowerCase().includes(serviceName.toLowerCase())
                  )
                  .map((suggestion, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton 
                        onClick={() => handleServiceSelect(suggestion)}
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
                  ))
                }
              </List>
            </Paper>
          </Popper>
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
          
          {/* Location Suggestions Dropdown for Desktop */}
          <Popper 
            open={showLocationSuggestions && Boolean(locationAnchorEl)} 
            anchorEl={locationAnchorEl} 
            placement="bottom-start"
            style={{ zIndex: 1300, width: locationAnchorEl?.offsetWidth }}
          >
            <Paper elevation={3} sx={{ maxHeight: 200, overflow: 'auto' }}>
              <List dense>
                {locationSuggestions
                  .filter(suggestion => 
                    suggestion.toLowerCase().includes(location.toLowerCase())
                  )
                  .map((suggestion, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton 
                        onClick={() => handleLocationSelect(suggestion)}
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
                  ))
                }
              </List>
            </Paper>
          </Popper>
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
              backgroundColor: "grey.800",
            },
          }}
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Search"}
        </Button>
      </Box>
      
      {/* Custom Date Picker */}
      <CustomDatePicker
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        onSelectDate={handleDateSelect}
      />
    </Box>
  )
}


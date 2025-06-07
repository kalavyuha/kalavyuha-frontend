import React, { useEffect, useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    Box,
    Button,
    Grid,
    InputAdornment,
    Popper,
    Paper,
    Typography,
    TextField,
    IconButton,
    Select,
    MenuItem,
} from '@mui/material';
import { format } from 'date-fns';
import { Loader } from 'lucide-react';

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
                                // onSelectDate(null); // Removed this line to prevent closing
                                setSelected(null);
                                setSelectedQuick('24 Hours');
                            }
                        },
                        {
                            label: 'Today', key: 'today', action: () => {
                                // onSelectDate(today); // Removed this line to prevent closing
                                setSelected(today);
                                setSelectedQuick('today');
                            }
                        },
                        {
                            label: 'Tomorrow', key: 'tomorrow', action: () => {
                                const tmr = new Date();
                                tmr.setDate(today.getDate() + 1);
                                // onSelectDate(tmr); // Removed this line to prevent closing
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


const SearchField = ({ serviceName,location,setLocation,setServiceName, handleFetchData, loading }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    // Update service name state when prop changes
    useEffect(() => {
        setServiceName(serviceName || '');
    }, [serviceName]);

    const handleDateClick = (e) => {
        setAnchorEl(anchorEl ? null : e.currentTarget);
    };

    const handleDateSelect = (date) => {
        setAnchorEl(null);
        setSelectedDate(date ? format(date, 'dd-MMM-yyyy') : '');
    };

    
    const handleSearch = () => {
        handleFetchData({
            location: location,
            date: selectedDate,
            service: serviceName
        });
    };

    return (
        <Box>
            <Grid container spacing={2}>
                {[
                    {
                        placeholder: 'Where?',
                        defaultValue: 'Sector 19, IND..',
                        icon: <LocationOnIcon sx={{ color: 'white', fontSize: 18 }} />,
                        value: location,
                        onChange: (e) =>setLocation(e.target.value),
                        md: 3,
                    },
                    {
                        placeholder: 'Date/Time',
                        icon: <CalendarMonthIcon sx={{ color: 'white', fontSize: 18 }} />,
                        md: 3,
                        value: selectedDate,
                        onClick: handleDateClick,
                        isDateField: true,
                    },
                    {
                        placeholder: 'Services',
                        defaultValue: 'Haircut, Color, ..',
                        icon: <SearchIcon sx={{ color: 'white', fontSize: 18 }} />,
                        md: 4,
                        value: serviceName,
                        onChange: (e) => setServiceName(e.target.value),
                    },
                ].map((field, index) => (
                    <Grid item xs={12} md={field.md} key={index}>
                        <TextField
                            fullWidth
                            placeholder={field.placeholder}
                            value={field.value || ''}
                            onChange={field.onChange || undefined}
                            onClick={field.onClick || undefined}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box
                                            sx={{
                                                bgcolor: '#1B4E6C',
                                                borderRadius: '50%',
                                                width: 30,
                                                height: 30,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {field.icon}
                                        </Box>
                                    </InputAdornment>
                                ),
                                sx: {
                                    bgcolor: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderRadius: '15px',
                                    },
                                    height: 52,
                                    fontSize: '0.9rem',
                                    cursor: field.isDateField ? 'pointer' : 'text',
                                },
                            }}
                        />
                    </Grid>
                ))}

                <Grid item xs={12} md={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                            bgcolor: '#1B4E6C',
                            borderRadius: '15px',
                            textTransform: 'none',
                            height: 52,
                            fontSize: '16px',
                            fontWeight: 600,
                            '&:hover': {
                                bgcolor: '#163d55',
                            },
                        }}
                        disabled={loading}
                    >
                        {!loading ? "Update Results" : <Loader/>}
                    </Button>
                </Grid>
            </Grid>

            {/* Date Picker Component */}
            <CustomDatePicker
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                onSelectDate={handleDateSelect}
            />
        </Box>
    );
};

export default SearchField;

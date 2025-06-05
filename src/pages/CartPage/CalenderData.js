import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Typography, Paper, Box } from '@mui/material';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MonthSelect = ({ value, onChange }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      sx={{
        minHeight: '32px',
        width: '120px',
        '& fieldset': { border: '1px solid black' },
        '& .MuiSelect-select': {
          py: 0.5,
          px: 2,
        },
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            borderRadius: 2,
            maxHeight: 160,
            overflowY: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '& .MuiList-root': {
              paddingTop: 0,
              paddingBottom: 0,
            },
          },
        },
      }}
    >
      {months.map((monthName) => (
        <MenuItem
          key={monthName}
          value={monthName}
          sx={{
            bgcolor: '#fff',
            '&:hover': { bgcolor: '#eaeef2' },
            '&.Mui-selected': { bgcolor: '#1b4d69', color: '#fff' },
            '&.Mui-selected:hover': { bgcolor: '#1b4d69', color: '#fff' },
          }}
        >
          {monthName}
        </MenuItem>
      ))}
    </Select>
  );
};

const Calendar = () => {
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedDate, setSelectedDate] = useState(null);
  const [days, setDays] = useState([]);

  const generateCalendarDays = (monthName) => {
    const currentYear = new Date().getFullYear();
    const monthIndex = months.indexOf(monthName);
    
    // Get first day of the month
    const firstDay = new Date(currentYear, monthIndex, 1);
    
    // Get last day of the month
    const lastDay = new Date(currentYear, monthIndex + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    
    const calendarDays = [];
    
    // Add all days of the month
    for (let date = 1; date <= daysInMonth; date++) {
      const dayDate = new Date(currentYear, monthIndex, date);
      const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
      
      calendarDays.push({
        day: dayName.substring(0, 2), // First 2 letters like "Th", "Fr", "Sa"
        date: date
      });
    }
    
    return calendarDays;
  };

  useEffect(() => {
    const calendarDays = generateCalendarDays(selectedMonth);
    setDays(calendarDays);
    setSelectedDate(null); // Reset selected date when month changes
  }, [selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h6" fontSize={16} sx={{ mb: 2 }}>
        Choose date and time
      </Typography>
      
      <Paper elevation={0} sx={{ padding: "1.5rem 2rem", bgcolor: "#dce1e6", borderRadius: 3 }}>
        <Box sx={{ mb: 2 }}>
          <MonthSelect value={selectedMonth} onChange={handleMonthChange} />
        </Box>
        
        {/* Horizontal scrollable days - exactly like your original */}
        <Box sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}>
          {days.map(({ day, date }) => (
            <Box
              key={date}
              onClick={() => setSelectedDate(date)}
              sx={{
                minWidth: 40,
                height: 40,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '20%',
                bgcolor: selectedDate === date ? '#1b4d69' : 'transparent',
                color: selectedDate === date ? 'white' : 'inherit',
                cursor: 'pointer',
                mx: 0.5,
                '&:hover': {
                  bgcolor: selectedDate !== date ? '#eaeef2' : '#1b4d69'
                }
              }}
            >
              <Typography variant="caption">{day}</Typography>
              <Typography variant="body2">{date}</Typography>
            </Box>
          ))}
        </Box>

        {selectedDate && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 1 }}>
            <Typography variant="body2">
              Selected: {selectedMonth} {selectedDate}, {new Date().getFullYear()}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Calendar;
import React, { useState } from 'react';
import { Select, MenuItem } from '@mui/material';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MonthSelect = () => {
  const [month, setMonth] = useState('January');

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <Select
      value={month}
      onChange={handleChange}
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

export default MonthSelect;

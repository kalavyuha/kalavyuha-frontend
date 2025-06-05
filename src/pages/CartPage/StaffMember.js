import React, { useEffect, useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { UserRound } from 'lucide-react';
import { apiget } from '../service/api';


const ServiceStaffSelect = ({ selectedStaff,staffData}) => {
  const [selectedValue, setSelectedValue] = useState('any');

    const arr_list = [
      { _id: 'any', StaffName: 'Any Professional' },
      ...staffData
    ];


  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    selectedStaff(event.target.value);
  };

  return (
    <Select
      fullWidth
      value={selectedValue}
      onChange={handleChange}
      startAdornment={<UserRound sx={{ mr: 2 }} />}
      sx={{
        bgcolor: '#dce1e6',
        border: 'none',
        py: 0,
        borderRadius: 3,
        px: '1.9rem',
        '& fieldset': { border: 'none' },
        '& .MuiSelect-select': { pl: 2, pr: 3 },
        '& .MuiSelect-icon': { right: '2rem' },
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            borderRadius: 2,
            '& .MuiList-root': {
              paddingTop: 0,
              paddingBottom: 0,
            },
            '& .MuiMenu-list': {
              paddingTop: 0,
              paddingBottom: 0,
            },
          },
        },
      }}
    >
      {arr_list && arr_list.map((staff) => (
        <MenuItem
          key={staff._id}
          value={staff._id}
          sx={{
            bgcolor: '#fff',
            '&:hover': { bgcolor: '#eaeef2' },
            '&.Mui-selected': { bgcolor: '#1b4d69', color: '#fff' },
            '&.Mui-selected:hover': { bgcolor: '#1b4d69', color: '#fff' },
          }}
        >
          {staff.StaffName}
        </MenuItem>
      ))}
    </Select>
  );
};

export default ServiceStaffSelect;
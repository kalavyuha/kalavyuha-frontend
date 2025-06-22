import React from 'react';
import {
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
} from '@mui/material';

// Shared select styles
const commonSelectStyles = {
  width: '140px',
  height: '33px',
  px: '8px',
  borderRadius: '6px',
  fontSize: '0.875rem',
  '& .MuiSelect-select': {
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #d9d9d9',
  },
};

// StaffSelect component
export const StaffSelect = ({ value, onChange, teamMembers }) => (
  <Select
    multiple
    value={value || []}
    onChange={onChange}
    size="small"
    displayEmpty
    sx={{ ...commonSelectStyles, ml: 9.8 }} // Adjust ml as needed
    renderValue={(selected) =>
      selected.length ? selected.join(', ') : 'Select staff'
    }
    MenuProps={{
      PaperProps: {
        sx: {
          borderRadius: '6px',
        },
      },
    }}
  >
    <MenuItem disabled value="" sx={{py:0}}>
      Select staff
    </MenuItem>
    {teamMembers && teamMembers.length > 0 ? (
      teamMembers.map((member) =>
        member.name ? (
          <MenuItem key={member.name} value={member.name}>
            <Checkbox checked={value?.includes(member.name) || false} />
            <ListItemText primary={member.name} />
          </MenuItem>
        ) : null
      )
    ) : (
      <MenuItem disabled >
        <ListItemText primary="No staff available" />
      </MenuItem>
    )}
  </Select>
);

// DurationSelect component
export const DurationSelect = ({ value, onChange }) => (
  <Select
    value={value || ''}
    onChange={onChange}
    size="small"
    displayEmpty
    sx={commonSelectStyles}
    renderValue={(selected) => (selected ? selected : 'Select time')}
  >
    <MenuItem disabled value="">
      Select time
    </MenuItem>
    <MenuItem value="minutes">Minutes</MenuItem>
    <MenuItem value="hours">Hours</MenuItem>
    <MenuItem value="days">Days</MenuItem>
    <MenuItem value="months">Months</MenuItem>
  </Select>
);

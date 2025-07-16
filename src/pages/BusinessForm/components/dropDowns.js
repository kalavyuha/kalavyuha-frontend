import React from 'react';
import {
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
} from '@mui/material';

// Shared select styles
const commonSelectStyles = {
  width: { xs: '90px', sm: '120px', md: '140px' },
  height: { xs: '30px', sm: '33px' },
  px: { xs: '6px', sm: '8px' },
  borderRadius: '6px',
  fontSize: { xs: '0.75rem', sm: '0.875rem' },
  maxWidth: '100%',
  '& .MuiSelect-select': {
    padding: { xs: '2px 6px', sm: '4px 8px' },
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
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
    sx={{ 
      ...commonSelectStyles, 
      width: { xs: '100%', sm: '160px', md: '180px' },
      minWidth: { xs: '100%', sm: '140px', md: '160px' },
      maxWidth: { xs: '100%', sm: '180px', md: '200px' },
      height: { xs: '40px', sm: '45px', md: '50px' },
      '& .MuiSelect-select': {
        padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 16px' },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        wordWrap: 'break-word',
        wordBreak: 'break-word',
      },
    }}
    renderValue={(selected) =>
      selected.length ? (
        selected.length > 2 ? 
          `${selected.slice(0, 2).join(', ')}...` : 
          selected.join(', ')
      ) : 'Select staff'
    }
    MenuProps={{
      PaperProps: {
        sx: {
          borderRadius: '6px',
          maxHeight: { xs: '200px', sm: '300px' },
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
            <Checkbox 
              checked={value?.includes(member.name) || false} 
              size="small"
            />
            <ListItemText 
              primary={member.name} 
              primaryTypographyProps={{
                fontSize: { xs: '13px', sm: '14px' }
              }}
            />
          </MenuItem>
        ) : null
      )
    ) : (
      <MenuItem disabled >
        <ListItemText 
          primary="No staff available"
          primaryTypographyProps={{
            fontSize: { xs: '13px', sm: '14px' }
          }}
        />
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
    sx={{
      ...commonSelectStyles,
      width: { xs: '60px', sm: '80px', md: '90px' },
      minWidth: { xs: '60px', sm: '80px', md: '90px' },
      maxWidth: { xs: '80px', sm: '100px', md: '110px' },
      height: { xs: '30px', sm: '33px' },
      '& .MuiSelect-select': {
        ...commonSelectStyles['& .MuiSelect-select'],
        fontSize: { xs: '11px', sm: '12px' },
        padding: { xs: '2px 4px', sm: '4px 6px' },
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    }}
    renderValue={(selected) => (selected ? selected : 'Time')}
    MenuProps={{
      PaperProps: {
        sx: {
          borderRadius: '6px',
        },
      },
    }}
  >
    <MenuItem disabled value="">
      Select time
    </MenuItem>
    <MenuItem value="minutes" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
      Minutes
    </MenuItem>
    <MenuItem value="hours" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
      Hours
    </MenuItem>
    <MenuItem value="days" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
      Days
    </MenuItem>
    <MenuItem value="months" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
      Months
    </MenuItem>
  </Select>
);

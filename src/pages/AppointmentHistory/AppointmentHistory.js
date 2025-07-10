import React, { useState } from 'react'
import { 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  Button,
  Chip,
  Grid
} from '@mui/material'
import { AccessTime as ClockIcon } from '@mui/icons-material'

const AppointmentHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState('January')

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value)
  }

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#eaeef2", minHeight: "100vh", p: { xs: 2, md: 3 } }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 10,
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            color: '#333',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          Appointment History
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ClockIcon sx={{ color: '#666' }} />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              sx={{
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ddd'
                }
              }}
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Appointment Card */}
      <Box sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        mb: 3
      }}>
        <Grid container sx={{ minHeight: 200 }}>
          {/* Left Section - 75% */}
          <Grid item xs={12} md={9}>
            <Box sx={{ 
              p: { xs: 2, md: 3 }, 
              display: 'flex', 
            //   height: '100%',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 3 }
            }}>
              {/* Image */}
              <Box sx={{
                width: { xs: '100%', sm: 120, md: 150 },
                height: { xs: 120, sm: 120, md: 150 },
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src="" 
                  alt="Batbox Cricket Nets"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </Box>
              
              {/* Content */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                flex: 1,
                gap: 1
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  Batbox | Indoor Cricket Nets
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#666',
                    fontSize: { xs: '0.9rem', md: '1rem' }
                  }}
                >
                  Grab Mall, Sector 18, Chandigarh
                </Typography>
                
                <Chip 
                  label="Pending" 
                  sx={{ 
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    fontWeight: 'bold',
                    width: 'fit-content',
                    mt: 1
                  }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Right Section - 25% */}
          <Grid item xs={12} md={3}>
            <Box sx={{ 
              backgroundColor: '#8eabbb',
            //   height: '100%',
              p: { xs: 2, md: 3 },
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              {/* Appointment Details */}
              <Box sx={{ mb: 0, display:"flex", gap: 1, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem' }}>
                  Appointment Date:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Dec 15, 2024
                </Typography>
              </Box>

              <Box sx={{ mb: 0, display:"flex", gap: 1, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem' }}>
                  Status:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Confirmed
                </Typography>
              </Box>

              <Box sx={{ mb: 0, display:"flex", gap: 1, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem' }}>
                  Appointment ID:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  #APT123456
                </Typography>
              </Box>

              <Box sx={{ mb: 1, display:"flex", gap: 1, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem' }}>
                  Total Amount:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  ₹1,500
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: 1,
                mt: 'auto'
              }}>
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{ 
                    backgroundColor: 'white',
                    color: '#8eabbb',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  Details
                </Button>
                
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  Reschedule
                </Button>
                
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{ 
                    backgroundColor: 'white',
                    color: '#8eabbb',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  Invoice
                </Button>
                
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default AppointmentHistory
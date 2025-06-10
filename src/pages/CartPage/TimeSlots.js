import React, { useState, useMemo } from 'react';
import { Box, Paper, Button, Typography, TextField, Grid } from '@mui/material';

const AvailableTimesComponent = ({selectedSlot}) => {
    const [selectedTime, setSelectedTime] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('18:00');

    const generateTimeSlots = useMemo(() => {
        const slots = [];
        const start = new Date(`2024-01-01T${startTime}:00`);
        const end = new Date(`2024-01-01T${endTime}:00`);

        let current = new Date(start);

        while (current < end) {
            const timeString = current.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            slots.push(timeString);
            current.setMinutes(current.getMinutes() + 30);
        }

        return slots;
    }, [startTime, endTime]);

    return (
        <Box sx={{ maxWidth: 400, margin: '2rem auto', padding: '10px 2px' }}>
          
            <Typography
                variant="h6"
                sx={{
                    mb: 2,
                    color: '#666',
                    fontWeight: 500,
                    fontSize: '1rem'
                }}
            >
                Available Times ({generateTimeSlots.length} slots)
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    padding: "12px",
                    bgcolor: "#dce1e6",
                    borderRadius: 3,
                    mt: 2
                }}
            >
                {generateTimeSlots.length > 0 && 
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap:'12px'
                    }}>
                        {generateTimeSlots.map((time) => (
                            <Button
                                key={time}
                                variant={selectedTime === time ? 'contained' : 'outlined'}
                                sx={{
                                    bgcolor: selectedTime === time ? "#3498db" : "white",
                                    color: selectedTime === time ? "white" : "#333",
                                    borderRadius: "8px",
                                    padding: "0px",
                                    border: selectedTime === time ? "none" : "1px solid #e0e0e0",
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    minHeight: '35px',
                                    '&:hover': {
                                        bgcolor: selectedTime === time ? "#2980b9" : "#f5f5f5",
                                        border: selectedTime === time ? "none" : "1px solid #d0d0d0"
                                    },
                                    boxShadow: selectedTime === time ? '0 2px 4px rgba(52,152,219,0.2)' : 'none'
                                }}
                                onClick={() =>{
                                    selectedSlot(time)
                                    setSelectedTime(time)}}
                            >
                                {time}
                            </Button>
                        ))}
                    </Box>}
               
            </Paper>

            
        </Box>
    );
};

export default AvailableTimesComponent;
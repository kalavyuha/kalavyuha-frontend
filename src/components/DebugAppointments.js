import React from 'react';
import { Button, Box, Typography } from '@mui/material';

const DebugAppointments = () => {
  const addTestAppointment = () => {
    const testAppointment = {
      BusinessId: 55319888,
      CustomerId: 21138275,
      AssignedStaffs: [],
      SelectedDate: new Date().toISOString().split("T")[0],
      SelectedTime: "2:00 PM",
      Services: [
        {
          ServiceId: "35861610",
          ServiceName: "Debug Test Service",
          Duration: "30 min",
          Price: 500
        }
      ],
      TotalPrice: 500,
      PaymentMethod: "online",
      PaymentStatus: "paid",
      SendSms: true,
      BookingId: Date.now(),
      CreatedAt: new Date().toISOString()
    };

    const existingAppointments = JSON.parse(localStorage.getItem("userAppointments") || "[]");
    existingAppointments.unshift(testAppointment);
    localStorage.setItem("userAppointments", JSON.stringify(existingAppointments));
    
    window.dispatchEvent(new CustomEvent('appointmentAdded', { detail: testAppointment }));
    
    alert("Test appointment added! Check appointment history page.");
  };

  const clearAppointments = () => {
    localStorage.removeItem("userAppointments");
    alert("All appointments cleared from localStorage!");
  };

  const showStoredAppointments = () => {
    const stored = localStorage.getItem("userAppointments");
    alert(`Stored appointments: ${stored || "None"}`);
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Debug Appointment Tools
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={addTestAppointment}>
          Add Test Appointment
        </Button>
        <Button variant="outlined" onClick={showStoredAppointments}>
          Show Stored Appointments
        </Button>
        <Button variant="outlined" color="error" onClick={clearAppointments}>
          Clear All Appointments
        </Button>
      </Box>
    </Box>
  );
};

export default DebugAppointments;

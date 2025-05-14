import React from 'react'
import { Box, Paper, Typography } from '@mui/material'

const Map = () => {
  const center = { lat: 51.505, lng: -0.09 }
  const GOOGLE_API_KEY='AIzaSyCYmK7_q9luqg3YaFAxxWjNW4-zzoWF3KI';
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_API_KEY}&q=${center.lat},${center.lng}&zoom=15`;

  const googleMapsEmbedUrlNoKey = `https://maps.google.com/maps?q=${center.lat},${center.lng}&z=15&output=embed`;

  return (
    <Box sx={{ height: '30vh', mt: 2, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          flex: 1,
          borderRadius: '16px',
          overflow: 'hidden', 
        
        }}
      >
        <iframe
          src={googleMapsEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </Box>
    </Box>
  )
}

export default Map

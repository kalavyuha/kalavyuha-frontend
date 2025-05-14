import { Box, Typography, Button } from '@mui/material'
import { ArrowRight } from 'lucide-react'

const OfferCard=({ title, description, image, buttonText }) =>{
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        bgcolor: '#F5F7FA',
        borderRadius: '15px',
        p: 2,
        mb: 2,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#1A1A1A',
            mb: 1,
            mt:-0.5
          }}
        >
          {title}
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            color: '#1b4d69',
            mb: 2,
          }}
        >
          {description}
        </Typography>

        <Button
          endIcon={<ArrowRight size={18} />}
          sx={{
            bgcolor: '#aec5d2',
            color: '#2D3748',
            textTransform: 'none',
            px: 2,
            py: 0.3,
            borderRadius: '20px',
            '&:hover': {
              bgcolor: '#CBD5E0',
            },
          }}
        >
          {buttonText}
        </Button>
      </Box>

      <Box
        sx={{
          width: { xs: '50px', sm: '80px' },
          height: { xs: '50px', sm: '80px' },
          ml: 2,
          position: 'relative',
        }}
      >
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            objectFit: 'cover',
          }}
        />
      </Box>
    </Box>
  )
}

export default OfferCard;


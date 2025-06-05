import { Box, Typography } from '@mui/material'
import  OfferCard  from "../../components/overviewOffersCards.js"
import Skeleton from '@mui/material/Skeleton'
import { useEffect, useState } from 'react';


const offers = [
  {
    title: 'Sunday Special',
    description: 'Pick any 5 services just @1299!',
    image: '',
    buttonText: 'View Details'
  },
  {
    title: 'Festival Discount',
    description: 'Flat 20% off on every services',
    image: '',
    buttonText: 'Explore Now'
  },
  {
    title: 'Limited - Time Discounts',
    description: 'Up to 50% off on selected services',
    image: '',
    buttonText: 'Explore Now'
  },
]

export function DealsSection({loading}) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(false)
  }, [offers])
  return (
    <Box
      sx={{
        mt: 3,
        borderRadius: '16px',
      }}
    >
      {(isLoading || loading) ? (
        <Skeleton
          variant="text"
          width={200}
          height={40}
          sx={{ mb: 2 }}
        />
      ) : (
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontWeight: 600,
            color: '#000',
            mb: 2,
          }}
        >
          Offer & Deals
        </Typography>
      )}

      <Box>
        {(isLoading || loading) ? (
          // Skeleton loading state for cards
          [...Array(3)].map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" width="100%" height={150} />
              <Skeleton variant="text" width="60%" height={30} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="30%" height={20} sx={{ mt: 1 }} />
            </Box>
          ))
        ) : (
          // Actual content when loaded
          offers.map((offer, index) => (
            <OfferCard key={index} {...offer} />
          ))
        )}
      </Box>
    </Box>
  )
}
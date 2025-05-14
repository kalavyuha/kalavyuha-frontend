import React, { useState } from 'react';
import { Box, Typography ,Container} from '@mui/material';

const ServiceDetails = ({ serviceName, salonName, startingPrice }) => {
    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: '-20px',  // Half of the component outside the image
                left: '50%',
                transform: 'translateX(-50%)',
                width: {xs:'58%',md:'50%'}, // Slightly narrower than the image

                backgroundColor: '#e2e6ea',
                padding: {xs:'0.4rem',md:'0.4rem 0.8rem'},
                borderRadius: '10px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',

            }}
        >
            <Typography variant="body1"
                sx={{
                    fontSize: {xs:'0.6em',md:'0.8em'},
                    fontWeight: 700,
                  
                }}
                component="p">
                {serviceName}
            </Typography>
            <Typography variant="h6"
             sx={{
                fontSize: {xs:'0.8em',md:'1.1em'},
                fontWeight: 700,
            }}
              component="h6">
                {salonName}
            </Typography>
            <Typography variant="body2" 
             sx={{
                fontSize: {xs:'0.6em',md:'0.8em'},
            }}
            component="p">
                {` Starting  ${startingPrice}`}
            </Typography>
        </Box>
    );
};

const DailyOffers = () => {
    const [selectedButton, setSelectedButton] = useState(0); // Default to the first button

    const buttons = [
        'Most Popular Services',
        'Best Selling Products',
        'Highest Rated Staff Members',
    ];

    const handleButtonClick = (index) => {
        setSelectedButton(index);
    };

    return (
        <>
            <Container maxWidth="lg">
                <Box sx={{ my: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <Box>
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                            // fontWeight: 'bold',
                            mb: 2
                            }}
                        >
                            Daily Deals
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{
                    height:"12vh"
                }}>

                </Box>
            </Container>
        </>
    );
};

export default DailyOffers;

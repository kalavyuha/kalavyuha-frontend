import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Card, CardMedia, useMediaQuery, useTheme } from '@mui/material';
import { keyframes } from '@mui/system';
import HappyClapEmoji from "../../assets/images/busniess_images/happyClapEmoji.png";
import HappyTopEmjoi from "../../assets/images/busniess_images/happyTopEmjoi.png";
import HappyThumbsEmjoi from "../../assets/images/busniess_images/happyThumbsEmjoi.png";
import listBusinessPage from "../../assets/images/busniess_images/listBusinessPage.png";

import { useInView } from 'react-intersection-observer';

// Floating animation for decorative elements
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Fade-in animation on scroll
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(50px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;


const FeaturesAvailable = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    'Reduce no-shows with reminders',
    'Automate bookings 24/7',
    'Optimize staff schedules effortlessly'
  ];

  const progress = 78;

  return (
    <Box
      id="features-available"
      sx={{
        py: 3,
        px: 2,
      }}
      
    >
      <Typography
        variant={isSmallScreen ? "h4" : "h3"}
        component="h1"
        align="center"
        gutterBottom
        sx={{ mb: 8, mx: { xs: 2, sm: '40px' }, 
        fontSize: { xs: 25, sm: 35, md: 48 },
       }}
      >
        Awesome features you'll like, everything in a simple way
      </Typography>

      {/* Top Section */}
      <Box
        sx={{
          p: 4,
          bgcolor: '#ffec46ad',
          borderRadius: '24px',
          display: 'flex',
          gap: 4,
          minHeight: '300px',
          flexDirection: { xs: 'column', md: 'row' }
        }}
      >
        {/* Left Content */}
        <Box
          sx={{
            flex: '0 0 40%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              mb: 2,
              lineHeight: 1.2
            }}
          >
            Boost Sales with Integrated Product Listings
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: '1rem'
            }}
          >
            Seamlessly showcase and sell your products alongside services, maximizing revenue opportunities.
          </Typography>
        </Box>

        {/* Right Content - Product Card */}
        <Box
          sx={{
            flex: '0 0 55%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'flex-end' }
          }}
        >
          <Box>
            <Card
              sx={{
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '10px',
                bgcolor: 'white'
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="100%"
                  image={listBusinessPage}
                  alt="Product Image"
                  sx={{
                    objectFit: 'cover',
                    bgcolor: '#E8EDF1'
                  }}
                />
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Combined Cards Section */}
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          justifyContent: 'center',
          padding: { xs: '24px 0', sm: '32px 0' },
          flexDirection: { xs: 'column', sm: 'row' }
        }}
      >
        {/* Smart Scheduling Card */}
        <Box
          sx={{
            flex: 1,
            maxWidth: '500px',
            borderRadius: '32px',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #E5D4F9 0%, #D1B7F4 100%)',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                lineHeight: 1.2,
                mb: 2
              }}
            >
              Streamline operations with smart scheduling
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1rem',
                mb: 4,
                maxWidth: '90%'
              }}
            >
              Efficiently manage appointments, staff availability, and resources to optimize your business workflow.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {features.map((feature, index) => (
                <Button
                  key={index}
                  variant="contained"
                  sx={{
                    bgcolor: 'white',
                    color: '#666',
                    textTransform: 'none',
                    borderRadius: '100px',
                    padding: '12px 24px',
                    fontSize: '.8rem',
                    fontWeight: 500,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                    width: 'fit-content',
                    '&:hover': {
                      bgcolor: 'white',
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.5s ease-in-out'
                    }
                  }}
                >
                  {feature}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Decorative Circles */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              zIndex: 1
            }}
          >
            <Box
              sx={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFA07A 0%, #FF7F50 100%)',
                position: 'absolute',
                bottom: '0px',
                right: '0px',
              }}
            />
            <Box
              sx={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFC0CB 0%, #FFB6C1 100%)',
                position: 'absolute',
                bottom: '60px',
                right: '40px',
              }}
            />
          </Box>
        </Box>

        {/* Todo Progress Card */}
        <Box
          sx={{
            flex: 1,
            maxWidth: '500px',
            bgcolor: '#fe8d279e',
            borderRadius: '24px',
            p: 4,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ mb: 4, maxWidth: '80%' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: 'white',
                fontSize: { xs: '1.5rem', sm: '2rem' },
                mb: 2,
                lineHeight: 1.2
              }}
            >
              Turn To-Dos into Can't-Wait-To-Dos
            </Typography>
            <Typography
              sx={{
                color: 'white',
                opacity: 0.9,
                fontSize: '1rem',
                lineHeight: 1.4
              }}
            >
              A task preview that is so enjoyable and attractive that you actually look forward to checking it.
            </Typography>
          </Box>

          {/* Progress Circle with Emojis */}
          <Box
            sx={{
              position: 'relative',
              width: '280px',
              height: '180px',
              mx: 'auto',
              mt: 2
            }}
          >
            {/* Background Circle */}
            <CircularProgress
              variant="determinate"
              value={100}
              size={280}
              thickness={2}
              sx={{
                color: 'rgba(255, 255, 255, 0.2)',
                position: 'absolute'
              }}
            />

            {/* Progress Circle */}
            <CircularProgress
              variant="determinate"
              value={progress}
              size={280}
              thickness={2}
              sx={{
                color: '#FFE600',
                position: 'absolute'
              }}
            />

            {/* Animated Emojis */}
            {[
              { top: '10%', left: '90%', delay: '0.2s', emojiPath: HappyThumbsEmjoi },
              { top: '20%', left: '-30%', delay: '0s', emojiPath: HappyTopEmjoi },
              { top: '70%', left: '30%', delay: '0.4s', emojiPath: HappyClapEmoji }
            ].map((position, index) => (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  top: position.top,
                  left: position.left,
                  fontSize: '0.8rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
              >
                <img
                  src={position.emojiPath}
                  alt="Emo"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturesAvailable;
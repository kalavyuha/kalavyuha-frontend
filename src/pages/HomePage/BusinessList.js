'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from '@mui/material';
import { AccessTime, People, Campaign } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'black',
  color: 'white',
  borderRadius: 20,
  padding: '8px 20px',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#333',
  },
}));

const FeatureItem = ({ icon, text }) => (
  <ListItem sx={{ padding: '8px 0' }}>
    <ListItemIcon sx={{ minWidth: 40 }}>
      <Box
        sx={{
          borderRadius: '50%',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color:"black"
        }}
      >
        {icon}
      </Box>
    </ListItemIcon>
    <ListItemText
      primary={text}
      primaryTypographyProps={{
        fontWeight: 500,
        fontSize: '0.95rem',
      }}
    />
  </ListItem>
);

const KalavyuhaBusinessPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 4, sm:8, md: 8, lg:4 }, pb:6 }}>
      <Typography  
        variant="h4"
        component="h2"
        sx={{
          color: 'black',
          fontSize: { xs: 'h5.fontSize', sm: 'h4.fontSize' }
        }}
        mb={3}
      >
        Join <Box component="span" fontWeight="bold">Kalavyuha!</Box>
      </Typography>

      <Grid container spacing={8}>
        <Grid item xs={12} md={7}>
          <Box
            sx={{
              backgroundColor: '#c5dce6',
              borderRadius: 4,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Box sx={{ flex: 1, pr: { sm: 2 }, px:4, my: { xs: 3, sm: 0 } }}>
              <Typography variant="h5" component="h2" fontWeight="bold" mb={1}>
                Are you a business?
              </Typography>
              <Typography variant="h5" component="h2" fontWeight="bold" mb={3}>
                Join and get more bookings.
              </Typography>
              
              <Button
                variant="contained"
                sx={{
                  minWidth: 100,
                  borderRadius: "8px",
                  backgroundColor: "black",
                  py: "5px",
                  "&:hover": {
                    backgroundColor: "grey.800",
                  },
                }}
                onClick={() => window.open('/kalavyuha-frontend/business-page', '_blank')}
              >
                LIST YOUR BUSINESS
              </Button>
            </Box>
              <Box
                component="img"
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250331-WA0005-UE2QlhNsOhvWZnG1H9kvCDAr2WUpaZ.png"
                alt="Two business people looking at a notebook"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 253,
                  objectFit: 'contain',
                }}
              />
          </Box>
        </Grid>

        <Grid item xs={12} md={5} >
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" component="h2"  mb={3}>
              Features
            </Typography>

            <Box sx={{ml:3}}>
              <List sx={{ mb: 2 }}>
                <FeatureItem icon={<AccessTime sx={{ fontSize: 18 }} />} text="Real-time appointment management" />
                <FeatureItem icon={<People sx={{ fontSize: 18 }} />} text="Customer relationship tools" />
                <FeatureItem icon={<Campaign sx={{ fontSize: 18 }} />} text="Marketing campaign creator" />
              </List>

              <Link
                component="button"
                onClick={() => window.open('/kalavyuha-frontend/business-page#features-available', '_blank')}
                underline="hover"
                sx={{ mt: 'auto', color: 'text.primary', fontWeight: 300, cursor: 'pointer' }}
              >
                See All
              </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default KalavyuhaBusinessPage;

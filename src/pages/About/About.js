import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  useMediaQuery,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade
} from "@mui/material";
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Launch as RocketIcon,
  Favorite as HeartIcon,
  CheckCircle as CheckCircleIcon,
  Lightbulb as LightbulbIcon,
  Group as GroupIcon,
  Public as PublicIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from "@mui/icons-material";

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedValue, setSelectedValue] = useState(0);

  const stats = [
    { icon: <BusinessIcon sx={{ color: '#1b4d69' }} />, number: '10,000+', label: 'Registered Businesses' },
    { icon: <PeopleIcon sx={{ color: '#1b4d69' }} />, number: '50,000+', label: 'Active Users' },
    { icon: <StarIcon sx={{ color: '#1b4d69' }} />, number: '4.8/5', label: 'Average Rating' },
    { icon: <TrendingUpIcon sx={{ color: '#1b4d69' }} />, number: '95%', label: 'Customer Satisfaction' }
  ];

  const features = [
    {
      icon: <SecurityIcon sx={{ color: '#1b4d69', fontSize: 40 }} />,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security measures and encryption protocols.'
    },
    {
      icon: <SupportIcon sx={{ color: '#1b4d69', fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Our dedicated support team is available round the clock to assist you with any queries.'
    },
    {
      icon: <RocketIcon sx={{ color: '#1b4d69', fontSize: 40 }} />,
      title: 'Fast Performance',
      description: 'Optimized platform delivering lightning-fast performance for seamless user experience.'
    },
    {
      icon: <HeartIcon sx={{ color: '#1b4d69', fontSize: 40 }} />,
      title: 'User-Centric',
      description: 'Designed with users in mind, focusing on intuitive interface and smooth interactions.'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'Kalavyuha was established with a vision to revolutionize local business discovery.'
    },
    {
      year: '2021',
      title: 'Platform Launch',
      description: 'Successfully launched our beta platform with initial business partnerships.'
    },
    {
      year: '2022',
      title: 'Rapid Growth',
      description: 'Achieved 1,000+ businesses and 10,000+ users milestone within two years.'
    },
    {
      year: '2023',
      title: 'Feature Expansion',
      description: 'Introduced advanced booking system and payment integration features.'
    },
    {
      year: '2024',
      title: 'Market Leadership',
      description: 'Became the leading platform for local business discovery and booking.'
    }
  ];

  const values = [
    { icon: <CheckCircleIcon />, text: 'Transparency in all our operations and communications' },
    { icon: <LightbulbIcon />, text: 'Innovation-driven approach to solve real-world problems' },
    { icon: <GroupIcon />, text: 'Community-focused platform supporting local businesses' },
    { icon: <PublicIcon />, text: 'Global accessibility with local market understanding' }
  ];

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#eaeef2", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        
        {/* Hero Section */}
        <Fade in={true} timeout={1000}>
          <Paper
            elevation={0}
            sx={{
              background: "#eaeef2",
              color: 'black',
              borderRadius: 4,
              p: { xs: 3, md: 5 },
              mt: 8,
              mb: 4,
              textAlign: 'center'
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontSize: { xs: '1.5rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              About Kalavyuha
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '0.8rem', md: '1rem' },
                opacity: 0.9,
                maxWidth: 700,
                mx: 'auto',
                mb: 3,
                lineHeight: 1.6
              }}
            >
              Connecting communities through innovative local business discovery and booking solutions. 
              We're building the future of local commerce, one connection at a time.
            </Typography>
            <Chip
              icon={<RocketIcon />}
              label="Trusted by 10,000+ Businesses"
              sx={{
                backgroundColor: 'rgba(27, 77, 105, 0.1)',
                color: '#1b4d69',
                fontWeight: 600,
                fontSize: { xs: '0.8rem', md: '1rem' },
                border: '1px solid #1b4d69'
              }}
            />
          </Paper>
        </Fade>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Fade in={true} timeout={1000 + index * 200}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 3,
                    boxShadow: '0 4px 16px rgba(27, 77, 105, 0.1)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(27, 77, 105, 0.15)'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 1 }}>
                      {stat.icon}
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: { xs: '1.2rem', md: '1.8rem' },
                        fontWeight: 700,
                        color: '#1b4d69',
                        mb: 1
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.7rem', md: '0.9rem' },
                        color: '#4a5568'
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Mission Section */}
        <Box
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            backgroundColor: '#eaeef2',
            mb: 6
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: '1.2rem', md: '1.8rem' },
                  fontWeight: 600,
                  color: '#1b4d69',
                  mb: 3
                }}
              >
                Our Mission
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '0.8rem', md: '1rem' },
                  color: '#4a5568',
                  lineHeight: 1.7,
                  mb: 3
                }}
              >
                At Kalavyuha, we believe in empowering local businesses and creating meaningful connections 
                within communities. Our platform serves as a bridge between service providers and customers, 
                fostering economic growth and strengthening local economies.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '0.8rem', md: '1rem' },
                  color: '#4a5568',
                  lineHeight: 1.7
                }}
              >
                We're committed to providing innovative solutions that make it easier for businesses to reach 
                their customers and for customers to discover exceptional local services.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: { xs: 150, md: 200 },
                    height: { xs: 150, md: 200 },
                    backgroundColor: '#1b4d69',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <BusinessIcon sx={{ fontSize: { xs: 60, md: 80 } }} />
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '0.9rem', md: '1.1rem' },
                    fontWeight: 500,
                    color: '#1b4d69'
                  }}
                >
                  Building Tomorrow's Marketplace
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Features Section */}
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.2rem', md: '1.8rem' },
            fontWeight: 600,
            color: '#1b4d69',
            mb: 4,
            textAlign: 'center'
          }}
        >
          Why Choose Kalavyuha?
        </Typography>
        
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Box
                sx={{
                  p: 3,
                  bgcolor:"#eaeef2",
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ mt: 0.5 }}>
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: { xs: '0.9rem', md: '1.1rem' },
                        fontWeight: 600,
                        color: '#1b4d69',
                        mb: 1
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.7rem', md: '0.9rem' },
                        color: '#4a5568',
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Values Section */}
        <Box
          elevation={2}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            backgroundColor: '#f8fafc',
            border: '2px solid #e2e8f0',
            mb: 6
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.2rem', md: '1.8rem' },
              fontWeight: 600,
              color: '#1b4d69',
              mb: 4,
              textAlign: 'center'
            }}
          >
            Our Core Values
          </Typography>
          
          <List sx={{ maxWidth: 800, mx: 'auto' }}>
            {values.map((value, index) => (
              <ListItem key={index} sx={{ mb: 2 }}>
                <ListItemIcon>
                  <Box
                    sx={{
                      backgroundColor: '#1b4d69',
                      borderRadius: '50%',
                      p: 1,
                      color: 'white'
                    }}
                  >
                    {value.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: '0.8rem', md: '1rem' },
                        color: '#2d3748',
                        fontWeight: 500,
                        lineHeight: 1.6
                      }}
                    >
                      {value.text}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Contact Section */}
        <Box
          elevation={2}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            backgroundColor: '#eaeef2',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.2rem', md: '1.8rem' },
                fontWeight: 600,
                color: '#1b4d69',
                mb: 2
              }}
            >
              Get in Touch
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.8rem', md: '1rem' },
                color: '#4a5568',
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Have questions about our platform or want to partner with us? 
              We'd love to hear from you and discuss how we can help your business grow.
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <EmailIcon sx={{ fontSize: 40, color: '#1b4d69', mb: 1 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '0.9rem', md: '1.1rem' },
                    fontWeight: 500,
                    color: '#1b4d69',
                    mb: 1
                  }}
                >
                  Email Us
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.7rem', md: '0.9rem' },
                    color: '#4a5568'
                  }}
                >
                  support@kalavyuha.com
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <PhoneIcon sx={{ fontSize: 40, color: '#1b4d69', mb: 1 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '0.9rem', md: '1.1rem' },
                    fontWeight: 500,
                    color: '#1b4d69',
                    mb: 1
                  }}
                >
                  Call Us
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.7rem', md: '0.9rem' },
                    color: '#4a5568'
                  }}
                >
                  +91 987-123-4567
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <LocationIcon sx={{ fontSize: 40, color: '#1b4d69', mb: 1 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '0.9rem', md: '1.1rem' },
                    fontWeight: 500,
                    color: '#1b4d69',
                    mb: 1
                  }}
                >
                  Visit Us
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.7rem', md: '0.9rem' },
                    color: '#4a5568'
                  }}
                >
                  123 Gurugram, Haryana, India
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#1b4d69',
                '&:hover': {
                  backgroundColor: '#2d5a7b'
                },
                borderRadius: 3,
                px: 4,
                py: 0.5,
                textTransform: 'none',
                fontSize: { xs: '0.8rem', md: '1rem' },
                fontWeight: 500
              }}
              onClick={() => window.location.href = '/kalavyuha-frontend/support'}
            >
              Contact Support
            </Button>
          </Box>
        </Box>

        {/* Footer Note */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Divider sx={{ mb: 3 }} />
          <Typography
            variant="body2"
            sx={{
              color: '#718096',
              fontStyle: 'italic',
              fontSize: { xs: '0.7rem', md: '0.9rem' }
            }}
          >
            Thank you for being part of the Kalavyuha community. Together, we're building the future of local commerce.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
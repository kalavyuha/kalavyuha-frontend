import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import SupportIcon from '@mui/icons-material/Support';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import { useInView } from 'react-intersection-observer';

// Styled components matching the app's design system
const HeroSection = styled(Box)(({ theme }) => ({
//   background: 'linear-gradient(135deg, #1b4d69 0%, #2980b9 100%)',
  color: 'black',
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  }
}));

const PricingCard = styled(Card)(({ theme, recommended }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: recommended ? '2px solid #1b4d69' : '1px solid #e0e0e0',
  borderRadius: '16px',
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
  ...(recommended && {
    '&::before': {
      content: '"Most Popular"',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#1b4d69',
      color: 'white',
      textAlign: 'center',
      padding: '8px',
      fontSize: '14px',
    //   fontWeight: 'bold',
      zIndex: 1,
    },
  }),
}));

const FeatureSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  padding: theme.spacing(8, 0),
}));

const Enterprise = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedPlan, setSelectedPlan] = useState('gold');

  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [pricingRef, pricingInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const membershipPlans = [
    {
      id: 'silver',
      name: 'Silver',
      color: '#C0C0C0',
      price: '₹9,999',
      period: '/month',
      description: 'Perfect for small to medium businesses',
      features: [
        'Up to 100 appointments per month',
        'Basic analytics and reporting',
        'Email support',
        '2 team member accounts',
        // 'Standard booking system',
        // 'Mobile app access',
        // 'Basic customization',
        // 'Payment processing'
      ],
      recommended: false,
      buttonText: 'Get Started'
    },
    {
      id: 'gold',
      name: 'Gold',
      color: '#FFD700',
      price: '₹19,999',
      period: '/month',
      description: 'Most popular choice for growing businesses',
      features: [
        'Up to 500 appointments per month',
        'Advanced analytics and insights',
        'Priority email & phone support',
        '10 team member accounts',
        'Advanced booking system',
        'White-label mobile app',
        // 'Full customization options',
        // 'Advanced payment processing',
        // 'Marketing automation tools',
        // 'Customer loyalty programs',
        // 'Integration with 50+ apps',
        // 'Multi-location support'
      ],
      recommended: true,
      buttonText: 'Start Free Trial'
    },
    {
      id: 'platinum',
      name: 'Platinum',
      color: '#E5E4E2',
      price: '₹39,999',
      period: '/month',
      description: 'Enterprise solution for large organizations',
      features: [
        'Unlimited appointments',
        'Real-time analytics dashboard',
        '24/7 dedicated support',
        'Unlimited team members',
        'Enterprise booking system',
        'Custom mobile apps',
        'Complete white-label solution',
        'Enterprise payment solutions',
        'Advanced marketing suite',
        // 'AI-powered insights',
        // 'Custom integrations',
        // 'Multi-brand management',
        // 'Advanced security features',
        // 'Custom training & onboarding',
        // 'Dedicated account manager'
      ],
      recommended: false,
      buttonText: 'Contact Sales'
    }
  ];

  const enterpriseFeatures = [
    {
      icon: <BusinessIcon sx={{ fontSize: 40, color: '#1b4d69' }} />,
      title: 'Multi-Location Management',
      description: 'Seamlessly manage multiple business locations from a single dashboard with centralized control and reporting.'
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#1b4d69' }} />,
      title: 'Team Collaboration',
      description: 'Enable your entire team with role-based access controls and collaborative tools for efficient operations.'
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: '#1b4d69' }} />,
      title: 'Advanced Analytics',
      description: 'Gain deep insights into your business performance with comprehensive reporting and real-time dashboards.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#1b4d69' }} />,
      title: 'Enterprise Security',
      description: 'Bank-grade security with SSL encryption, secure data storage, and compliance with industry standards.'
    },
    {
      icon: <IntegrationInstructionsIcon sx={{ fontSize: 40, color: '#1b4d69' }} />,
      title: 'Custom Integrations',
      description: 'Connect with your existing tools and systems through our robust API and custom integration solutions.'
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40, color: '#1b4d69' }} />,
      title: '24/7 Support',
      description: 'Get round-the-clock support from our dedicated enterprise team with guaranteed response times.'
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    // Add your plan selection logic here
  };

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection ref={heroRef}>
        <Container maxWidth="lg">
          <Fade in={heroInView} timeout={1000}>
            <Box sx={{mt:16, mb:6}}>
              <Typography
                variant="h2"
                sx={{
                //   fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem', lg: '3.2rem' },
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                Enterprise Solutions
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  maxWidth: '800px',
                  mx: 'auto',
                  fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' },
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                Scale your business with our comprehensive enterprise platform designed for 
                large organizations and multi-location businesses
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#eaeef2',
                  color: '#1b4d69',
                  borderRadius: '25px',
                //   textTransform: 'none', 
                  px: 3,
                  py: 1,
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#cdddec',
                  },
                }}
              >
                Schedule a Demo
              </Button>
            </Box>
          </Fade>
        </Container>
      </HeroSection>

      {/* Pricing Plans Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box ref={pricingRef} sx={{ textAlign: 'center', mb: 6 }}>
          <Fade in={pricingInView} timeout={1000}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                //   fontWeight: 'bold',
                  mb: 2,
                  color: '#000',
                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem', lg: '2.2rem' }
                }}
              >
                Choose Your Plan
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#6c757d',
                  mb: 4,
                  maxWidth: '600px',
                  mx: 'auto',
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
                }}
              >
                Select the perfect membership plan that scales with your business needs
              </Typography>
            </Box>
          </Fade>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {membershipPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <Zoom in={pricingInView} style={{ transitionDelay: `${index * 200}ms` }}>
                <PricingCard recommended={plan.recommended}>
                  <CardContent
                    sx={{
                      p: 4,
                      pt: plan.recommended ? 6 : 4, 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Plan Header */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          backgroundColor: plan.color,
                          mx: 'auto',
                          mb: 2,
                        //   mt:4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            
                            color: plan.id === 'silver' ? '#000' : '#000'
                          }}
                        >
                          {plan.name[0]}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{
                        //   fontWeight: 'bold',
                        fontFamily: "Arial, sans-serif",
                          fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' },
                          color: '#000',
                          mb: 1
                        }}
                      >
                        {plan.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ 
                          color: '#6c757d', 
                          mb: 2,
                          fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
                        }}
                      >
                        {plan.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                        <Typography
                          variant="h3"
                          sx={{
                            // fontWeight: 'bold',
                            fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                            color: '#1b4d69'
                          }}
                        >
                          {plan.price}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ 
                            color: '#6c757d', 
                            ml: 1,
                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
                          }}
                        >
                          {plan.period}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Features List */}
                    <List sx={{ flexGrow: 1, py: 0 }}>
                      {plan.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex} sx={{ py: 0.5, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleIcon sx={{ color: '#1b4d69', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                                lineHeight: 1.4
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    {/* CTA Button */}
                    <Button
                      variant={plan.recommended ? 'contained' : 'outlined'}
                      fullWidth
                      size="large"
                      onClick={() => handlePlanSelect(plan.id)}
                      sx={{
                        mt: 2,
                        textTransform: 'none',
                        borderRadius: '12px',
                        py: 1.5,
                        fontWeight: 'bold',
                        fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                        ...(plan.recommended ? {
                          backgroundColor: '#1b4d69',
                          '&:hover': {
                            backgroundColor: '#164056',
                          },
                        } : {
                          color: '#1b4d69',
                          borderColor: '#1b4d69',
                          '&:hover': {
                            backgroundColor: 'rgba(27, 77, 105, 0.1)',
                            borderColor: '#1b4d69',
                          },
                        })
                      }}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </PricingCard>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Enterprise Features Section */}
      <FeatureSection>
        <Container maxWidth="lg">
          <Box ref={featuresRef} sx={{ textAlign: 'center', mb: 6 }}>
            <Fade in={featuresInView} timeout={1000}>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    // fontWeight: 'bold',
                    mb: 2,
                    color: '#000',
                    fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem', lg: '2.5rem' }
                  }}
                >
                  Enterprise Features
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#6c757d',
                    mb: 4,
                    maxWidth: '600px',
                    mx: 'auto',
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
                  }}
                >
                  Powerful tools and features designed for enterprise-level operations
                </Typography>
              </Box>
            </Fade>
          </Box>

          <Grid container spacing={4}>
            {enterpriseFeatures.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Zoom in={featuresInView} style={{ transitionDelay: `${index * 150}ms` }}>
                  <Box
                    // elevation={2}
                    sx={{
                      p: 4,
                      height: '100%',
                      borderRadius: '16px',
                      textAlign: 'center',
                      transition: 'all 0.1s ease-in-out',
                    //   '&:hover': {
                    //     transform: 'translateY(-4px)',
                    //     boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    //   }
                    }}
                  >
                    <Box sx={{ mb: 3 }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        // fontWeight: 'bold',
                        mb: 2,
                        color: '#1b4d69',
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#6c757d',
                        lineHeight: 1.6,
                        fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </FeatureSection>

      {/* Call to Action Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
        //   elevation={4}
          sx={{
            // background: 'linear-gradient(135deg, #1b4d69 0%, #2980b9 100%)',
            color: 'black',
            p: {xs:2, sm: 6},
            borderRadius: '24px',
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h4"
            sx={{
            //   fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem', lg: '2.2rem' }
            }}
          >
            Ready to Transform Your Business?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
            }}
          >
            Join thousands of enterprises who trust Kalavyuha to manage their business operations
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center'
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: '#1b4d69',
                borderRadius: '25px',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'black',
                color: 'black',
                borderRadius: '25px',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(62, 52, 249, 0.03)',
                  borderColor: 'black',
                },
              }}
            >
              Contact Sales
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Enterprise;
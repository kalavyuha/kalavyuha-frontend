import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  useMediaQuery,
  useTheme,
  Button,
  Alert
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Policy as PolicyIcon,
  Gavel as GavelIcon,
  Update as UpdateIcon,
  Email as EmailIcon
} from "@mui/icons-material";

const TermsConditions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const lastUpdated = "January 15, 2025";

  const termsData = [
    {
      id: 'panel1',
      title: 'Acceptance of Terms',
      icon: <GavelIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'By accessing and using Kalavyuha platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.',
        'These terms constitute a legally binding agreement between you and Kalavyuha.',
        'If you do not agree with any part of these terms, you must not use our services.',
        'Your continued use of the platform constitutes acceptance of any modifications to these terms.'
      ]
    },
    {
      id: 'panel2',
      title: 'User Registration and Account',
      icon: <SecurityIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'You must provide accurate and complete information when creating an account.',
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You must notify us immediately of any unauthorized use of your account.',
        'Users must be at least 18 years old to create an account.',
        'Business accounts require valid business documentation and verification.'
      ]
    },
    {
      id: 'panel3',
      title: 'Platform Usage and Conduct',
      icon: <PolicyIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'Use the platform only for lawful purposes and in accordance with these terms.',
        'Do not engage in any activity that could harm, disable, or impair our services.',
        'Respect intellectual property rights of Kalavyuha and other users.',
        'Maintain professional and respectful communication with other users.',
        'Report any suspicious or inappropriate behavior immediately.'
      ]
    },
    {
      id: 'panel4',
      title: 'Business Services and Marketplace',
      icon: <GavelIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'Business owners are responsible for the accuracy of their service descriptions and pricing.',
        'All transactions are subject to our payment processing terms and conditions.',
        'Kalavyuha reserves the right to review and approve business listings.',
        'Service providers must maintain required licenses and certifications.',
        'Cancellation and refund policies are determined by individual service providers.'
      ]
    },
    {
      id: 'panel5',
      title: 'Privacy and Data Protection',
      icon: <SecurityIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'Your privacy is important to us. Please review our Privacy Policy for detailed information.',
        'We collect and process personal data in accordance with applicable data protection laws.',
        'You have the right to access, modify, or delete your personal information.',
        'We implement appropriate security measures to protect your data.',
        'Third-party integrations are subject to their respective privacy policies.'
      ]
    },
    {
      id: 'panel6',
      title: 'Intellectual Property',
      icon: <PolicyIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'All content, trademarks, and intellectual property on Kalavyuha are our exclusive property.',
        'Users retain rights to content they create but grant us license to use it on our platform.',
        'Unauthorized use of our intellectual property is strictly prohibited.',
        'We respect the intellectual property rights of others and expect users to do the same.',
        'Report any copyright infringement to our designated agent.'
      ]
    },
    {
      id: 'panel7',
      title: 'Limitation of Liability',
      icon: <GavelIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'Kalavyuha provides the platform "as is" without warranties of any kind.',
        'We are not liable for any indirect, incidental, or consequential damages.',
        'Our total liability shall not exceed the amount paid by you for our services.',
        'We do not guarantee the quality or outcome of services provided by third parties.',
        'Users acknowledge the inherent risks of online transactions and interactions.'
      ]
    },
    {
      id: 'panel8',
      title: 'Termination and Suspension',
      icon: <UpdateIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'We may suspend or terminate accounts that violate these terms.',
        'You may terminate your account at any time by contacting our support team.',
        'Upon termination, your access to the platform will be immediately revoked.',
        'We reserve the right to retain certain information as required by law.',
        'Termination does not affect any accrued rights or obligations.'
      ]
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#eaeef2", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            // background: "#1b4d69",
            background: "#eaeef2  ",
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
            Terms & Conditions
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '0.8rem', md: '1rem' },
              opacity: 0.9,
              maxWidth: 600,
              mx: 'auto',
              mb: 2
            }}
          >
            Please read these terms carefully before using our platform
          </Typography>
          <Chip
            icon={<UpdateIcon />}
            label={`Last Updated: ${lastUpdated}`}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              color: 'black',
              fontWeight: 600,
              fontSize: { xs: '0.8rem', md: '1rem' },
            }}
          />
        </Paper>

        {/* Important Notice */}
        <Alert
          severity="info"
          sx={{
            mb: 4,
            borderRadius: 2,
            alignItems: 'center',
            backgroundColor: '#f0f8ff',
            border: '1px solid #1b4d69',
            '& .MuiAlert-icon': {
              color: '#1b4d69'
            }
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500 ,  fontSize: { xs: '0.8rem', md: '1rem' }}}>
            By using Kalavyuha's services, you agree to these terms. If you have any questions, 
            please contact our support team before proceeding.
          </Typography>
        </Alert>

        {/* Terms Content */}
        <Box sx={{ mb: 4 }}>
          {termsData.map((term, index) => (
            <Accordion
              key={term.id}
              expanded={expanded === term.id}
              onChange={handleChange(term.id)}
              sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  margin: '0 0 16px 0',
                  boxShadow: '0 4px 16px rgba(27, 77, 105, 0.15)'
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#1b4d69' }} />}
                sx={{
                  backgroundColor: expanded === term.id ? '#f8fafc' : 'white',
                  borderRadius: expanded === term.id ? '8px 8px 0 0' : '8px',
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center',
                    gap: 2
                  }
                }}
              >
                {term.icon}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    color: '#1b4d69',
                    fontSize: { xs: '0.8rem', md: '1rem' }
                  }}
                >
                  {index + 1}. {term.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: '#fafbfc', p: 3 }}>
                <List disablePadding>
                  {term.content.map((item, itemIndex) => (
                    <ListItem key={itemIndex} disablePadding sx={{ mb: 1 }}>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{
                              color: '#2d3748',
                              lineHeight: 1.6,
                              fontSize: { xs: '0.7rem', md: '0.9rem' }
                            }}
                          >
                            • {item}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Contact Section */}
        <Box
          // elevation={2}
          sx={{
            p: { xs: 3, md: 4 },
            // borderRadius: 3,
            // backgroundColor: 'white',
            // border: '2px solid #e2e8f0'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <EmailIcon sx={{ fontSize: 48, color: '#1b4d69', mb: 1 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 500,
                color: '#1b4d69',
                mb: 2,
                 fontSize: { xs: '1.2rem', md: '1.4rem' },
              }}
            >
              Questions About These Terms?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#4a5568',
                mb: 3,
                maxWidth: 500,
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '0.8rem', md: '1rem' }
              }}
            >
              If you have any questions about these Terms and Conditions, 
              please don't hesitate to contact our support team.
            </Typography>
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
              fontStyle: 'italic'
            }}
          >
            These terms are effective as of {lastUpdated} and may be updated from time to time. 
            Users will be notified of any significant changes.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsConditions;
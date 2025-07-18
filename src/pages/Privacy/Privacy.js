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
  Shield as ShieldIcon,
  Update as UpdateIcon,
  Email as EmailIcon,
  Storage as StorageIcon,
  Share as ShareIcon,
  Cookie as CookieIcon,
  Lock as LockIcon
} from "@mui/icons-material";

const Privacy = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const lastUpdated = "January 15, 2025";

  const privacyData = [
    {
      id: 'panel1',
      title: 'Information We Collect',
      icon: <StorageIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'Personal Information: Name, email address, phone number, and location data when you create an account.',
        'Business Information: Business name, address, operating hours, services offered, and business documentation.',
        'Usage Data: Information about how you use our platform, including pages visited, features used, and time spent.',
        'Device Information: Device type, operating system, browser type, and unique device identifiers.',
        'Communication Data: Messages, reviews, and other communications made through our platform.',
        'Payment Information: Credit card details and billing information (processed securely through third-party payment processors).'
      ]
    },
    {
      id: 'panel2',
      title: 'How We Use Your Information',
      icon: <PolicyIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'Provide and maintain our services, including user accounts and business listings.',
        'Process transactions and facilitate bookings between users and service providers.',
        'Communicate with you about your account, services, and important updates.',
        'Improve our platform through analytics and user feedback.',
        'Personalize your experience and provide relevant service recommendations.',
        'Ensure platform security and prevent fraudulent activities.',
        'Comply with legal obligations and resolve disputes.'
      ]
    },
    {
      id: 'panel3',
      title: 'Information Sharing and Disclosure',
      icon: <ShareIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'Service Providers: We share information with trusted third-party service providers who help us operate our platform.',
        'Business Partners: With your consent, we may share information with business partners for promotional purposes.',
        'Legal Requirements: We may disclose information when required by law or to protect our rights and users.',
        'Business Transfers: In the event of a merger or acquisition, user information may be transferred.',
        'Public Information: Business listings and reviews are publicly visible on our platform.',
        'We do not sell your personal information to third parties for marketing purposes.'
      ]
    },
    {
      id: 'panel4',
      title: 'Data Security and Protection',
      icon: <ShieldIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'We implement industry-standard security measures to protect your personal information.',
        'Data is encrypted during transmission and storage using SSL/TLS protocols.',
        'Access to personal information is restricted to authorized personnel only.',
        'Regular security audits and updates are conducted to maintain data protection.',
        'We use secure payment processing systems that comply with PCI DSS standards.',
        'User passwords are hashed and stored securely using advanced encryption methods.'
      ]
    },
    {
      id: 'panel5',
      title: 'Cookies and Tracking Technologies',
      icon: <CookieIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'Essential Cookies: Required for the basic functionality of our platform.',
        'Performance Cookies: Help us understand how users interact with our platform.',
        'Functional Cookies: Remember your preferences and settings.',
        'Targeting Cookies: Used to deliver personalized advertisements and content.',
        'Third-party Cookies: Analytics and advertising partners may set cookies on our platform.',
        'You can manage cookie preferences through your browser settings.'
      ]
    },
    {
      id: 'panel6',
      title: 'Your Privacy Rights',
      icon: <LockIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'Access: You can request access to your personal information we hold.',
        'Correction: You can update or correct inaccurate personal information.',
        'Deletion: You can request deletion of your personal information, subject to legal requirements.',
        'Portability: You can request a copy of your data in a structured, machine-readable format.',
        'Objection: You can object to certain processing of your personal information.',
        'Withdraw Consent: You can withdraw consent for data processing at any time.',
        'Contact our privacy team to exercise these rights.'
      ]
    },
    {
      id: 'panel7',
      title: 'Data Retention',
      icon: <StorageIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'We retain personal information for as long as necessary to provide our services.',
        'Account information is retained until you request deletion or close your account.',
        'Business information may be retained for legal and regulatory compliance.',
        'Communication records are kept for customer service and dispute resolution purposes.',
        'Financial transaction data is retained as required by law and accounting standards.',
        'Anonymous usage data may be retained indefinitely for analytics purposes.'
      ]
    },
    {
      id: 'panel8',
      title: 'Third-Party Services',
      icon: <ShareIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'Our platform integrates with third-party services for payments, analytics, and communications.',
        'These services have their own privacy policies and data handling practices.',
        'We encourage you to review the privacy policies of these third-party services.',
        'We are not responsible for the privacy practices of external websites or services.',
        'Social media integration allows you to share content but is subject to their privacy policies.',
        'We regularly review and update our third-party partnerships to ensure data protection.'
      ]
    },
    {
      id: 'panel9',
      title: 'International Data Transfers',
      icon: <SecurityIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'Your information may be transferred to and processed in countries other than your own.',
        'We ensure appropriate safeguards are in place for international data transfers.',
        'Data transfers comply with applicable data protection laws and regulations.',
        'We use standard contractual clauses and adequacy decisions where appropriate.',
        'Your information is protected regardless of where it is processed.',
        'Contact us if you have concerns about international data transfers.'
      ]
    },
    {
      id: 'panel10',
      title: 'Children\'s Privacy',
      icon: <ShieldIcon sx={{ color: '#1b4d69' }} />,
      content: [
        'Our services are not intended for children under 18 years of age.',
        'We do not knowingly collect personal information from children.',
        'If we discover that a child has provided personal information, we will delete it immediately.',
        'Parents or guardians should monitor their children\'s online activities.',
        'Contact us if you believe a child has provided personal information.',
        'We encourage parents to teach children about online privacy and safety.'
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
            Privacy Policy
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
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
          <Typography variant="body1" sx={{ fontWeight: 500, fontSize: { xs: '0.8rem', md: '1rem' } }}>
            This Privacy Policy applies to all users of Kalavyuha's platform. By using our services, 
            you consent to the collection and use of information as described in this policy.
          </Typography>
        </Alert>

        {/* Privacy Content */}
        <Box sx={{ mb: 4 }}>
          {privacyData.map((privacy, index) => (
            <Accordion
              key={privacy.id}
              expanded={expanded === privacy.id}
              onChange={handleChange(privacy.id)}
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
                  backgroundColor: expanded === privacy.id ? '#f8fafc' : 'white',
                  borderRadius: expanded === privacy.id ? '8px 8px 0 0' : '8px',
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center',
                    gap: 2
                  }
                }}
              >
                {privacy.icon}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    color: '#1b4d69',
                    fontSize: { xs: '0.8rem', md: '1rem' }
                  }}
                >
                  {index + 1}. {privacy.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: '#fafbfc', p: 3 }}>
                <List disablePadding>
                  {privacy.content.map((item, itemIndex) => (
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
          sx={{
            p: { xs: 3, md: 4 },
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
              Privacy Questions or Concerns?
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
              If you have any questions about this Privacy Policy or how we handle your personal information, 
              please contact our privacy team.
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
              Contact Privacy Team
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
            This Privacy Policy is effective as of {lastUpdated} and may be updated from time to time. 
            We will notify users of any material changes to this policy.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Privacy;
import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  List, 
  ListItem, 
  Collapse, 
  IconButton, 
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { MoveRight } from 'lucide-react';
import { constant } from '../../constant';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
}));

export default function FAQSection() {
  const [expanded, setExpanded] = useState(null);
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fallback FAQ data in case API fails
  const fallbackFAQs = [
    {
      id: 'fallback-1',
      question: "How much does it cost to list my business on Kalavyuha?",
      answer: "Listing your business on Kalavyuha is completely free! You only pay when you receive bookings through our platform, with a small percentage fee on successful transactions."
    },
    {
      id: 'fallback-2',
      question: "Can I manage multiple locations or businesses under one account?",
      answer: "Kalavyuha is designed to support multi-location businesses. You can easily manage multiple locations or even different businesses all from a single, centralized dashboard."
    },
    {
      id: 'fallback-3',
      question: "How do I receive payments for bookings made through Kalavyuha?",
      answer: "We've made receiving payments simple and secure. Funds are transferred directly to your linked bank account on a regular schedule, typically within 2-3 business days."
    },
    {
      id: 'fallback-4',
      question: "Is it easy to sync Kalavyuha with my existing calendar or booking system?",
      answer: "Yes, Kalavyuha integrates seamlessly with popular calendar systems like Google Calendar, iCal, and Outlook. We also offer API integrations for more complex booking systems."
    },
    {
      id: 'fallback-5',
      question: "How can Kalavyuha help me attract new clients?",
      answer: "Kalavyuha helps you attract new clients in several ways: our SEO-optimized business profiles, promotional tools, and review system increase your visibility and build trust."
    }
  ];

  // Function to fetch FAQ data from API
  const fetchFAQData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${constant.baseUrl}api/v1/FAQ/list/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${constant.token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.Status === 200 && data.Data && data.Data.Data) {
        // Transform API data to match component structure
        const transformedData = data.Data.Data
          .filter(item => item.isActive) // Only show active FAQs
          .map(item => ({
            question: item.Question,
            answer: item.Answer,
            id: item._id
          }));
        
        if (transformedData.length > 0) {
          setFaqData(transformedData);
        } else {
          setFaqData(fallbackFAQs);
        }
      } else {
        throw new Error(`Invalid response format. Status: ${data.Status || 'unknown'}`);
      }
    } catch (err) {
      setError(err.message);
      // Use fallback data when API fails
      setFaqData(fallbackFAQs);
    } finally {
      setLoading(false);
    }
  };

  // Fetch FAQ data on component mount
  useEffect(() => {
    fetchFAQData();
  }, []);

  const handleToggle = (index) => {
    setExpanded(prev => (prev === index ? null : index)); 
  };

  return (
    <Box sx={{ margin: 'auto', padding: { xs: 2, md: 4 }, overflow: 'hidden' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                minHeight: 200,
              }}
            >
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Frequently Asked Questions
              </Typography>
            </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          {loading ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography>Loading FAQs...</Typography>
            </Box>
          ) : faqData.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography>No FAQs available at the moment.</Typography>
              {error && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Error: {error}
                </Typography>
              )}
            </Box>
          ) : (
            <>
              {error && (
                <Box sx={{ p: 2, mb: 2, bgcolor: '#fff3cd', borderRadius: 1, border: '1px solid #ffeaa7' }}>
                  <Typography variant="body2" color="text.secondary">
                    ⚠️ Using cached data. API Error: {error}
                  </Typography>
                </Box>
              )}
              <List>
                {faqData.map((item, index) => (
                  <Box key={item.id || index}>
                    <StyledListItem disablePadding>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', flex: 1, pr: 2 }}>
                        {item.question}
                      </Typography>
                      <IconButton 
                        edge="end" 
                        onClick={() => handleToggle(index)}
                        aria-expanded={expanded === index}
                        aria-label={expanded === index ? "Collapse" : "Expand"}
                      >
                        {expanded === index ? <RemoveIcon sx={{ color: '#1b4d69' }} /> : <AddIcon sx={{ color: '#1b4d69' }} />}
                      </IconButton>
                    </StyledListItem>
                    <Collapse in={expanded === index} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 2, bgcolor: '#e2e6ea', borderRadius: '0 0 4px 4px' }}>
                        <Typography>{item.answer}</Typography>
                      </Box>
                    </Collapse>
                    <Box sx={{ 
                      border: "1px solid #dbe3e3", 
                      borderRadius: "4px", 
                      mb: 2 
                    }} />
                  </Box>
                ))}
              </List>
            </>
          )}
          {isMobile && (
            <Button
              variant="outlined"
              endIcon={<MoveRight size={15} style={{ marginLeft: 8 }} />}
              sx={{
                width: "fit-content",
                borderRadius: 28,
                paddingLeft: 3,
                paddingRight: 3,
                color: '#1b4d69',
                textTransform: "capitalize",
                borderColor: '#1b4d69',
                '&:hover': {
                  borderColor: '#1b4d69',
                  bgcolor: '#1b4d6929',
                },
                mt: 2, 
              }}
            >
              Have other questions?
            </Button>
          )}
        </Grid>
      </Grid>
      {!isMobile && (
        <Button
          variant="outlined"
          endIcon={<MoveRight size={15} style={{ marginLeft: 8 }} />}
          sx={{
            width: "fit-content",
            borderRadius: 28,
            paddingLeft: 3,
            paddingRight: 3,
            color: '#1b4d69',
            textTransform: "capitalize",
            borderColor: '#1b4d69',
            '&:hover': {
              borderColor: '#1b4d69',
              bgcolor: '#1b4d6929',
            },
            mt: { xs: 2, md: -8 }, 
            mb: { xs: 2, md: 8 }
          }}
        >
          Have other questions?
        </Button>
      )}
    </Box>
  );
}

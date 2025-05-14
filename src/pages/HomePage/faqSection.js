import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  List,
  ListItem,
  Collapse,
  IconButton,
  Grid,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { MoveRight } from 'lucide-react';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
}));

const questions = [
  {
    question: "How much does it cost to list my business on Kalavyuha?",
    answer: "Listing your business on Kalavyuha is completely free! You only pay when you receive bookings through our platform, with a small percentage fee on successful transactions."
  },
  {
    question: "Can I manage multiple locations or businesses under one account?",
    answer: "Kalavyuha is designed to support multi-location businesses. You can easily manage multiple locations or even different businesses all from a single, centralized dashboard."
  },
  {
    question: "How do I receive payments for bookings made through Kalavyuha?",
    answer: "We've made receiving payments simple and secure. Funds are transferred directly to your linked bank account on a regular schedule, typically within 2-3 business days."
  },
  {
    question: "Is it easy to sync Kalavyuha with my existing calendar or booking system?",
    answer: "Yes, Kalavyuha integrates seamlessly with popular calendar systems like Google Calendar, iCal, and Outlook. We also offer API integrations for more complex booking systems."
  },
  {
    question: "How can Kalavyuha help me attract new clients?",
    answer: "Kalavyuha helps you attract new clients in several ways: our SEO-optimized business profiles, promotional tools, and review system increase your visibility and build trust."
  }
];

export default function FAQSection() {
  const [expanded, setExpanded] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleToggle = (index) => {
    setExpanded(prev => (prev === index ? null : index));
  };

  return (
    <Container maxWidth="lg">
      <Box >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
                Frequently Asked Questions
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <List>
              {questions.map((item, index) => (
                <Box key={index}>
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
                  <Box sx={{ border: "1px solid #dbe3e3", borderRadius: "4px", mb: 2 }} />
                </Box>
              ))}
            </List>
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
    </Container>
  );
}

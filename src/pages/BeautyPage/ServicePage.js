import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const services = {
  'Popular Services': [
    { name: 'HairCut', price: 100, duration: '40 min', description: 'Cutting hairs after the shampoo' },
    { name: 'HairCut', price: 100, duration: '40 min', description: 'Cutting hairs after the shampoo' },
    { name: 'HairCut', price: 100, duration: '40 min', description: 'Cutting hairs after the shampoo' },
  ],
  'Male Grooming + Bread': [
    { name: 'HairCut', price: 100, duration: '40 min', description: 'Cutting hairs after the shampoo' },
    { name: 'HairCut', price: 100, duration: '40 min', description: 'Cutting hairs after the shampoo' },
  ],
  'Combos': [
    { name: 'HairCut', price: 100, duration: '40 min', description: 'Cutting hairs after the shampoo' },
    { name: 'HairCut', price: 100, duration: '40 min', description: 'Cutting hairs after the shampoo' },
    { name: 'HairCut', price: 100, duration: '40 min', description: 'Cutting hairs after the shampoo' },
  ],
};

export default function ServiceBooking() {
  const [cart, setCart] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const addToCart = (service) => {
    setCart([...cart, service]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, service) => total + service.price, 0);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Typography variant="h4" gutterBottom>
            Expert Services <Typography variant="caption">see all</Typography>
          </Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              select
              fullWidth
              variant="outlined"
              label="All Providers"
              SelectProps={{
                native: true,
              }}
            >
              <option>All Providers</option>
            </TextField>
          </Box>
          {Object.entries(services).map(([category, categoryServices]) => (
            <Accordion key={category} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{category}</Typography>
                <Typography variant="caption" sx={{ ml: 1 }}>
                  {categoryServices.length} services
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {categoryServices.map((service, index) => (
                    <ListItem key={index} alignItems="flex-start">
                      <ListItemText
                        primary={service.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              ₹{service.price}
                            </Typography>
                            {` — ${service.description}`}
                            <br />
                            {service.duration}
                          </>
                        }
                      />
                      <Button variant="outlined" onClick={() => addToCart(service)}>
                        ADD
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Your Cart
            </Typography>
            <List>
              {cart.map((service, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={service.name}
                    secondary={`${service.duration}`}
                  />
                  <Typography>₹{service.price}</Typography>
                  <CheckCircleIcon color="primary" sx={{ ml: 1 }} />
                </ListItem>
              ))}
            </List>
            <TextField
              fullWidth
              variant="outlined"
              label="Enter Coupon Code"
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" fullWidth>
              APPLY
            </Button>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Bill Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>Total Service</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{calculateTotal()}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Discount</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">- ₹0</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Platform Fee</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹3</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6">To Pay</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" align="right">
                  ₹{calculateTotal() + 3}
                </Typography>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
            >
              BOOK NOW
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
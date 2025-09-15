import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Avatar, 
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Chip,
  Rating,
  Button,
  Modal,
  TextField,
  Backdrop,
  Fade,
  Divider
} from '@mui/material';
import { 
  Edit as EditIcon, 
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon
} from '@mui/icons-material';
import { useAuth } from '../../Context/AuthContext';

// Import images from assets
import beautyImage1 from '../../assets/images/Overview_Images/beautyImage1.webp';
import beautyImage2 from '../../assets/images/Overview_Images/beautyImage2.jpeg';
import beautyImage3 from '../../assets/images/Overview_Images/beautyImage3.jpeg';
import product1 from '../../assets/images/Overview_Images/product1.png';
import product2 from '../../assets/images/Overview_Images/product2.jpeg';

// Dummy data for favorite services
const favoriteServices = [
  {
    id: 1,
    name: "Hair Cut & Styling",
    salon: "Elite Beauty Salon",
    price: "$45",
    rating: 4.8,
    image: beautyImage1,
    duration: "45 min"
  },
  {
    id: 2,
    name: "Deep Cleansing Facial",
    salon: "Glow Spa",
    price: "$80",
    rating: 4.9,
    image: beautyImage2,
    duration: "60 min"
  },
  {
    id: 3,
    name: "Manicure & Pedicure",
    salon: "Nail Paradise",
    price: "$35",
    rating: 4.7,
    image: beautyImage3,
    duration: "90 min"
  },
  {
    id: 4,
    name: "Full Body Massage",
    salon: "Relax Center",
    price: "$120",
    rating: 4.9,
    image: product1,
    duration: "90 min"
  },
  {
    id: 5,
    name: "Eyebrow Threading",
    salon: "Beauty Hub",
    price: "$15",
    rating: 4.6,
    image: product2,
    duration: "20 min"
  }
];

// Dummy appointments data
const appointmentsData = {
  upcoming: [
    {
      id: 1,
      service: "Hair Cut & Styling",
      salon: "Elite Beauty Salon",
      date: "Dec 15, 2024",
      time: "2:00 PM",
      status: "Confirmed",
      price: "$45"
    },
    {
      id: 2,
      service: "Deep Cleansing Facial",
      salon: "Glow Spa",
      date: "Dec 18, 2024",
      time: "11:00 AM",
      status: "Pending",
      price: "$80"
    },
    {
      id: 3,
      service: "Manicure & Pedicure",
      salon: "Nail Paradise",
      date: "Dec 22, 2024",
      time: "3:30 PM",
      status: "Confirmed",
      price: "$35"
    }
  ],
  ongoing: [
    {
      id: 4,
      service: "Full Body Massage",
      salon: "Relax Center",
      date: "Dec 10, 2024",
      time: "1:00 PM",
      status: "In Progress",
      price: "$120"
    }
  ]
};

const Profile = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAddressModalOpen, setEditAddressModalOpen] = useState(false);
  const [servicesScrollPosition, setServicesScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [formData, setFormData] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phoneNumber: "+91 987-6543-732"
  });
  const [addressData, setAddressData] = useState({
    street: "456 Beauty Lane",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90210"
  });

  // Initialize scroll button states
  useEffect(() => {
    const updateScrollButtons = () => {
      const container = document.getElementById('services-container');
      if (container) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const tolerance = 1; // Add small tolerance for floating point precision
        setCanScrollLeft(container.scrollLeft > tolerance);
        setCanScrollRight(container.scrollLeft < maxScroll - tolerance);
      }
    };

    // Initial check
    setTimeout(updateScrollButtons, 100);

    // Handle window resize
    window.addEventListener('resize', updateScrollButtons);
    
    return () => {
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditModalOpen = () => {
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleEditAddressModalOpen = () => {
    setEditAddressModalOpen(true);
  };

  const handleEditAddressModalClose = () => {
    setEditAddressModalOpen(false);
  };

  const handleFormChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleAddressChange = (field) => (event) => {
    setAddressData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSaveProfile = () => {
    // Here you would typically save the data to your backend
    setEditModalOpen(false);
    // You could also update the userData here if needed
  };

  const handleSaveAddress = () => {
    // Here you would typically save the address data to your backend
    setEditAddressModalOpen(false);
    // You could also update the userData.address here if needed
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Scroll functions for favorite services
  const scrollServices = (direction) => {
    const container = document.getElementById('services-container');
    if (!container) return;

    const scrollAmount = 300; // Amount to scroll in pixels
    const currentScroll = container.scrollLeft;
    const newScrollPosition = direction === 'left' 
      ? Math.max(0, currentScroll - scrollAmount)
      : currentScroll + scrollAmount;

    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });

    // Update scroll position state
    setServicesScrollPosition(newScrollPosition);

    // Update button states
    setTimeout(() => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const tolerance = 1; // Add small tolerance for floating point precision
      setCanScrollLeft(container.scrollLeft > tolerance);
      setCanScrollRight(container.scrollLeft < maxScroll - tolerance);
    }, 300);
  };

  const handleServicesScroll = (e) => {
    const container = e.target;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const tolerance = 1; // Add small tolerance for floating point precision
    setCanScrollLeft(container.scrollLeft > tolerance);
    setCanScrollRight(container.scrollLeft < maxScroll - tolerance);
  };

  // Default user data - always use dummy data for now
  const userData = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phoneNumber: "+1 (555) 987-6543",
    address: {
      street: "456 Beauty Lane",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210"
    }
  };

  const ServiceCard = ({ service }) => (
    <Card sx={{ 
      minWidth: 250, 
      maxWidth: 280, 
      mr: 2, 
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      '&:hover': {
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease'
      }
    }}>
      <CardMedia
        component="img"
        height="120"
        image={service.image}
        alt={service.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 1 }}>
          {service.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {service.salon}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={service.rating} precision={0.1} size="small" readOnly />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {service.rating}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="#1b4d69" sx={{ fontWeight: 600 }}>
            {service.price}
          </Typography>
          <Chip 
            icon={<TimeIcon sx={{ fontSize: 14 }} />}
            label={service.duration}
            size="small"
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );

  const AppointmentCard = ({ appointment }) => (
    <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {appointment.service}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {appointment.salon}
            </Typography>
          </Box>
          <Chip 
            label={appointment.status}
            color={
              appointment.status === 'Confirmed' ? 'success' : 
              appointment.status === 'In Progress' ? 'warning' : 'default'
            }
            size="small"
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="body2">{appointment.date}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TimeIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="body2">{appointment.time}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="#1b4d69" sx={{ fontWeight: 600 }}>
            {appointment.price}
          </Typography>
          <Button 
            variant="outlined" 
            size="small"
            sx={{ 
              borderColor: '#1b4d69', 
              color: '#1b4d69',
              '&:hover': {
                borderColor: '#1b4d69',
                backgroundColor: 'rgba(27, 77, 105, 0.04)'
              }
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 14, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, fontSize: { xs: '1.2rem', md: '1.5rem', lg: '1.6rem' } }}>
        My Profile
      </Typography>
      
      <Grid container spacing={4}>
        {/* Left Side - 4 columns */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* User Details Box */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, position: 'relative' }}>
              <IconButton 
                sx={{ position: 'absolute', top: 8, right: 8 }}
                size="small"
                onClick={handleEditModalOpen}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    background: 'linear-gradient(135deg, #1b4d69 0%, #2d6a8f 50%, #5a9bb8 100%)',
                    fontSize: '2rem',
                    fontWeight: 600,
                    mb: 2 
                  }}
                >
                  {getUserInitials(userData.name)}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {userData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userData.email}
                </Typography>
                {userData.phoneNumber && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {userData.phoneNumber}
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Address Box */}
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2, position: 'relative' }}>
              <IconButton 
                sx={{ position: 'absolute', top: 8, right: 8 }}
                size="small"
                onClick={handleEditAddressModalOpen}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon sx={{ color: '#1b4d69', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Address
                </Typography>
              </Box>
              {userData.address ? (
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {userData.address.street}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {userData.address.city}, {userData.address.state} {userData.address.zipCode}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No address provided
                </Typography>
              )}
            </Paper>
          </Box>
        </Grid>

        {/* Right Side - 8 columns */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Favorite Services Section */}
            <Box sx={{ borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FavoriteIcon sx={{ color: '#1b4d69', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Favorite Services
                  </Typography>
                </Box>
              </Box>
              
              {/* Services Container with Arrows positioned over the cards */}
              <Box sx={{ position: 'relative' }}>
                {/* Left Arrow - Positioned on top of the first card, only show when can scroll left */}
                {canScrollLeft && (
                  <IconButton
                    onClick={() => scrollServices('left')}
                    sx={{
                      display: { xs: 'none', sm: 'flex' },
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      backgroundColor: 'rgba(27, 77, 105, 0.9)',
                      color: 'white',
                      backdropFilter: 'blur(4px)',
                      '&:hover': {
                        backgroundColor: 'rgba(20, 64, 86, 0.9)',
                      },
                      width: 40,
                      height: 40,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    <ArrowBackIosIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                )}

                {/* Right Arrow - Positioned on top of the last visible card, only show when can scroll right */}
                {canScrollRight && (
                  <IconButton
                    onClick={() => scrollServices('right')}
                    sx={{
                      display: { xs: 'none', sm: 'flex' },
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      backgroundColor: 'rgba(27, 77, 105, 0.9)',
                      color: 'white',
                      backdropFilter: 'blur(4px)',
                      '&:hover': {
                        backgroundColor: 'rgba(20, 64, 86, 0.9)',
                      },
                      width: 40,
                      height: 40,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                )}

                <Box 
                  id="services-container"
                  onScroll={handleServicesScroll}
                  sx={{ 
                    display: 'flex', 
                    overflowX: 'auto', 
                    pb: 2,
                    // Hide scrollbar on screens > 600px, show on mobile
                    '&::-webkit-scrollbar': {
                      height: { xs: 8, sm: 0 },
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f1f1f1',
                      borderRadius: 4,
                      display: { xs: 'block', sm: 'none' }
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#c1c1c1',
                      borderRadius: 4,
                      display: { xs: 'block', sm: 'none' }
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: '#a8a8a8',
                    },
                    // For Firefox
                    scrollbarWidth: { xs: 'thin', sm: 'none' },
                    scrollbarColor: { xs: '#c1c1c1 #f1f1f1', sm: 'transparent' }
                  }}
                >
                  {favoriteServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Appointments Section */}
            <Box elevation={2} sx={{ borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                My Appointments
              </Typography>
              
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                sx={{ 
                  mb: 3, 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  '& .MuiTab-root': {
                    color: 'text.secondary',
                    textTransform: 'none',
                    minHeight: 48,
                    '&.Mui-selected': {
                      color: '#1b4d69'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#1b4d69'
                  }
                }}
              >
                <Tab 
                  label={
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      width: '100%',
                      minWidth: 120
                    }}>
                      <Typography variant="body2">Upcoming</Typography>
                      <Box sx={{
                        backgroundColor: '#1b4d69',
                        color: 'white',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {appointmentsData.upcoming.length}
                      </Box>
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      width: '100%',
                      minWidth: 120
                    }}>
                      <Typography variant="body2">Ongoing</Typography>
                      <Box sx={{
                        backgroundColor: '#1b4d69',
                        color: 'white',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {appointmentsData.ongoing.length}
                      </Box>
                    </Box>
                  } 
                />
              </Tabs>

              <Box sx={{ mt: 2 }}>
                {tabValue === 0 && (
                  <Box>
                    {appointmentsData.upcoming.length > 0 ? (
                      appointmentsData.upcoming.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No upcoming appointments
                      </Typography>
                    )}
                  </Box>
                )}
                
                {tabValue === 1 && (
                  <Box>
                    {appointmentsData.ongoing.length > 0 ? (
                      appointmentsData.ongoing.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No ongoing appointments
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Edit Profile Modal */}
      <Modal
        open={editModalOpen}
        onClose={handleEditModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={editModalOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '85%', md: 500, lg: 550 },
            maxWidth: '600px',
            bgcolor: 'background.paper',
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            p: 0,
            outline: 'none'
          }}>
            {/* Modal Header */}
            <Box sx={{ 
              p: { xs: 1.5, sm: 2, md: 2.5 }, 
              borderBottom: '1px solid', 
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.3rem' }
                }}
              >
                Edit Profile
              </Typography>
              <IconButton 
                onClick={handleEditModalClose}
                size="small"
                sx={{ 
                  color: 'text.secondary',
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
                }}
              >
                <CloseIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </IconButton>
            </Box>

            {/* Modal Content */}
            <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 } }}>
              {/* Profile Picture Section */}
              <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: { xs: 1.5, sm: 2 }, 
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.125rem' }
                  }}
                >
                  Profile Picture
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar 
                    sx={{ 
                      width: { xs: 70, sm: 80, md: 90 }, 
                      height: { xs: 70, sm: 80, md: 90 }, 
                      background: 'linear-gradient(135deg, #1b4d69 0%, #2d6a8f 50%, #5a9bb8 100%)',
                      fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                      fontWeight: 600,
                      mx: 'auto'
                    }}
                  >
                    {getUserInitials(formData.name)}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: { xs: -3, sm: -5 },
                      right: { xs: -3, sm: -5 },
                      bgcolor: '#1b4d69',
                      color: 'white',
                      width: { xs: 28, sm: 32, md: 35 },
                      height: { xs: 28, sm: 32, md: 35 },
                      '&:hover': {
                        bgcolor: '#2d6a8f'
                      }
                    }}
                    size="small"
                  >
                    <PhotoCameraIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }} />
                  </IconButton>
                </Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mt: 1,
                    fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.875rem' },
                    px: { xs: 1, sm: 0 }
                  }}
                >
                  Click the camera icon to change picture
                </Typography>
              </Box>

              <Divider sx={{ mb: { xs: 2.5, sm: 3 } }} />

              {/* Form Fields */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  value={formData.name}
                  onChange={handleFormChange('name')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1b4d69',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: '#1b4d69',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: { xs: '12px 14px', sm: '16.5px 14px' }
                    }
                  }}
                />

                <TextField
                  label="Email Address"
                  variant="outlined"
                  fullWidth
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange('email')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1b4d69',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: '#1b4d69',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: { xs: '12px 14px', sm: '16.5px 14px' }
                    }
                  }}
                />

                <TextField
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  value={formData.phoneNumber}
                  onChange={handleFormChange('phoneNumber')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1b4d69',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: '#1b4d69',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: { xs: '12px 14px', sm: '16.5px 14px' }
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Modal Footer */}
            <Box sx={{ 
              p: { xs: 2, sm: 3, md: 3.5 }, 
              borderTop: '1px solid', 
              borderColor: 'divider',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'flex-end',
              gap: { xs: 1.5, sm: 2 }
            }}>
              <Button 
                variant="outlined" 
                onClick={handleEditModalClose}
                fullWidth={true}
                sx={{
                  borderColor: 'text.secondary',
                  color: 'text.secondary',
                  fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.875rem' },
                  padding: { xs: '10px 16px', sm: '8px 16px' },
                  minWidth: { sm: 'auto' },
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    borderColor: 'text.primary',
                    bgcolor: 'rgba(0,0,0,0.02)'
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSaveProfile}
                fullWidth={true}
                sx={{
                  bgcolor: '#1b4d69',
                  fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.875rem' },
                  padding: { xs: '10px 16px', sm: '8px 16px' },
                  minWidth: { sm: 'auto' },
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    bgcolor: '#2d6a8f'
                  }
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Edit Address Modal */}
      <Modal
        open={editAddressModalOpen}
        onClose={handleEditAddressModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={editAddressModalOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '85%', md: 500, lg: 550 },
            maxWidth: '600px',
            bgcolor: 'background.paper',
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            p: 0,
            outline: 'none'
          }}>
            {/* Modal Header */}
            <Box sx={{ 
              p: { xs: 1.5, sm: 2, md: 2.5 }, 
              borderBottom: '1px solid', 
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ 
                  color: '#1b4d69', 
                  mr: { xs: 0.8, sm: 1 },
                  fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.5rem' }
                }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.3rem' }
                  }}
                >
                  Edit Address
                </Typography>
              </Box>
              <IconButton 
                onClick={handleEditAddressModalClose}
                size="small"
                sx={{ 
                  color: 'text.secondary',
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
                }}
              >
                <CloseIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </IconButton>
            </Box>

            {/* Modal Content */}
            <Box sx={{ p: { xs: 2, sm: 3, md: 3.5 } }}>
              {/* Form Fields */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
                <TextField
                  label="Street Address"
                  variant="outlined"
                  fullWidth
                  value={addressData.street}
                  onChange={handleAddressChange('street')}
                  placeholder="Enter your street address"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1b4d69',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: '#1b4d69',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: { xs: '12px 14px', sm: '16.5px 14px' }
                    }
                  }}
                />

                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2.5, sm: 2 }
                }}>
                  <TextField
                    label="City"
                    variant="outlined"
                    fullWidth
                    value={addressData.city}
                    onChange={handleAddressChange('city')}
                    placeholder="City"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1b4d69',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        '&.Mui-focused': {
                          color: '#1b4d69',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: { xs: '12px 14px', sm: '16.5px 14px' }
                      }
                    }}
                  />

                  <TextField
                    label="State"
                    variant="outlined"
                    value={addressData.state}
                    onChange={handleAddressChange('state')}
                    placeholder="State"
                    sx={{
                      width: { xs: '100%', sm: '30%' },
                      '& .MuiOutlinedInput-root': {
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1b4d69',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        '&.Mui-focused': {
                          color: '#1b4d69',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: { xs: '12px 14px', sm: '16.5px 14px' }
                      }
                    }}
                  />
                </Box>

                <TextField
                  label="ZIP Code"
                  variant="outlined"
                  value={addressData.zipCode}
                  onChange={handleAddressChange('zipCode')}
                  placeholder="ZIP Code"
                  sx={{
                    width: { xs: '100%', sm: '60%', md: '50%' },
                    '& .MuiOutlinedInput-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1b4d69',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      '&.Mui-focused': {
                        color: '#1b4d69',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: { xs: '12px 14px', sm: '16.5px 14px' }
                    }
                  }}
                />
              </Box>

              {/* Address Preview */}
              <Box sx={{ 
                mt: { xs: 3, sm: 4 }, 
                p: { xs: 1.5, sm: 2 }, 
                bgcolor: 'rgba(27, 77, 105, 0.05)', 
                borderRadius: { xs: 1.5, sm: 2 }, 
                border: '1px solid rgba(27, 77, 105, 0.1)' 
              }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: { xs: 0.8, sm: 1 }, 
                    color: '#1b4d69',
                    fontSize: { xs: '0.9rem', sm: '0.95rem', md: '0.875rem' }
                  }}
                >
                  Address Preview:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 0.5,
                    fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.875rem' }
                  }}
                >
                  {addressData.street || 'Street Address'}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.875rem' }
                  }}
                >
                  {addressData.city || 'City'}, {addressData.state || 'State'} {addressData.zipCode || 'ZIP'}
                </Typography>
              </Box>
            </Box>

            {/* Modal Footer */}
            <Box sx={{ 
              p: { xs: 2, sm: 3, md: 3.5 }, 
              borderTop: '1px solid', 
              borderColor: 'divider',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'flex-end',
              gap: { xs: 1.5, sm: 2 }
            }}>
              <Button 
                variant="outlined" 
                onClick={handleEditAddressModalClose}
                fullWidth={true}
                sx={{
                  borderColor: 'text.secondary',
                  color: 'text.secondary',
                  fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.875rem' },
                  padding: { xs: '10px 16px', sm: '8px 16px' },
                  minWidth: { sm: 'auto' },
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    borderColor: 'text.primary',
                    bgcolor: 'rgba(0,0,0,0.02)'
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSaveAddress}
                fullWidth={true}
                sx={{
                  bgcolor: '#1b4d69',
                  fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.875rem' },
                  padding: { xs: '10px 16px', sm: '8px 16px' },
                  minWidth: { sm: 'auto' },
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    bgcolor: '#2d6a8f'
                  }
                }}
              >
                Save Address
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default Profile;

import React, { useEffect, useState } from 'react';
import { Switch, Divider, } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Map, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Box, Button, Container, Grid, Radio, Dialog, FormControlLabel, DialogActions, Slider, RadioGroup, DialogTitle, DialogContent, Stack, Typography, Chip } from '@mui/material';
import SearchField from '../../components/searchField';
import CustomButton from '../../components/customButton';
import { fetchFilteredBusinesses } from '../../Services/overview/api/filterBusinesses.api';
import { fetchNavigationPopularServices } from '../../Services/overview/api/navigationPopularServices.api';



const Navigation = React.memo(({ onDataChange, setBuisnessType, setIsLoading, searchData, showMap, setShowMap }) => {
    const [location, setLocation] = useState(searchData?.location || '');
    const [date, setDate] = useState(searchData?.date || '');
    const [time, setTime] = useState(searchData?.time || '');
    const [selectedDateData, setSelectedDateData] = useState(searchData?.selectedDateData || null);
    const [serviceName, setServiceName] = useState(searchData?.serviceName || '');
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(searchData?.category);
    const [loading, setLoading] = useState(false);
    const [showSortByOptions, setShowSortByOptions] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [popularServices, setPopularServices] = useState([]);



    const customTheme = createTheme({
        palette: {
            primary: {
                main: '#1b4d69',
            },
        },
    });

    useEffect(() => {
        if (selectedCategory) {
            setBuisnessType(selectedCategory);
            updateSearchResult();
        }
    }, [selectedCategory])

    // Update local state when searchData changes
    useEffect(() => {
        if (searchData) {
            setLocation(searchData?.location || '');
            setDate(searchData?.date || '');
            setTime(searchData?.time || '');
            setSelectedDateData(searchData?.selectedDateData || null);
            setServiceName(searchData?.serviceName || '');
            setSelectedCategory(searchData?.category);
        }
    }, [searchData])



    const category = [
        "Beauty",
        "Wellness",
        "Fitness",
        "Health"
    ]

    const handleOpenFilterDialog = () => {
        setShowFilterDropdown(true);
        // Scroll down slightly to create full visibility of the dropdown
        setTimeout(() => {
            const filterButton = document.querySelector('[data-filter-button]');
            if (filterButton) {
                const rect = filterButton.getBoundingClientRect();
                const currentScrollY = window.scrollY;
                
                // Calculate how much space we need for the dropdown (estimated height)
                const dropdownHeight = window.innerWidth < 600 ? 400 : 500; // Mobile vs desktop
                const viewportHeight = window.innerHeight;
                const spaceBelow = viewportHeight - rect.bottom;
                
                // If there's not enough space below, scroll down
                if (spaceBelow < dropdownHeight) {
                    const scrollAmount = dropdownHeight - spaceBelow + 50; // Extra 50px padding
                    
                    window.scrollTo({
                        top: currentScrollY + scrollAmount,
                        behavior: 'smooth'
                    });
                }
            }
        }, 150);
    };
    const handleCloseFilterDialog = () => {
        setShowFilterDropdown(false);
        setOpenFilterDialog(false);
    };



    const [filters, setFilters] = useState({
        serviceType: [],
        genderPreference: 'everyone',
        priceRange: [0, 10000],
        availability: [],
        additionalFilters: {
            instantBooking: false,
            specialOffers: false,
            highlyRated: false,
        },
        sortBy: 'recommended',
    });

    // Handle chip selection for service type
    const handleServiceTypeChange = (service) => {
        setFilters((prev) => {
            const newServiceType = prev.serviceType.includes(service)
                ? prev.serviceType.filter((item) => item !== service)
                : [...prev.serviceType, service];
            return { ...prev, serviceType: newServiceType };
        });
    };

    // Handle gender preference change
    const handleGenderPreferenceChange = (event) => {
        setFilters((prev) => ({ ...prev, genderPreference: event.target.value }));
    };

    // Handle price range change
    const handlePriceRangeChange = (event, newValue) => {
        setFilters((prev) => ({ ...prev, priceRange: newValue }));
    };

    // Handle availability selection
    const handleAvailabilityChange = (availability) => {
        setFilters((prev) => {
            const newAvailability = prev.availability.includes(availability)
                ? prev.availability.filter((item) => item !== availability)
                : [...prev.availability, availability];
            return { ...prev, availability: newAvailability };
        });
    };

    // Handle additional filter change (switches)
    const handleAdditionalFilterChange = (event) => {
        setFilters((prev) => ({
            ...prev,
            additionalFilters: {
                ...prev.additionalFilters,
                [event.target.name]: event.target.checked,
            },
        }));
    };

    // Handle sort option change
    const handleSortByChange = (event) => {
        setFilters((prev) => ({ ...prev, sortBy: event.target.value }));
    };

    // Handle the filter apply
    const handleApplyFilter = () => {

        onDataChange(filters);
        handleCloseFilterDialog();
    };

    // Handle reset
    const handleResetFilters = () => {
        setFilters({
            serviceType: [],
            genderPreference: 'everyone',
            priceRange: [0, 10000],
            availability: [],
            additionalFilters: {
                instantBooking: false,
                specialOffers: false,
                highlyRated: false,
            },
            sortBy: 'recommended',
        });
        onDataChange({
            serviceType: [],
            genderPreference: 'everyone',
            priceRange: [0, 10000],
            availability: [],
            additionalFilters: {
                instantBooking: false,
                specialOffers: false,
                highlyRated: false,
            },
            sortBy: 'recommended',
        });
        handleCloseFilterDialog();
    };


    const updateSearchResult = async () => {
        setLoading(true)
        setIsLoading(true)
        
        try {
            const businesses = await fetchFilteredBusinesses({
                serviceName,
                location,
                businessType: selectedCategory,
                date,
                time,
                timeSlot: selectedDateData?.slot,
                startTime: selectedDateData?.startTime,
                endTime: selectedDateData?.endTime
            });
            onDataChange(businesses);
            setBuisnessType(selectedCategory)
        } catch (err) {
            console.error('Error fetching filtered businesses:', err);
        } finally {
            setIsLoading(false)
            setLoading(false)
        }
    }

    const loadPopularServices = async () => {
        try {
            const services = await fetchNavigationPopularServices({
                maxDistanceKm: 15,
                limit: 5,
                minPrice: 50,
                sortBy: 'Price',
                userLatitude: 28.466296,
                userLongitude: 77.011864,
                newBusinesses: true
            });
            setPopularServices(services);
        } catch (err) {
            console.error('Error loading popular services:', err);
        }
    }

    useEffect(() => {
        loadPopularServices();
    }, [])


    return (
        <Box
            sx={{
                position: 'relative',
                pt: 18,
                // mt:14
            }}
        >
            <Box sx={{
                background: 'linear-gradient(to bottom, #467d9b, #002c5c)',
                position: 'absolute',
                height: '19rem',
                width: '100%',
                zIndex: -1,
                top: 0

            }} />
            <Container maxWidth="lg">
                <Box sx={{ bgcolor: 'white', borderRadius: 5, boxShadow: 3, p: 2 }}>

                    <SearchField 
                        serviceName={serviceName} 
                        setServiceName={setServiceName} 
                        location={location} 
                        setLocation={setLocation} 
                        handleFetchData={updateSearchResult} 
                        loading={loading}
                        initialDate={date}
                        initialTime={time}
                        initialSelectedDateData={selectedDateData}
                    />

                    {/* Category Selection */}
                    <Box mt={2} mb={2} display={'flex'} gap={1} flexWrap={'wrap'}>
                        {category.map((item, index) => (
                            <Chip
                                key={index}
                                label={item}
                                onClick={() => setSelectedCategory(item)}
                                variant={selectedCategory === item ? 'filled' : 'outlined'}
                                color={selectedCategory === item ? 'primary' : 'default'}
                                sx={{
                                    fontWeight: selectedCategory === item ? 600 : 500,
                                    backgroundColor: selectedCategory === item ? '#1b4d69' : 'transparent',
                                    borderColor: selectedCategory === item ? '#1b4d69' : '#d1d5db',
                                    color: selectedCategory === item ? 'white' : '#4b5563',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: selectedCategory === item ? '#164a5a' : '#f3f4f6'
                                    }
                                }}
                            />
                        ))}
                    </Box>

                    {/* Popular Services Section */}
                    {popularServices && popularServices.length > 0 && (
                        <Box mt={2} mb={2}>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    fontWeight: 600, 
                                    color: '#4b5563',
                                    mb: 1.5,
                                    fontSize: '0.9rem'
                                }}
                            >
                                Popular Services
                            </Typography>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {popularServices.map((service, index) => {
                                    const { Service } = service;
                                    return (
                                        <Chip
                                            key={service._id || index}
                                            label={Service?.Name}
                                            variant="outlined"
                                            icon={<Search size="14px" style={{ color: '#1b4d69' }} />}
                                            onClick={() => setServiceName(Service?.Name)}
                                            sx={{
                                                borderRadius: '16px',
                                                borderColor: '#d1d5db',
                                                color: '#4b5563',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: '#f3f4f6',
                                                    borderColor: '#1b4d69'
                                                }
                                            }}
                                        />
                                    )
                                })}
                            </Box>
                        </Box>
                    )}
                    <Box sx={{ mt: '20px' }}>
                        <Grid container spacing={1} alignItems="center">

                            {/* Map View Button */}
                            <Grid item xs={12} sm="auto">
                                <CustomButton
                                    onClick={() => setShowMap(!showMap)}
                                    startIcon={<Map size="15px" style={{ color: '#1b4d69' }} />}
                                    sx={{
                                        width: { xs: '100%', sm: 'auto' },
                                        mb: { xs: 1, sm: 0 }
                                    }}
                                >
                                    {showMap ? 'Hide Map' : 'Map View'}
                                </CustomButton>
                            </Grid>

                            {/* Filter & Sort Buttons */}
                            <Grid item xs={12} sm>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        justifyContent: { xs: 'space-between', sm: 'flex-end' },
                                        flexWrap: 'nowrap'
                                    }}
                                >
                                    <Box sx={{ width: { xs: '48%', sm: 'auto' }, position: 'relative' }}>
                                        <CustomButton
                                            fullWidth
                                            startIcon={<SlidersHorizontal style={{ color: '#1b4d69' }} />}
                                            onClick={handleOpenFilterDialog}
                                            data-filter-button
                                        >
                                            Filters
                                        </CustomButton>
                                        
                                        {/* Filter Dropdown */}
                                        {showFilterDropdown && (
                                            <>
                                                {/* Invisible backdrop for click detection only */}
                                                <Box
                                                    sx={{
                                                        position: 'fixed',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        backgroundColor: 'transparent',
                                                        zIndex: 999,
                                                    }}
                                                    onClick={handleCloseFilterDialog}
                                                />
                                                
                                                {/* Filter Content - Responsive Design */}
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '100%',
                                                        right: 0,
                                                        mt: 1,
                                                        width: { 
                                                            xs: '280px', 
                                                            sm: '380px',
                                                            md: '420px'
                                                        },
                                                        maxHeight: { xs: '65vh', sm: '75vh' },
                                                        overflowY: 'auto',
                                                        backgroundColor: 'white',
                                                        borderRadius: { xs: '16px', sm: '20px' },
                                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                                        border: '1px solid #e5e7eb',
                                                        zIndex: 1000,
                                                        p: { xs: 1.5, sm: 2, md: 3 },
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {/* Header */}
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'space-between',
                                                        mb: { xs: 1.5, sm: 2 }
                                                    }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                                                            <SlidersHorizontal style={{ 
                                                                height: '16px', 
                                                                width: '16px', 
                                                                color: '#1b4d69' 
                                                            }} />
                                                            <Typography 
                                                                variant="h6" 
                                                                sx={{ 
                                                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                                                    fontWeight: 'bold',
                                                                    color: '#1b4d69'
                                                                }}
                                                            >
                                                                Filters
                                                            </Typography>
                                                        </Box>
                                                        <Button
                                                            size="small"
                                                            onClick={handleCloseFilterDialog}
                                                            sx={{ 
                                                                minWidth: 'auto',
                                                                p: { xs: 0.25, sm: 0.5 },
                                                                color: '#6b7280',
                                                                fontSize: { xs: '14px', sm: '16px' }
                                                            }}
                                                        >
                                                            ✕
                                                        </Button>
                                                    </Box>
                                                    <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

                                                    {/* Content Grid Layout */}
                                                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                                                        {/* Gender Preference */}
                                                        <Grid item xs={12} sm={6}>
                                                            <Box>
                                                                <Typography 
                                                                    variant="subtitle1" 
                                                                    sx={{ 
                                                                        fontSize: { xs: '0.85rem', sm: '1rem' }, 
                                                                        fontWeight: 'bold',
                                                                        color: '#374151',
                                                                        mb: { xs: 0.5, sm: 1 }
                                                                    }}
                                                                >
                                                                    Gender Preference
                                                                </Typography>
                                                                <RadioGroup 
                                                                    value={filters.genderPreference} 
                                                                    onChange={handleGenderPreferenceChange}
                                                                    sx={{ gap: { xs: 0.25, sm: 0.5 } }}
                                                                >
                                                                    {['everyone', 'male', 'female'].map((option) => (
                                                                        <FormControlLabel
                                                                            key={option}
                                                                            value={option}
                                                                            control={
                                                                                <Radio
                                                                                    size="small"
                                                                                    sx={{ 
                                                                                        padding: { xs: '4px', sm: '6px' },
                                                                                        '&.Mui-checked': {
                                                                                            color: '#1b4d69'
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            }
                                                                            label={option.charAt(0).toUpperCase() + option.slice(1)}
                                                                            sx={{
                                                                                '& .MuiFormControlLabel-label': { 
                                                                                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                                                                    color: '#4b5563'
                                                                                },
                                                                                margin: 0
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </RadioGroup>
                                                            </Box>
                                                        </Grid>

                                                        {/* Price Range */}
                                                        <Grid item xs={12} sm={6}>
                                                            <Box>
                                                                <Typography 
                                                                    variant="subtitle1" 
                                                                    sx={{ 
                                                                        fontSize: { xs: '0.85rem', sm: '1rem' }, 
                                                                        fontWeight: 'bold',
                                                                        color: '#374151',
                                                                        mb: { xs: 1, sm: 2 }
                                                                    }}
                                                                >
                                                                    Price Range
                                                                </Typography>
                                                                <Slider
                                                                    value={filters.priceRange}
                                                                    onChange={handlePriceRangeChange}
                                                                    valueLabelDisplay="auto"
                                                                    valueLabelFormat={(value) => `₹${value}`}
                                                                    max={10000}
                                                                    step={100}
                                                                    marks={[
                                                                        { value: 0, label: '₹0' },
                                                                        { value: 10000, label: '₹10K' },
                                                                    ]}
                                                                    sx={{
                                                                        color: '#1b4d69',
                                                                        '& .MuiSlider-markLabel': { 
                                                                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                                                            color: '#6b7280'
                                                                        },
                                                                        '& .MuiSlider-valueLabel': { 
                                                                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                                                            backgroundColor: '#1b4d69'
                                                                        },
                                                                        '& .MuiSlider-thumb': { 
                                                                            width: { xs: 16, sm: 18 }, 
                                                                            height: { xs: 16, sm: 18 },
                                                                            backgroundColor: '#1b4d69'
                                                                        },
                                                                        '& .MuiSlider-track': { 
                                                                            height: { xs: 4, sm: 6 },
                                                                            backgroundColor: '#1b4d69'
                                                                        },
                                                                        '& .MuiSlider-rail': { 
                                                                            height: { xs: 4, sm: 6 },
                                                                            backgroundColor: '#e5e7eb'
                                                                        }
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Grid>

                                                        {/* Availability */}
                                                        <Grid item xs={12}>
                                                            <Box>
                                                                <Typography 
                                                                    variant="subtitle1" 
                                                                    sx={{ 
                                                                        fontSize: { xs: '0.85rem', sm: '1rem' }, 
                                                                        fontWeight: 'bold',
                                                                        color: '#374151',
                                                                        mb: { xs: 1, sm: 1.5 }
                                                                    }}
                                                                >
                                                                    Availability
                                                                </Typography>
                                                                <Box sx={{ 
                                                                    display: 'flex', 
                                                                    flexWrap: 'wrap', 
                                                                    gap: { xs: 0.5, sm: 1 }
                                                                }}>
                                                                    {['Today', 'Tomorrow', 'This Week', 'Next Week'].map((time) => (
                                                                        <Chip
                                                                            key={time}
                                                                            label={time}
                                                                            clickable
                                                                            variant={filters.availability.includes(time) ? 'filled' : 'outlined'}
                                                                            color={filters.availability.includes(time) ? 'primary' : 'default'}
                                                                            onClick={() => handleAvailabilityChange(time)}
                                                                            sx={{
                                                                                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                                                                fontWeight: '500',
                                                                                height: { xs: '28px', sm: '32px' },
                                                                                borderRadius: { xs: '14px', sm: '16px' },
                                                                                px: { xs: 1, sm: 1.5 },
                                                                                '&.MuiChip-colorPrimary': {
                                                                                    backgroundColor: '#1b4d69',
                                                                                    color: 'white'
                                                                                },
                                                                                '&:hover': {
                                                                                    backgroundColor: filters.availability.includes(time) ? '#164a5a' : '#f3f4f6'
                                                                                }
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </Box>
                                                            </Box>
                                                        </Grid>

                                                        {/* Additional Filters */}
                                                        <Grid item xs={12}>
                                                            <Box>
                                                                <Typography 
                                                                    variant="subtitle1" 
                                                                    sx={{ 
                                                                        fontSize: { xs: '0.85rem', sm: '1rem' }, 
                                                                        fontWeight: 'bold',
                                                                        color: '#374151',
                                                                        mb: { xs: 1, sm: 1.5 }
                                                                    }}
                                                                >
                                                                    Additional Filters
                                                                </Typography>
                                                                <Grid container spacing={{ xs: 0.5, sm: 1 }}>
                                                                    {[
                                                                        { label: 'Instant Booking', id: 'instantBooking' },
                                                                        { label: 'Special Offers', id: 'specialOffers' },
                                                                        { label: 'Highly Rated (4.5+)', id: 'highlyRated' },
                                                                    ].map((filter) => (
                                                                        <Grid item xs={12} sm={6} key={filter.id}>
                                                                            <FormControlLabel
                                                                                control={
                                                                                    <Switch
                                                                                        checked={filters.additionalFilters[filter.id]}
                                                                                        onChange={handleAdditionalFilterChange}
                                                                                        name={filter.id}
                                                                                        size="small"
                                                                                        sx={{
                                                                                            transform: { xs: 'scale(0.8)', sm: 'scale(1)' },
                                                                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                                                                color: '#1b4d69',
                                                                                                '& + .MuiSwitch-track': {
                                                                                                    backgroundColor: '#1b4d69',
                                                                                                },
                                                                                            },
                                                                                        }}
                                                                                    />
                                                                                }
                                                                                label={filter.label}
                                                                                sx={{
                                                                                    '& .MuiFormControlLabel-label': {
                                                                                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                                                                        color: '#4b5563',
                                                                                        fontWeight: '500'
                                                                                    },
                                                                                    margin: 0,
                                                                                }}
                                                                            />
                                                                        </Grid>
                                                                    ))}
                                                                </Grid>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>

                                                    {/* Action Buttons */}
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        gap: { xs: 1, sm: 2 }, 
                                                        justifyContent: 'flex-end', 
                                                        pt: { xs: 2, sm: 3 },
                                                        mt: { xs: 1.5, sm: 2 },
                                                        borderTop: '1px solid #e5e7eb'
                                                    }}>
                                                        <Button
                                                            variant="outlined"
                                                            onClick={handleResetFilters}
                                                            sx={{
                                                                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                                                fontWeight: 600,
                                                                borderRadius: { xs: '10px', sm: '12px' },
                                                                borderColor: '#d1d5db',
                                                                color: '#6b7280',
                                                                px: { xs: 2, sm: 3 },
                                                                py: { xs: 0.5, sm: 1 },
                                                                minHeight: { xs: '32px', sm: '36px' },
                                                                '&:hover': {
                                                                    borderColor: '#9ca3af',
                                                                    backgroundColor: '#f9fafb'
                                                                }
                                                            }}
                                                        >
                                                            Reset All
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            onClick={handleApplyFilter}
                                                            sx={{
                                                                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                                                fontWeight: 600,
                                                                borderRadius: { xs: '10px', sm: '12px' },
                                                                backgroundColor: '#1b4d69',
                                                                px: { xs: 2, sm: 3 },
                                                                py: { xs: 0.5, sm: 1 },
                                                                minHeight: { xs: '32px', sm: '36px' },
                                                                '&:hover': {
                                                                    backgroundColor: '#164a5a'
                                                                }
                                                            }}
                                                        >
                                                            Apply Filters
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </>
                                        )}
                                    </Box>

                                    <>
                                        <Box sx={{ position: 'relative', width: { xs: '48%', sm: 'auto' } }}>
                                            <CustomButton
                                                fullWidth
                                                startIcon={<ArrowUpDown size="15px" style={{ color: '#1b4d69' }} />}
                                                onClick={() => setShowSortByOptions(prev => !prev)}
                                            >
                                                Sort By
                                            </CustomButton>
                                            {showSortByOptions && (
                                                <>
                                                    {/* Invisible backdrop for Sort By */}
                                                    <Box
                                                        sx={{
                                                            position: 'fixed',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            backgroundColor: 'transparent',
                                                            zIndex: 999,
                                                        }}
                                                        onClick={() => setShowSortByOptions(false)}
                                                    />
                                                    
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '100%',
                                                            right: 0,
                                                            mt: 1,
                                                            background: 'white',
                                                            padding: '16px',
                                                            borderRadius: '16px',
                                                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                                                            border: '1px solid #e5e7eb',
                                                            zIndex: 1000,
                                                            minWidth: '220px'
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{ 
                                                                fontSize: '1rem', 
                                                                fontWeight: 'bold',
                                                                color: '#1b4d69',
                                                                mb: 1
                                                            }}
                                                        >
                                                            Sort By
                                                        </Typography>
                                                        <RadioGroup value={filters.sortBy} onChange={handleSortByChange}>
                                                            {[
                                                                { value: 'recommended', label: 'Recommended' },
                                                                { value: 'topRated', label: 'Top Rated' },
                                                                { value: 'nearest', label: 'Nearest to Me' },
                                                                { value: 'priceAsc', label: 'Price: Low to High' },
                                                                { value: 'priceDesc', label: 'Price: High to Low' },
                                                            ].map((option) => (
                                                                <FormControlLabel
                                                                    key={option.value}
                                                                    value={option.value}
                                                                    control={
                                                                        <Radio 
                                                                            size="small" 
                                                                            sx={{
                                                                                '&.Mui-checked': {
                                                                                    color: '#1b4d69'
                                                                                }
                                                                            }}
                                                                        />
                                                                    }
                                                                    label={
                                                                        <span style={{ 
                                                                            fontSize: '0.9rem',
                                                                            color: '#4b5563'
                                                                        }}>
                                                                            {option.label}
                                                                        </span>
                                                                    }
                                                                    sx={{ margin: '2px 0' }}
                                                                />
                                                            ))}
                                                        </RadioGroup>
                                                    </Box>
                                                </>
                                            )}
                                        </Box>
                                    </>
                                </Stack>
                            </Grid>

                        </Grid>
                    </Box>


                </Box>
            </Container>


            <ThemeProvider theme={customTheme} >
                {/* Keep the original dialog hidden as we now use dropdown */}
                <Dialog 
                    open={false} 
                    onClose={handleCloseFilterDialog} 
                    fullWidth 
                    maxWidth="xs" 
                    PaperProps={{ sx: { borderRadius: '20px', display: 'none' } }} 
                >
                    {/* Dialog content removed as we're using dropdown now */}
                </Dialog>
            </ThemeProvider>
        </Box >
    );
});

export default Navigation;

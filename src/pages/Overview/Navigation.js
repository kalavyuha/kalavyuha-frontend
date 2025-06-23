import React, { useEffect, useState } from 'react';
import { Switch, Divider, } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Map, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Box, Button, Container, Grid, Radio, Dialog, FormControlLabel, DialogActions, Slider, RadioGroup, DialogTitle, DialogContent, Stack, Typography, Chip } from '@mui/material';
import { apiget } from '../service/api';
import SearchField from '../../components/searchField';
import CustomButton from '../../components/customButton';



const Navigation = React.memo(({ onDataChange, setBuisnessType, setIsLoading, searchData, showMap, setShowMap }) => {
    const [location, setLocation] = useState(searchData?.location || '');
    const [date, setDate] = useState('21-Nov-2023');
    const [serviceName, setServiceName] = useState(searchData?.serviceName || '');
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(searchData?.category);
    const [loading, setLoading] = useState(false);
    const [showSortByOptions, setShowSortByOptions] = useState(false);
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



    const category = [
        "Beauty",
        "Wellness",
        "Fitness"
    ]

    const handleOpenFilterDialog = () => setOpenFilterDialog(true);
    const handleCloseFilterDialog = () => setOpenFilterDialog(false);



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
        handleCloseFilterDialog();
    };


    const updateSearchResult = async () => {
        setLoading(true)
        setIsLoading(true)
        const result = await apiget(`api/v1/BussinessDetails/filter/?ServiceName=${serviceName}&Location=${location}&BussinessType=${selectedCategory}`);
        if (result && result.status === 200) {
            onDataChange(result?.data?.Data);
            setBuisnessType(selectedCategory)
            console.log(result?.data?.Data)
        }
        setIsLoading(false)
        setLoading(false)
    }

    const fetchPopularServices = async () => {
        try {
            const result = await apiget(`api/v1/Service/popularServices/?max_distance_km=15&limit=5&MinPrice=50&SortBy=Price&user_latitude=28.466296&user_longitude=77.011864&new_businesses=true`);
            if (result && result.data?.Status === 200) {
                setPopularServices(result?.data?.Data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchPopularServices();
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

                    <SearchField serviceName={serviceName} setServiceName={setServiceName} location={location} setLocation={setLocation} handleFetchData={updateSearchResult} loading={loading} />

                    {/* need to remove  */}
                    <Box mt={1} display={'flex'} gap={1} flexWrap={'wrap'}>
                        {category.map((item, index) => (
                            <Typography
                                key={index}
                                variant="body2"
                                onClick={() => setSelectedCategory(item)}
                                sx={{
                                    background: selectedCategory === item ? '#164a5a' : '#f1f1f1',
                                    color: selectedCategory === item ? '#f1f1f1' : '#164a5a',
                                    width: 'max-content',
                                    padding: '2px 12px',
                                    borderRadius: '15px',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s, color 0.3s'
                                }}
                            >
                                {item}
                            </Typography>
                        ))}
                    </Box>

                    {/* Popular Services Section */}
                    <Box mt={2}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold", mb: 1 }}>
                            Popular Services
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {popularServices && popularServices.map((service, index) => {
                                const { Service } = service;
                                return (
                                    <Chip
                                        key={index}
                                        label={Service?.Name}
                                        variant="outlined"
                                        icon={<Search size="15px" style={{ color: '#1b4d69', paddingRight: "2px" }} />}
                                        onClick={() => setServiceName(Service?.Name)}
                                        sx={{
                                            borderRadius: '8px',
                                            px: 1,
                                        }}
                                    />
                                )
                            })}
                        </Box>
                    </Box>
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
                                    <Box sx={{ width: { xs: '48%', sm: 'auto' } }}>
                                        <CustomButton
                                            fullWidth
                                            startIcon={<SlidersHorizontal style={{ color: '#1b4d69' }} />}
                                            onClick={handleOpenFilterDialog}
                                        >
                                            Filters
                                        </CustomButton>
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
                                                <div
                                                    style={{
                                                        margin: '10px 0px',
                                                        position: 'absolute',
                                                        background: 'white',
                                                        padding: '13px',
                                                        borderRadius: '14px',
                                                        boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
                                                        zIndex: 10
                                                    }}
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        style={{ fontSize: '0.9rem', fontWeight: 'bold' }}
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
                                                                control={<Radio size="small" />}
                                                                label={<span style={{ fontSize: '0.8rem' }}>{option.label}</span>}
                                                            />
                                                        ))}
                                                    </RadioGroup>
                                                </div>
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
                <Dialog open={openFilterDialog} onClose={handleCloseFilterDialog} fullWidth maxWidth="xs" PaperProps={{
                    sx: { borderRadius: '20px' }
                }} >
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '10px' }}>
                        <SlidersHorizontal style={{ height: '16px', width: '16px' }} />
                        <Typography variant="h6" style={{ fontSize: '1rem' }} fontWeight="bold">Filter</Typography>
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }}>
                        {/* Gender Preference */}
                        <div>
                            <Typography variant="subtitle1" style={{ fontSize: '0.9rem' }} fontWeight="bold">Gender Preference</Typography>
                            <RadioGroup value={filters.genderPreference} onChange={handleGenderPreferenceChange}>
                                {['everyone', 'male', 'female'].map((option) => (
                                    <FormControlLabel
                                        key={option}
                                        value={option}
                                        control={
                                            <Radio
                                                size="small"
                                                sx={{
                                                    padding: '4px' // optional: adjust spacing around the radio
                                                }}
                                            />
                                        }
                                        label={option.charAt(0).toUpperCase() + option.slice(1)}
                                        sx={{
                                            '& .MuiFormControlLabel-label': { fontSize: '0.8rem' },
                                            marginBottom: '4px' // optional: tweak spacing between options
                                        }}
                                    />
                                ))}
                            </RadioGroup>

                        </div>
                        <Divider />
                        {/* Price Range */}
                        <div style={{ margin: '16px 0' }}>
                            <Typography variant="subtitle1" style={{ fontSize: '0.9rem' }} fontWeight="bold">Price Range</Typography>
                            <Slider
                                value={filters.priceRange}
                                onChange={handlePriceRangeChange}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(value) => `₹${value}`}
                                max={10000}
                                step={100}
                                marks={[
                                    { value: 0, label: '₹0' },
                                    { value: 10000, label: '₹10000' },
                                ]}
                                sx={{
                                    '& .MuiSlider-markLabel': {
                                        fontSize: '0.8rem',
                                    },
                                    '& .MuiSlider-valueLabel': {
                                        fontSize: '0.8rem',
                                    },
                                    '& .MuiSlider-thumb': {
                                        width: 16,
                                        height: 16,
                                    },
                                    '& .MuiSlider-track': {
                                        height: 4,
                                    },
                                    '& .MuiSlider-rail': {
                                        height: 4,
                                    }
                                }}
                            />

                        </div>
                        <Divider />
                        {/* Availability */}
                        <div style={{ margin: '16px 0' }}>
                            <Typography variant="subtitle1" style={{ fontSize: '0.9rem' }} fontWeight="bold">Availability</Typography>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {['Today', 'Tomorrow', 'This Week', 'Next Week'].map((time) => (
                                    <Chip
                                        key={time}
                                        label={time}
                                        clickable
                                        color={filters.availability.includes(time) ? 'primary' : 'default'}
                                        onClick={() => handleAvailabilityChange(time)}
                                        sx={{
                                            fontSize: '0.8rem',
                                            padding: '4px 8px',
                                            height: '28px' // slightly smaller height
                                        }}
                                    />
                                ))}
                            </div>

                        </div>
                        <Divider />
                        {/* Additional Filters */}
                        <div style={{ margin: '16px 0' }}>
                            <Typography variant="subtitle1" style={{ fontSize: '0.9rem' }} fontWeight="bold">Additional Filters</Typography>
                            {[
                                { label: 'Instant Booking', id: 'instant' },
                                { label: 'Special Offers', id: 'offers' },
                                { label: 'Highly Rated (4.5+)', id: 'rated' },
                            ].map((filter) => (
                                <FormControlLabel
                                    key={filter.id}
                                    control={
                                        <Switch
                                            checked={filters.additionalFilters[filter.id]}
                                            onChange={handleAdditionalFilterChange}
                                            name={filter.id}
                                            size="small"
                                            sx={{
                                                padding: '4px',
                                                '& .MuiSwitch-thumb': {
                                                    width: 14,
                                                    height: 14,
                                                },
                                                '& .MuiSwitch-switchBase': {
                                                    padding: '4px',
                                                },
                                                '& .MuiSwitch-track': {
                                                    borderRadius: 14,
                                                    height: 14,
                                                },
                                            }}
                                        />
                                    }
                                    label={filter.label}
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '0.8rem',
                                        },
                                        marginBottom: '4px',
                                    }}
                                />
                            ))}

                        </div>


                    </DialogContent>

                    <Divider />
                    <DialogActions>
                        <Button
                            variant="outlined"
                            onClick={handleResetFilters}
                            sx={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                borderRadius: '14px'
                            }}
                        >
                            Reset All
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleApplyFilter}
                            sx={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                borderRadius: '14px'
                            }}
                        >
                            Apply Filters
                        </Button>
                    </DialogActions>

                </Dialog>
            </ThemeProvider>
        </Box >
    );
});

export default Navigation;

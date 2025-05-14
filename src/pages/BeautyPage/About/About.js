import React from "react";
import {
    Grid,
    Typography,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Card,
    CardContent,
    Button,
} from "@mui/material";
import Done from '@mui/icons-material/Done';
import Clear from '@mui/icons-material/Clear';
import LocationOn from '@mui/icons-material/LocationOn';
import Circle from '@mui/icons-material/Circle';


const AboutUs = ({ facilities, timing, latitude = 30.7333, longitude = 76.7794 }) => {
    const GOOGLE_API_KEY='AIzaSyBdWs3MgBKaIDNzkk5pvlfqO2SeobfsWCk';
    
    // Updated embed URL format to ensure marker is visible
    const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_API_KEY}&q=${latitude},${longitude}&zoom=15`;
    
    // If you don't want to use an API key, this alternative approach works too
    const googleMapsEmbedUrlNoKey = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
    
    const openDirections = () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
    };
    
    const openGoogleMaps = () => {
        window.open(`https://www.google.com/maps/search/taxi+near+${latitude},${longitude}`, '_blank');
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontWeight: "bold",
                    fontSize: { xs: '20px', sm: '24px', md: '28px' }
                }}
            >
                About
            </Typography>
            <Typography
                variant="body1"
                paragraph
                sx={{ fontSize: { xs: "0.7rem", sm: "0.8", md: "0.9rem" } }}
            >
                Welcome to Batbox, the ultimate destination for cricket enthusiasts in
                Gyan Khand-3, Indirapuram, Ghaziabad. Our state-of-the-art indoor nets
                facility offers high-quality batting sessions powered by modern bowling
                machines. Whether you're a seasoned pro or just starting out, our
                easy-going atmosphere and friendly staff ensure a fun and fulfilling
                cricket experience. Join us and take your game to the next level at
                Batbox!
            </Typography>
            <Grid container spacing={20}>
                <Grid item xs={12} sm={7}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: { xs: "1rem", sm: "1.2rem" },
                            fontWeight: "bold",
                            mb: 2,
                        }}
                    >
                        Accessibility
                    </Typography>
                    <List
                        sx={{
                            columnCount: { xs: 1, sm: 2 },
                            columnGap: 2,
                        }}
                    >
                        {facilities && facilities.map((item, index) => (
                            <ListItem
                            key={index}
                            sx={{
                              display: 'flex',
                              breakInside: 'avoid',
                              padding: 0,
                              alignItems: 'flex-start',
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              {item.available === true ? (
                                <Done color="success" />
                              ) : (
                                <Clear color="error" />
                              )}
                            </ListItemIcon>
                          
                            <ListItemText
                              primary={item.name || ""}
                              primaryTypographyProps={{
                                fontSize: { xs: '10px', sm: '12px', md: '13px' },
                                fontWeight:600
                              }}
                            />
                          </ListItem>
                          
                        ))}
                    </List>
                </Grid>


                <Grid item xs={12} sm={5}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: { xs: "1rem", sm: "1.2rem" },
                            fontWeight: "bold",
                            
                        }}
                    >
                        Opening times
                    </Typography>
                    <List>
                        {timing && timing.map((schedule, index) => (
                            <ListItem key={index} sx={{ padding: '0px' }} >
                                <ListItemIcon sx={{ minWidth: '32px' }}>
                                    {schedule.time === "Closed" ?
                                        <Circle fontSize="small" sx={{ height: 'auto', width: '12px' }} color="error" />
                                        :
                                        <Circle
                                            sx={{ height: 'auto', width: '12px' }}
                                            fontSize="small"
                                            color={"success"}
                                        />}
                                </ListItemIcon>
                                <ListItemText

                                    primary={
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                width: "100%",

                                            }}
                                        >
                                            <Box sx={{ fontSize: { xs: "10px", sm: "12px", md: "13px" }, fontWeight: 600 }}>
                                                {schedule.day}
                                            </Box>
                                            <Box
                                                sx={{
                                                    color: "grey.500",
                                                    fontSize: { xs: "10px", sm: "12px", md: "13px" }
                                                }}
                                            >
                                                {schedule.time}
                                            </Box>
                                        </Typography>
                                    }
                                />


                            </ListItem>
                        ))}
                    </List>
                </Grid>

                <Grid item xs={12}>
                    <Grid container>
                        {/* Map Section with visible marker */}
                        <Grid item xs={12} sm={7}>
                            <Card
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexWrap: { xs: "wrap", sm: "nowrap" },
                                    background: "transparent",
                                    boxShadow: "none",
                                   
                                }}
                            >
                                <CardContent
                                    sx={{
                                        padding: "0",
                                        width: "100%",
                                        height: { xs: "40vw", sm: "20vw", lg: "15vw" }, // Responsive height
                                    }}
                                >
                                    <iframe
                                        title="Google Maps Location"
                                        src={googleMapsEmbedUrlNoKey} // Using the no API key version
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </CardContent>
                            </Card>
                        </Grid>


                        <Grid item xs={12} sm={5}>
                            <Box
                                display="flex"
                                sx={{
                                    background: "#e2e6ea",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: { xs: "max-content", sm: "20vw", lg: "15vw" },
                                    padding: { xs: '7px', sm: 'unset', md: 'unset' }
                                }}
                            >
                                <Box display="flex" alignItems="flex-start">
                                    <LocationOn
                                        sx={{
                                            marginRight: 2,
                                            fontSize: { xs: "1.5rem", sm: "2rem", lg: "2.5rem" }, // Responsive font size
                                        }}
                                    />
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            sx={{
                                                fontSize: { xs: "1rem", sm: "1.2rem", lg: "1.5rem" }, // Responsive font size
                                            }}
                                        >
                                            Batbox | Indoor Cricket Nets
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            paragraph
                                            sx={{
                                                fontSize: { xs: "0.8rem", sm: "0.9rem", lg: "1rem" },
                                                marginBottom: '0'
                                            }}
                                        >
                                            Grab Mall,
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            paragraph
                                            sx={{
                                                fontSize: { xs: "0.8rem", sm: "0.9rem", lg: "1rem" }, // Responsive font size
                                            }}
                                        >
                                            Sector 18, Chandigarh (119001)
                                        </Typography>
                                        <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row', md: 'row' }, gap: 1, marginTop: "40px" }}>
                                            <Button
                                                variant="contained"
                                                onClick={openDirections}
                                                sx={{
                                                    background: "#1b4d69",
                                                    fontSize: { xs: "8px", sm: "10px", lg: "10px" },
                                                    fontWeight: 600,
                                                }}
                                            >
                                                How to get there?
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={openGoogleMaps}
                                                sx={{
                                                    background: "#1b4d69",
                                                    fontSize: { xs: "8px", sm: "10px", lg: "10px" }, // Responsive font size
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Get there by taxi!
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>


            </Grid>
        </Box>
    );
};

export default AboutUs;
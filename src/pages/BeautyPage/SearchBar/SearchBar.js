import React, { useEffect, useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ReplyIcon from '@mui/icons-material/Reply';
import ShareIcon from "@mui/icons-material/Share";
import {
  Box,
  Container,
  Grid,
  Chip,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import { Info, Heart, Share2, ChevronRight } from 'lucide-react';
import SearchField from '../../../components/searchField';
import CustomButton from '../../../components/customButton';
import { apiget } from '../../service/api';



const SearchBar = ({ buisnessInfo }) => {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = ['All', 'Beauty', 'Wellness', 'Fitness'];
  const [isOpen, setIsOpen] = useState(false);
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    const checkBusinessStatus = () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;


      const openingTime = buisnessInfo?.OpeningTime || "09:00";
      const closingTime = buisnessInfo?.ClosingTime || "17:00";


      if (currentTimeString >= openingTime && currentTimeString < closingTime) {
        setIsOpen(true);
        setStatusText(`Closes At: ${closingTime}`);
      } else {
        setIsOpen(false);
        setStatusText(`Opens At: ${openingTime}`);
      }
    };


    checkBusinessStatus();


    const intervalId = setInterval(checkBusinessStatus, 60000);


    return () => clearInterval(intervalId);
  }, [buisnessInfo]);

  const updateSearchResult = async () => {
    setLoading(true)
    const result = await apiget(`api/v1/BussinessDetails/filter/?ServiceName=${serviceName}&Location=${location}&BussinessType=${selectedCategory}`);
    if (result && result.status === 200) {
      // onDataChange(result?.data?.Data)
      console.log(result?.data?.Data)
    }
    setLoading(false)
  }

  return (
    <Box sx={{ position: 'relative', pt: 15 }}>
      <Box
        sx={{
          background: 'linear-gradient(to bottom, #467d9b, #002c5c)',
          position: 'absolute',
          height: '35vh',
          width: '100%',
          zIndex: -1,
          top: 0,
        }}
      />
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 5,
            boxShadow: 3,
            p: '18px',
          }}
        >
          <SearchField serviceName={serviceName} setServiceName={setServiceName} location={location} setLocation={setLocation} handleFetchData={updateSearchResult} loading={loading} />

          <Box
            sx={{
              borderRadius: "8px",
              maxWidth: "100%",
              backgroundColor: "#fff",
              mt: 3
            }}
          >

            <Grid container spacing={2}>
              <Grid item xs={12} md={9}>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "18px", md: "32px" },
                  }}
                >
                  {buisnessInfo?.BusinessName || 'Loading...'}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row', md: 'row' }} gap={1} alignItems={{ xs: 'flex-start', sm: 'center', md: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", marginTop: "8px", fontSize: "14px" }}
                  >
                    {`${buisnessInfo?.StreetAddress || 'Loading...'},${buisnessInfo?.Region || ''}`}
                  </Typography>

                  {buisnessInfo && buisnessInfo?.StreetAddress && <Typography
                    variant="body2"
                    sx={{
                      color: "#1b4d69",
                      fontWeight: "bold",
                      marginTop: "10px",
                      cursor: "pointer",
                      display: "inline-block",
                      marginLeft: "10px"
                    }}
                    onClick={() => {
                      const encodedDestination = encodeURIComponent(buisnessInfo?.StreetAddress);
                      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}&travelmode=driving`;
                      window.open(mapsUrl, '_blank');
                    }}

                  >
                    Get direction →
                  </Typography>}
                </Stack>
              </Grid>


              <Grid item xs={12} md={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: { xs: 'space-between', sm: 'flex-end', md: 'flex-end' },
                    gap: 1,
                    flexWrap: "wrap",
                    width: { xs: '100%', sm: 'unset', md: 'unset' }
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#0D4D69",
                      borderRadius: "8px",
                      padding: "6px 0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "48px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      4.8
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: "18px",
                      }}
                    >
                      Best
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "black",
                        fontSize: "12px",
                        width: "100px",
                      }}
                    >
                      See all 1,005 reviews
                      <ChevronRight height={20} width={20} style={{ marginLeft: "14px" }} />
                    </Box>
                  </Box>
                </Box>

              </Grid>
            </Grid>




            <Stack
              direction={{ xs: "column", sm: "row", md: "row" }}
              alignItems={{ xs: "flex-start", sm: "center", md: "center" }}
              justifyContent={"space-between"}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  marginTop: "16px",
                  border: `2px solid ${!isOpen ? "#2e7d32" : "#d32f2f"}`,
                  borderRadius: "12px",
                  width: "max-content",
                  paddingRight: "10px",
                }}
              >
                <Chip
                  label={statusText}
                  sx={{
                    background: "#fff",
                    color: !isOpen ? "#2e7d32" : "#d32f2f",
                    fontWeight: "bold",
                    borderColor: !isOpen ? "#2e7d32" : "#d32f2f",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  ⓘ
                </Typography>
              </Box>

              {/* Save & Share Buttons */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "space-between", sm: "unset" },
                  gap: 1,
                  mt: "16px",
                  width: { xs: "100%", sm: "unset", md: "unset" },
                }}
              >
                {/* Save Button */}
                <Button
                  variant="contained"
                  startIcon={<FavoriteBorderIcon />}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: '2px solid #143a50',
                    padding: "4px 16px",
                    color: '#143a50',
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#143a50",
                      color: '#fff',
                    },
                  }}
                >
                  Save
                </Button>


                <Button
                  variant="contained"
                  startIcon={<ReplyIcon sx={{ transform: "scaleX(-1)" }} />}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: '2px solid #143a50',
                    color: '#143a50',
                    padding: "4px 16px",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#143a50",
                      color: '#fff'
                    },
                  }}
                >
                  Share
                </Button>
              </Box>
            </Stack>


          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SearchBar;

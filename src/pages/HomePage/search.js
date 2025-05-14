import React, { useState } from 'react';
import {
  AppBar,
  Tabs,
  Tab,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  MenuItem ,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material"
import { useNavigate } from "react-router"
import { apiget } from "../service/api"
import SearchIcon from "@mui/icons-material/Search"

export default function SearchUI() {
  const navigate = useNavigate()

  const [value, setValue] = useState(0)
  const [category, setCategory] = useState("Beauty")
  const [serviceName, setServiceName] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = React.useState('');
  const [time, setTime] = useState("")
  
  const [loading, setLoading] = useState(false)

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"))
  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up("xl"))

  const timeOptions = [
    { value: 'morning', label: 'Morning' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'evening', label: 'Evening' },
    { value: 'anytime', label: 'Anytime' }
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue)
    setCategory(["Beauty", "Fitness", "Wellness"][newValue])
  }

  const handleSearchChange = (event) => {
    setServiceName(event.target.value)
  }

  const handleLocationChange = (event) => {
    setLocation(event.target.value)
  }

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value)
  }

  const handleSearch = async () => {
    setLoading(true)

    const result = await apiget(
      `api/v1/BussinessDetails/filter?ServiceName=${serviceName}&Location=${location}&BussinessType=${category}`,
    )

    console.log(result)

    if (result && result.status === 200) {
      navigate("/overview", {
        state: {
          data: result?.data?.Data,
          search: {
            category: category,
            serviceName: serviceName,
            location: location,
          },
        },
      })
    }
    setLoading(false)
  }

  // Mobile view that matches the image
  if (isSmallScreen) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          margin: "auto",
        }}
      >
        {/* Category tabs - simplified for mobile */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mb: 3,
          }}
        >
          {["Beauty", "Fitness", "Wellness"].map((cat, idx) => (
            <Button
              key={idx}
              variant={value === idx ? "contained" : "outlined"}
              onClick={() => {
                setValue(idx)
                setCategory(cat)
              }}
              sx={{
                borderRadius: "2rem",
                px: 2,
                py: 0.5,
                textTransform: "none",
                backgroundColor: value === idx ? "#1b4d69" : "white",
                color: value === idx ? "white" : "#1b4d69",
                border: "1px solid #e0e0e0",
                "&:hover": {
                  backgroundColor: value === idx ? "#1b4d69" : "rgba(7, 132, 7, 0.1)",
                },
              }}
            >
              {cat}
            </Button>
          ))}
        </Box>

        {/* Search fields in mobile layout */}
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 0.5, color: "text.secondary" }}>
                What are you looking for?
              </Typography>
              <TextField
                placeholder="Name of Services"
                variant="outlined"
                fullWidth
                value={serviceName}
                onChange={handleSearchChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white",
                    "& fieldset": {
                      borderColor: "#ccc", 
                    },
                    "&:hover fieldset": {
                      borderColor: "#1b4d69", 
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1b4d69 !important", 
                    },
                  },
                }}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 0.5, color: "text.secondary" }}>
                Where?
              </Typography>
              <TextField
                placeholder="City, Country"
                variant="outlined"
                fullWidth
                value={location}
                onChange={handleLocationChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white",
                    "& fieldset": {
                      borderColor: "#ccc", 
                    },
                    "&:hover fieldset": {
                      borderColor: "#1b4d69",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1b4d69 !important", 
                    },
                  },
                }}
                size="small"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6} sm={6}>
              <Typography variant="body2" sx={{ mb: 0.5, color: "text.secondary" }}>
                Date
              </Typography>
              <TextField
                type="date"
                variant="outlined"
                fullWidth
                value={date}
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white",
                    "& fieldset": {
                      borderColor: "#ccc", 
                    },
                    "&:hover fieldset": {
                      borderColor: "#1b4d69",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1b4d69 !important", 
                    },
                  },
                }}
                size="small"
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
              />
            </Grid>
            
            <Grid item xs={6} sm={6}>
              <Typography variant="body2" sx={{ mb: 0.5, color: "text.secondary" }}>
                Time
              </Typography>
              <TextField
                select
                variant="outlined"
                fullWidth
                value={time}
                onChange={handleTimeChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white",
                    "& fieldset": {
                      borderColor: "#ccc", 
                    },
                    "&:hover fieldset": {
                      borderColor: "#1b4d69",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1b4d69 !important", 
                    },
                  },
                }}
                size="small"
              >
                {timeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              borderRadius: "8px",
              backgroundColor: "black",
              color: "white",
              py: 1.5,
              "&:hover": {
                backgroundColor: "#008F6E",
              },
            }}
            onClick={handleSearch}
            disabled={loading}
            startIcon={<SearchIcon />}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "SEARCH"}
          </Button>
        </Box>

      </Box>
    )
  }

  // Desktop view - keep original layout
  return (
    <Box
      sx={{
        width: isExtraLargeScreen ? "60%" : "80%",
        maxWidth: 800,
        margin: "auto",
        position: "absolute",
        zIndex: 11,
        padding: 2,
      }}
    >
      <AppBar
        position="static"
        sx={{
          borderRadius: "20px 22px 0 0",
          overflow: "hidden",
          background: "transparent",
          width: "20rem",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          sx={{
            position: "relative",
            "& .MuiTab-root": {
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "16px 0 0 0",
              backgroundColor: "#1b4d69",
              color: "white",
              position: "relative",
              border: "2px solid #eaeef2",
              zIndex: 1,
              "&.Mui-selected": {
                backgroundColor: "white",
                color: "#1b4d69",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              },
              "&:not(.Mui-selected)": {
                "&:hover": {
                  backgroundColor: "white",
                  color: "#1b4d69",
                },
              },
              "&:not(:last-child)": {
                marginRight: "-10px",
              },
            },
          }}
        >
          <Tab label="Beauty" onClick={() => setCategory("Beauty")} />
          <Tab label="Fitness" onClick={() => setCategory("Fitness")} />
          <Tab label="Wellness" onClick={() => setCategory("Wellness")} />
        </Tabs>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "white",
          p: 2,
          borderRadius: "0 16px 16px 16px",
          boxShadow: 3,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, mr: 2 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            What are you looking?
          </Typography>
          <TextField
            placeholder={`Name of Services (${["beauty", "fitness", "wellness"][value]}...)`}
            variant="standard"
            fullWidth
            value={serviceName}
            onChange={handleSearchChange}
            InputProps={{
              disableUnderline: true,
            }}
          />
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mr: 2 }} />

        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, mr: 2 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Where?
          </Typography>
          <TextField
            placeholder="City, Country"
            variant="standard"
            fullWidth
            value={location}
            onChange={handleLocationChange}
            InputProps={{
              disableUnderline: true,
            }}
          />
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mr: 2 }} />

        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, mr: 2 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            When?
          </Typography>
          <TextField
            placeholder="Anytime"
            variant="standard"
            fullWidth
            value={time}
            onChange={handleTimeChange}
            InputProps={{
              disableUnderline: true,
            }}
          />
        </Box>

        <Button
          variant="contained"
          sx={{
            minWidth: 100,
            borderRadius: "10px",
            backgroundColor: "black",
            py: 1,
            "&:hover": {
              backgroundColor: "grey.800",
            },
          }}
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Search"}
        </Button>
      </Box>
    </Box>
  )
}


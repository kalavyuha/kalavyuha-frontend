import { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";

const containerStyle = {
  width: "100%",
  height: "9rem",
  borderRadius:12,
  
};

const center = {
  lat: 28.6139, 
  lng: 77.2090, 
};

const GOOGLE_MAPS_API_KEY = "AIzaSyBowYOiTMa2mRH_7QzPZ_ovUjA14w2NlgQ"; 

const MapComponent = ({ onSelectLocation }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [open, setOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCoords, setSelectedCoords] = useState({ lat: null, lng: null });

  // Handle map click
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    updateLocation(lat, lng);
  };

  // Get live location
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          updateLocation(lat, lng);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to fetch location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Update map center, marker, and address
  const updateLocation = (lat, lng) => {
    setMarkerPosition({ lat, lng });
    setMapCenter({ lat, lng });
    setSelectedCoords({ lat, lng });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setSelectedAddress(results[0].formatted_address);
        setOpen(true);
      } else {
        console.error("Geocode failed:", status);
      }
    });
  };

  // Confirm selected location
  const handleAddLocation = () => {
    onSelectLocation({
      address: selectedAddress,
      lat: selectedCoords.lat,
      lng: selectedCoords.lng,
    });
    setOpen(false);
  };

  // Reselect location
  const handleReselect = () => {
    setMarkerPosition(null);
    setOpen(false);
  };

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <Grid container justifyContent="center" sx={{ pl: 2, my: 1, position: "relative" }}>
      <div style={containerStyle}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={mapCenter}
          zoom={12}
          onClick={handleMapClick}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>

        {/* Floating GPS Button in Bottom-Right */}
        <IconButton
          onClick={handleUseMyLocation}
          sx={{
            position: "absolute",
            bottom: 10,
            right: 10,
            zIndex: 1000,
            backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
          }}
        >
          <MyLocationIcon color="primary" />
        </IconButton>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleReselect}>
        <DialogTitle>Confirm Location</DialogTitle>
        <DialogContent>
          <p>{selectedAddress}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReselect} color="secondary">Reselect</Button>
          <Button onClick={handleAddLocation} color="primary">Add This</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default MapComponent;
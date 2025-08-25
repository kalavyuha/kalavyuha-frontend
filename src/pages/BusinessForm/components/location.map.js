import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap , useMapEvents} from "react-leaflet";
import L from "leaflet";
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import "leaflet/dist/leaflet.css";
import { constant } from '../../../constant';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const containerStyle = {
  width: "100%",
  height: "9rem",
  borderRadius: 12,
};

const center = {
  lat: 28.6139, 
  lng: 77.2090, 
};

const MapEvents = ({ addMarker }) => {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      addMarker(e.latlng);
      // Zoom to the clicked location
      map.setView(e.latlng, 16); // 16 is a good zoom level for street view
    },
  });
  
  return null;
};

const RecenterAutomatically = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, 16); // Zoom to 16 when recentering
    }
  }, [center, map]);
  
  return null;
};

const MapComponent = ({ onSelectLocation, initialPosition  }) => {
  const [markerPosition, setMarkerPosition] = useState(initialPosition || null);
  const [mapCenter, setMapCenter] = useState(initialPosition || center);
  const [open, setOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCoords, setSelectedCoords] = useState({ lat: null, lng: null });
  const [displayName, setDisplayName] = useState("");
  const mapRef = useRef();

  const addMarker = async (latlng) => {
    const lat = latlng.lat;
    const lng = latlng.lng;
    updateLocation(lat, lng);
  };

  useEffect(() => {
    if (initialPosition) {
      setMarkerPosition(initialPosition);
      setMapCenter(initialPosition);
    }
  }, [initialPosition]);

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          updateLocation(lat, lng);
          
          // Center and zoom on the current location
          setMapCenter({ lat, lng });
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

  const updateLocation = async (lat, lng) => {
    setMarkerPosition({ lat, lng });
    setSelectedCoords({ lat, lng });

    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${constant.REACT_APP_LOCATIONIQ_API}&lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();

      const addr = data.address || {};
      const display_name = data.display_name || "";

      if (addr && display_name) {
        setSelectedAddress(addr);
        setDisplayName(display_name);
        setOpen(true);
      } else {
        console.error("No address found");
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  };

  const handleAddLocation = () => {
    onSelectLocation({
      address: selectedAddress,      
      display_name: displayName,
      lat: selectedCoords.lat,
      lng: selectedCoords.lng,
    });
    setOpen(false);
  };

  const handleReselect = () => {
    setMarkerPosition(null);
    setOpen(false);
  };

  return (
    <Grid container justifyContent="center" sx={{ pl: 2, my: 1, position: "relative" }}>
      <div style={containerStyle}>
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={12}
          style={{ width: "100%", height: "100%", borderRadius: "12px" }}
          whenCreated={(map) => { mapRef.current = map; }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents addMarker={addMarker} />
          <RecenterAutomatically center={markerPosition || mapCenter} />
          {markerPosition && (
            <Marker position={[markerPosition.lat, markerPosition.lng]}>
              <Popup>{displayName || "Selected location"}</Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Floating GPS Button in Bottom-Right */}
        <IconButton
          onClick={handleUseMyLocation}
          sx={{
            position: "absolute",
            bottom: 10,
            right: 10,
            zIndex: 1000,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
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
          <p>{displayName}</p>
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
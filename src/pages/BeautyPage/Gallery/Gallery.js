import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, IconButton, Dialog, Skeleton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CollectionsIcon from "@mui/icons-material/Collections";
import Gal1 from "../../../assets/images/Overview_Images/gall1.jpeg";
import Gal2 from "../../../assets/images/Overview_Images/gall2.jpeg";
import Gal3 from "../../../assets/images/Overview_Images/gall3.jpeg";
import Gal4 from "../../../assets/images/Overview_Images/gall4.jpeg";
import Gal5 from "../../../assets/images/Overview_Images/gall5.jpeg";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});

  const images = [
    { url: Gal1, alt: "Tall waterfall in forest" },
    { url: Gal2, alt: "Giant sequoia trees" },
    { url: Gal3, alt: "Green forest leaves" },
    { url: Gal4, alt: "Forest path with sunlight" },
    { url: Gal5, alt: "River in forest" },
    { url: Gal1, alt: "Sunlit forest path" },
    { url: Gal2, alt: "Forest undergrowth" },
    { url: Gal3, alt: "Forest flowers" },
  ];

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const handleNextImage = () => {
    setSelectedImage((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <Box mt={5} mb={5}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} sx={{ position: "relative" }}>
          <Paper
            elevation={1}
            sx={{ height: "300px", overflow: "hidden", backgroundColor: "#fff", position: "relative" }}
          >
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
            ) : (
              <>
                {!loadedImages[selectedImage] && (
                  <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
                )}
                <Box
                  component="img"
                  src={images[selectedImage].url}
                  alt={images[selectedImage].alt}
                  onLoad={() => handleImageLoad(selectedImage)}
                  sx={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover", 
                    opacity: loadedImages[selectedImage] ? 1 : 0,
                    position: loadedImages[selectedImage] ? "relative" : "absolute",
                    transition: "opacity 0.5s ease-in-out"
                  }}
                />
              </>
            )}
          </Paper>

          <IconButton
            onClick={handleNextImage}
            disabled={loading}
            sx={{ 
              position: "absolute", 
              bottom: 10, 
              right: 10, 
              backgroundColor: "#fff", 
              color: "#1b4d69", 
              "&:hover": { backgroundColor: "#f0f0f0" },
              opacity: loading ? 0.5 : 1
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Grid>

        <Grid item xs={12} sm={3} md={3}>
          <Paper elevation={1} sx={{ height: "120px", overflow: "hidden", backgroundColor: "#fff", marginBottom: "15px" }}>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
            ) : (
              <>
                {!loadedImages[(selectedImage + 1) % images.length] && (
                  <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
                )}
                <Box 
                  component="img" 
                  src={images[(selectedImage + 1) % images.length].url} 
                  alt="Thumbnail 1" 
                  onLoad={() => handleImageLoad((selectedImage + 1) % images.length)}
                  sx={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    opacity: loadedImages[(selectedImage + 1) % images.length] ? 1 : 0,
                    position: loadedImages[(selectedImage + 1) % images.length] ? "relative" : "absolute",
                    transition: "opacity 0.5s ease-in-out"
                  }} 
                />
              </>
            )}
          </Paper>
          <Paper elevation={1} sx={{ height: "165px", overflow: "hidden", backgroundColor: "#fff" }}>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
            ) : (
              <>
                {!loadedImages[(selectedImage + 2) % images.length] && (
                  <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
                )}
                <Box 
                  component="img" 
                  src={images[(selectedImage + 2) % images.length].url} 
                  alt="Thumbnail 2" 
                  onLoad={() => handleImageLoad((selectedImage + 2) % images.length)}
                  sx={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    opacity: loadedImages[(selectedImage + 2) % images.length] ? 1 : 0,
                    position: loadedImages[(selectedImage + 2) % images.length] ? "relative" : "absolute",
                    transition: "opacity 0.5s ease-in-out"
                  }} 
                />
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={3} md={3}>
          <Paper elevation={1} sx={{ height: "300px", overflow: "hidden", backgroundColor: "#fff", position: "relative" }}>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
            ) : (
              <>
                {!loadedImages[(selectedImage + 3) % images.length] && (
                  <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
                )}
                <Box 
                  component="img" 
                  src={images[(selectedImage + 3) % images.length].url} 
                  alt="Thumbnail 3" 
                  onLoad={() => handleImageLoad((selectedImage + 3) % images.length)}
                  sx={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    opacity: loadedImages[(selectedImage + 3) % images.length] ? 1 : 0,
                    position: loadedImages[(selectedImage + 3) % images.length] ? "relative" : "absolute",
                    transition: "opacity 0.5s ease-in-out"
                  }} 
                />
              </>
            )}
            <IconButton
              onClick={() => setOpen(true)}
              disabled={loading}
              sx={{ 
                position: "absolute", 
                bottom: 10, 
                right: 10, 
                fontSize: 12, 
                borderRadius: 4, 
                backgroundColor: "rgba(0,0,0,0.5)", 
                color: "#fff", 
                "&:hover": { backgroundColor: "#1b4d69" },
                opacity: loading ? 0.5 : 1
              }}
            >
              <CollectionsIcon sx={{ fontSize: "12px", marginRight: "5px" }} /> {images.length - 3}+
            </IconButton>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <Box p={2}>
          <Grid container spacing={2}>
            {images.map((img, index) => (
              <Grid item xs={6} sm={6} md={6} key={index}>
                <Paper elevation={3} sx={{ overflow: "hidden" }}>
                  {!loadedImages[`dialog-${index}`] && (
                    <Skeleton variant="rectangular" width="100%" height="150px" animation="wave" />
                  )}
                  <Box 
                    component="img" 
                    src={img.url} 
                    alt={img.alt} 
                    onLoad={() => handleImageLoad(`dialog-${index}`)}
                    sx={{ 
                      width: "100%", 
                      height: "150px", 
                      objectFit: "cover",
                      display: 'block',
                      opacity: loadedImages[`dialog-${index}`] ? 1 : 0,
                      position: loadedImages[`dialog-${index}`] ? "relative" : "absolute",
                      transition: "opacity 0.3s ease-in-out"
                    }} 
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Gallery;
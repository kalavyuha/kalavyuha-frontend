import { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography, IconButton, useMediaQuery, useTheme } from "@mui/material";
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

export default function Component() {
  const theme = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const testimonials = [
    {
      text: "I was able to use Appointy's appointment scheduler for my class booking business. The design is totally beautiful, I was able to restrict client account booking as per the validity period of class registrations. The cancellation and rescheduling, and reminder email features are amazing.",
      author: "Vijay K Mohan",
      position: "Owner - Rama Dental, Mohali"
    },
    {
      text: "The scheduling system has transformed our business operations. The interface is intuitive, and the automated reminders have significantly reduced no-shows. Highly recommended for any service-based business.",
      author: "Sarah Johnson",
      position: "Director - Wellness Center, Boston"
    },
    {
      text: "Outstanding appointment management solution! The ability to customize booking rules and the seamless integration with our existing systems has made this an invaluable tool for our practice.",
      author: "Michael Chen",
      position: "CEO - Tech Solutions, San Francisco"
    }
  ];

  // Automatically advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [testimonials.length]);

  return (
    <Card sx={{ backgroundColor: "transparent", maxWidth: 600, mx: "auto", boxShadow: "none" }}>
      <CardContent sx={{ mt: 4 }}>
        <div style={{ position: "relative" }}>
          <FormatQuoteIcon style={{ color: "#9e9e9e", width: 48, height: 48, position: "absolute", left: -16, top: -40, transform: "rotate(180deg)" }} />
          <Typography variant="h4" component="h2" sx={{ 
            mb: 2, 
            fontSize:{ xs: "1.8rem", sm: "2rem", md: "2.5rem" },

            ml: 2, 
            fontFamily: "serif" 
          }}>
            Business Success Stories
          </Typography>
          
          <div style={{marginBottom:"2rem", overflowY: "auto" }}>
            <Typography variant="body1" color="black" sx={{ 
              mb: 1, 
              mt: 2, 
              ml: 2, 
              fontSize: { xs: 12, sm:14, md: 15 },
              fontWeight: "medium",
              color: '#545454'
              
            }}>
              {testimonials[currentSlide].text}
            </Typography>
            <Typography variant="subtitle1" sx={{ ml: 2, mt: 2, fontSize:  { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
              {testimonials[currentSlide].author}
            </Typography>
            <Typography variant="subtitle2" color="#919191" sx={{ ml: 2, fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }}>
              {testimonials[currentSlide].position}
            </Typography>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "16px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {testimonials.map((_, index) => (
                <IconButton
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: currentSlide === index ? "#8eabbb" : "#cdddec",
                    padding: 5,
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "black",
                color: "white",
                fontSize: "0.75rem",
                borderRadius: 0,
                px: 1.5,
                py: 0.5,
                transition: "transform 0.5s",
                "&:hover": { backgroundColor: "#424242", transform: "scale(1.05)" }
              }}
            >
              See All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Rating,
  Container,
  Stack,
  Link,
  Grid,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';

import RecommendedImgPath from '../../assets/images/recommended/recommended.png';

const reviews = [
  {
    id: 1,
    name: "Sunita Kumari",
    avatar: RecommendedImgPath,
    rating: 5,
    timeAgo: "2 hours ago",
    content: "Very Good Experience and very supportive Mentors."
  },
  {
    id: 2,
    name: "Abhishek",
    avatar: RecommendedImgPath,
    rating: 4,
    timeAgo: "one month ago",
    content: "Very Good Experience and very supportive Mentors. Very Good Experience and very supportive Mentors. This is a long review."
  },
  {
    id: 3,
    name: "Anuradha",
    avatar: RecommendedImgPath,
    rating: 5,
    timeAgo: "2 hours ago",
    content: "Very Good Experience and very supportive Mentors."
  },
  {
    id: 4,
    name: "Another Reviewer",
    avatar: RecommendedImgPath,
    rating: 5,
    timeAgo: "2 hours ago",
    content: "Very Good Experience and very supportive Mentors."
  }
];

const ReviewCard = styled(Card)(({ theme }) => ({
  width: 300,
  height: 200,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 16,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '&:hover': {
    boxShadow: theme.shadows[2]
  }
}));

const GoogleImage = styled('img')({
  height: 20,
  objectFit: 'contain',
  marginRight: 4
});

export default function ReviewsSection() {
  const [expandedReview, setExpandedReview] = useState(null);
  const scrollContainerRef = useRef(null);
  // const [stopScrolling, setStopScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleReadMore = (id) => {
    setExpandedReview((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollInterval;
    
    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (isHovered || scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          clearInterval(scrollInterval); // Stop when last review is reached or hovered
          return;
        }
        scrollContainer.scrollLeft += 1;
      }, 20);
    };

    startScrolling();

    return () => clearInterval(scrollInterval);
  }, [isHovered]);


  return (
    <Container maxWidth="lg" sx={{ px: { xs: 4, sm:8, md: 8, lg:4 }, pb: 4 }} >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} alignItems={{ xs: 'end', sm: 'center' } }>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              color: 'black',
              fontSize: { xs: 'h5.fontSize', sm: 'h4.fontSize' }
            }}
          >
            Recent Reviews
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
            <Typography component="span">(</Typography>
            <GoogleImage
              src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
              alt="Google"
            />
            <Typography variant="body2">reviews</Typography>
            <Typography component="span">)</Typography>
          </Stack>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* Rating Summary Section */}
        <Grid item xs={12} md={2}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <Typography
              variant="h4"
              component="div"
              sx={{ display: 'flex', alignItems: 'baseline', fontSize: { xs: 'h5.fontSize', sm: 'h4.fontSize' } }}
            >
              4.8
              <Typography variant="h5" component="span" color="text.secondary" sx={{ ml: 0.5 }}>
                /5
              </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 'body2.fontSize', sm: 'body1.fontSize' } }}>
              1,005 reviews
            </Typography>
          </Box>
        </Grid>

        {/* Reviews Section */}
        <Grid item xs={12} md={10}>
          <div
            ref={scrollContainerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              paddingBottom: '16px',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {reviews.map((review) => {
              const isExpanded = expandedReview === review.id;
              return (
                <div key={review.id} style={{ minWidth:  { xs: '14rem', sm:'18rem', md:'26rem' }, borderRadius: '20px', border: "2px solid black", padding: "5px", mr:2 }}>
                  <CardContent >
                    <Stack direction="row" spacing={2} sx={{mb:2}}>
                      <Avatar src={review.avatar} alt={review.name} sx={{ borderRadius: "8px" }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">{review.name}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Rating value={review.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#1b4d69' } }} />
                          <Typography variant="caption" color="text.secondary">{review.timeAgo}</Typography>
                        </Stack>
                      </Box>
                    </Stack>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        display: '-webkit-box', 
                        WebkitBoxOrient: 'vertical', 
                        WebkitLineClamp: isExpanded ? 'none' : 3, 
                        overflow: 'hidden',
                        maxHeight: isExpanded ? 'none' : '4.5em',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}
                    >
                      {review.content}
                    </Typography>

                    {review.content.length > 80 && (
                      <Link 
                        href="#" 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          handleReadMore(review.id); 
                        }} 
                        sx={{ 
                          display: 'block', 
                          mt: 1, 
                          color: '#1b4d69', 
                          textDecoration: 'none', 
                          '&:hover': { textDecoration: 'underline' } 
                        }}
                      >
                        {isExpanded ? 'Read less' : 'Read more'}
                      </Link>
                    )}
                  </CardContent>
                </div>
              );
            })}
          </div>
        </Grid>
      </Grid>

      {/* <Button
        variant="contained"
        sx={{
          mt: 2,
          bgcolor: '#cdddec',
          fontWeight: 'bold',
          color: '#1b4d69',
          '&:hover': {
            bgcolor: 'white'
          },
          display: { xs: 'inline-block', sm: 'none' } // Show on small screens
        }}
      >
        See all
      </Button> */}
    </Container>
  );
}

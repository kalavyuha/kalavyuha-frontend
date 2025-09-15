
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

    const handleReadMore = (id) => {
        setExpandedReview((prev) => (prev === id ? null : id));
    };

   // Auto-scroll logic
    useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const cloneContent = () => {
        const clonedContent = scrollContainer.innerHTML;
        scrollContainer.innerHTML += clonedContent;
    };

    cloneContent();

    const scrollInterval = setInterval(() => {
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
        } else {
        scrollContainer.scrollLeft += 1;
        }
    }, 50); 

    return () => clearInterval(scrollInterval); 
    }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center">
            <Typography
                variant="h3"
                component="h2"
                sx={{
                    color: 'black',
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

        <Button
            variant="contained"
            sx={{
              bgcolor: '#cdddec',
              fontWeight: 'bold',
              color: '#1b4d69',
              '&:hover': {
                bgcolor: 'white'
              }
            }}
          >
            See all
          </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Rating Summary Section */}
        <Grid item xs={12} md={2}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <Typography variant="h3" component="div"  sx={{ display: 'flex', alignItems: 'baseline' }}>
              4.8
              <Typography variant="h5" component="span" color="text.secondary" sx={{ ml: 0.5 }}>
                /5
              </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              1,005 reviews
            </Typography>
          </Box>
        </Grid>

        {/* Reviews Section */}
        <Grid item xs={12} md={10}>
            <div
                ref={scrollContainerRef}
                style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                paddingBottom: '16px',
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
                
                }}
            >
                {reviews.map((review) => {
                const isExpanded = expandedReview === review.id;
                return (
                    <div
                    key={review.id}
                    style={{
                        minWidth: '300px',
                        borderRadius: '20px',
                        border:"2px solid black",
                        padding:"5px"
                    }}
                    >
                    <CardContent>
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Avatar src={review.avatar} alt={review.name}  sx={{
                            borderRadius:"8px"
                        }}/>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="medium">
                            {review.name}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                            <Rating
                                value={review.rating}
                                readOnly
                                size="small"
                                sx={{
                                '& .MuiRating-iconFilled': {
                                    color: '#1b4d69',
                                },
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {review.timeAgo}
                            </Typography>
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
                        }}
                        >
                        {review.content}
                        </Typography>
                        {review.content.length > 120 && (
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
                            '&:hover': {
                                textDecoration: 'underline',
                            },
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
    </Container>
  );
}

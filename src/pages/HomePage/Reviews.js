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
  Button,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { constant } from '../../constant';
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

 const ReviewsSection=React.memo(({ data = [], businessId = "55319888", customerId = "21138275" }) =>{
  const [expandedReview, setExpandedReview] = useState(null);
  const scrollContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [apiReviews, setApiReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} days ago`;
    } else {
      return `${diffInMonths} months ago`;
    }
  };

  // Function to fetch reviews from API
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${constant.baseUrl}api/v1/Reviews/get/?businessId=${businessId}&customerId=${customerId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer VIRoHdqUAtpklgKg'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiData = await response.json();
      console.log('API Response:', apiData); // Debug log
      
      // Transform API data to match component structure
      // The API response has a Data array containing the reviews
      const reviewsData = apiData.Data || [];
      console.log('Reviews Data:', reviewsData); // Debug log
      const transformedReviews = Array.isArray(reviewsData) ? reviewsData.map(review => ({
        id: review._id,
        ReviewId: review._id,
        CustomerName: review.CustomerName,
        name: review.CustomerName,
        Rating: review.Rating,
        rating: review.Rating,
        ReviewText: review.ReviewText,
        content: review.ReviewText,
        avatar: RecommendedImgPath, // Using default avatar since API doesn't provide one
        timeAgo: formatTimeAgo(review.CreatedOn),
        CreatedOn: review.CreatedOn,
        IsActive: review.IsActive
      })) : [];
      
      setApiReviews(transformedReviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate average rating from API data
  const calculateAverageRating = () => {
    if (apiReviews.length === 0) return 4.5; // Default rating
    const totalRating = apiReviews.reduce((sum, review) => sum + review.Rating, 0);
    return (totalRating / apiReviews.length).toFixed(1);
  };

  // Fetch reviews when component mounts or businessId/customerId changes
  useEffect(() => {
    if (businessId && customerId) {
      fetchReviews();
    }
  }, [businessId, customerId]);

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

  const finalReviewList = apiReviews.length > 0 ? apiReviews : (data ? data?.reviews : reviews);

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 8, md: 8, lg: 4 }, pb: 4, mt: 6 }} >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} alignItems={{ xs: 'end', sm: 'center' }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              color: 'black',
              fontSize: { xs: '28px' }
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
              {calculateAverageRating()}
              <Typography variant="h5" component="span" color="text.secondary" sx={{ ml: 0.5 }}>
                /5
              </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 'body2.fontSize', sm: 'body1.fontSize' } }}>
              {apiReviews.length > 0 ? `${apiReviews.length} reviews` : (data?.totalReviews || `${reviews.length} reviews`)}
            </Typography>
          </Box>
        </Grid>

        {/* Reviews Section */}
        <Grid item xs={12} md={10}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: 200 }}>
              <Typography color="error">Error loading reviews: {error}</Typography>
            </Box>
          ) : (
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
            {finalReviewList && finalReviewList.map((review) => {
              const isExpanded = expandedReview === review.id || review?.ReviewId ;
              return (
                <div key={review.id} style={{ minWidth: { xs: '14rem', sm: '18rem', md: '26rem' }, borderRadius: '20px', border: "2px solid black", padding: "5px", mr: 2 }}>
                  <CardContent >
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Avatar src={review.avatar} alt={review.name|| review?.CustomerName ||''} sx={{ borderRadius: "8px" }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">{review.name|| review?.CustomerName ||''}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Rating value={review.rating ||review?.Rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#1b4d69' } }} />
                          <Typography variant="caption" color="text.secondary">{review.timeAgo || ''}</Typography>
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
                      {review.content ||review?.ReviewText ||''}
                    </Typography>

                    {review.content && review.content.length > 80 && (
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
          )}
        </Grid>
      </Grid>

    </Container>
  );
})
export default ReviewsSection;

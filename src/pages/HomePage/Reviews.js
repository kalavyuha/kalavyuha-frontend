import React, {
  useState,
  useEffect,
  useRef
} from 'react';

import {
  Box,
  CardContent,
  Typography,
  Avatar,
  Rating,
  Container,
  Stack,
  Link,
  Grid,
  Skeleton
} from '@mui/material';

import { fetchReviews } from '../../Services/home/api/reviews.api';

const ReviewsSection = React.memo(({
  businessId = "55319888",
  customerId = "21138275"
}) => {

  const [expandedReview, setExpandedReview] =
    useState(null);

  const scrollContainerRef = useRef(null);

  const [isHovered, setIsHovered] =
    useState(false);

  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    const loadReviews = async () => {

      try {

        setLoading(true);

        const response =
          await fetchReviews({
            businessId,
            customerId
          });

        setReviews(response);

      } catch (error) {

        console.error(error);

        setReviews([]);

      } finally {

        setLoading(false);
      }
    };

    if (businessId && customerId) {
      loadReviews();
    }

  }, [businessId, customerId]);

  useEffect(() => {

    const scrollContainer =
      scrollContainerRef.current;

    if (!scrollContainer) return;

    let scrollInterval;

    const startScrolling = () => {

      scrollInterval = setInterval(() => {

        if (isHovered) {
          return;
        }

        if (
          scrollContainer.scrollLeft >=
          scrollContainer.scrollWidth / 2
        ) {
          scrollContainer.scrollLeft = 0;
          return;
        }

        scrollContainer.scrollLeft += 1;

      }, 20);
    };

    startScrolling();

    return () => clearInterval(scrollInterval);

  }, [isHovered]);

  const handleReadMore = (id) => {

    setExpandedReview((prev) =>
      prev === id ? null : id
    );
  };

  const calculateAverageRating = () => {

    if (reviews.length === 0) {
      return 4.5;
    }

    const totalRating = reviews.reduce(
      (sum, review) =>
        sum + review.Rating,
      0
    );

    return (
      totalRating / reviews.length
    ).toFixed(1);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        px: {
          xs: 0,
          sm: 8,
          md: 8,
          lg: 4
        },
        pb: 4,
        mt: 6
      }}
    >

      {/* Header */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >

        <Stack
          direction="row"
          spacing={1}
          alignItems={{
            xs: 'end',
            sm: 'center'
          }}
        >

          <Typography
            variant="h4"
            component="h2"
            sx={{
              color: 'black',
              fontSize: {
                xs: '28px'
              }
            }}
          >
            Recent Reviews
          </Typography>

          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{
              color: 'text.secondary'
            }}
          >

            <Typography component="span">
              (
            </Typography>

            <img
              src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
              alt="Google"
              style={{
                height: 20,
                objectFit: 'contain',
                marginRight: 4
              }}
            />

            <Typography variant="body2">
              reviews
            </Typography>

            <Typography component="span">
              )
            </Typography>

          </Stack>

        </Stack>

      </Stack>

      <Grid container spacing={3}>

        {/* Rating Summary */}

        <Grid item xs={12} md={2}>

          <Box
            sx={{
              position: 'sticky',
              top: 24
            }}
          >

            <Typography
              variant="h4"
              component="div"
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                fontSize: {
                  xs: 'h5.fontSize',
                  sm: 'h4.fontSize'
                }
              }}
            >

              {calculateAverageRating()}

              <Typography
                variant="h5"
                component="span"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                /5
              </Typography>

            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: 'body2.fontSize',
                  sm: 'body1.fontSize'
                }
              }}
            >
              {reviews.length} reviews
            </Typography>

          </Box>

        </Grid>

        {/* Reviews Cards */}

        <Grid item xs={12} md={10}>

          {loading ? (

            <div
              style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                paddingBottom: '16px',
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <Box
                  key={`skeleton-${index}`}
                  sx={{
                    minWidth: '18rem',
                    borderRadius: '20px',
                    border: '1px solid #E0E0E0',
                    padding: '5px'
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ mb: 2 }}
                    >
                      <Skeleton
                        variant="circular"
                        width={48}
                        height={48}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton
                          variant="text"
                          width="60%"
                          height={24}
                          sx={{ mb: 1 }}
                        />
                        <Skeleton
                          variant="text"
                          width="40%"
                          height={18}
                        />
                      </Box>
                    </Stack>
                    <Skeleton
                      variant="text"
                      width="100%"
                      height={20}
                      sx={{ mb: 1 }}
                    />
                    <Skeleton
                      variant="text"
                      width="100%"
                      height={20}
                      sx={{ mb: 1 }}
                    />
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={20}
                    />
                  </CardContent>
                </Box>
              ))}
            </div>

          ) : (

            <div
              ref={scrollContainerRef}
              onMouseEnter={() =>
                setIsHovered(true)
              }
              onMouseLeave={() =>
                setIsHovered(false)
              }
              style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                paddingBottom: '16px',
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                whiteSpace: 'nowrap'
              }}
            >

              {reviews.length > 0 &&
                [...reviews, ...reviews].map(
                  (review, index) => {
                    const reviewKey = `${review.id}-${index}`;
                    const isExpanded =
                      expandedReview === reviewKey;

                    return (
                      <div
                        key={reviewKey}
                        style={{
                          minWidth: '18rem',
                          borderRadius: '20px',
                          border: '1px solid #E0E0E0',
                          padding: '5px'
                        }}
                      >

                        <CardContent>

                          {/* User */}

                          <Stack
                            direction="row"
                            spacing={2}
                            sx={{ mb: 2 }}
                          >

                            <Avatar
                              src={review.avatar}
                              alt={review.name}
                              sx={{
                                borderRadius: '8px'
                              }}
                            />

                            <Box>

                              <Typography
                                variant="subtitle1"
                                fontWeight="medium"
                              >
                                {review.name}
                              </Typography>

                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >

                                <Rating
                                  value={review.rating}
                                  readOnly
                                  size="small"
                                  sx={{
                                    '& .MuiRating-iconFilled': {
                                      color: '#1b4d69'
                                    }
                                  }}
                                />

                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {review.timeAgo}
                                </Typography>

                              </Stack>

                            </Box>

                          </Stack>

                          {/* Review */}

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp:
                                isExpanded
                                  ? 'none'
                                  : 3,
                              overflow: 'hidden',
                              maxHeight:
                                isExpanded
                                  ? 'none'
                                  : '4.5em',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word'
                            }}
                          >
                            {review.content}
                          </Typography>

                          {/* Read More */}

                          {review.content?.length > 80 && (

                            <Link
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleReadMore(
                                  reviewKey
                                );
                              }}
                              sx={{
                                display: 'block',
                                mt: 1,
                                color: '#1b4d69',
                                textDecoration: 'none',
                                '&:hover': {
                                  textDecoration:
                                    'underline'
                                }
                              }}
                            >

                              {isExpanded
                                ? 'Read less'
                                : 'Read more'}

                            </Link>

                          )}

                        </CardContent>

                      </div>
                    );
                  }
                )}

            </div>

          )}

        </Grid>

      </Grid>

    </Container>
  );
});

export default ReviewsSection;
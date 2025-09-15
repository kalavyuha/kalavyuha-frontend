import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Rating,
  Paper,
} from "@mui/material";

const AddReviews = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  // Feedback labels for each rating value
  const ratingLabels = {
    1: "1/5 - Poor",
    2: "2/5 - Fair",
    3: "3/5 - Average",
    4: "4/5 - Good",
    5: "5/5 - Excellent",
  };

  return (
    <Box maxWidth="lg" sx={{ p: { xs: 0, sm: 4 }, mx: "auto", mt: 0 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{
          color: "#000",
          fontSize: { xs: "20px", sm: "24px", md: "28px" },
          mb: 1,
        }}
      >
        Add a Review
      </Typography>
      <Typography
        variant="h4"
        component="h2"
        sx={{
          color: "#555",
          fontSize: { xs: "12px", sm: "14px", md: "16px" },
          mb: 3,
        }}
      >
        Kindly help us improve by sharing your experience with us.
      </Typography>
      <Box sx={{ p: { xs: 0, sm: 0 }, borderRadius: 3, mb: 3 }}>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>

            <Box sx={{ mt: 0, display: "flex", alignItems: "center", gap: 2 }}>
              <Rating
                name="review-rating"
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                size="large"
                sx={{ fontSize: { xs: 28, sm: 40 }, color: "#1b4d69" }}
              />
              {rating > 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "grey",
                    fontWeight: 500,
                    fontSize: { xs: "14px", sm: "16px" },
                  }}
                >
                  {ratingLabels[rating]}
                </Typography>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <TextField
              placeholder="Share your thoughts..."
              variant="outlined"
              fullWidth
              multiline
              rows={5}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              sx={{
                mb: 1,
                background: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: { xs: "14px", sm: "15px", md: "16px" },
                  },
                },
              }}
            />
          </Box>
        </Grid>

        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "flex-end",
            flexDirection: "column",
          }}
        >
          <Box sx={{ mt: 2, alignItems: "flex-end", bottom: 0 }}>
            <Button
              variant="contained"
              sx={{
                background: "#1b4d69",
                color: "white",
                textTransform: "none",
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.5, sm: 1 },
                fontSize: { xs: "12px", sm: "14px", md: "16px" },
                borderRadius: 2,
              }}
            >
              Submit Review
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddReviews;

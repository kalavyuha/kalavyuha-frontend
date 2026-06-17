import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";

import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import StarIcon from "@mui/icons-material/Star";

import { useNavigate } from "react-router-dom";

import ImageIcon from "../assets/images/Overview_Images/image.png";

const CARD_WIDTH = 300;

const TypeOneCard = React.memo(({ salon, isSmallScreen }) => {
  const { Business, id } = salon;

  const navigate = useNavigate();

  const handleCardClick = () => {
    if (id) {
      navigate(`/detail/${id}`);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        minWidth: CARD_WIDTH,
        maxWidth: CARD_WIDTH,

        flexShrink: 0,

        borderRadius: 0,

        background: "transparent",

        boxShadow: "none",

        cursor: "pointer",

        transition: "all 0.25s ease",

        "&:hover": {
          transform: "translateY(-3px)",
        },
      }}
    >
      {/* IMAGE */}
      <Box
        sx={{
          position: "relative",
        }}
      >
        <CardMedia
          component="img"
          image={Business?.Image || ImageIcon}
          alt={Business?.Name || "Business"}
          height="175"
          sx={{
            borderRadius: "10px",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.src = ImageIcon;
          }}
        />

        {/* OFFER TAG */}
        {/* <Box
          sx={{
            position: "absolute",
            top: 14,
            left: 14,

            bgcolor: "#114B69",
            color: "#fff",

            px: 1.2,
            py: 0.6,

            borderRadius: "6px",

            fontSize: "0.72rem",
            fontWeight: 600,

            letterSpacing: "0.2px",
          }}
        >
          UP TO 10% OFF
        </Box> */}
      </Box>

      {/* CONTENT */}
      <CardContent
        sx={{
          px: 0,
          pt: 1.8,
          pb: "0 !important",
        }}
      >
        {/* LOCATION + DISTANCE */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",

            gap: 1,

            mb: 0.8,
          }}
        >
          {/* LOCATION */}
          <Typography
            variant="body2"
            sx={{
              color: "#6B7280",

              fontSize: isSmallScreen ? "0.82rem" : "0.9rem",

              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",

              flex: 1,
            }}
          >
            {Business?.Address || "Location"}
          </Typography>

          {/* DISTANCE */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",

              gap: 0.3,

              flexShrink: 0,
            }}
          >
            <NearMeOutlinedIcon
              sx={{
                fontSize: "0.9rem",
                color: "#6B7280",
              }}
            />

            <Typography
              sx={{
                color: "#6B7280",

                fontSize: isSmallScreen ? "0.82rem" : "0.9rem",

                whiteSpace: "nowrap",
              }}
            >
              {Business?.Distance || "1.2 Km"}
            </Typography>
          </Box>
        </Box>

        {/* NAME + RATING */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            gap: 1,
          }}
        >
          {/* NAME */}
          <Typography
            sx={{
              fontWeight: 700,

              color: "#111827",

              fontSize: isSmallScreen ? "1.05rem" : "1.15rem",

              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",

              flex: 1,
            }}
          >
            {Business?.Name || "Glow Beauty Salon"}
          </Typography>

          {/* RATING */}
          <Box
            sx={{
              bgcolor: "#114B69",

              color: "#fff",

              borderRadius: "6px",

              py: 0.45,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              minWidth: "58px",

              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",

                gap: 0.5,

                fontSize: "0.82rem",

                fontWeight: 600,

                lineHeight: 1,

                whiteSpace: "nowrap",
              }}
            >
              {Business?.Rating || "4.7"}

              <StarIcon
                sx={{
                  fontSize: "0.78rem",
                }}
              />
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

export default TypeOneCard;
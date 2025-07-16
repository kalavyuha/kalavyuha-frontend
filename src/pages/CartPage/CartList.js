import React from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";

const CartList = ({ cartItems, onRemove }) => {
  return (
    <>
      {cartItems.map((item, index) => (
        <Card
          elevation={0}
          key={index}
          sx={{ mb: 2, bgcolor: "#dce1e6", borderRadius: 3 }}
        >
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "8px !important",
              paddingTop: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                py: 0,
                px: "5px",
              }}
            >
              <Box
                component="img"
                src={item.img}
                alt={item.serviceName}
                sx={{ width: 80, height: 60, borderRadius: 2 }}
              />
              <Box sx={{ ml: 1 }}>
                <Typography variant="h6">{item.serviceName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.duration}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography>₹{item.price}/-</Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "black",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
                onClick={() => onRemove(index)}
              >
                Remove
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default CartList;

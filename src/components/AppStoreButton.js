import { Button, Box } from "@mui/material";
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";

const GetAppButton = () => {
  return (
    <Button
      variant="outlined"
      sx={{
        width: "fit-content",
        borderRadius: 28,
        paddingLeft: 2,
        paddingRight: 2,
        color: "#1b4d69",
        textTransform: "none",
        borderColor: "#1b4d69",
        display: "flex",
        alignItems: "center",
        gap: 1,
        "&:hover": {
          borderColor: "#1b4d69",
          bgcolor: "#1b4d6929",
        },
        mt: { xs: 2, md: 2 },
        mb: { xs: 2, md: 8 },
      }}
    >
      Get the app
      <Box sx={{ alignItems: "center", display: "flex" }}>
        <AppleIcon sx={{ fontSize: 20, mr:1 }} />
        <GoogleIcon sx={{ fontSize: 20 }} />
      </Box>
    </Button>
  );
};

export default GetAppButton;

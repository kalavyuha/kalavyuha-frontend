import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import TwitterIcon from "../assets/images/busniess_images/twitter.png";
import GetAppButton from "../components/AppStoreButton";
import CookiePopup from "./Cookies";
import { useCookieSettings } from "../hooks/useCookieSettings";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { showCookieSettings, openCookieSettings, closeCookieSettings } =
    useCookieSettings();

  const quickLinks = [
    { name: "Home", url: "/" },
    { name: "Top picks", url: "/kalavyuha-frontend/under-construction" },
    { name: "Plan & Sign up", url: "/kalavyuha-frontend/under-construction" },
    { name: "Enterprise", url: "/kalavyuha-frontend/enterprise" },
    { name: "Help & Support", url: "/kalavyuha-frontend/support" },
  ];

  const legalLinks = [
    { name: "Privacy & Cookie Policy", url: "#", action: "cookie-settings" },
    { name: "Terms of Service", url: "/kalavyuha-frontend/terms&conditions" },
    {
      name: "Accessibility Statement",
      url: "/kalavyuha-frontend/under-construction",
    },
    { name: "Imprint", url: "/kalavyuha-frontend/under-construction" },
  ];

  const followLinks = [
    { name: "Blog", url: "/kalavyuha-frontend/under-construction" },
    { name: "Instagram", url: "https://instagram.com" },
    { name: "Facebook", url: "https://facebook.com" },
    { name: "Twitter", url: "https://twitter.com" },
  ];

  const handleLinkClick = (link) => {
    if (link.action === "cookie-settings") {
      openCookieSettings();
    }
  };

  const companyLinks = [
    { name: "Contact Us", url: "/kalavyuha-frontend/support" },
    { name: "About", url: "/kalavyuha-frontend/about" },
  ];

  return (
    <Container style={{ maxWidth: "none" }} sx={{ mt: 5, background: "white" }}>
      <Container maxWidth="lg">
        <Box component="footer" sx={{ pb: 2, mt: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} sx={{ pt: 4 }}>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pb: 1,
                  mb: 4,
                  borderBottom: "3px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="h6"
                  color="#1b4d69"
                  sx={{ fontWeight: "bold" }}
                >
                  Kalavyuha
                </Typography>

                <Box>
                  <IconButton
                    aria-label="Twitter"
                    component="a"
                    href="https://twitter.com"
                  >
                    <Box
                      component="img"
                      src={TwitterIcon}
                      alt="Twitter"
                      sx={{
                        width: 24,
                        height: 24,
                        color: "#000",
                      }}
                    />
                  </IconButton>
                  <IconButton
                    aria-label="LinkedIn"
                    component="a"
                    href="https://linkedin.com"
                  >
                    <LinkedInIcon sx={{ color: "#000", fontSize: "30px" }} />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", fontSize: "17px", mb: 2 }}
                  >
                    Quick Links
                  </Typography>
                  <Grid container>
                    <Grid item xs={12} sm={6}>
                      {quickLinks.map((link, index) => (
                        <Link
                          key={link.name}
                          href={link.url}
                          display="block"
                          color="textSecondary"
                          target={
                            link.name === "Enterprise" ? "_blank" : undefined
                          }
                          rel={
                            link.name === "Enterprise"
                              ? "noopener noreferrer"
                              : undefined
                          }
                          sx={{
                            mb: 1,
                            textDecoration: "none",
                            "&:hover": {
                              color: "#1b4d69",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {legalLinks.map((link, index) => (
                        <Link
                          key={link.name}
                          href={
                            link.action === "cookie-settings"
                              ? undefined
                              : link.url
                          }
                          display="block"
                          color="textSecondary"
                          onClick={
                            link.action === "cookie-settings"
                              ? () => handleLinkClick(link)
                              : undefined
                          }
                          sx={{
                            mb: 1,
                            textDecoration: "none",
                            cursor: "pointer",
                            "&:hover": {
                              color: "#1b4d69",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", fontSize: "17px", mb: 2 }}
                  >
                    Follow
                  </Typography>
                  {followLinks.map((link, index) => (
                    <Link
                      key={link.name}
                      href={link.url}
                      display="block"
                      color="textSecondary"
                      sx={{
                        mb: 1,
                        textDecoration: "none",
                        "&:hover": {
                          color: "#1b4d69",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", fontSize: "17px", mb: 2 }}
                  >
                    Company
                  </Typography>
                  {companyLinks.map((link, index) => (
                    <Link
                      key={link.name}
                      href={link.url}
                      display="block"
                      color="textSecondary"
                      sx={{
                        mb: 1,
                        textDecoration: "none",
                        "&:hover": {
                          color: "#1b4d69",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {link.name}
                    </Link>
                  ))}

                  <GetAppButton />
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Box
                  mt={4}
                  display="flex"
                  justifyContent={isMobile ? "center" : "flex-end"}
                  flexDirection={isMobile ? "column" : "row"}
                  alignItems="center"
                >
                  <Typography variant="body2" color="textSecondary">
                    © 2024 kalavyuha.com
                  </Typography>
                  <Typography sx={{ mx: 1 }} color="textSecondary">
                    |
                  </Typography>
                  <Link
                    href="/faq"
                    color="#1b4d69"
                    sx={{
                      mt: isMobile ? 1 : 0,
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    FAQ
                  </Link>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Container>

      {/* Cookie Settings Popup */}
      <CookiePopup
        forceShowSettings={showCookieSettings}
        onSettingsClose={closeCookieSettings}
      />
    </Container>
  );
};

export default Footer;

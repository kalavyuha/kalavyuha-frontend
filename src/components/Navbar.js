import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Popper,
  Paper,
  Fade,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Badge,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Download, MoreVert, Store } from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Signup from "../pages/Auth/Signup";
import Login from "../pages/Auth/Login";
import ColorLogo from "../assets/logo/kalavyuha-favicon/kalavyuha-favicon-color.png";
import { apiget } from '../pages/service/api';
import { useAuth } from '../Context/AuthContext';

import { Link } from "react-router-dom";

const StyledAppBar = styled(AppBar)({
  background: "#eaeef2",
  boxShadow: "0px 2px 3px -2px rgba(0, 0, 0, 0.1)",
  transition: "top 0.3s ease-in-out",
});

const NavButton = styled(Button)({
  color: "#1a1a1a",
  textTransform: "none",
  fontSize: "16px",
  borderRadius: "25px",
  padding: "6px 24px",
  "&:hover": {
    background: "#cdddec",
  },
});

const ProfileButton = styled(Button)({
  color: "#333",
  textTransform: "none",
  fontSize: "16px",
  borderRadius: "20px",
  padding: "6px 24px",
  background: "#cdddec",
  "&:hover": {
    background: "#cdddec",
    // boxShadow: "1px 2px 5px -2px black",
  },
});

const DownloadButton = styled(Button)({
  background: "#1b4d69",
  color: "white",
  textTransform: "none",
  borderRadius: "25px",
  padding: "6px 24px",
  "&:hover": {
    background: "#1b4d69",
  },
});

const Logo = styled("img")({
  height: "40px",
  marginRight: "20px",
});

const DropdownItem = styled(ListItem)({
  padding: "12px 24px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
});

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userAction, setUserAction] = useState(null);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const handleBackdropClick = (e) => {
    // Only close if clicking directly on the backdrop, not on child elements
    if (e.target === e.currentTarget) {
      setLoginOpen(false);
      setSignupOpen(false);
    }
  };

  // Fetch cart items function
  const fetchCartItems = async () => {
    try {
      if (user && user._id) {
        // For logged-in users, try API first
        try {
          const result = await apiget(`api/v1/addToCart/service/cart/${user._id}`);
          if (result && result.status === 200 && result?.data?.Data?.services) {
            setCartItems(result.data.Data.services);
            return;
          }
        } catch (apiError) {
          console.log("API fetch failed, using localStorage");
        }
      }
      
      // For non-logged-in users or API fallback, use localStorage
      const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartItems(savedCartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]);
    }
  };

  const handleCartClick = () => {
    // Check if we have a stored business ID and try to get business data
    const businessId = localStorage.getItem('businessId');
    let navigationState = {};
    
    if (businessId) {
      const storedBusinessData = localStorage.getItem(`businessData_${businessId}`);
      if (storedBusinessData) {
        try {
          const businessData = JSON.parse(storedBusinessData);
          navigationState = {
            _id: businessId,
            businessData: businessData
          };
        } catch (error) {
          console.error('Error parsing stored business data in navbar:', error);
        }
      }
      // Even if no stored business data, pass the business ID
      if (!navigationState._id) {
        navigationState._id = businessId;
      }
    }
    
    navigate('/cart', { state: Object.keys(navigationState).length > 0 ? navigationState : undefined });
  };

  const handleDownloadClick = () => {
    // Navigate to home page
    navigate('/');
    
    // Wait for navigation to complete, then scroll to AppInfoSection
    setTimeout(() => {
      const appInfoSection = document.getElementById('app-info-section');
      if (appInfoSection) {
        appInfoSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  useEffect(() => {
    // Initial cart fetch
    fetchCartItems();
    
    // Set up polling for cart updates (every 2 seconds)
    const cartInterval = setInterval(fetchCartItems, 2000);
    
    // Custom event listener for cart updates
    const handleCartUpdate = () => {
      setTimeout(fetchCartItems, 100); // Small delay to ensure data is updated
    };
    
    // Listen for custom cart events
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Listen for localStorage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'cartItems') {
        fetchCartItems();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for focus events to refresh cart
    const handleFocus = () => {
      fetchCartItems();
    };
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(cartInterval);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]); // Updated dependency to use user from auth context

  const handleLogOut = () => {
    logout(); // Use logout from auth context
  };

  useEffect(() => {
    if (loginOpen || signupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loginOpen, signupOpen]);

  // Listen for custom event to open login modal (from CartPage or anywhere)
  useEffect(() => {
    const handleOpenLoginModal = () => setLoginOpen(true);
    window.addEventListener('open-login-modal', handleOpenLoginModal);
    return () => {
      window.removeEventListener('open-login-modal', handleOpenLoginModal);
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMouseEnter = (event) => {
    if (timeoutId) clearTimeout(timeoutId);
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setAnchorEl(null);
    }, 300);
    setTimeoutId(id);
  };

  const handleCommunityToggle = () => {
    setCommunityOpen(!communityOpen);
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
  };

  const handleDropdownMouseLeave = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const visible =
        prevScrollPos > currentScrollPos || currentScrollPos < 100;
      setVisible(visible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const open = Boolean(anchorEl);

  const drawer = (
    <Box
      sx={{
        height: "max-content",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        px: 3,
        py: 1,
      }}
      role="presentation"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1, 
            mt: 1,
            cursor: "pointer"
          }}
          onClick={() => navigate("/")}
        >
          <Box
            component="img"
            src={ColorLogo}
            alt="Kalavyuha Logo"
            sx={{
              width: "40px",
              height: "auto",
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
              lineHeight: 1,
              color: "#1b4d69",
              fontSize: "14px",
            }}
          >
            Kalavyuha <br />
          </Typography>
        </Box>

        <IconButton
          color="inherit"
          aria-label="close drawer"
          edge="end"
          onClick={handleDrawerToggle}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ flexGrow: 1, overflowY: "auto" }}>
        {/* Cart Button in Mobile Menu */}
        {cartItems.length > 0 && (
          <ListItem 
            button 
            onClick={() => {
              handleCartClick();
              setMobileOpen(false);
            }}
            sx={{ 
              borderRadius: "50px", 
              "&:hover": { background: "#eaeef2" },
              mb: 1
            }}
          >
            <Badge badgeContent={cartItems.length}
             sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#1b4d69',
                    color: 'white'
                  },
                   mr: 2
                }}
             >
              <ShoppingCartIcon />
            </Badge>
            <ListItemText
              primary="Cart"
              sx={{
                "& .MuiTypography-root": {
                  fontWeight: "548!important",
                  color: "#1a1a1a !important",
                  fontSize: "0.9rem !important",
                  fontFamily: "inherit",
                },
              }}
            />
          </ListItem>
        )}
        
        <ListItem 
          button 
          onClick={() => {
            setSignupOpen(true);
            setMobileOpen(false);
          }}
        >
          <ListItemText
            primary="Signup"
            sx={{
              "& .MuiTypography-root": {
                fontWeight: "548!important",
                color: "#1a1a1a !important",
                fontSize: "0.9rem !important",
                fontFamily: "inherit",
              },
            }}
          />
        </ListItem>
        <ListItem 
          button
          onClick={() => {
            setLoginOpen(true);
            setMobileOpen(false);
          }}
        >
          <ListItemText
            primary="Login"
            sx={{
              "& .MuiTypography-root": {
                fontWeight: "548!important",
                color: "#1a1a1a !important",
                fontSize: "0.9rem !important",
                fontFamily: "inherit",
              },
            }}
          />
        </ListItem>
        <ListItem button>
          <ListItemText
            primary="Settings"
            sx={{
              "& .MuiTypography-root": {
                fontWeight: "548!important",
                color: "#1a1a1a !important",
                fontSize: "0.9rem !important",
                fontFamily: "inherit",
              },
            }}
          />
        </ListItem>
        <ListItem
          button
          onClick={handleCommunityToggle}
          sx={{ borderRadius: "50px", "&:hover": { background: "#eaeef2" } }}
        >
          <ListItemText
            sx={{
              position: "inline",
              "& .MuiTypography-root": {
                fontWeight: "548!important",
                color: "#1a1a1a !important",
                fontSize: "0.9rem !important",
                fontFamily: "inherit",
              },
            }}
            primary="More"
          />
          {communityOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </ListItem>
        <Collapse in={communityOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button sx={{ pl: 4 }} onClick={() => navigate('/support')}>
              <ListItemText
                primary="Support"
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: "548!important",
                    color: "#1a1a1a !important",
                    fontSize: "0.9rem !important",
                    fontFamily: "inherit",
                  },
                }}
              />
            </ListItem>
            <ListItem button sx={{ pl: 4 }}>
              <ListItemText
                primary="Community"
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: "548!important",
                    color: "#1a1a1a !important",
                    fontSize: "0.9rem !important",
                    fontFamily: "inherit",
                  },
                }}
              />
            </ListItem>
          </List>
        </Collapse>
        <ListItem 
          button
          onClick={() => {
            handleDownloadClick();
            setMobileOpen(false);
          }}
        >
          <ListItemText
            primary="Download App"
            sx={{
              "& .MuiTypography-root": {
                fontWeight: "548!important",
                color: "#1a1a1a !important",
                fontSize: "0.9rem !important",
                fontFamily: "inherit",
              },
            }}
          />
        </ListItem>
      </List>
      
      <Link
        to="/business/page"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <Box sx={{ p: 2 }}>
          <DownloadButton
            fullWidth
            sx={{
              fontWeight: "548!important",
              fontSize: "0.9rem !important",
              fontFamily: "inherit",
            }}
          >
            List Your Business
          </DownloadButton>
        </Box>
      </Link>

    </Box>
  );

  return (
    <Box sx={{ position: "relative" }}>
      <Container maxWidth="xl">
        <StyledAppBar
          style={{
            top: visible ? "0" : "-80px",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", padding: "8px 0" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1,
                  cursor: "pointer"
                }}
                onClick={() => navigate("/")}
              >
                <Box
                  component="img"
                  src={ColorLogo}
                  alt="Kalavyuha Logo"
                  sx={{
                    width: "60px",
                    height: "auto",
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", lineHeight: 1, color: "#1b4d69" }}
                >
                  Kalavyuha
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <NavButton startIcon={<Download />} onClick={handleDownloadClick}>Download</NavButton>
                <Link
                  to="/business/page"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <NavButton startIcon={<Store />}>List Your Business</NavButton>
                </Link>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mr: 2 }}
              >
                {/* Cart Button - Only show when cart has items */}
                {cartItems.length > 0 && (
                  <IconButton
                    size="small"
                    onClick={handleCartClick}
                    sx={{
                      color: "#333",
                      textTransform: "none",
                      fontSize: "16px",
                      borderRadius: "20px",
                      padding: "6px 18px",
                      "&:hover": {
                        boxShadow: "none",
                        background: "#cdddec",
                      },
                    }}
                  >
                    <Badge badgeContent={cartItems.length} sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#1b4d69',
                    color: 'white'
                  }
                }}>
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                )}
              </Box>

              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <ProfileButton
                  endIcon={<KeyboardArrowDownIcon />}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {isAuthenticated ? <AccountCircleIcon /> : "Sign In"}
                </ProfileButton>
              </Box>
            </Box>

            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon sx={{ color: "black" }} />
            </IconButton>
          </Toolbar>
        </StyledAppBar>
      </Container>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        sx={{ zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
              sx={{
                mt: 1,
                borderRadius: "12px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                minWidth: "200px",
              }}
            >
              {!isAuthenticated ? (
                <DropdownItem
                  sx={{ color: "#000" }}
                  onClick={() => setLoginOpen(true)}
                >
                  Sign In
                </DropdownItem>
              ) : (
                <>
                  <DropdownItem sx={{ color: "#000" }} onClick={() => navigate('/profile')}>
                    My Profile
                  </DropdownItem>
                  <DropdownItem sx={{ color: "#000" }} onClick={() => navigate('/appointment-history')}>
                    History
                  </DropdownItem>
                  <DropdownItem sx={{ color: "#000" }} onClick={handleLogOut}>
                    Sign out
                  </DropdownItem>
                </>
              )}
            <DropdownItem onClick={() => navigate('/support')}>Support</DropdownItem>
            <DropdownItem onClick={() => navigate('/under-construction')}>Community</DropdownItem>
            <DropdownItem onClick={handleDownloadClick}>Download App</DropdownItem>
            </Paper>
          </Fade>
        )}
      </Popper>

      {(loginOpen || signupOpen) && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // padding: 2,
          }}
          onClick={handleBackdropClick}
        >
          <Box
            sx={{
              position: "relative",
              // backgroundColor: "red",
              padding: 1,
              borderRadius: "12px",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflow: "auto",
              zIndex: 1500,
              // width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {signupOpen && (
              <Box sx={{ 
                overflow: "auto",
                "& > *": {
                  minHeight: "auto !important",
                  height: "auto !important"
                }
              }}>
                <Signup
                  setLoginOpen={setLoginOpen}
                  setSignupOpen={setSignupOpen}
                  setUserAction={setUserAction}
                />
              </Box>
            )}

            {loginOpen && (
              <Box sx={{ 
                overflow: "auto",
                "& > *": {
                  minHeight: "auto !important",
                  height: "auto !important"
                }
              }}>
                <Login
                  setLoginOpen={setLoginOpen}
                  setSignupOpen={setSignupOpen}
                  setUserAction={setUserAction}
                />
              </Box>
            )}
          </Box>
        </Box>
      )}

      <Drawer
        anchor="top"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "100%",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

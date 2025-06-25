import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { fontSize, fontWeight, styled } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Download,
  MoreVert,
  Notifications,
  Settings,

  Store,
} from '@mui/icons-material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Signup from '../pages/Auth/Signup';
import Login from '../pages/Auth/Login';
import ColorLogo from "../assets/logo/kalavyuha-favicon/kalavyuha-favicon-color.png"



const StyledAppBar = styled(AppBar)({
  background: '#eaeef2',
  boxShadow: '0px 2px 3px -2px rgba(0, 0, 0, 0.1)',
  transition: 'top 0.3s ease-in-out',
});

const NavButton = styled(Button)({
  color: '#1a1a1a',
  textTransform: 'none',
  fontSize: '16px',
  borderRadius: '25px',
  padding: '6px 24px',
  '&:hover': {
  background: '#cdddec',
  }
});



const ProfileButton = styled(Button)({
  color: '#333',
  textTransform: 'none',
  fontSize: '16px',
  borderRadius: '20px',
  padding: '6px 24px',
  background: '#cdddec',
  '&:hover': {
    background: '#cdddec',
    // boxShadow: "1px 2px 5px -2px black",
  },
});

const DownloadButton = styled(Button)({
  background: '#1b4d69',
  color: 'white',
  textTransform: 'none',
  borderRadius: '25px',
  padding: '6px 24px',
  '&:hover': {
    background: '#1b4d69',
  },
});

const Logo = styled('img')({
  height: '40px',
  marginRight: '20px',
});

const DropdownItem = styled(ListItem)({
  padding: '12px 24px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

export default function Navbar() {

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userAction, setUserAction] = useState(null)
  const [communityOpen, setCommunityOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const handleBackdropClick = () => {
    setLoginOpen(false);
    setSignupOpen(false);
  };


  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user_Id = JSON.parse(localStorage.getItem("userDetail"));
    if (user_Id) {
      setUserId(user_Id);
    }
  }, [userAction]);


  const handleLogOut = () => {
    localStorage.removeItem("userDetail");
    setUserId(null);

  }


  useEffect(() => {
    if (loginOpen || signupOpen) {

      document.body.style.overflow = 'hidden';
    } else {

      document.body.style.overflow = '';
    }
    return () => {

      document.body.style.overflow = '';
    };
  }, [loginOpen, signupOpen]);


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
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 100;
      setVisible(visible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);


  const open = Boolean(anchorEl);

  const drawer = (
    <Box sx={{ height: 'max-content', position: 'relative', display: 'flex', flexDirection: 'column', px: 3, py: 1 }} role="presentation">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Box
            component="img"
            src={ColorLogo}
            alt="Kalavyuha Logo"
            sx={{
              width: '40px',
              height: 'auto',
            }}
          />
          <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1, color: '#1b4d69', fontSize: "14px" }}>
            Kalavyuha <br />{' '}
            {/* <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '12px', color: '#000' }}>
              Business
            </Typography> */}
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

      <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <ListItem button>
          <ListItemText
            primary="Signup"
            sx={{
              '& .MuiTypography-root': {
                fontWeight: '548!important',
                color: '#1a1a1a !important',
                fontSize: '0.9rem !important',
                fontFamily: 'inherit',
              },
            }}
          />
        </ListItem>
        <ListItem button>
          <ListItemText
            primary="Login"
            sx={{
              '& .MuiTypography-root': {
                fontWeight: '548!important',
                color: '#1a1a1a !important',
                fontSize: '0.9rem !important',
                fontFamily: 'inherit',
              },
            }}
          />
        </ListItem>
        <ListItem button>
          <ListItemText
            primary="Settings"
            sx={{
              '& .MuiTypography-root': {
                fontWeight: '548!important',
                color: '#1a1a1a !important',
                fontSize: '0.9rem !important',
                fontFamily: 'inherit',
              },
            }}
          />
        </ListItem>
        <ListItem button onClick={handleCommunityToggle} sx={{ borderRadius: "50px", '&:hover': { background: "#eaeef2" } }}>
          <ListItemText sx={{
            position: "inline",
            '& .MuiTypography-root': {
              fontWeight: '548!important',
              color: '#1a1a1a !important',
              fontSize: '0.9rem !important',
              fontFamily: 'inherit',
            },
          }} primary="More" />
          {communityOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </ListItem>
        <Collapse in={communityOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button sx={{ pl: 4 }}>
              <ListItemText primary="Support" sx={{
                '& .MuiTypography-root': {
                  fontWeight: '548!important',
                  color: '#1a1a1a !important',
                  fontSize: '0.9rem !important',
                  fontFamily: 'inherit',
                },
              }} />
            </ListItem>
            <ListItem button sx={{ pl: 4 }}>
              <ListItemText primary="Community" sx={{
                '& .MuiTypography-root': {
                  fontWeight: '548!important',
                  color: '#1a1a1a !important',
                  fontSize: '0.9rem !important',
                  fontFamily: 'inherit',
                },
              }} />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button>
          <ListItemText primary="Download App" sx={{
            '& .MuiTypography-root': {
              fontWeight: '548!important',
              color: '#1a1a1a !important',
              fontSize: '0.9rem !important',
              fontFamily: 'inherit',
            },
          }} />
        </ListItem>
      </List>
      <Box sx={{ p: 2 }}>
        <DownloadButton fullWidth sx={{ fontWeight: '548!important', fontSize: '0.9rem !important', fontFamily: 'inherit', }}>
          List Your Business
        </DownloadButton>
     </Box>
    </Box>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      <Container maxWidth="xl">
        <StyledAppBar
          style={{
            top: visible ? '0' : '-80px',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', padding: '8px 0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  component="img"
                  src={ColorLogo}
                  alt="Kalavyuha Logo"
                  sx={{
                    width: '60px',
                    height: 'auto',
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1, color: '#1b4d69' }}>
                  Kalavyuha 
                </Typography>
              </Box>

            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NavButton startIcon={<Download />}>
                  Download
                </NavButton>

                <a
                  href="/business-page"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <NavButton startIcon={<Store />}>
                    Store
                  </NavButton>
                </a>
              </Box>

              <IconButton size="small" color="#000" sx={{ pointerEvents: 'none', '&:hover': { background: "none" } }}>
                <MoreVert />
              </IconButton>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
                <IconButton size="small" color="#000" sx={{
                  color: '#333',
                  textTransform: 'none',
                  fontSize: '16px',
                  borderRadius: '20px',
                  padding: '6px 18px',
                  // border: "1px solid black",
                  // boxShadow:"1px 2px 5px -2px black",
                  '&:hover': {
                    boxShadow: "none",
                    background: '#cdddec',
                  },
                }}

                >
                  <Notifications />
                </IconButton>
              </Box>

              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <ProfileButton
                  endIcon={<KeyboardArrowDownIcon />}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {userId ? <AccountCircleIcon /> : "Sign In"}
                </ProfileButton>
              </Box>

            </Box>



            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
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
                borderRadius: '12px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                minWidth: '200px',
              }}
            >
              {!userId ? (
                <DropdownItem sx={{ color: '#000' }} onClick={() => setLoginOpen(true)}>
                  Sign In
                </DropdownItem>
              ) : (
                <DropdownItem sx={{ color: '#000' }} onClick={handleLogOut}>
                  Sign out
                </DropdownItem>
              )}
              <DropdownItem>Support</DropdownItem>
              <DropdownItem>Community</DropdownItem>
              <DropdownItem>Download App</DropdownItem>
            </Paper>
          </Fade>
        )}
      </Popper>


      {(loginOpen || signupOpen) && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent backdrop
            zIndex: 1400, // Higher than Popper
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handleBackdropClick} // Close on clicking the backdrop
        >
          <Box
            sx={{
              position: 'relative',
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              minWidth: '300px',
              background: 'transparent',
              zIndex: 1500, // Ensure it's above the backdrop
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {signupOpen && <Signup
              setLoginOpen={setLoginOpen}
              setSignupOpen={setSignupOpen}
              setUserAction={setUserAction}
            />}

            {loginOpen && <Login
              setLoginOpen={setLoginOpen}
              setSignupOpen={setSignupOpen}
              setUserAction={setUserAction}
            />}

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
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            // height: '100%',
            width: '100%',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
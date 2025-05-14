import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Logo from "../../assets/logo/kalavyuha-favicon/kalavyuha-favicon-color.png"
import { MessagesSquare, Send, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import DocumentUpload from '../../components/documentUploads';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1b4d69',
    },
    background: {
      default: '#fff',
    },
  },
});


export default function BusinessDocumentUploads() {
  const previousData = useLocation();
  const navigate = useNavigate();
  
  const { 
    firstName, lastName, email, countryCode, phone, 
    formData, teamSize, teamMembers, 
    services 
  } = previousData.state || {};

  const handleBackTeamPresence = () => {
    navigate('/business-service-info', { state: previousData.state });
  };


  
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          bgcolor: 'background.default',
          overflow:"hidden",
        }}
      >
        <Container maxWidth={false} disableGutters sx={{ display: 'flex', flexGrow: 1, margin:0 }}>
          <Grid container>
            <Grid item xs={12} md={4} square>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',          
                  bgcolor: '#e2e6ea',
                  minHeight: "91vh",
                  margin: 2,
                  borderRadius: "16px", 
                  padding: 2.5,
                }}
              > 
                <Typography variant="h6" component="div" sx={{ mb: 2, color: '#1b4d69', display: 'flex', alignItems: 'center', fontWeight: "bold" }}>
                  <Box component="img" src={Logo} alt="Kalavyuha Logo" sx={{ width: 30, height: 30, mr: 1 }} />     
                  Kalavyuha
                </Typography>
                
                <Typography variant="h6" sx={{ mb: 0, fontWeight:"bold" }}>
                  Chat with us
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Speak to our friendly team via live chat.
                </Typography>
                
                <Button
                  startIcon={<MessagesSquare />}
                  sx={{ mb: 1, textTransform: "capitalize", color: "black", fontWeight: "bold", px:2 }}
                >
                  Start live chat
                </Button>
                <Button
                  startIcon={<Send />}
                  sx={{textTransform: "capitalize", color: "black", fontWeight: "bold", px:2 }}
                >
                  Shoot us an email
                </Button>

                <Typography variant="h6" sx={{ mb: 0,mt:2, fontWeight:"bold" }}>
                  Your Details
                </Typography>
                <Box sx={{ display: 'flex', width: '100%' }}>
                    <Box sx={{ flexGrow: 1, pr: 2, paddingRight: "40px" }}>
                      <Typography variant="body2" sx={{ mb: 2, fontSize: 12, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        <b>Full Name:</b> {firstName} {lastName} <br />
                        <b>Email:</b> {email}<br />
                        <b>Phone no:</b> {countryCode} {phone}
                      </Typography>

                      <Typography variant="h6" sx={{ mb: 0, mt: 2, fontWeight: "bold" }}>
                        Business Introduction
                      </Typography>
                      <Box 
                        sx={{ 
                          maxHeight: '45vh',
                          overflowY: 'auto',  
                          width: '100%',    
                          padding: '4px 24px 4px 0',
                          
                        }}
                      >
                        <Typography variant="body2" sx={{ mb: 2, fontSize: 12, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                          <b>Business Name:</b> {formData.businessName} <br />
                          <b>Introduction:</b> {formData.introduction} <br />
                          <b>Location:</b> {formData.shopName}, near  {formData.nearBy}, {formData.streetAddress}, {formData.cityState}, Pin Code: {formData.zipCode} <br />
                        </Typography>
                        
                        <Typography variant="h6" sx={{ mb: 0, mt: 2, fontWeight: "bold" }}>
                          Staff Presence
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 2, fontSize: 12, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                          <b>Employees:</b> {teamSize || "None"} <br />
                          <b>Team Members:</b>
                          <ul style={{ listStyleType: 'none', paddingLeft: 0, marginTop:0 }}>
                            {teamMembers.length > 0 ? (
                              teamMembers.map((member, index) => (
                                <li key={member.id} style={{ marginBottom: '8px' }}>
                                  <b style={{ marginLeft: 15 }}>{index + 1}:</b> <b>Name:</b> {member.name || "None"} <b>Experience:</b> {member.experience || "None"}<br />
                                  <b style={{ marginLeft: 30 }}>Role:</b> {member.role && member.role.length > 0 ? member.role.join(', ') : "None"} <br />
                                </li>
                              ))
                            ) : (
                              <li style={{ marginBottom: '8px' }}>No team members added.</li>
                            )}
                          </ul>
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 0, mt: 2, fontWeight: "bold" }}>
                          Services
                        </Typography>
                        
                        <Typography variant="body2" sx={{ mb: 2, ml:1.5,fontSize: 12, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                          {services.length > 0 ? (
                            <ul style={{ listStyleType: 'none', paddingLeft: 0, marginTop: 0 }}>
                              {services.map((service, index) => (
                                <li key={service.id} style={{ marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
                                  <b style={{ marginLeft: -10}}>{index + 1}.</b>
                                  <b style={{ marginLeft: 5 }}>Name:</b> {service.name || "None"} <br />
                                  <b style={{ marginLeft: 5 }}>Price:</b> ${service.price} <br />
                                  <b style={{ marginLeft: 5 }}>Duration:</b> {service.duration} {service.durationType} <br />
                                  <b style={{ marginLeft: 5 }}>Assigned Staff:</b> {service.staff.length > 0 ? service.staff.join(', ') : "None"} <br />
                                  <b style={{ marginLeft: 5 }}>Uploaded:</b> {service.uploaded ? "Yes" : "No"} <br />
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div>No services added yet.</div>
                          )}
                        </Typography>

                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '8px', height: '140px' }}>
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <Box
                          key={index}
                          sx={{
                            width: '8px',
                            height: index === 5 ? '54px' : '22px',
                            backgroundColor: index === 5 ? 'primary.main' : '#aec5d2',
                            borderRadius: '4px',
                            mb: 0.5,
                          }}
                        />
                      ))}
                    </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right */}
            <Grid item xs={12} md={8} sx={{alignContent: "center",  height: '100vh', overflow: 'auto'}}>
              <Box
                sx={{
                    my: 3,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding:0,
                }}
              >
                <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#1b4d69",textAlign:"center" }}>
                    Final Step! Verify Your Business
                </Typography>

                <Typography variant="subtitle1" sx={{ mb: 3, textAlign:"center" }}>
                    Complete your business profile by submitting essential<br/> documents for verification.    
                </Typography>

                
                <DocumentUpload/>
                <Box sx={{ mt: 2, maxWidth: 600, width: '100%', mx: 4 }}>
                    
                    <Grid item xs={12} sx={{mt:2}}>
                        <Grid container sx={{justifyContent: "space-between"}}>
                        
                        <Grid item xs={3}>
                            <Button 
                            fullWidth
                            variant="outlined" 
                            sx={{ mt: 3, mb: 2, borderRadius: "24px",color: "black", textTransform: "none", borderColor: "#d9d9d9", background:"#fbfbfb" }}
                            onClick={handleBackTeamPresence}
                            >
                            <ArrowLeft className="mr-2" style={{ width: "26px", height: "16px" }} />
                            <b>Go Back</b>
                            </Button>
                        </Grid>


                        <Grid item xs={3}>
                            <Button 
                            type="submit" 
                            fullWidth 
                            variant="contained" 
                            sx={{ mt: 3, mb: 2, textTransform: "none", borderRadius: "24px", bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' } }}
                            >
                            Preview
                            </Button>
                        </Grid>
                        </Grid>
                    </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
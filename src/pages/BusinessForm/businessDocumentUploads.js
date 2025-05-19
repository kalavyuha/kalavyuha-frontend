import React, { useRef, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import DocumentUpload from '../../components/documentUploads';
import LeftPanel from './components/leftpanel'
import { constant } from '../../constant.js';

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
  const location = useLocation();
  const storedData = localStorage.getItem('formData');
  const previousData = location.state || (storedData ? JSON.parse(storedData) : {});


  const navigate = useNavigate();
  const [fileList, setFileList] = useState({});

  const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)?.[1]; 

  const { 
    firstName, lastName, email, countryCode, phone, 
    teamSize, teamMembers, 
    services 
  } = previousData || {};

  

  const handleBackTeamPresence = () => {
    navigate('/business-service-info', { state: previousData });
  };

  // backend integration
  const handleSubmit = async () => {
    try {
        // 1. Submit Business Details
        const businessPayload = {
            BussinessUserId: Number(previousData.MerchantAccountID),
            BussinessType: previousData.businessRole,
            BusinessName: previousData.formData.businessName,
            ProfileImage: previousData.formData.profilePicture ?? "",
            Introduction: previousData.formData.introduction ?? null,
            ShopNumber: previousData.formData.shopNumber ?? null,
            StreetAddress: previousData.formData.streetAddress,
            Nearby: null,
            ZipCode: previousData.formData.zipCode,
            Region: `${previousData.formData.city}, ${previousData.formData.state}`,
            Latitude: parseFloat(previousData.formData.adrsLatitude),
            Longitude: parseFloat(previousData.formData.adrsLongitude),
            LikesCount: 0,
            website: previousData.formData.website ?? null,
            OpeningTime: previousData.formData.openingTime ?? "00:00",
            ClosingTime: previousData.formData.closingTime ?? "00:00",
            CreatedBy: 1,
            UpdatedBy: 1,
        };

        const businessResponse = await fetch(`${constant.baseUrl}api/v1/BussinessDetails/create/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(businessPayload),
        });

        // const businessData = await businessResponse.json();
        // const businessId = Number(businessData.Data?._id);
  
        // if (!businessResponse.ok) throw new Error('Failed to save business details');

        // 2. Submit Staff Data
        // const staffPayload = teamMembers.map(member => ({
        //   BussinessId: businessId,
        //   Name: member.name,
        //   StaffNumber: Number(member.id),
        //   Gender: member.gender,
        //   ProfileImage: member.profileImage || "",
        //   Experience: String(member.experience), // Ensure it's a string
        //   Role: Array.isArray(member.role) ? member.role.join(", ") : "General", // Convert to string
        //   Specialization: "Orthopedics"
        // }));

        // await fetch(`${constant.baseUrl}api/v1/Staff/create`, {
        //     method: "POST", 
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(staffPayload),
        // });

        // // 3. Submit Services
        // const staffMap = new Map(teamMembers.map(member => [member.name, Number(member.id)]));
       
        // const servicePayload = services.map(service => ({
        //   BussinessId: businessId, 
        //   ServiceName: service.name,
        //   Price: parseFloat(service.price),
        //   Duration: service.durationType === "days" 
        //       ? `${service.duration}d`
        //       : service.durationType === "hours"
        //       ? `${service.duration}h`
        //       : service.durationType === "minutes"
        //       ? `${service.duration}m`
        //       : service.durationType === "months"
        //       ? `${service.duration}mo`
        //       : `${service.duration}`,
        //   AssignedStaffs: service.staff
        //       .map(staffName => staffMap.get(staffName))
        //       .filter(id => id !== undefined),
        //   ImageURL: "",  
        //   isDiscount: false,
        //   DiscountPercentage: null  
        // }));

        // await fetch(`${constant.baseUrl}api/v1/Service/create/`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(servicePayload),
        // });


        
        // // 4. Submit Documents
        // const backendKeys = {
        //     "Pan Card (Owner)": "PanCard",
        //     "GST Certificate": "GstCertification",
        //     "Business License": "BusinessLicense",
        //     "Insurance Certificate": "InsuranceCertificate",
        //     "Utility Bills": "UtilityBills",
        //     "Upload Images": "Images",
        // };

        // const formData_n = new FormData();
        // Object.keys(fileList).forEach(docName => {
        //     const key = backendKeys[docName];
        //     if (key) {
        //         fileList[docName].forEach(file => formData_n.append(key, file.originFileObj || file));
        //     }
        // });

        // const url = `${constant.baseUrl}api/v1/Documents/create/?BussinessId=${businessId}`;
        // const response = await fetch(url, {
        //     method: 'POST',
        //     headers: { 'X-CSRFToken': csrfToken },
        //     body: formData_n,
        // });

        // if (!response.ok) {
        //     const errorData = await response.json();
        //     console.error("Error uploading documents:", errorData);
        //     alert("Document upload failed! Please reselect the documents and try again.");
        //     setFileList({});
        //     return;
        // }


        // alert('All data uploaded successfully!');
        
        // localStorage.removeItem("formData");
        // navigate(previousData.pathname, { replace: true, state: null }); 
        // navigate('/business-page');
            

    } catch (error) {
        console.error('Error during submission:', error);
        alert(`Error: ${error.message}`);
    }
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
              <LeftPanel
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  countryCode={countryCode}
                  phone={phone}
                  isSignIn={true}
                  formData={previousData} 
                />

              {/* <Box
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
                        maxHeight: '47vh',
                        overflow: 'hidden',  // Disable scrollbar
                        position: 'relative',
                        width: '100%',
                      }}
                      >
                      <Box 
                        ref={scrollContainerRef} 
                        sx={{
                          overflowY: 'hidden', // Disable scrollbar
                          padding: '4px 24px 4px 0',
                          maxHeight: '45vh', 
                        }}
                      >
                        <Typography variant="body2" sx={{ mb: 2, fontSize: 12, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                          <b>Business Name:</b> {formData.businessName} <br />
                          <b>Introduction:</b> {formData.introduction} <br />
                          <b>Location:</b> {formData.shopName}, near  {formData.nearBy}, {formData.streetAddress}, {formData.city} {formData.state}, Pin Code: {formData.zipCode} <br />
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
                        
                        <Typography variant="body2" sx={{ mb: 2, ml: 1.5, fontSize: 12, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                          {services.length > 0 ? (
                            <ul style={{ listStyleType: 'none', paddingLeft: 0, marginTop: 0 }}>
                              {services.map((service, index) => (
                                <li key={service.id} style={{ marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
                                  <b style={{ marginLeft: -10 }}>{index + 1}.</b>
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
                     
                    </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column-reverse', 
                      marginRight:"-31px",
                      padding: '8px', 
                    }}
                  >
                      {isScrollable && (
                        <>
                          <Button
                            onClick={handleScrollDown}
                            sx={{ color: canScrollDown ? 'black' : 'gray', fontWeight: 'bold', minWidth: '0px' }}
                            disabled={!canScrollDown}
                          >
                            <ChevronDown />
                          </Button>

                          <Button
                            onClick={handleScrollUp}
                            sx={{ color: canScrollUp ? 'black' : 'gray', fontWeight: 'bold', minWidth: '0px' }}
                            disabled={!canScrollUp}
                          >
                            <ChevronUp />
                          </Button>
                        </>
                      )}
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
              </Box> */}
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

                
                <DocumentUpload setFileListParent={setFileList}/>

                <Box sx={{ mt: 1, maxWidth: 600, width: '100%', mx: 4 }}>
                    
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
                            onClick={handleSubmit}
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
import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Button, LinearProgress} from '@mui/material';
import { MessagesSquare, Send, ChevronUp, ChevronDown } from 'lucide-react';
import Logo from '../../../assets/logo/kalavyuha-favicon/kalavyuha-favicon-color.png';

const LeftPanel = ({
  firstName = '',
  lastName = '',
  email = '',
  countryCode = '',
  phone = '',
  isSignIn = '',
  businessRoleForm = '',
  formData = {},
}) => {
  const scrollContainerRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let completedSteps = 0;
    const totalSteps = 6; 

    if (formData.businessRole) completedSteps++; 
    if (formData.businessInfoCompleted) completedSteps++;
    if (formData.teamInfoCompleted) completedSteps++; 
    if (formData.services?.length > 0) completedSteps++;
    
    setProgress((completedSteps / totalSteps) * 100);
  }, [firstName, email, formData.businessRole, formData.businessProfile, formData.teamPresence, formData.services]);


  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        setCanScrollUp(scrollTop > 0);
        setCanScrollDown(scrollTop + clientHeight < scrollHeight);
        setIsOverflowing(scrollHeight > clientHeight); // Check if content overflows
      }
    };

    if (scrollContainerRef.current) {
      checkScroll();
      scrollContainerRef.current.addEventListener('scroll', checkScroll);
    }

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: direction * 100, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', bgcolor: '#e2e6ea', minHeight: '91vh', margin: 2, borderRadius: '16px', padding: 2.5 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#1b4d69', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
        <Box component="img" src={Logo} alt="Kalavyuha Logo" sx={{ width: 30, height: 30, mr: 1 }} />
        Kalavyuha
      </Typography>

      <Typography variant="h6" sx={{ mb: 0, fontWeight: 'bold' }}>Chat with us</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>Speak to our friendly team via live chat.</Typography>

      <Button startIcon={<MessagesSquare />} sx={{ mb: 1, textTransform: 'capitalize', color: 'black', fontWeight: 'bold' }}>Start live chat</Button>
      <Button startIcon={<Send />} sx={{ textTransform: 'capitalize', color: 'black', fontWeight: 'bold' }}>Shoot us an email</Button>
        
      
       {/* Progress Section */}
       {(isSignIn || businessRoleForm) && (
        <>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            Profile Completion
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              width: '100%',
              height: 10,
              borderRadius: 5,
              backgroundColor: "#d3d3d3",
              "& .MuiLinearProgress-bar": { backgroundColor: "#1b4d69" }
            }}
          />
          <Typography sx={{ mt: 1, fontSize: 12, fontWeight: 'bold' }}>
            {Math.round(progress)}% Completed
          </Typography>
        </>
      )}

      <Box sx={{ maxHeight: '47vh', overflow: 'hidden', width: '100%' }}>
        <Box ref={scrollContainerRef} sx={{ overflowY: 'auto', padding: '4px 24px 4px 0', maxHeight: '45vh' }}>

          {/* Your Details Section */}
          {(isSignIn || formData.agreeTerms) && (
            <>
              <Typography variant="h6" sx={{ mb: 0, mt: 2, fontWeight: 'bold' }}>Your Details</Typography>
              <Typography variant="body2" sx={{ mb: 2, fontSize: 12, wordBreak: 'break-word' }}>
                <b>Full Name:</b> {firstName} {lastName} <br />
                <b>Email:</b> {email} <br />
                <b>Phone no:</b> {countryCode} {phone}
              </Typography>
            </>
          )}

          {/* Business Introduction Section */}
          {(isSignIn && formData.businessInfoCompleted) && (
            <>
              <Typography variant="h6" sx={{ mb: 0, mt: 2, fontWeight: 'bold' }}>Business Introduction</Typography>
              <Typography variant="body2" sx={{ mb: 2, fontSize: 12, wordBreak: 'break-word' }}>
                <b>Business Name:</b> {formData.formData.businessName} <br />
                <b>Introduction:</b> {formData.formData.introduction} <br />
                <b>Location:</b> {formData.formData.shopName}, near {formData.formData.nearBy}, {formData.formData.streetAddress}, {formData.formData.city} {formData.formData.state}, Pin Code: {formData.formData.zipCode}
              </Typography>
            </>
          )}

          {/* Staff Presence Section */}
          {(isSignIn && formData.teamInfoCompleted) && (
            <>
              <Typography variant="h6" sx={{ mb: 0, mt: 2, fontWeight: 'bold' }}>Staff Presence</Typography>
              <Typography variant="body2" sx={{ mb: 2, fontSize: 12, wordBreak: 'break-word' }}>
                <b>Employees:</b> {formData.teamSize || 'None'} <br />
                <b>Team Members:</b>
                <ul style={{ listStyleType: 'none', paddingLeft: 0, marginTop: 0 }}>
                  {formData.teamMembers?.length > 0 ? (
                    formData.teamMembers.map((member, index) => (
                      <li key={member.id} style={{ marginBottom: '8px' }}>
                        <b>{index + 1}:</b> <b>Name:</b> {member.name || 'None'}, <b>Experience:</b> {member.experience || 'None'}<br />
                        <b>Role:</b> {member.role?.join(', ') || 'None'}
                      </li>
                    ))
                  ) : (
                    <li>No team members added.</li>
                  )}
                </ul>
              </Typography>
            </>
          )}

          {/* Services Section */}
          {isSignIn && formData && Array.isArray(formData.services) && formData.services.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 0, mt: 2, fontWeight: "bold" }}>
                Services
              </Typography>

              <Typography variant="body2" sx={{ mb: 2, ml: 1.5, fontSize: 12, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                <ul style={{ listStyleType: 'none', paddingLeft: 0, marginTop: 0 }}>
                  {formData.services.map((service, index) => (
                    <li 
                      key={service.id} 
                      style={{ marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}
                    >
                      <b style={{ marginLeft: -10 }}>{index + 1}.</b>
                      <b style={{ marginLeft: 5 }}>Name:</b> {service.name || "None"} <br />
                      <b style={{ marginLeft: 5 }}>Price:</b> ₹{service.price || "N/A"} <br />
                      <b style={{ marginLeft: 5 }}>Duration:</b> {service.duration} {service.durationType || "N/A"} <br />
                      <b style={{ marginLeft: 5 }}>Assigned Staff:</b> {service.staff?.length > 0 ? service.staff.join(', ') : "None"} <br />
                      <b style={{ marginLeft: 5 }}>Uploaded:</b> {service.uploaded ? "Yes" : "No"} <br />
                    </li>
                  ))}
                </ul>
              </Typography>
            </>
          )}

        </Box>
      </Box>

      {/* Scroll Buttons  */}
      {/* {isOverflowing && (
        <Box sx={{ display: 'flex', flexDirection: 'column-reverse', marginRight: '-31px', padding: '8px' }}>
          <Button onClick={() => handleScroll(1)} sx={{ color: canScrollDown ? 'black' : 'gray', fontWeight: 'bold', minWidth: '0px' }} disabled={!canScrollDown}>
            <ChevronDown />
          </Button>
          <Button onClick={() => handleScroll(-1)} sx={{ color: canScrollUp ? 'black' : 'gray', fontWeight: 'bold', minWidth: '0px' }} disabled={!canScrollUp}>
            <ChevronUp />
          </Button>
        </Box>
      )} */}
    </Box>
  );
};

export default LeftPanel;

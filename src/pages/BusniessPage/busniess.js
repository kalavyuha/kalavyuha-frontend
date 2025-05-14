import React,{useState} from 'react';
import {
  Box,
  Container,
  useMediaQuery,
} from '@mui/material';



import NavbarSection from "./navbarsection.js"
import BusinessLandingSection from "./businessLanding"
import BenefitsSection from  "./benefitSection"
import BusinessAreaSection from './buniessAreaSection';
import BuniessSuccessStories from "./buniessSuccessStories"
import KalavyhuaOnboarding from './kalavyuhaSteps';

import FeaturesAvailable from "./featuresShown";
import FAQSection from "./faqSection"
import Footer from "./businessFooter"

// responsive
import { useTheme } from '@mui/material/styles';

const BusniessPage = () => {
  


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
  const [drawerOpen, setDrawerOpen] = useState(false);

  
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#eaeef2' }}>

      {/* navbar */}

      <Container style={{maxWidth: "none"}}>
        <Container maxWidth="lg">
          <NavbarSection/>
        </Container>
      </Container>
      
      {/* section one */}
      <Container style={{maxWidth: "none"}} sx={{ mt: 15, backgroundColor: '#e2e6ea' }}  >
        <Container maxWidth="lg">
            <BusinessLandingSection/>
        </Container>
      </Container>

      {/* section two */}
      <Container style={{maxWidth: "none"}} sx={{ mt: 10 }}  >
        <Container maxWidth="lg">
            <BenefitsSection/>
        </Container>
      </Container>
      

      {/* section three */}
      <Container style={{maxWidth: "none"}} sx={{ mt: 10 }}>
          <Container maxWidth="lg">
            <BusinessAreaSection/>
          </Container>
      </Container>


      {/* section four */}
      <Container style={{maxWidth: "none"}} sx={{ mt: 10 }}>
        <Container maxWidth="lg">
            <BuniessSuccessStories/>
        </Container>
      </Container>


      {/* section five  account creation steps*/}
      <Container style={{maxWidth: "none"}} sx={{ mt: 15 }} >
          <Container maxWidth="lg">
            <KalavyhuaOnboarding/>
          </Container>
      </Container>

      {/* section six Feature Avaible*/}
      <Container style={{maxWidth: "none"}} sx={{ mt: 15 }}>
          <Container maxWidth="lg">
            <FeaturesAvailable/>
          </Container>
      </Container>

      {/* section seven FAQ */}
      <Container style={{maxWidth: "none"}} sx={{ mt: 5 }}>
          <Container maxWidth="lg">
            <FAQSection/>
          </Container>
      </Container>


      {/* section eight Footer */}
      <Container style={{maxWidth: "none"}} sx={{ mt: 5, background:"white"}}>
        <Container maxWidth="lg">
            <Footer/>
        </Container>
      </Container>

    </Box>
  );
};

export default BusniessPage;


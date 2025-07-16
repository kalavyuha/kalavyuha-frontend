// import { Grid2 } from '@mui/material'
import { Grid } from '@mui/material'
import React, { useState } from 'react'
import LeftPanel from '../BusinessForm/components/leftpanel'
// import LeftSection from './LeftSection'
import LoginSection from './LoginSection'
import ForgotPassword from './ForgotPassword'




const Screen = () => {
     const [showForgot, setShowForgot] = useState(false);

  return (
   <>
   <Grid container size={12}>
     {/* Left Panel */}
            <Grid 
              item 
              xs={12} 
              md={4}
              sx={{
                order: { xs: 1, md: 1 },
                minHeight: { xs: 'auto', md: '100vh' },
                bgcolor: 'background.paper',
              }}
            >
              <LeftPanel
                // firstName={formData.firstName}
                // lastName={formData.lastName}
                // email={formData.email}
                // countryCode={formData.countryCode}
                // phone={formData.phone}
              />
            </Grid>
   {/* Right Panel*/}
   <Grid 
              item 
              xs={12} 
              md={8} 
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: { xs: 'auto', md: '100vh' },
                py: { xs: 2, sm: 4, md: 8 },
                px: { xs: 2, sm: 4, md: 6 },
                order: { xs: 2, md: 2 },
                bgcolor: 'background.default',
              }}
            >
  {showForgot ? (
        <ForgotPassword onBack={() => setShowForgot(false)} />
      ) : (
        <LoginSection onForgotPassword={() => setShowForgot(true)} />
      )}
      </Grid>
   </Grid>
   </>
  )
}

export default Screen
import React, { useEffect, Suspense, lazy } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { MatchingSearchResultProvider } from "./Context/detailPageContext";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { SearchBarProvider } from "./Context/searchBarContext";


const MaterialLoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      gap: 2
    }}
  >
    <CircularProgress color="primary" size={60} thickness={4} />

  </Box>
);

// Lazy load all page components
const Home = lazy(() => import("./pages/main"));
const BeautyMain = lazy(() => import("./pages/BeautyPage/beautymain"));
const Overview = lazy(() => import("./pages/Overview/Overview"));
const CartMain = lazy(() => import("./pages/CartPage/Cart"));
const SuccessCart = lazy(() => import("./pages/CartPage/SuccessCart"));
const BusniessPage = lazy(() => import("./pages/BusniessPage/busniess"));

// Lazy load business form pages
const CreateBusniessAccount = lazy(() => import("./pages/BusinessForm/createAccount"));
const OTPVerification = lazy(() => import("./pages/BusinessForm/otpVerification"));
const BusinessRoleSelection = lazy(() => import("./pages/BusinessForm/businessRoleSelection"));
const BusinessInfoSelection = lazy(() => import("./pages/BusinessForm/businessInfoSelection"));
const BusinessProfileForm = lazy(() => import("./pages/BusinessForm/businessProfile"));

// const BusinessHoursSection = lazy(() => import("./pages/BusinessForm/businessHours"));

const TeamPresence = lazy(() => import("./pages/BusinessForm/teamPresence"));
const BusinessServiceInfo = lazy(() => import("./pages/BusinessForm/businessServiceInfo"));
const BusinessDocumentUploads = lazy(() => import("./pages/BusinessForm/businessDocumentUploads"));

function App() {
  const location = useLocation();
  const hideNavbarRoutes = [
    "/business-page",
    "/business-account",
    "/otp-verification",
    "/business-role-selection",
    "/business-info-selection",
    "/business-profile-form",
    "/business-team-presence",
    "/business-service-info",
    "/business-document-uploads"
  ];

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <React.StrictMode>
      {shouldShowNavbar && <Navbar />}
      <Suspense fallback={<MaterialLoadingFallback />}>
        <Routes basename="/kalavyuha-frontend">
          <Route exact path="/" element={<Home />} />
          <Route exact path="/overview" element={<Overview />} />
          <Route path="/detail/:id" element={<BeautyMain />} />
          <Route path="/cart" element={<CartMain />} />
          <Route path="/cart/success" element={<SuccessCart />} />

          {/* Business form routes */}
          <Route exact path="/business-page" element={<BusniessPage />} />
          <Route exact path="/business-account" element={<CreateBusniessAccount />} />
          <Route exact path="/otp-verification" element={<OTPVerification />} />
          <Route exact path="/business-role-selection" element={<BusinessRoleSelection />} />
          <Route exact path="/business-info-selection" element={<BusinessInfoSelection />} />
          <Route exact path="/business-profile-form" element={<BusinessProfileForm />} />
          <Route exact path="/business-team-presence" element={<TeamPresence />} />
          <Route exact path="/business-service-info" element={<BusinessServiceInfo />} />
          <Route exact path="/business-document-uploads" element={<BusinessDocumentUploads />} />
        </Routes>
      </Suspense>
      {shouldShowNavbar && <Footer />}
    </React.StrictMode>
  );
}

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function AppWrapper() {
  return (
    <Router basename="/kalavyuha-frontend">
      <SearchBarProvider>
        <MatchingSearchResultProvider>
          <ScrollToTop />
          <App />
        </MatchingSearchResultProvider>
      </SearchBarProvider>
    </Router>
  );
}

export default AppWrapper;
import React, { useEffect, Suspense, lazy } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation
} from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { MatchingSearchResultProvider } from "./Context/detailPageContext";
// import { HashRouter as Router } from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import CookiePopup from "./components/Cookies";
import ErrorBoundary from "./components/ErrorBoundary";
import { SearchBarProvider } from "./Context/searchBarContext";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";


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
const PaymentPage = lazy(() => import("./pages/CartPage/PaymentPage")); //-----ADDED PAYMENT PAGE
const BookingSuccessPage = lazy(() => import("./pages/CartPage/BookingSuccessPage"));
const BusniessPage = lazy(() => import("./pages/BusniessPage/busniess"));
const Support = lazy(() => import("./pages/SupportPage/Support"));  //-----ADDED SUPPORT PAGE
const About = lazy(() => import("./pages/About/About"));  //-----ADDED ABOUT PAGE
const TermsConditions = lazy(() => import("./pages/TermsConditions/termsConditions"));  //-----ADDED T&C PAGE
const Privacy = lazy(() => import("./pages/Privacy/Privacy"));  //-----ADDED Privacy PAGE
const AppointmentHistory = lazy(() => import("./pages/AppointmentHistory/AppointmentHistory"));  //-----ADDED HISTORY PAGE
const AppointmentHistoryDetail = lazy(() => import("./pages/AppointmentHistory/AppointmentHistoryDetail"));  //-----ADDED APPOINTMENT DETAIL PAGE
const Profile = lazy(() => import("./pages/Profile/Profile"));  //-----ADDED PROFILE PAGE
const Enterprise = lazy(() => import("./pages/Enterprise/Enterprise"));  //-----ADDED ENTERPRISE PAGE
const ConstructionPage = lazy(() => import("./pages/UnderConstructionPage/ConstructionPage"));  //-----ADDED CONSTRUCTION PAGE
const ErrorPage = lazy(() => import("./pages/ErrorPage/ErrorPage"));  //-----ADDED ERROR PAGE
const NotFoundPage = lazy(() => import("./pages/ErrorPage/NotFoundPage"));  //-----ADDED 404 PAGE
const ErrorHandlingDemo = lazy(() => import("./pages/ErrorPage/ErrorHandlingDemo"));  //-----ADDED ERROR DEMO PAGE

// Lazy load business form pages
const CreateBusniessAccount = lazy(() => import("./pages/BusinessForm/createAccount"));
const LoginBusinessAccount = lazy(() => import("./pages/Login_page/Screen"));
const OTPVerification = lazy(() => import("./pages/BusinessForm/otpVerification"));
const BusinessRoleSelection = lazy(() => import("./pages/BusinessForm/businessRoleSelection"));
const BusinessInfoSelection = lazy(() => import("./pages/BusinessForm/businessInfoSelection"));
const BusinessProfileForm = lazy(() => import("./pages/BusinessForm/businessProfile"));


const TeamPresence = lazy(() => import("./pages/BusinessForm/teamPresence"));
const BusinessServiceInfo = lazy(() => import("./pages/BusinessForm/businessServiceInfo"));
const BusinessHoursSection = lazy(() => import("./pages/BusinessForm/businessHours")); //-----------ADDED BUSINESS HOURS SECTION
const BusinessDocumentUploads = lazy(() => import("./pages/BusinessForm/businessDocumentUploads"));

// Layout Components
const MainLayout = () => {
  const location = useLocation();
  const hideNavbarRoutes = [
    "/business-page",
    "/business-account",
    "/login-business",
    "/otp-verification",
    "/business-role-selection",
    "/business-info-selection",
    "/business-profile-form",
    "/business-team-presence",
    "/business-service-info",
    "/business-hours",
    "/business-document-uploads",
  ];

  const hideFooterRoutes = [
    "/business-page",
    "/business-account",
    "/login-business",
    "/otp-verification",
    "/business-role-selection",
    "/business-info-selection",
    "/business-profile-form",
    "/business-team-presence",
    "/business-service-info",
    "/business-hours",
    "/business-document-uploads",
    "/cart",
    "/cart/success",
    "/cart/payment",
    "/appointment-history-details",
  ];

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Outlet />
      {shouldShowFooter && <Footer />}
      <CookiePopup />
    </>
  );
};

const BusinessLayout = () => (
  <>
    <Outlet />
    <CookiePopup />
  </>
);

const CartLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <CookiePopup />
  </>
);

const MinimalLayout = () => (
  <>
    <Outlet />
    <CookiePopup />
  </>
);

function App() {
  const location = useLocation();
  const hideNavbarRoutes = [
    "/business-page",
    "/business-account",
    "/login-business",
    "/otp-verification",
    "/business-role-selection",
    "/business-info-selection",
    "/business-profile-form",
    "/business-team-presence",
    "/business-service-info",
    "/business-hours",
    "/business-document-uploads"
  ];

  const hideFooterRoutes = [
    "/business-page",
    "/business-account",
    "/login-business",
    "/otp-verification",
    "/business-role-selection",
    "/business-info-selection",
    "/business-profile-form",
    "/business-team-presence",
    "/business-service-info",
    "/business-hours",
    "/business-document-uploads",
    "/cart",
    "/cart/success",
    "/cart/payment",
    "/appointment-history-details"
  ];

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <ErrorBoundary fallback={ErrorPage}>
      <Suspense fallback={<MaterialLoadingFallback />}>
        <Routes>
          {/* Main layout routes - with navbar and footer */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="overview" element={<Overview />} />
            <Route path="detail/:id" element={<BeautyMain />} />
            <Route path="support" element={<Support />} />
            <Route path="about" element={<About />} />
            <Route path="terms&conditions" element={<TermsConditions />} />
            <Route path="privacy" element={<Privacy />} />
            <Route 
              path="profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="appointment-history" 
              element={
                <ProtectedRoute>
                  <AppointmentHistory />
                </ProtectedRoute>
              } 
            />
            <Route path="enterprise" element={<Enterprise />} />
            <Route path="under-construction" element={<ConstructionPage />} />
            <Route path="error" element={<ErrorPage />} />
            <Route path="error-demo" element={<ErrorHandlingDemo />} />
          </Route>

          {/* Cart layout routes - navbar only, no footer */}
          <Route path="/cart" element={<CartLayout />}>
            <Route index element={<CartMain />} />
            <Route path="success" element={<SuccessCart />} />
            <Route path="payment" element={<PaymentPage />} />
          </Route>

          {/* Business layout routes - no navbar, no footer */}
          <Route path="/business" element={<BusinessLayout />}>
            <Route path="page" element={<BusniessPage />} />
            <Route path="account" element={<CreateBusniessAccount />} />
            <Route path="login" element={<LoginBusinessAccount />} />
            <Route path="otp-verification" element={<OTPVerification />} />
            <Route path="role-selection" element={<BusinessRoleSelection />} />
            <Route path="info-selection" element={<BusinessInfoSelection />} />
            <Route path="profile-form" element={<BusinessProfileForm />} />
            <Route path="team-presence" element={<TeamPresence />} />
            <Route path="service-info" element={<BusinessServiceInfo />} />
            <Route path="hours" element={<BusinessHoursSection />} />
            <Route path="document-uploads" element={<BusinessDocumentUploads />} />
          </Route>

          {/* Special routes with minimal layout */}
          <Route path="/" element={<MinimalLayout />}>
            <Route path="booking/success" element={<BookingSuccessPage />} />
            <Route 
              path="appointment-history-details" 
              element={
                <ProtectedRoute>
                  <AppointmentHistoryDetail />
                </ProtectedRoute>
              } 
            />
          </Route>
          
          {/* 404 Catch-all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
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
      <AuthProvider>
        <SearchBarProvider>
          <MatchingSearchResultProvider>
            <ScrollToTop />
            <App />
          </MatchingSearchResultProvider>
        </SearchBarProvider>
      </AuthProvider>
    </Router>
  );
}

export default AppWrapper;
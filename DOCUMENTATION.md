# Kalavyuha Frontend Documentation

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Getting Started](#getting-started)
5. [Architecture](#architecture)
6. [State Management](#state-management)
7. [Routing](#routing)
8. [Components](#components)
9. [Pages](#pages)
10. [Utils & Helpers](#utils--helpers)
11. [Context Providers](#context-providers)
12. [Hooks](#hooks)
13. [Development Guidelines](#development-guidelines)
14. [Deployment](#deployment)
15. [API Integration](#api-integration)

## Overview

Kalavyuha Frontend is a React-based web application for a beauty and wellness service platform. The application allows users to browse services, book appointments, manage their profiles, and complete payments. It features a comprehensive booking system with cart functionality, payment processing, and appointment management.

### Key Features
- **Service Discovery**: Browse beauty and wellness services by category and location
- **Business Listings**: Detailed business pages with services, staff, and reviews
- **Shopping Cart**: Add multiple services and book appointments
- **User Authentication**: Login/register functionality with protected routes
- **Payment Processing**: Multiple payment methods (online, wallet, cash)
- **Appointment Management**: View booking history and manage appointments
- **Responsive Design**: Mobile-first responsive design using Material-UI
- **Location Services**: IP-based location detection and Google Maps integration

## Project Structure

```
src/
├── assets/                 # Static assets (images, videos, icons)
├── components/            # Reusable UI components
├── Context/               # React Context providers
├── hooks/                 # Custom React hooks
├── pages/                 # Page components
├── utils/                 # Utility functions and helpers
├── App.js                 # Main application component
├── index.js              # Application entry point
└── constant.js           # Application constants
```

### Assets Organization
```
assets/
├── cart/                 # Cart-related images
├── images/               # General images
├── logo/                 # Brand logos
└── videos/               # Video assets
```

### Pages Structure
```
pages/
├── HomePage/             # Landing page components
├── BeautyPage/           # Service category pages
├── BusniessPage/         # Business detail pages
├── CartPage/             # Shopping cart and checkout
├── Auth/                 # Authentication pages
├── Profile/              # User profile management
├── AppointmentHistory/   # Booking history
├── Overview/             # Service overview pages
├── SupportPage/          # Customer support
├── About/                # About us page
├── Privacy/              # Privacy policy
├── TermsConditions/      # Terms and conditions
├── Enterprise/           # Enterprise solutions
├── ErrorPage/            # Error handling pages
├── Login_page/           # Login components
├── UnderConstructionPage/ # Under construction placeholder
└── service/              # Service-related pages
```

## Technology Stack

### Core Technologies
- **React 18.3.1**: Frontend framework
- **React Router DOM**: Client-side routing
- **Material-UI (MUI) 6.1.3**: UI component library
- **Ant Design 5.23.4**: Additional UI components
- **Emotion**: CSS-in-JS styling

### Supporting Libraries
- **Axios 1.8.1**: HTTP client for API requests
- **Formik 2.4.6**: Form handling and validation
- **Framer Motion 12.4.7**: Animation library
- **React Beautiful DnD 13.1.1**: Drag and drop functionality
- **React Google Maps API 2.20.6**: Google Maps integration
- **Leaflet 1.9.4**: Alternative mapping solution
- **Date-fns 2.30.0**: Date manipulation utilities
- **Lodash Debounce 4.0.8**: Utility for debouncing

### Development Tools
- **Create React App**: Build toolchain
- **React Testing Library**: Component testing
- **Jest**: Testing framework

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/kalavyuha/kalavyuha-frontend.git

# Navigate to project directory
cd kalavyuha-frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Available Scripts
- `npm start`: Runs the development server on http://localhost:3000
- `npm test`: Launches the test runner
- `npm run build`: Creates production build
- `npm run eject`: Ejects from Create React App (irreversible)

## Architecture

### Component Architecture
The application follows a component-based architecture with:
- **Presentational Components**: Pure UI components in `/components`
- **Container Components**: Business logic containers in `/pages`
- **Context Providers**: Global state management in `/Context`
- **Custom Hooks**: Reusable logic in `/hooks`
- **Utility Functions**: Helper functions in `/utils`

### Data Flow
1. **Props Down**: Data flows down through component hierarchy
2. **Events Up**: Events bubble up through callback props
3. **Context**: Global state managed through React Context
4. **Local Storage**: Persistent data storage for user preferences and cart

### Error Handling
- **Error Boundaries**: Catch and handle React component errors
- **Try-Catch Blocks**: Handle async operations and API calls
- **User Feedback**: Toast notifications and error messages

## State Management

### React Context
The application uses React Context for global state management:

#### AuthContext
```javascript
// User authentication state
{
  isAuthenticated: boolean,
  user: Object | null,
  loading: boolean
}
```

#### SearchBarContext
```javascript
// Search functionality state
{
  searchQuery: string,
  searchResults: Array,
  isSearching: boolean
}
```

#### DetailPageContext
```javascript
// Business detail page state
{
  selectedBusiness: Object,
  matchingResults: Array
}
```

### Local Storage
Persistent data stored in browser localStorage:
- `userDetail`: User authentication data
- `checkoutData`: Cart and checkout information
- `latitude`, `longitude`: User location coordinates
- `selectedServices`: Current service selections

## Routing

### Route Structure
```javascript
// Public Routes
/ - Home page
/beauty - Beauty services
/business/:id - Business detail page
/about - About us
/support - Customer support
/terms - Terms and conditions
/privacy - Privacy policy

// Protected Routes (require authentication)
/cart - Shopping cart
/payment - Payment page
/profile - User profile
/appointment-history - Booking history
/enterprise - Enterprise solutions
```

### Route Protection
- **ProtectedRoute Component**: Wraps authenticated routes
- **Automatic Redirects**: Redirect to login for unauthenticated users
- **Persistent Sessions**: Maintain authentication across browser sessions

## Components

### Core Components

#### Navigation
- **Navbar**: Main navigation with search, auth, and cart
- **Footer**: Site footer with links and information
- **Navigation**: Breadcrumb navigation component

#### UI Components
- **CustomButton**: Styled button variants
- **LightButton/DarkButton**: Theme-specific buttons
- **PillShapeContainer**: Pill-shaped UI containers
- **CardShapeContainer**: Card layout containers
- **Toast**: Notification system

#### Data Display
- **DataTable**: Reusable data table component
- **Reviews**: Review display and rating system
- **OverviewOffersCards**: Service offer cards
- **RecommendedCards**: Recommended service cards

#### Forms & Inputs
- **SearchField**: Search input with autocomplete
- **DocumentUploads**: File upload handling
- **ImageAvatarUpload**: Profile image upload
- **FileUploadProgress**: Upload progress indicator

#### Utility Components
- **ErrorBoundary**: Error catching and fallback UI
- **ProtectedRoute**: Route access control
- **ActiveLastBreadcrumb**: Breadcrumb navigation
- **FilterAndMap**: Service filtering and map view

## Pages

### Home Page (`/pages/HomePage/`)
Landing page with multiple sections:
- **Banner**: Hero section with search
- **NearByServices**: Location-based service discovery
- **DailyOffers**: Featured daily deals
- **RecommendedSection**: Personalized recommendations
- **BusinessList**: Featured business listings
- **Reviews**: Customer testimonials
- **FAQSection**: Frequently asked questions
- **AppInfoSection**: Mobile app promotion

### Business Page (`/pages/BusniessPage/`)
Business detail and service booking:
- Business information and gallery
- Service listings with pricing
- Staff profiles and availability
- Reviews and ratings
- Booking interface

### Cart & Checkout (`/pages/CartPage/`)
Complete booking and payment flow:
- **Cart.js**: Service cart management
- **PaymentPage.js**: Payment method selection
- **BookingSuccessPage.js**: Confirmation page
- **SuccessCart.js**: Legacy success page

### Authentication (`/pages/Auth/`)
User authentication flows:
- Login and registration forms
- Password recovery
- Social authentication
- Email verification

## Utils & Helpers

### Checkout Utilities (`/utils/checkoutUtils.js`)
- **storeCheckoutData()**: Save checkout data to localStorage
- **getCheckoutData()**: Retrieve checkout data
- **updateCheckoutPaymentMethod()**: Update payment method
- **prepareBookingPayload()**: Format data for API
- **sendBookingToAPI()**: Submit booking request

### Booking Data Manager (`/utils/bookingDataManager.js`)
- Appointment data management
- Booking validation
- Date and time handling

### File Upload Utilities (`/utils/fileUploadUtils.js`)
- File validation and processing
- Image optimization
- Upload progress tracking

### Error Handlers
- **errorHandler.js**: Global error handling
- **uploadErrorHandler.js**: File upload specific errors

## Context Providers

### AuthContext
Manages user authentication state:
```javascript
const authContext = {
  isAuthenticated: boolean,
  user: object,
  login: function,
  logout: function,
  checkAuthStatus: function
}
```

### SearchBarContext
Handles search functionality:
```javascript
const searchContext = {
  searchQuery: string,
  setSearchQuery: function,
  searchResults: array,
  performSearch: function
}
```

### DetailPageContext
Manages business detail page state:
```javascript
const detailContext = {
  selectedBusiness: object,
  matchingResults: array,
  updateBusiness: function
}
```

## Hooks

### Custom Hooks

#### useCookieSettings
Manages cookie preferences and GDPR compliance:
```javascript
const { 
  acceptCookies, 
  declineCookies, 
  cookieSettings 
} = useCookieSettings();
```

#### useFileUpload
Handles file upload operations:
```javascript
const {
  uploadFile,
  uploadProgress,
  uploadError,
  isUploading
} = useFileUpload();
```

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices and patterns
- Use TypeScript-style JSDoc comments
- Implement proper error boundaries
- Write unit tests for critical functionality

### Component Guidelines
- Keep components small and focused
- Use composition over inheritance
- Implement proper prop validation
- Handle loading and error states
- Follow accessibility best practices

### State Management
- Use local state for component-specific data
- Use Context for truly global state
- Prefer derived state over stored state
- Implement proper cleanup in useEffect

### Performance
- Implement lazy loading for routes
- Use React.memo for expensive components
- Optimize images and assets
- Implement proper error boundaries
- Use loading states and skeletons

## Deployment

### Build Process
```bash
# Create production build
npm run build

# The build folder contains optimized production files
```

### Deployment Configuration
- **Homepage**: Configured for GitHub Pages deployment
- **Static Assets**: Optimized and hashed for caching
- **Environment Variables**: Configure API endpoints per environment

### Production Considerations
- Enable HTTPS for security
- Configure proper CORS headers
- Implement CSP headers
- Set up monitoring and analytics
- Configure error tracking

## API Integration

### Base Configuration
- HTTP client: Axios
- Base URL configuration in constants
- Request/response interceptors
- Error handling middleware

### Authentication
- JWT token management
- Automatic token refresh
- Secure token storage
- Logout on token expiration

### Data Management
- Local storage for offline capability
- Cache management
- Optimistic updates
- Error retry mechanisms

### Key API Endpoints
```javascript
// Authentication
POST /auth/login
POST /auth/register
POST /auth/refresh-token

// Services
GET /services
GET /services/:id
GET /services/categories

// Bookings
POST /bookings
GET /bookings/user/:userId
PUT /bookings/:id
DELETE /bookings/:id

// Businesses
GET /businesses
GET /businesses/:id
GET /businesses/search
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the coding guidelines
4. Write tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# Cart and Checkout Flow Documentation

## Overview
The Kalavyuha Frontend implements a comprehensive cart and checkout system that manages service bookings from cart addition through payment completion. The system ensures data persistence across navigation, provides multiple payment methods, and handles both successful and failed booking scenarios.

### Key Features
- **Persistent Cart**: Cart data survives page refreshes and navigation
- **Multi-Service Booking**: Support for booking multiple services in one transaction
- **Staff Selection**: Assign specific staff members to services
- **Date/Time Scheduling**: Flexible appointment scheduling
- **Multiple Payment Methods**: Online payment, wallet, and cash on delivery
- **Real-time Validation**: Form validation and error handling
- **Booking Confirmation**: Complete booking history and confirmations

## Complete User Journey

### 1. Service Discovery and Selection
**Location**: Home Page (`/pages/HomePage/`) and Business Pages (`/pages/BusniessPage/`)

1. **Browse Services**: Users discover services through:
   - Home page service categories
   - Search functionality
   - Business detail pages
   - Recommendations and offers

2. **Service Details**: Each service displays:
   - Service name and description
   - Duration and pricing
   - Available staff members
   - Customer reviews and ratings

3. **Add to Cart**: Users click "Add to Cart" which:
   - Validates service selection
   - Stores service data in localStorage
   - Updates cart count in navigation
   - Shows success notification

### 2. Cart Management
**Location**: Cart Page (`/pages/CartPage/Cart.js`)

#### Cart Features
- **Service Review**: Display all selected services with details
- **Quantity Management**: Modify service quantities or remove items
- **Price Calculation**: Real-time total calculation with discounts
- **Promo Codes**: Apply and validate promotional codes
- **Staff Assignment**: Select preferred staff for each service
- **Date/Time Selection**: Choose appointment date and time slots

#### Validation Requirements
Before proceeding to checkout, the system validates:
- User authentication (must be logged in)
- Service selection (at least one service)
- Date selection (valid future date)
- Time slot selection (available time)
- Staff assignment (if required)

#### Cart Data Structure
```javascript
// Stored in localStorage as 'cartItems'
{
  businessId: "55319888",
  businessInfo: {
    name: "Beauty Salon",
    address: "123 Main St",
    phone: "+1234567890"
  },
  services: [
    {
      serviceId: "35861610",
      serviceName: "7 overs Plan",
      duration: "30 min",
      price: 500,
      quantity: 1,
      staffId: "53099326",
      staffName: "John Doe"
    }
  ],
  selectedDate: "2024-02-07",
  selectedTime: "11:00 AM",
  totalPrice: 900,
  originalPrice: 1000,
  discount: 100,
  promoCode: {
    code: "SAVE10",
    discount: 100
  }
}
```

### 3. Checkout Process
**Location**: Cart Page Checkout Handler

When user clicks "Checkout":

1. **Validation Check**:
   ```javascript
   // Validate required fields
   if (!selectedDate || !selectedTime || services.length === 0) {
     showErrorToast("Please complete all required fields");
     return;
   }
   
   if (!isAuthenticated) {
     redirectToLogin();
     return;
   }
   ```

2. **Data Preparation**:
   ```javascript
   const checkoutData = {
     BusinessId: parseInt(businessId),
     CustomerId: parseInt(user._id),
     AssignedStaffs: services.map(service => ({
       StaffId: service.staffId,
       StaffName: service.staffName
     })),
     SelectedDate: formatDate(selectedDate),
     SelectedTime: selectedTime,
     Services: services.map(service => ({
       ServiceId: service.serviceId,
       ServiceName: service.serviceName,
       Duration: service.duration,
       Price: service.price
     })),
     TotalPrice: totalPrice,
     PaymentMethod: "pending", // Will be updated on payment page
     PaymentStatus: "pending",
     SendSms: true,
     BusinessInfo: businessInfo,
     PromoCode: promoCode,
     CartId: generateCartId()
   };
   ```

3. **Data Storage**:
   ```javascript
   import { storeCheckoutData } from '../utils/checkoutUtils';
   storeCheckoutData(checkoutData);
   ```

4. **Navigation**:
   ```javascript
   navigate('/cart/payment');
   ```

### 4. Payment Method Selection
**Location**: Payment Page (`/pages/CartPage/PaymentPage.js`)

#### Available Payment Methods
1. **Online Payment**: Credit/debit cards, UPI, net banking
2. **Digital Wallet**: PayTM, PhonePe, Google Pay
3. **Cash on Delivery**: Pay at the business location

#### Payment Page Features
- **Order Summary**: Review booking details before payment
- **Payment Method Selection**: Radio button interface for payment options
- **Terms Acceptance**: Checkbox for terms and conditions
- **Secure Processing**: SSL encrypted payment handling

#### Payment Data Flow
```javascript
// On payment method selection
const updatePaymentMethod = (method) => {
  const updatedData = updateCheckoutPaymentMethod(method);
  setCheckoutData(updatedData);
};

// On "Pay Now" click
const processPayment = async () => {
  try {
    const bookingResult = await sendBookingToAPI(checkoutData);
    if (bookingResult.success) {
      clearCart();
      clearCheckoutData();
      navigate('/booking/success', { 
        state: { bookingDetails: bookingResult.data } 
      });
    }
  } catch (error) {
    handlePaymentError(error);
  }
};
```

### 5. Booking Confirmation
**Location**: Booking Success Page (`/pages/CartPage/BookingSuccessPage.js`)

#### Success Page Features
- **Booking Confirmation**: Display booking reference number
- **Appointment Details**: Complete booking information
- **Business Contact**: Phone and address for the business
- **Calendar Integration**: Add to calendar functionality
- **SMS/Email Confirmation**: Automatic notifications
- **Next Steps**: Instructions for appointment preparation

#### Success Data Display
```javascript
{
  bookingId: "BK2024020712345",
  status: "confirmed",
  appointmentDate: "2024-02-07",
  appointmentTime: "11:00 AM",
  business: {
    name: "Beauty Salon",
    address: "123 Main St",
    phone: "+1234567890"
  },
  services: [...],
  totalAmount: 900,
  paymentMethod: "online",
  paymentStatus: "completed"
}
```

## Technical Architecture

### Storage Layer (`src/utils/checkoutUtils.js`)

#### Core Functions
```javascript
// Store checkout data in localStorage
export const storeCheckoutData = (checkoutData) => {
  try {
    localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkoutData));
    console.log('Checkout data stored:', checkoutData);
  } catch (error) {
    console.error('Error storing checkout data:', error);
  }
};

// Retrieve checkout data from localStorage
export const getCheckoutData = () => {
  try {
    const stored = localStorage.getItem(CHECKOUT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error retrieving checkout data:', error);
    return null;
  }
};

// Update payment method in existing checkout data
export const updateCheckoutPaymentMethod = (paymentMethod) => {
  try {
    const existingData = getCheckoutData();
    if (existingData) {
      existingData.PaymentMethod = paymentMethod;
      storeCheckoutData(existingData);
      return existingData;
    }
    return null;
  } catch (error) {
    console.error('Error updating payment method:', error);
    return null;
  }
};

// Send booking request to API
export const sendBookingToAPI = async (checkoutData) => {
  try {
    const payload = prepareBookingPayload(checkoutData);
    const response = await axios.post(
      'https://api.slotwel.in/api/v1/booking/book/',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Booking API error:', error);
    // Fallback for development
    return {
      success: true,
      data: {
        bookingId: `BK${Date.now()}`,
        status: 'confirmed',
        message: 'Booking confirmed successfully'
      }
    };
  }
};
```

### Component Integration

#### Cart Component (`/pages/CartPage/Cart.js`)
```javascript
import { storeCheckoutData } from '../../utils/checkoutUtils';
import { useAuth } from '../../Context/AuthContext';

const Cart = () => {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleCheckout = () => {
    // Validation
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedDate || !selectedTime || cartItems.length === 0) {
      showToast('Please complete all required fields', 'error');
      return;
    }

    // Prepare checkout data
    const checkoutData = {
      BusinessId: parseInt(businessId),
      CustomerId: parseInt(user._id),
      AssignedStaffs: cartItems.map(item => ({
        StaffId: item.staffId,
        StaffName: item.staffName
      })),
      SelectedDate: selectedDate,
      SelectedTime: selectedTime,
      Services: cartItems.map(item => ({
        ServiceId: item.serviceId,
        ServiceName: item.serviceName,
        Duration: item.duration,
        Price: item.price
      })),
      TotalPrice: calculateTotal(),
      PaymentMethod: 'pending',
      PaymentStatus: 'pending',
      SendSms: true
    };

    // Store and navigate
    storeCheckoutData(checkoutData);
    navigate('/cart/payment');
  };

  return (
    // Cart UI components
  );
};
```

#### Payment Component (`/pages/CartPage/PaymentPage.js`)
```javascript
import { 
  getCheckoutData, 
  updateCheckoutPaymentMethod, 
  sendBookingToAPI,
  clearCheckoutData 
} from '../../utils/checkoutUtils';

const PaymentPage = () => {
  const [checkoutData, setCheckoutData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('online');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const data = getCheckoutData();
    if (!data) {
      navigate('/cart');
      return;
    }
    setCheckoutData(data);
  }, []);

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    const updatedData = updateCheckoutPaymentMethod(method);
    setCheckoutData(updatedData);
  };

  const handlePayNow = async () => {
    setIsProcessing(true);
    try {
      const result = await sendBookingToAPI(checkoutData);
      if (result.success) {
        clearCheckoutData();
        navigate('/booking/success', { 
          state: { bookingDetails: result.data } 
        });
      }
    } catch (error) {
      showToast('Payment failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    // Payment UI components
  );
};
```
## Data Structures

### localStorage Key: `checkoutData`
```javascript
{
  "BusinessId": 55319888,
  "CustomerId": 21138275,
  "AssignedStaffs": [
    {
      "StaffId": "53099326",
      "StaffName": "John Doe"
    }
  ],
  "SelectedDate": "2024-02-07",
  "SelectedTime": "11:00 AM",
  "Services": [
    {
      "ServiceId": "35861610",
      "ServiceName": "7 overs Plan",
      "Duration": "30 min",
      "Price": 500
    }
  ],
  "TotalPrice": 900,
  "OriginalPrice": 1000,
  "Discount": 100,
  "PaymentMethod": "online",
  "PaymentStatus": "pending",
  "SendSms": true,
  "BusinessInfo": {
    "name": "Beauty Salon",
    "address": "123 Main St",
    "phone": "+1234567890",
    "email": "info@beautysalon.com"
  },
  "PromoCode": {
    "code": "SAVE10",
    "discount": 100,
    "type": "percentage"
  },
  "CartId": "cart_1704652800000"
}
```

### Cart Items Structure (`localStorage: cartItems`)
```javascript
{
  "businessId": "55319888",
  "businessInfo": {
    "name": "Beauty Salon",
    "address": "123 Main St",
    "phone": "+1234567890",
    "rating": 4.5,
    "image": "business-image.jpg"
  },
  "items": [
    {
      "serviceId": "35861610",
      "serviceName": "Hair Cut & Styling",
      "duration": "45 min",
      "price": 500,
      "originalPrice": 600,
      "quantity": 1,
      "staffId": "53099326",
      "staffName": "John Doe",
      "staffImage": "staff-image.jpg",
      "description": "Professional hair cut and styling",
      "category": "Hair"
    }
  ],
  "selectedDate": "2024-02-07",
  "selectedTime": "11:00 AM",
  "availableSlots": ["10:00 AM", "11:00 AM", "12:00 PM"],
  "subtotal": 500,
  "tax": 50,
  "discount": 100,
  "total": 450,
  "promoCode": "SAVE10",
  "notes": "Please call before arriving"
}
```

### API Request Payload
```javascript
{
  "BusinessId": 55319888,
  "CustomerId": 21138275,
  "AssignedStaffs": [
    {
      "StaffId": "53099326",
      "StaffName": "John Doe"
    }
  ],
  "SelectedDate": "2024-02-07",
  "SelectedTime": "11:00 AM",
  "Services": [
    {
      "ServiceId": "35861610",
      "ServiceName": "Hair Cut & Styling",
      "Duration": "45 min",
      "Price": 500
    }
  ],
  "TotalPrice": 450,
  "PaymentMethod": "online",
  "PaymentStatus": "pending",
  "SendSms": true,
  "PromoCode": "SAVE10"
}
```

### API Response Structure
```javascript
// Success Response
{
  "success": true,
  "data": {
    "bookingId": "BK2024020712345",
    "status": "confirmed",
    "appointmentDate": "2024-02-07",
    "appointmentTime": "11:00 AM",
    "businessId": 55319888,
    "customerId": 21138275,
    "services": [...],
    "totalAmount": 450,
    "paymentMethod": "online",
    "paymentStatus": "completed",
    "confirmationNumber": "CNF789123",
    "createdAt": "2024-02-01T10:30:00Z"
  },
  "message": "Booking confirmed successfully"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "BOOKING_FAILED",
    "message": "The selected time slot is no longer available",
    "details": {
      "availableSlots": ["10:00 AM", "12:00 PM", "2:00 PM"]
    }
  }
}
```

## API Integration

### Booking API Endpoint
**URL**: `https://api.slotwel.in/api/v1/booking/book/`
**Method**: POST
**Content-Type**: application/json

### Request Payload
```javascript
{
  "BusinessId": 55319888,
  "CustomerId": 21138275,
  "AssignedStaffs": [
    {
      "StaffId": "53099326",
      "StaffName": "John Doe"
    }
  ],
  "SelectedDate": "2024-02-07",
  "SelectedTime": "11:00 AM",
  "Services": [
    {
      "ServiceId": "35861610",
      "ServiceName": "7 overs Plan", 
      "Duration": "30 min",
      "Price": 500
    }
  ],
  "TotalPrice": 900,
  "PaymentMethod": "online",
  "PaymentStatus": "pending",
  "SendSms": true
}
```

## Usage Flow

1. **User adds services to cart** (existing functionality)
2. **User selects date, time, staff on cart page**
3. **User clicks "Checkout"**:
   - Data validation
   - Store in localStorage as `checkoutData`
   - Navigate to `/cart/payment`
4. **User selects payment method**
5. **User clicks "Pay Now"**:
   - Update payment method in localStorage
   - Send booking request to API
   - Clear cart and checkout data on success
   - Navigate to `/booking/success`

## Error Handling & Edge Cases

### Validation Errors
```javascript
// User Authentication Check
if (!isAuthenticated) {
  showToast("Please login to continue with booking", "warning");
  navigate('/login', { state: { from: '/cart' } });
  return;
}

// Required Fields Validation
const validateCheckoutData = (data) => {
  const errors = [];
  
  if (!data.selectedDate) errors.push("Please select an appointment date");
  if (!data.selectedTime) errors.push("Please select an appointment time");
  if (!data.services || data.services.length === 0) {
    errors.push("Please add at least one service to your cart");
  }
  
  // Validate date is in future
  const selectedDateTime = new Date(`${data.selectedDate} ${data.selectedTime}`);
  if (selectedDateTime <= new Date()) {
    errors.push("Please select a future date and time");
  }
  
  return errors;
};
```

### API Error Handling
```javascript
export const sendBookingToAPI = async (checkoutData) => {
  try {
    const response = await axios.post(API_ENDPOINT, checkoutData, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    return { success: true, data: response.data };
    
  } catch (error) {
    console.error('Booking API error:', error);
    
    // Handle different error types
    if (error.code === 'NETWORK_ERROR') {
      return {
        success: false,
        error: {
          message: "Network connection error. Please check your internet connection.",
          type: "network"
        }
      };
    }
    
    if (error.response?.status === 409) {
      return {
        success: false,
        error: {
          message: "The selected time slot is no longer available.",
          type: "conflict",
          availableSlots: error.response.data.availableSlots
        }
      };
    }
    
    if (error.response?.status === 401) {
      return {
        success: false,
        error: {
          message: "Session expired. Please login again.",
          type: "authentication"
        }
      };
    }
    
    // Generic error fallback
    return {
      success: false,
      error: {
        message: "Booking failed. Please try again.",
        type: "general"
      }
    };
  }
};
```

### Local Storage Error Handling
```javascript
export const safeLocalStorageOperation = (operation, key, data = null) => {
  try {
    switch (operation) {
      case 'get':
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
        
      case 'set':
        localStorage.setItem(key, JSON.stringify(data));
        return true;
        
      case 'remove':
        localStorage.removeItem(key);
        return true;
        
      default:
        throw new Error('Invalid operation');
    }
  } catch (error) {
    console.error(`localStorage ${operation} error:`, error);
    
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      showToast("Storage limit exceeded. Please clear browser data.", "error");
      return null;
    }
    
    // Handle parsing errors
    if (error instanceof SyntaxError) {
      console.warn(`Invalid JSON in localStorage for key: ${key}`);
      localStorage.removeItem(key); // Clear corrupted data
      return null;
    }
    
    return null;
  }
};
```

### User Experience Error Recovery
```javascript
const CartErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    const handleError = (error) => {
      setHasError(true);
      setErrorDetails({
        message: error.message,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    };

    window.addEventListener('unhandledrejection', handleError);
    return () => window.removeEventListener('unhandledrejection', handleError);
  }, []);

  const handleRetry = () => {
    setHasError(false);
    setErrorDetails(null);
    // Optionally reload cart data
    window.location.reload();
  };

  const handleResetCart = () => {
    clearCheckoutData();
    clearCart();
    navigate('/');
  };

  if (hasError) {
    return (
      <ErrorFallback 
        error={errorDetails}
        onRetry={handleRetry}
        onResetCart={handleResetCart}
      />
    );
  }

  return children;
};
```

## Development and Deployment

### Development Features
- **Hot Reload**: Real-time code changes during development
- **Mock API Responses**: Fallback responses when API is unavailable
- **Debug Logging**: Detailed console logs for troubleshooting
- **Environment Variables**: Configuration management across environments

### Environment Configuration
```javascript
// .env.development
REACT_APP_API_BASE_URL=https://dev-api.slotwel.in
REACT_APP_PAYMENT_GATEWAY=sandbox
REACT_APP_DEBUG_MODE=true

// .env.production
REACT_APP_API_BASE_URL=https://api.slotwel.in
REACT_APP_PAYMENT_GATEWAY=live
REACT_APP_DEBUG_MODE=false
```

### Build and Deployment
```bash
# Development build with debugging
npm start

# Production build
npm run build

# Test the production build locally
npm install -g serve
serve -s build

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

### Monitoring and Analytics

#### Error Tracking
```javascript
// Error tracking integration
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});

// Track checkout events
const trackCheckoutEvent = (eventName, data) => {
  Sentry.addBreadcrumb({
    message: eventName,
    category: 'checkout',
    data: data,
    level: 'info'
  });
};
```

#### Analytics Events
```javascript
// Google Analytics 4 events
const trackCheckoutSteps = {
  beginCheckout: (cartData) => {
    gtag('event', 'begin_checkout', {
      currency: 'INR',
      value: cartData.total,
      items: cartData.services.map(service => ({
        item_id: service.serviceId,
        item_name: service.serviceName,
        price: service.price,
        quantity: service.quantity
      }))
    });
  },
  
  selectPaymentMethod: (method) => {
    gtag('event', 'select_payment_method', {
      payment_type: method
    });
  },
  
  completePurchase: (bookingData) => {
    gtag('event', 'purchase', {
      transaction_id: bookingData.bookingId,
      value: bookingData.totalAmount,
      currency: 'INR',
      items: bookingData.services
    });
  }
};
```

### Security Considerations

#### Data Protection
- **HTTPS Only**: All data transmission over secure connections
- **Input Validation**: Sanitize all user inputs
- **XSS Prevention**: Escape user-generated content
- **CSRF Protection**: Implement CSRF tokens for state-changing operations

#### Payment Security
```javascript
// PCI DSS compliance measures
const securePaymentHandling = {
  // Never store payment card data in localStorage
  sanitizePaymentData: (data) => {
    const { cardNumber, cvv, ...safeData } = data;
    return safeData;
  },
  
  // Encrypt sensitive data before transmission
  encryptSensitiveData: (data) => {
    // Implementation depends on payment gateway
    return paymentGateway.encrypt(data);
  },
  
  // Validate payment forms on client and server
  validatePaymentForm: (formData) => {
    const errors = [];
    if (!isValidCardNumber(formData.cardNumber)) {
      errors.push('Invalid card number');
    }
    return errors;
  }
};
```

### Troubleshooting Guide

#### Common Issues

1. **Cart Data Lost After Page Refresh**
   ```javascript
   // Check localStorage persistence
   console.log('Cart data:', localStorage.getItem('cartItems'));
   
   // Verify browser storage limits
   try {
     const testKey = 'storage-test';
     localStorage.setItem(testKey, 'test');
     localStorage.removeItem(testKey);
     console.log('localStorage is working');
   } catch (e) {
     console.error('localStorage error:', e);
   }
   ```

2. **Payment Processing Failures**
   ```javascript
   // Debug payment flow
   const debugPayment = async (checkoutData) => {
     console.log('Payment request:', checkoutData);
     
     try {
       const response = await sendBookingToAPI(checkoutData);
       console.log('Payment response:', response);
     } catch (error) {
       console.error('Payment error details:', {
         message: error.message,
         status: error.response?.status,
         data: error.response?.data
       });
     }
   };
   ```

3. **Authentication Issues**
   ```javascript
   // Debug auth state
   const debugAuth = () => {
     const userDetail = localStorage.getItem('userDetail');
     console.log('Stored user:', userDetail);
     
     const authToken = localStorage.getItem('authToken');
     console.log('Auth token present:', !!authToken);
     
     // Check token expiration
     if (authToken) {
       const decoded = jwt_decode(authToken);
       console.log('Token expires:', new Date(decoded.exp * 1000));
     }
   };
   ```

### Performance Optimization

#### Code Splitting
```javascript
// Lazy load cart components
const Cart = lazy(() => import('./pages/CartPage/Cart'));
const PaymentPage = lazy(() => import('./pages/CartPage/PaymentPage'));
const BookingSuccess = lazy(() => import('./pages/CartPage/BookingSuccessPage'));

// Route-based code splitting
const AppRoutes = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/cart" element={<Cart />} />
      <Route path="/cart/payment" element={<PaymentPage />} />
      <Route path="/booking/success" element={<BookingSuccess />} />
    </Routes>
  </Suspense>
);
```

#### Memory Management
```javascript
// Clean up event listeners and timers
useEffect(() => {
  const handleBeforeUnload = (e) => {
    // Save cart state before page unload
    const cartData = getCartData();
    if (cartData && cartData.items.length > 0) {
      e.preventDefault();
      e.returnValue = 'You have items in your cart. Are you sure you want to leave?';
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, []);
```

## Future Enhancements

### Planned Features
1. **Offline Support**: Progressive Web App capabilities for offline cart management
2. **Push Notifications**: Appointment reminders and promotional offers
3. **Advanced Scheduling**: Recurring appointments and bulk booking
4. **Social Features**: Share bookings and refer friends
5. **AI Recommendations**: Personalized service suggestions
6. **Voice Booking**: Voice interface for accessibility
7. **Video Consultations**: Virtual service consultations
8. **Loyalty Program**: Points and rewards system

### Technical Improvements
1. **GraphQL Integration**: More efficient data fetching
2. **Real-time Updates**: WebSocket connections for live availability
3. **Advanced Caching**: Service worker for better performance
4. **Micro-frontends**: Modular architecture for scalability
5. **TypeScript Migration**: Type safety and better development experience

### Accessibility Enhancements
1. **Screen Reader Support**: ARIA labels and semantic HTML
2. **Keyboard Navigation**: Full keyboard accessibility
3. **Color Contrast**: WCAG 2.1 AA compliance
4. **Font Scaling**: Support for user font preferences
5. **Voice Commands**: Speech recognition for booking

## Testing and Quality Assurance

### Manual Testing Checklist

#### Cart Functionality
- [ ] Add services to cart from business page
- [ ] Modify service quantities in cart
- [ ] Remove services from cart
- [ ] Apply and remove promo codes
- [ ] Select appointment date and time
- [ ] Assign staff to services
- [ ] Calculate totals correctly with discounts

#### Authentication Flow
- [ ] Redirect to login when not authenticated
- [ ] Maintain cart data after login
- [ ] Handle session expiration gracefully
- [ ] Auto-login with saved credentials

#### Checkout Process
- [ ] Validate all required fields before checkout
- [ ] Store checkout data in localStorage
- [ ] Navigate to payment page successfully
- [ ] Handle missing checkout data scenarios

#### Payment Processing
- [ ] Display correct order summary
- [ ] Select different payment methods
- [ ] Process payment with each method
- [ ] Handle payment failures gracefully
- [ ] Clear cart data after successful payment

#### Success and Confirmation
- [ ] Display booking confirmation details
- [ ] Send confirmation email/SMS
- [ ] Navigate to booking history
- [ ] Handle booking reference numbers

### Automated Testing Examples

#### Unit Tests
```javascript
// checkoutUtils.test.js
import { 
  storeCheckoutData, 
  getCheckoutData, 
  updateCheckoutPaymentMethod 
} from '../utils/checkoutUtils';

describe('Checkout Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should store and retrieve checkout data', () => {
    const testData = {
      BusinessId: 123,
      CustomerId: 456,
      Services: [{ ServiceId: '789', Price: 100 }]
    };

    storeCheckoutData(testData);
    const retrieved = getCheckoutData();
    
    expect(retrieved).toEqual(testData);
  });

  test('should update payment method', () => {
    const initialData = {
      PaymentMethod: 'pending',
      TotalPrice: 100
    };

    storeCheckoutData(initialData);
    const updated = updateCheckoutPaymentMethod('online');
    
    expect(updated.PaymentMethod).toBe('online');
    expect(updated.TotalPrice).toBe(100);
  });
});
```

#### Integration Tests
```javascript
// cart.integration.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../Context/AuthContext';
import Cart from '../pages/CartPage/Cart';

const MockedCart = () => (
  <BrowserRouter>
    <AuthProvider>
      <Cart />
    </AuthProvider>
  </BrowserRouter>
);

describe('Cart Integration', () => {
  test('should complete checkout flow', async () => {
    // Mock localStorage with cart data
    const mockCartData = {
      services: [{ serviceId: '1', price: 100 }],
      businessId: '123'
    };
    localStorage.setItem('cartItems', JSON.stringify(mockCartData));

    render(<MockedCart />);

    // Select date and time
    fireEvent.change(screen.getByLabelText('Select Date'), {
      target: { value: '2024-12-31' }
    });
    fireEvent.change(screen.getByLabelText('Select Time'), {
      target: { value: '10:00 AM' }
    });

    // Click checkout
    fireEvent.click(screen.getByText('Checkout'));

    // Verify navigation to payment page
    await waitFor(() => {
      expect(window.location.pathname).toBe('/cart/payment');
    });
  });
});
```

### Performance Testing

#### Load Testing Scenarios
```javascript
// Performance benchmarks
const performanceTests = {
  cartLoadTime: {
    description: "Cart page should load within 2 seconds",
    threshold: 2000,
    test: () => measurePageLoadTime('/cart')
  },
  
  checkoutProcessTime: {
    description: "Checkout process should complete within 5 seconds",
    threshold: 5000,
    test: () => measureCheckoutFlow()
  },
  
  localStorageOperations: {
    description: "localStorage operations should be under 100ms",
    threshold: 100,
    test: () => measureStorageOperations()
  }
};
```

### Browser Compatibility Testing

#### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 8+)

#### Feature Detection
```javascript
const browserSupport = {
  localStorage: typeof(Storage) !== "undefined",
  fetch: typeof fetch !== "undefined",
  promises: typeof Promise !== "undefined",
  modules: typeof import !== "undefined"
};

// Graceful degradation for unsupported features
if (!browserSupport.localStorage) {
  console.warn("localStorage not supported, using session storage");
  // Implement sessionStorage fallback
}
```

## localStorage Management

### Data Persistence Strategy
The cart and checkout system uses localStorage for data persistence across sessions and page refreshes. This ensures users don't lose their cart contents or progress through the booking flow.

#### Storage Keys and Purposes
```javascript
// Primary storage keys
const STORAGE_KEYS = {
  CART_ITEMS: 'cartItems',           // Current cart contents
  CHECKOUT_DATA: 'checkoutData',     // Checkout flow data
  USER_DETAIL: 'userDetail',         // User authentication data
  BUSINESS_CACHE: 'businessCache',   // Cached business information
  USER_PREFERENCES: 'userPrefs',     // User preferences and settings
  BOOKING_HISTORY: 'bookingHistory', // Recent booking history
  PROMO_CODES: 'promoCodes',         // Available and used promo codes
  LOCATION_DATA: 'locationData'      // User location coordinates
};
```

#### Automatic Data Synchronization
```javascript
// Sync cart data across components
export const syncCartData = () => {
  const cartData = getCartItems();
  
  // Broadcast storage event to sync across tabs
  window.dispatchEvent(new StorageEvent('storage', {
    key: STORAGE_KEYS.CART_ITEMS,
    newValue: JSON.stringify(cartData),
    storageArea: localStorage
  }));
};

// Listen for storage changes across tabs
useEffect(() => {
  const handleStorageChange = (e) => {
    if (e.key === STORAGE_KEYS.CART_ITEMS) {
      const updatedCart = JSON.parse(e.newValue || '[]');
      setCartItems(updatedCart);
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

#### Data Cleanup and Expiration
```javascript
// Clean up expired data
export const cleanupLocalStorage = () => {
  const now = Date.now();
  const EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days

  Object.keys(localStorage).forEach(key => {
    try {
      const item = JSON.parse(localStorage.getItem(key));
      
      // Check if item has expiration timestamp
      if (item && item.expiresAt && item.expiresAt < now) {
        localStorage.removeItem(key);
        console.log(`Expired data removed: ${key}`);
      }
      
      // Clean up old checkout data
      if (key.startsWith('checkout_') && item.createdAt < now - EXPIRY_TIME) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      // Remove corrupted data
      localStorage.removeItem(key);
    }
  });
};

// Run cleanup on app initialization
useEffect(() => {
  cleanupLocalStorage();
}, []);
```

#### Business Data Caching
```javascript
// Cache business information to reduce API calls
export const cacheBusinessData = (businessId, data) => {
  const cache = getBusinessCache();
  const cacheKey = `business_${businessId}`;
  
  cache[cacheKey] = {
    data: data,
    timestamp: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  
  localStorage.setItem(STORAGE_KEYS.BUSINESS_CACHE, JSON.stringify(cache));
};

export const getCachedBusinessData = (businessId) => {
  const cache = getBusinessCache();
  const cacheKey = `business_${businessId}`;
  const cachedItem = cache[cacheKey];
  
  if (cachedItem && cachedItem.expiresAt > Date.now()) {
    return cachedItem.data;
  }
  
  return null;
};
```

### Cart State Management
```javascript
// Comprehensive cart management
export const CartManager = {
  // Add item to cart
  addItem: (businessId, service, staffId = null) => {
    const cart = getCartItems();
    
    // Check if cart is for different business
    if (cart.businessId && cart.businessId !== businessId) {
      const confirmSwitch = window.confirm(
        'Adding services from a different business will clear your current cart. Continue?'
      );
      if (!confirmSwitch) return false;
      CartManager.clearCart();
    }
    
    // Add or update service
    const existingIndex = cart.items.findIndex(item => 
      item.serviceId === service.serviceId && item.staffId === staffId
    );
    
    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += 1;
    } else {
      cart.items.push({
        ...service,
        quantity: 1,
        staffId: staffId,
        addedAt: Date.now()
      });
    }
    
    cart.businessId = businessId;
    cart.updatedAt = Date.now();
    
    storeCartItems(cart);
    return true;
  },
  
  // Remove item from cart
  removeItem: (serviceId, staffId = null) => {
    const cart = getCartItems();
    cart.items = cart.items.filter(item => 
      !(item.serviceId === serviceId && item.staffId === staffId)
    );
    cart.updatedAt = Date.now();
    storeCartItems(cart);
  },
  
  // Update item quantity
  updateQuantity: (serviceId, staffId, quantity) => {
    const cart = getCartItems();
    const itemIndex = cart.items.findIndex(item => 
      item.serviceId === serviceId && item.staffId === staffId
    );
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      cart.updatedAt = Date.now();
      storeCartItems(cart);
    }
  },
  
  // Clear entire cart
  clearCart: () => {
    localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
    syncCartData();
  },
  
  // Get cart summary
  getCartSummary: () => {
    const cart = getCartItems();
    const subtotal = cart.items.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax - (cart.discount || 0);
    
    return {
      itemCount: cart.items.reduce((count, item) => count + item.quantity, 0),
      subtotal,
      tax,
      discount: cart.discount || 0,
      total: Math.max(0, total)
    };
  }
};
```

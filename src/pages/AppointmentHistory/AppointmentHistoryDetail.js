import React from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Button, 
  Divider, 
  Grid,
  Paper,
  IconButton
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import sample from "../../assets/image (9).png";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";
import RescheduleIcon from "@mui/icons-material/Schedule";

const AppointmentHistoryDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'confirmed':
        return { backgroundColor: "#d4edda", color: "#155724" };
      case 'pending':
        return { backgroundColor: "#fff3cd", color: "#856404" };
      case 'cancelled':
        return { backgroundColor: "#f8d7da", color: "#721c24" };
      default:
        return { backgroundColor: "#e2e3e5", color: "#383d41" };
    }
  };
  
  // Get appointment data from navigation state or use default
  const rawAppointmentData = location.state?.appointment || {
    BookingId: "APT123456",
    SelectedDate: "2024-02-07",
    SelectedTime: "11:00 AM",
    Services: [
      { ServiceName: "Sample Service", Duration: "30 min", Price: 500 }
    ],
    TotalPrice: 500,
    PaymentStatus: "paid",
    PaymentMethod: "online"
  };

  // Convert new API format to legacy format for template compatibility
  const appointmentData = {
    // New API format properties
    ...rawAppointmentData,
    // Legacy properties for existing template compatibility
    id: rawAppointmentData.BookingId || "APT123456",
    businessName: "Business Appointment",
    businessAddress: "Business Location",
    businessPhone: "+91 98765 43210",
    businessEmail: "contact@business.com",
    rating: 4.8,
    appointmentDate: formatDate(rawAppointmentData.SelectedDate),
    appointmentTime: rawAppointmentData.SelectedTime,
    status: rawAppointmentData.PaymentStatus || "pending",
    services: rawAppointmentData.Services?.map(service => ({
      name: service.ServiceName,
      duration: service.Duration,
      price: service.Price,
      description: `${service.ServiceName} - ${service.Duration}`
    })) || [],
    subtotal: rawAppointmentData.TotalPrice || 0,
    tax: 0,
    discount: 0,
    total: rawAppointmentData.TotalPrice || 0,
    bookingDate: formatDate(rawAppointmentData.SelectedDate),
    paymentMethod: rawAppointmentData.PaymentMethod === "online" ? "Online Payment" : "Cash",
    paymentStatus: rawAppointmentData.PaymentStatus === "paid" ? "Paid" : "Pending"
  };

  const generateInvoice = () => {
    // Create invoice content
    const invoiceContent = `
      <html>
        <head>
          <title>Invoice - ${appointmentData.BookingId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
            }
            .invoice-header {
              text-align: center;
              border-bottom: 2px solid #1b4d69;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .invoice-title {
              color: #1b4d69;
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
              .invoice-title2 {
              color: #1b4d69;
              font-size: 20px;
              font-weight: bold;
              margin: 0;
            }
            .invoice-subtitle {
              color: #666;
              font-size: 14px;
              margin-top: 5px;
            }
            .business-info {
              background: #f1f1f1;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .business-name {
              font-size: 20px;
              font-weight: bold;
              color: #1b4d69;
              margin-bottom: 10px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
            }
            .info-label {
              font-weight: bold;
              color: #333;
              width: 150px;
            }
            .services-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .services-table th,
            .services-table td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            .services-table th {
              background-color: #1b4d69;
              color: white;
              font-weight: bold;
            }
            .services-table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .total-section {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-top: 20px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .total-final {
              font-size: 18px;
              font-weight: bold;
              color: #1b4d69;
              border-top: 2px solid #1b4d69;
              padding-top: 10px;
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 12px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <h1 class="invoice-title">Kalavyuha</h1>
            <h3 class="invoice-title2">Invoice</h3>
            <p class="invoice-subtitle">Appointment ID: ${appointmentData.id}</p>
          </div>

          <div class="business-info">
            <div class="business-name">${appointmentData.businessName}</div>
            <div>${appointmentData.businessAddress}</div>
            <div>Phone: ${appointmentData.businessPhone}</div>
            <div>Email: ${appointmentData.businessEmail}</div>
          </div>

          <div class="info-row">
            <div>
              <div class="info-label">Appointment Date:</div>
              <div>${appointmentData.appointmentDate}</div>
            </div>
            <div>
              <div class="info-label">Appointment Time:</div>
              <div>${appointmentData.appointmentTime}</div>
            </div>
          </div>

          <div class="info-row">
            <div>
              <div class="info-label">Booking Date:</div>
              <div>${appointmentData.bookingDate}</div>
            </div>
            <div>
              <div class="info-label">Payment Status:</div>
              <div>${appointmentData.paymentStatus}</div>
            </div>
          </div>

          <table class="services-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${appointmentData.services.map(service => `
                <tr>
                  <td>${service.name}</td>
                  <td>${service.description}</td>
                  <td>${service.duration}</td>
                  <td>₹${service.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₹${appointmentData.subtotal}</span>
            </div>
            <div class="total-row">
              <span>Tax & Fees:</span>
              <span>₹${appointmentData.tax}</span>
            </div>
            ${appointmentData.discount > 0 ? `
            <div class="total-row">
              <span>Discount:</span>
              <span>-₹${appointmentData.discount}</span>
            </div>
            ` : ''}
            <div class="total-row total-final">
              <span>Total Amount:</span>
              <span>₹${appointmentData.total}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for choosing ${appointmentData.businessName}</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `;

    // Open print window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print with printer selection
    printWindow.onload = () => {
      printWindow.focus();
      
      // Try to use the modern print API if available
      if ('print' in printWindow) {
        printWindow.print();
      }
    };
  };

  const downloadPDF = () => {
    // Create invoice content with PDF-specific styling and instructions
    const invoiceContent = `
      <html>
        <head>
          <title>Invoice - ${appointmentData.id}</title>
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            @media print {
              @page {
                size: A4;
                margin: 15mm;
              }
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
            }
            .invoice-header {
              text-align: center;
              border-bottom: 2px solid #1b4d69;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .invoice-title {
              color: #1b4d69;
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
              .invoice-title2 {
              color: #1b4d69;
              font-size: 20px;
              font-weight: bold;
              margin: 0;
            }
            .invoice-subtitle {
              color: #666;
              font-size: 14px;
              margin-top: 5px;
            }
            .business-info {
              background: #f1f1f1;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .business-name {
              font-size: 20px;
              font-weight: bold;
              color: #1b4d69;
              margin-bottom: 10px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
            }
            .info-label {
              font-weight: bold;
              color: #333;
              width: 150px;
            }
            .services-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .services-table th,
            .services-table td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            .services-table th {
              background-color: #1b4d69;
              color: white;
              font-weight: bold;
            }
            .services-table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .total-section {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-top: 20px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .total-final {
              font-size: 18px;
              font-weight: bold;
              color: #1b4d69;
              border-top: 2px solid #1b4d69;
              padding-top: 10px;
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 12px;
            }
            .pdf-instructions {
              position: fixed;
              top: 10px;
              right: 10px;
              background: #1b4d69;
              color: white;
              padding: 15px;
              border-radius: 8px;
              font-size: 14px;
              z-index: 1000;
              max-width: 300px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            .pdf-instructions h4 {
              margin: 0 0 10px 0;
              font-size: 16px;
            }
            .pdf-instructions ol {
              margin: 10px 0;
              padding-left: 20px;
            }
            .pdf-instructions li {
              margin-bottom: 5px;
            }
            @media print {
              .pdf-instructions { display: none; }
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>

          <div class="invoice-header">
            <h1 class="invoice-title">Kalavyuha</h1>
            <h3 class="invoice-title2">Invoice</h3>
            <p class="invoice-subtitle">Appointment ID: ${appointmentData.id}</p>
          </div>

          <div class="business-info">
            <div class="business-name">${appointmentData.businessName}</div>
            <div>${appointmentData.businessAddress}</div>
            <div>Phone: ${appointmentData.businessPhone}</div>
            <div>Email: ${appointmentData.businessEmail}</div>
          </div>

          <div class="info-row">
            <div>
              <div class="info-label">Appointment Date:</div>
              <div>${appointmentData.appointmentDate}</div>
            </div>
            <div>
              <div class="info-label">Appointment Time:</div>
              <div>${appointmentData.appointmentTime}</div>
            </div>
          </div>

          <div class="info-row">
            <div>
              <div class="info-label">Booking Date:</div>
              <div>${appointmentData.bookingDate}</div>
            </div>
            <div>
              <div class="info-label">Payment Status:</div>
              <div>${appointmentData.paymentStatus}</div>
            </div>
          </div>

          <table class="services-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${appointmentData.services.map(service => `
                <tr>
                  <td>${service.name}</td>
                  <td>${service.description}</td>
                  <td>${service.duration}</td>
                  <td>₹${service.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₹${appointmentData.subtotal}</span>
            </div>
            <div class="total-row">
              <span>Tax & Fees:</span>
              <span>₹${appointmentData.tax}</span>
            </div>
            ${appointmentData.discount > 0 ? `
            <div class="total-row">
              <span>Discount:</span>
              <span>-₹${appointmentData.discount}</span>
            </div>
            ` : ''}
            <div class="total-row total-final">
              <span>Total Amount:</span>
              <span>₹${appointmentData.total}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for choosing ${appointmentData.businessName}</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>

          <script>
            // Auto-trigger print dialog with PDF destination preference
            setTimeout(() => {
              window.focus();
              
              // Try to set PDF as default destination using modern browser APIs
              if (window.print) {
                // Add metadata to hint PDF preference
                const meta = document.createElement('meta');
                meta.name = 'print-destination';
                meta.content = 'pdf';
                document.head.appendChild(meta);
                
                window.print();
              }
            }, 1000);
            
            // Listen for beforeprint event to set PDF preference
            window.addEventListener('beforeprint', function() {
              // This helps browsers understand the intent is PDF
              document.title = 'Invoice-' + '${appointmentData.id}' + '.pdf';
            });
          </script>
        </body>
      </html>
    `;

    // Open new window for PDF download
    const pdfWindow = window.open('', '_blank', 'width=800,height=600');
    pdfWindow.document.write(invoiceContent);
    pdfWindow.document.close();
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "#eaeef2",
        minHeight: "100vh",
        py: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          margin: "0 auto",
          px: { xs: 2, sm: 6, md: 6, lg: 12 },
          mt: 12,
        }}
      >
        {/* Header with Back Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            gap: 2,
          }}
        >
          <IconButton 
            onClick={handleBack}
            sx={{
              bgcolor: "#1b4d69",
              color: "white",
              "&:hover": {
                bgcolor: "#0f3a52",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#333",
              fontSize: { xs: "1.4rem", md: "1.7rem" },
            }}
          >
            Appointment Details
          </Typography>
        </Box>

        {/* Business Info Card */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "flex-start" },
                justifyContent: "space-between",
                p: 3,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 3,
                  width: "100%",
                }}
              >
                {/* Business Image */}
                <Box
                  sx={{
                    width: { xs: "100%", sm: 150, md: 180 },
                    height: { xs: 150, sm: 150, md: 180 },
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={sample}
                    alt={appointmentData.businessName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </Box>

                {/* Business Details */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      color: "#333",
                      mb: 1,
                      fontSize: { xs: "1.2rem", md: "1.5rem" },
                    }}
                  >
                    {appointmentData.businessName}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
                    <LocationOnIcon sx={{ color: "#666", fontSize: "1rem" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                      }}
                    >
                      {appointmentData.businessAddress}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
                    <PhoneIcon sx={{ color: "#666", fontSize: "1rem" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                      }}
                    >
                      {appointmentData.businessPhone}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
                    <EmailIcon sx={{ color: "#666", fontSize: "1rem" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                      }}
                    >
                      {appointmentData.businessEmail}
                    </Typography>
                  </Box>

                  <Chip
                    label={appointmentData.status}
                    sx={{
                      backgroundColor: appointmentData.status === "Pending" ? "#fff3cd" : "#d4edda",
                      color: appointmentData.status === "Pending" ? "#856404" : "#155724",
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                    }}
                  />
                </Box>
              </Box>

              {/* Rating */}
              <Box
                sx={{
                  bgcolor: "#1b4d69",
                  color: "#fff",
                  px: 1,
                  py: 0.5,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "fit-content",
                }}
              >
                <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
                  {appointmentData.rating}
                </Typography>
                <StarOutlinedIcon sx={{ color: "#fdd835", fontSize: 16 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Left Column - Appointment & Services */}
          <Grid item xs={12} md={8}>
            {/* Appointment Info */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#1b4d69",
                    mb: 2,
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                  }}
                >
                  Appointment Information
                </Typography>
                
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarTodayIcon sx={{ color: "#8eabbb", fontSize: "1.1rem" }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: "#666", fontSize: "0.8rem" }}>
                        Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
                        {appointmentData.appointmentDate}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon sx={{ color: "#8eabbb", fontSize: "1.1rem" }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: "#666", fontSize: "0.8rem" }}>
                        Time
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
                        {appointmentData.appointmentTime}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" sx={{ color: "#666", fontSize: "0.8rem" }}>
                      ID: 
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
                      {appointmentData.id}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Services Details */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#1b4d69",
                    mb: 2,
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                  }}
                >
                  Booked Services
                </Typography>

                {appointmentData.services.map((service, index) => (
                  <Box key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "500",
                            color: "#333",
                            fontSize: "1rem",
                          }}
                        >
                          {service.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#666",
                            fontSize: "0.85rem",
                            mb: 0.5,
                          }}
                        >
                          {service.description}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#8eabbb",
                            fontSize: "0.8rem",
                            fontWeight: "500",
                          }}
                        >
                          Duration: {service.duration}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "bold",
                          color: "#1b4d69",
                          fontSize: "1rem",
                        }}
                      >
                        ₹{service.price}
                      </Typography>
                    </Box>
                    {index < appointmentData.services.length - 1 && (
                      <Divider sx={{ my: 2 }} />
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Payment & Actions */}
          <Grid item xs={12} md={4}>
            {/* Payment Summary */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#1b4d69",
                    mb: 2,
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                  }}
                >
                  Payment Summary
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Subtotal
                    </Typography>
                    <Typography variant="body2">₹{appointmentData.subtotal}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Tax & Fees
                    </Typography>
                    <Typography variant="body2">₹{appointmentData.tax}</Typography>
                  </Box>
                  {appointmentData.discount > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Discount
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#28a745" }}>
                        -₹{appointmentData.discount}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold", color: "#333" }}>
                      Total Amount
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold", color: "#1b4d69" }}>
                      ₹{appointmentData.total}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                    Payment Method: {appointmentData.paymentMethod}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                    Payment Status: 
                    <Chip
                      label={appointmentData.paymentStatus}
                      size="small"
                      sx={{
                        ml: 1,
                        backgroundColor: "#d4edda",
                        color: "#155724",
                        fontSize: "0.7rem",
                      }}
                    />
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Booking Date: {appointmentData.bookingDate}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#1b4d69",
                    mb: 2,
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                  }}
                >
                  Quick Actions
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={generateInvoice}
                    sx={{
                      backgroundColor: "#1b4d69",
                      color: "white",
                      textTransform: "none",
                      fontWeight: "500",
                      "&:hover": {
                        backgroundColor: "#0f3a52",
                      },
                    }}
                  >
                    Print Invoice
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={downloadPDF}
                    sx={{
                      borderColor: "#1b4d69",
                      color: "#1b4d69",
                      textTransform: "none",
                      fontWeight: "500",
                      "&:hover": {
                        borderColor: "#0f3a52",
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    Download PDF
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<RescheduleIcon />}
                    sx={{
                      borderColor: "#8eabbb",
                      color: "#8eabbb",
                      textTransform: "none",
                      fontWeight: "500",
                      "&:hover": {
                        borderColor: "#6c8b9a",
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    Reschedule
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    sx={{
                      borderColor: "#dc3545",
                      color: "#dc3545",
                      textTransform: "none",
                      fontWeight: "500",
                      "&:hover": {
                        borderColor: "#c82333",
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    Cancel Appointment
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AppointmentHistoryDetail;

export const getImageUrl = (path) => {
  return new URL(`assets/${path}`, import.meta.url).href;
};

// Cart notification utilities
export const notifyCartUpdate = () => {
  // Dispatch custom event for cart updates
  window.dispatchEvent(new CustomEvent('cartUpdated'));
};

export const updateCartAndNotify = (cartItems) => {
  // Update localStorage
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  // Notify components
  notifyCartUpdate();
};

// Appointment utilities for testing
export const addTestAppointment = () => {
  const testAppointment = {
    BusinessId: 55319888,
    CustomerId: 21138275,
    AssignedStaffs: [
      {
        StaffId: "53099326",
        StaffName: "Test Staff"
      }
    ],
    SelectedDate: new Date().toISOString().split("T")[0],
    SelectedTime: "2:00 PM",
    Services: [
      {
        ServiceId: "35861610",
        ServiceName: "Test Service 1",
        Duration: "30 min",
        Price: 300
      },
      {
        ServiceId: "35861611", 
        ServiceName: "Test Service 2",
        Duration: "45 min",
        Price: 500
      }
    ],
    TotalPrice: 800,
    PaymentMethod: "online",
    PaymentStatus: "paid",
    SendSms: true,
    BookingId: Date.now(),
    CreatedAt: new Date().toISOString()
  };

  // Get existing appointments or initialize empty array
  const existingAppointments = JSON.parse(localStorage.getItem("userAppointments") || "[]");
  existingAppointments.unshift(testAppointment);
  localStorage.setItem("userAppointments", JSON.stringify(existingAppointments));
  
  // Notify appointment history page
  window.dispatchEvent(new CustomEvent('appointmentAdded', { 
    detail: testAppointment 
  }));
  
  console.log("Test appointment added:", testAppointment);
  return testAppointment;
};

// Make this function available globally for testing
window.addTestAppointment = addTestAppointment;
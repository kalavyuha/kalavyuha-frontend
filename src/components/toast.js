import { toast } from "react-toastify";

// Custom toast functions
export const showSuccess = (message) => {
  toast.success(message, {
    toastStyle: {
      backdropFilter: "blur(0px)",
      background: "rgba(40, 167, 69, 0.8)", 
      color: "#fff",
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    toastStyle: {
      backdropFilter: "blur(8px)",
      background: "rgba(220, 53, 69, 0.8)", 
      color: "#fff",
    },
  });
};

export const showWarning = (message) => {
  toast.warn(message, {
    toastStyle: {
      backdropFilter: "blur(8px)",
      background: "rgba(255, 193, 7, 0.8)",
      color: "#fff",
    },
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    toastStyle: {
      backdropFilter: "blur(8px)",
      background: "rgba(23, 162, 184, 0.8)", 
      color: "#fff",
    },
  });
};

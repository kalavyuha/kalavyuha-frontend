import { constant } from '../../../constant';

export const createStaff = async (staffData, authToken) => {
  try {
    console.log("Staff API - Sending data:", staffData);
    console.log("Staff API - Auth token:", authToken);
    
    const response = await fetch(`${constant.baseUrl}api/v1/Staff/create`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(staffData),
    });
    
    console.log("Staff API - Response status:", response.status);
    console.log("Staff API - Response headers:", response.headers);
    
    if (!response.ok) {
      const errorResponse = await response.json().catch(() => null);
      console.error("Staff API - Error response:", errorResponse);
      console.error("Staff API - Error details:", JSON.stringify(errorResponse, null, 2));
      throw new Error(errorResponse?.message || `Failed to save staff data - Status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("Staff API - Success response:", result);
    return result;
  } catch (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
};
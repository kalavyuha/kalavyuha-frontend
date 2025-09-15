import { constant } from '../../../constant';

export const createStaff = async (staffData, authToken) => {
  try {
    const response = await fetch(`${constant.baseUrl}api/v1/Staff/create`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(staffData),
    });
    
    if (!response.ok) {
      const errorResponse = await response.json().catch(() => null);
      throw new Error(errorResponse?.message || `Failed to save staff data - Status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};
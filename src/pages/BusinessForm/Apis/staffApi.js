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
      throw new Error(errorResponse?.message || 'Failed to save staff data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
};
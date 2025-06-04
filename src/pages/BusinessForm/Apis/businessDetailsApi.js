import { constant } from '../../../constant';

export const createBusinessDetails = async (businessData) => {
  try {

    const response = await fetch(`${constant.baseUrl}api/v1/BussinessDetails/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(businessData),
    });

    if (!response.ok) {
      const errorResponse = await response.json().catch(() => null);
      console.error("Detailed error response:", errorResponse); 
      throw new Error(errorResponse?.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating business details:', error);
    throw error;
  }
};
import { constant } from '../../../constant';

export const createBusinessDetails = async (businessData) => {
  try {
    console.log("Sending business data:", businessData);

    const response = await fetch(`${constant.baseUrl}api/v1/BussinessDetails/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${constant.token}`, 
      },
      body: JSON.stringify(businessData),
    });

    if (!response.ok) {
      const errorResponse = await response.json().catch(() => null);
      console.error("Detailed error response:", errorResponse);
      
      // Handle 422 validation errors specifically
      if (response.status === 422 && errorResponse?.detail) {
        const validationErrors = Array.isArray(errorResponse.detail) 
          ? errorResponse.detail.map(err => `${err.loc?.join('.')} - ${err.msg}`).join(', ')
          : errorResponse.detail;
        throw new Error(`Validation errors: ${validationErrors}`);
      }
      
      throw new Error(errorResponse?.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating business details:', error);
    throw error;
  }
};
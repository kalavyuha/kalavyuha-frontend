import { constant } from '../../../constant';

export const createServices = async (servicesData, authToken) => {
  try {
    console.log("Sending services data:", servicesData);
    
    const response = await fetch(`${constant.baseUrl}api/v1/Service/create/`, {
      method: 'POST',
      headers: { 
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(servicesData)
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
    console.error('Error in createServices:', error);
    throw error;
  }
};
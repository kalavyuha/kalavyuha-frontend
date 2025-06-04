import { constant } from '../../../constant';

export const createServices = async (servicesData, authToken) => {
  try {
    const response = await fetch(`${constant.baseUrl}api/v1/Service/create/`, {
      method: 'POST',
      headers: { 
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(servicesData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create services');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in createServices:', error);
    throw error;
  }
};
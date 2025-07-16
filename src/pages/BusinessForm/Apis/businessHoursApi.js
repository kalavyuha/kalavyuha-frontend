// Business Hours API Functions

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

/**
 * Create business hours for a business
 * @param {Object} businessHoursData - The business hours data to create
 * @param {string} authToken - Authentication token
 * @returns {Promise} - Promise that resolves to the API response
 */
export const createBusinessHours = async (businessHoursData, authToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/BussinessHours/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(businessHoursData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Business hours creation failed: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating business hours:', error);
    throw error;
  }
};

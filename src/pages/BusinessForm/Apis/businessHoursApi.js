// Business Hours API Functions

const API_BASE_URL = 'https://api.slotwel.in/api/v1';

/**
 * Create business hours for a business
 * @param {Object} businessHoursData - The business hours data to create
 * @param {string} authToken - Authentication token
 * @returns {Promise} - Promise that resolves to the API response
 */
export const createBusinessHours = async (businessHoursData, authToken) => {
  try {
    console.log('Sending business hours data:', JSON.stringify(businessHoursData, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/BussinessHours/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(businessHoursData),
    });

    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        
        // Handle different error response formats
        if (errorData.detail && Array.isArray(errorData.detail)) {
          // FastAPI validation errors format
          console.error('Full validation errors:', errorData.detail);
          const validationErrors = errorData.detail.map(err => {
            console.error('Individual error:', err);
            return `${err.loc?.join('.')} - ${err.msg} (Input: ${JSON.stringify(err.input || 'N/A')})`;
          }).join('; ');
          errorMessage = `Validation errors: ${validationErrors}`;
        } else if (errorData.detail && typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else {
          errorMessage = JSON.stringify(errorData);
        }
        
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(`Business hours creation failed: ${errorMessage}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating business hours:', error);
    throw error;
  }
};

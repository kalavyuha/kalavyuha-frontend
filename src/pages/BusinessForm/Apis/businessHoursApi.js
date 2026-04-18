// Business Hours API Functions

import { constant } from "../../../constant";

/**
 * Create business hours for a business
 * @param {Object} businessHoursData - The business hours data to create
 * @param {string} authToken - Authentication token
 * @returns {Promise} - Promise that resolves to the API response
 */
export const createBusinessHours = async (businessHoursData, authToken) => {
  try {
    const response = await fetch(`${constant.baseUrl}/api/v1/business-hours/`, {
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
        
        // Handle different error response formats
        if (errorData.detail && Array.isArray(errorData.detail)) {
          // FastAPI validation errors format
          const validationErrors = errorData.detail.map(err => {
            return `${err.loc?.join('.')} - ${err.msg}`;
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
        // Failed to parse error response
      }
      throw new Error(`Business hours creation failed: ${errorMessage}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

import { constant } from '../../../constant';
import { transformFilteredBusinesses } from '../transformers/filteredBusinesses.transformer';

const buildQueryString = (params) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(
      ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');

export const fetchFilteredBusinesses = async ({
  serviceName = '',
  location = '',
  businessType = '',
  time = '',
  timeSlot = '',
  startTime = '',
  latitude,
  longitude
} = {}) => {
  try {
    const queryParams = {
      search: serviceName,
      business_type: businessType,
      city: location,
      latitude,
      longitude,
      radius_km: 15,
      time: time || startTime || (timeSlot && timeSlot !== '24 Hours' ? timeSlot : ''),
    };

    if ((latitude === undefined || longitude === undefined) && typeof window !== 'undefined') {
      const storedLat = window.localStorage.getItem('latitude');
      const storedLng = window.localStorage.getItem('longitude');
      if (storedLat && storedLng) {
        queryParams.latitude = parseFloat(storedLat);
        queryParams.longitude = parseFloat(storedLng);
      }
    }

    const queryString = buildQueryString(queryParams);
    const response = await fetch(
      `${constant.baseUrl}/api/v1/filters/busniess_metainfo?${queryString}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    if (data?.status === 1 && data?.data?.businesses) {
      return transformFilteredBusinesses(data.data.businesses);
    }

    return [];
  } catch (error) {
    console.error('Filter businesses API failed:', error);
    return [];
  }
};

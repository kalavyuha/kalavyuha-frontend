import { constant } from '../../../constant';
import { dummyNearbyServices } from '../utils/nearbyServices.dummy';
import { transformNearbyServices } from '../transformers/nearbyServices.transformer';

export const fetchNearbyServices = async ({
  searchFor = 'Service',
  latitude,
  longitude,
  page = 1
}) => {
  try {
    const API_URL = `${constant.baseUrl}/api/v1/Service/popularServiceAndBusinesses/?SearchFor=${searchFor}&latitude=${latitude}&longitude=${longitude}&page=${page}`;

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    const items = data?.Data?.items || [];

    if (Array.isArray(items) && items.length > 0) {
      return transformNearbyServices(items);
    }

    // fallback dummy data
    return transformNearbyServices(dummyNearbyServices);

  } catch (error) {
    console.error('Nearby services API failed:', error);

    // fallback dummy data
    return transformNearbyServices(dummyNearbyServices);
  }
};
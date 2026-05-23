import { constant } from '../../../constant';
import { dummyNavigationPopularServices } from '../utils/navigationPopularServices.dummy';
import { transformNavigationPopularServices } from '../transformers/navigationPopularServices.transformer';

export const fetchNavigationPopularServices = async ({
  maxDistanceKm = 15,
  limit = 5,
  minPrice = 50,
  sortBy = 'Price',
  userLatitude = 28.466296,
  userLongitude = 77.011864,
  newBusinesses = true
}) => {
  try {
    const API_URL = `${constant.baseUrl}/api/v1/Service/popularServices/?max_distance_km=${maxDistanceKm}&limit=${limit}&MinPrice=${minPrice}&SortBy=${sortBy}&user_latitude=${userLatitude}&user_longitude=${userLongitude}&new_businesses=${newBusinesses}`;

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (data?.Status === 200 && data?.Data) {
      return transformNavigationPopularServices(data.Data);
    }

    return transformNavigationPopularServices(dummyNavigationPopularServices);
  } catch (error) {
    console.error('Navigation popular services API failed:', error);
    return transformNavigationPopularServices(dummyNavigationPopularServices);
  }
};

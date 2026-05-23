import { constant } from '../../../constant';
import { dummyPopularServices } from '../utils/popularServices.dummy';
import { transformPopularServices } from '../transformers/popularServices.transformer';

export const fetchPopularServices = async ({
  category = 'Beauty',
  searchFor = 'Service',
  latitude = 28.466296,
  longitude = 77.011864,
  page = 1
}) => {
  try {
    const API_URL = `${constant.baseUrl}/api/v1/Service/popularServiceAndBusinesses/?SearchFor=${searchFor}&Category=${category}&latitude=${latitude}&longitude=${longitude}&page=${page}`;

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (data?.Status === 200 && data?.Data) {
      return transformPopularServices(data.Data);
    }

    return transformPopularServices(dummyPopularServices);
  } catch (error) {
    console.error('Popular services API failed:', error);
    return transformPopularServices(dummyPopularServices);
  }
};

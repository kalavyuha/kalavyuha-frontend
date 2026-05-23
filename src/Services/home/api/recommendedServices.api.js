import { constant } from '../../../constant';

import { dummyRecommendedServices } from '../utils/recommendedServices.dummy';

import { transformRecommendedServices } from '../transformers/recommendedServices.transformer';

export const fetchRecommendedServices = async ({
  category = 'Beauty',
  searchFor = 'Businesses',
  latitude,
  longitude,
  page = 1
}) => {
  try {

    const API_URL =
      `${constant.baseUrl}/api/v1/Service/popularServiceAndBusinesses/?search_for=${searchFor}&category=${category}&latitude=${latitude}&longitude=${longitude}&page=${page}`;

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    const items = data?.Data?.items || [];

    if (Array.isArray(items) && items.length > 0) {
      return transformRecommendedServices(items);
    }

    return transformRecommendedServices(dummyRecommendedServices);

  } catch (error) {

    console.error('Recommended services API failed:', error);

    return transformRecommendedServices(dummyRecommendedServices);
  }
};
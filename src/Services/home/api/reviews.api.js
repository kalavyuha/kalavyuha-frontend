import { constant } from '../../../constant';
import { transformReviews } from '../transformers/reviews.transformer';
import { dummyReviews } from '../utils/reviews.dummy';

export const fetchReviews = async ({
  businessId,
  customerId
}) => {

  try {

    const API_URL =
      `${constant.baseUrl}/api/v1/Reviews/get/?businessId=${businessId}&customerId=${customerId}`;

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const items = data?.Data || [];

    if (Array.isArray(items) && items.length > 0) {
      return transformReviews(items);
    }

    return transformReviews(dummyReviews);

  } catch (error) {

    console.error('Reviews API failed:', error);

    return transformReviews(dummyReviews);
  }
};
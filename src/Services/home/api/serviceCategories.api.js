import { constant } from '../../../constant';

export const fetchServiceCategories = async () => {
  try {
    const response = await fetch(
      `${constant.baseUrl}/api/v1/business-service/categories/names`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    const categories = Array.isArray(data?.data) ? data.data : [];

    return categories.map((item) => ({
      title: item.category_name || 'Unknown Category',
      image: item.image || '',
      action: 'Book Now',
      link: '/overview',
      state: {
        search: {
          category: item.category_name || '',
        },
      },
    }));
  } catch (error) {
    console.error('Service categories API failed:', error);
    return [];
  }
};

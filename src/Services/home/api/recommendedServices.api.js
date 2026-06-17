import { constant } from '../../../constant';
import { dummyRecommendedServices } from '../utils/recommendedServices.dummy';
import { transformRecommendedServices } from '../transformers/recommendedServices.transformer';

const normalizeBusinessType = (category) => {
  if (!category) return '';
  const lower = category.toLowerCase();

  if (lower.includes('beauty')) return 'beauty';
  if (lower.includes('wellness')) return 'wellness';
  if (lower.includes('fitness')) return 'fitness';
  if (lower.includes('health')) return 'health';
  return lower.replace(/\s+/g, '_');
};

const buildQueryString = (params) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

export const fetchRecommendedServices = async ({
  category = 'Beauty',
  latitude,
  longitude,
  page = 1,
  limit = 20
}) => {
  try {
    const businessType = normalizeBusinessType(category);

    const queryParams = {
      business_type: businessType,
      latitude,
      longitude,
      radius_km: 15,
      page,
      limit,
    };

    if ((!latitude || !longitude) && typeof window !== 'undefined') {
      const storedLat = window.localStorage.getItem('latitude');
      const storedLng = window.localStorage.getItem('longitude');
      if (storedLat && storedLng) {
        queryParams.latitude = parseFloat(storedLat);
        queryParams.longitude = parseFloat(storedLng);
      }
    }

    const API_URL = `${constant.baseUrl}/api/v1/filters/busniess_metainfo?${buildQueryString(queryParams)}`;

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    const items = data?.data?.businesses || [];

    if (Array.isArray(items) && items.length > 0) {
      return transformRecommendedServices(items);
    }

    return transformRecommendedServices(dummyRecommendedServices);
  } catch (error) {
    console.error('Recommended services API failed:', error);
    return transformRecommendedServices(dummyRecommendedServices);
  }
};
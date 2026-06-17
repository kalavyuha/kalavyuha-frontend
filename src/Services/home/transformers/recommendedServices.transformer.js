import RecommendedImgPath from '../../../assets/images/recommended/recommended.png';

export const transformRecommendedServices = (items = []) => {
  return items.map((item, index) => {
    const location = item.location || {};
    const streetAddress = [location.shop_number, location.street_address]
      .filter(Boolean)
      .join(', ');
    const region = [location.city, location.state]
      .filter(Boolean)
      .join(', ');
    const address = [streetAddress, region].filter(Boolean).join(', ') || 'Location';

    const distanceValue =
      location.latitude && location.longitude && item.distance_km !== undefined
        ? item.distance_km
        : item.distance_km ?? item.Distance ?? 0;

    const topService = Array.isArray(item.top_services) ? item.top_services[0] : null;

    return {
      id: item.id || item._id || index + 1,
      Business: {
        Name: item.business_name || item.BusinessName || 'Unknown Business',
        Address: address,
        Rating: item.rating?.average ?? item.Rating ?? 0,
        Image: item.profile_image || item.ProfileImage || RecommendedImgPath,
        Distance: distanceValue ? `${distanceValue} Km` : '0.0 Km',
      },
      Service: {
        Type: item.business_type || item.BussinessType || topService?.category?.name || 'Service',
        DiscountedPrice: topService?.current_pricing?.price || 50,
        OriginalPrice: topService?.current_pricing?.price || 50,
      },
    };
  });
};
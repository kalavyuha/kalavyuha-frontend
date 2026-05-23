import RecommendedImgPath from '../../../assets/images/recommended/recommended.png';

export const transformRecommendedServices = (items = []) => {
  return items.map((item, index) => ({
    id: item._id || index + 1,

    Business: {
      Name: item.BusinessName || 'Unknown Business',

      Address:
        item.Region ||
        item.City ||
        'Location',

      Rating: item.Rating || 4.8,

      Image: item.ProfileImage || RecommendedImgPath,

      Distance: item.Distance
        ? `${item.Distance} Km`
        : '0.0 Km'
    },

    Service: {
      Type: item.BussinessType || 'Service',

      DiscountedPrice: 50,

      OriginalPrice: 50
    }
  }));
};
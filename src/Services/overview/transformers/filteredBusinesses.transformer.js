export const transformFilteredBusinesses = (items = []) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => {
    const location = item.location || {};
    const streetAddress = [location.shop_number, location.street_address]
      .filter(Boolean)
      .join(', ');
    const region = [location.city, location.state].filter(Boolean).join(', ');

    const services = [
      {
        Categories: [
          {
            Services: Array.isArray(item.top_services)
              ? item.top_services.map((service) => ({
                  Name: service.name || 'Service',
                  Duration: service.duration
                    ? `${service.duration} ${service.duration_type || ''}`.trim()
                    : 'N/A',
                  Price: service.current_pricing?.price || 0,
                  isDiscount: false,
                  DiscountedPrice: service.current_pricing?.price || 0,
                }))
              : [],
          },
        ],
      },
    ];

    return {
      business_details: {
        BusinessName: item.business_name || 'Unknown Business',
        StreetAddress: streetAddress,
        Region: region,
        LikesCount: item.rating?.count || 0,
        ClosingTime: item.close_time || '',
        ProfileImage: item.profile_image || '',
        _id: item.id || '',
      },
      services,
      'Business Facilities': [],
      'Average Rating': item.rating?.average || 0,
    };
  });
};

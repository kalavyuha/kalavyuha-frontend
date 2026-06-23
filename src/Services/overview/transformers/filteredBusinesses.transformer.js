export const transformFilteredBusinesses = (items = []) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => {
    const location = item.location || {};

    const streetAddress = [
      location.shop_number,
      location.street_address,
    ]
      .filter(Boolean)
      .join(', ');

    const region = [
      location.city,
      location.state,
    ]
      .filter(Boolean)
      .join(', ');

    const allServices = Array.isArray(item.top_services)
      ? item.top_services.map((service) => ({
          Name: service.name || 'Service',
          Price: service.price || 0,
          isDiscount: false,
          DiscountedPrice: service.price || 0,
        }))
      : [];

    const services = allServices.slice(0, 3);

    const remainingServices = allServices.slice(3);

    return {
      business_details: {
        BusinessName: item.business_name || 'Unknown Business',

        StreetAddress: streetAddress,

        Region: region,

        ReviewCount: item.rating?.count || 0,

        AverageRating: item.rating?.average || 0,

        ClosingTime: item.close_time || '',

        ProfileImage: item.profile_image || '',

        _id: item.id || '',
      },

      services,

      more_services_count:
        item.more_services_count ||
        remainingServices.length,

      more_services_starting_from:
        item.more_services_starting_from ||
        (remainingServices.length
          ? Math.min(
              ...remainingServices.map(
                (service) => service.Price || 0
              )
            )
          : 0),

    };
  });
};
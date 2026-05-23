export const transformFilteredBusinesses = (items = []) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item, index) => ({
    _id: item._id || index + 1,
    BusinessName: item.BusinessName || 'Unknown Business',
    Region: item.Region || 'Unknown Region',
    StreetAddress: item.StreetAddress || '',
    Latitude: item.Latitude || 28.466296,
    Longitude: item.Longitude || 77.011864,
    Rating: item.Rating || 4.5,
    Distance: item.Distance || 0
  }));
};

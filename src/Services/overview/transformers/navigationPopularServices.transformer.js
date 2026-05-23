export const transformNavigationPopularServices = (items = []) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item, index) => ({
    _id: item._id || index + 1,
    Service: {
      Name: item.Service?.Name || item.ServiceName || 'Service'
    }
  }));
};

export const transformServices = (services) => {
  return services.map((category) => ({
    category: {
      name: category.name,
      expanded: category.expanded ?? true,
    },
    services: category.services.map((service) => ({
      name: service.name,
      description: service.description || "",
      duration: service.duration || 0,
      duration_type: service.durationType || "minutes",
      image: service.image?.url || service.imageUrl || null,
      uploaded: service.uploaded || false,
      online_booking_enabled: service.onlineBookingEnabled ?? false,
      pricing: {
        price: parseFloat(service.price) || 0,
        effective_from: new Date().toISOString(),
        effective_to: null,
      },
      assigned_staff: service.staff || [],
    })),
  }));
};

export const transformServices = (services) => {
  const normalizeDurationType = (dt) => {
    if (!dt) return "minutes";
    const d = String(dt).toLowerCase();

    if (d === "mins" || d === "mints" || d === "min") return "minutes";
    if (d === "hrs" || d === "hr") return "hours";
    if (d === "day") return "days";
    if (d === "month") return "months";

    if (["minutes", "hours", "days", "months"].includes(d)) return d;

    return "minutes";
  };

  return services.map((category) => ({
    category: {
      name: category.name,
      expanded: category.expanded ?? true,
    },
    services: category.services.map((service) => ({
      name: service.name,
      description: service.description || "",
      duration: service.duration || 0,
      duration_type: normalizeDurationType(
        service.durationType || service.duration_type
      ),
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

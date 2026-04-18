export const transformStaff = (members) =>
  members.map((m) => {
    let specialization = null;

    if (Array.isArray(m.role)) {
      specialization = m.role.join(", ");
    } else if (typeof m.role === "string") {
      specialization = m.role;
    } else if (m.role && typeof m.role === "object") {
      specialization =
        m.role.value || m.role.label || JSON.stringify(m.role);
    }

    return {
      name: m.name,

      profile_image: m.profileImage?.url || null,

      phone: m.phone || null,
      email: m.email || null,

      specialization: specialization || null,

      experience: m.experience ? Number(m.experience) : null,

      gender: m.gender?.toLowerCase() || "any"
    };
  });
import { apiClient } from "../utils/apiClient";

// Create a category
export const createCategoryApi = (payload, token) =>
  apiClient({
    url: "/api/v1/business-service/categories/",
    method: "POST",
    body: payload,
    token,
  });

// Create a service under a category
export const createServiceApi = (payload, token) =>
  apiClient({
    url: "/api/v1/business-service/",
    method: "POST",
    body: payload,
    token,
  });

// Assign staff to a service
export const assignStaffToServiceApi = (serviceId, staffIds, token) =>
  apiClient({
    url: `/api/v1/business-service/${serviceId}/assign-staff`,
    method: "POST",
    body: { staff_ids: staffIds },
    token,
  });


import { apiClient } from "../utils/apiClient";

export const createStaffApi = (payload, token) =>
  apiClient({
    url: "/api/v1/business-staff/",
    method: "POST",
    body: payload,
    token,
  });
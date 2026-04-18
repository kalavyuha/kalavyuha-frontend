import { apiClient } from "../utils/apiClient";

export const createHoursApi = (payload, token) =>
  apiClient({
    url: "/api/v1/business-hours/",
    method: "POST",
    body: payload,
    token,
  });
import { apiClient } from "../utils/apiClient";

export const createBusiness = (payload, token) =>
  apiClient({
    url: "/api/v1/business-details/",
    method: "POST",
    body: payload,
    token,
  });
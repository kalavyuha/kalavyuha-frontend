import { apiClient } from "../utils/apiClient";

export const uploadDocumentApi = (formData, token) =>
  apiClient({
    url: "/api/v1/business-documents/upload",
    method: "POST",
    body: formData,
    token,
    isFormData: true,
  });
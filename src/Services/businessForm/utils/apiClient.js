import { constant } from "../../../constant";

export const apiClient = async ({
  url,
  method = "GET",
  body,
  token,
  isFormData = false,
}) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${constant.baseUrl}${url}`, {
      method,
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });

    const contentType = response.headers.get("content-type");

    let data = null;
    if (contentType?.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
        data?.detail ||
        `HTTP ${response.status}`
      );
    }

    return data;

  } catch (error) {
    throw error;
  }
};
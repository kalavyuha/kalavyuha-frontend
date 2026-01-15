export const getToken = () => localStorage.getItem("authToken");

export const setToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const clearAuth = () => {
  localStorage.removeItem("authToken");
};

export const isAuthenticated = () => {
  return !!getToken();
};

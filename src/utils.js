export const getImageUrl = (path) => {
  return new URL(`assets/${path}`, import.meta.url).href;
};

// Cart notification utilities
export const notifyCartUpdate = () => {
  // Dispatch custom event for cart updates
  window.dispatchEvent(new CustomEvent('cartUpdated'));
};

export const updateCartAndNotify = (cartItems) => {
  // Update localStorage
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  // Notify components
  notifyCartUpdate();
};
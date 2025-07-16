import { useState } from 'react';

export const useCookieSettings = () => {
  const [showCookieSettings, setShowCookieSettings] = useState(false);

  const openCookieSettings = () => {
    setShowCookieSettings(true);
  };

  const closeCookieSettings = () => {
    setShowCookieSettings(false);
  };

  return {
    showCookieSettings,
    openCookieSettings,
    closeCookieSettings,
  };
};

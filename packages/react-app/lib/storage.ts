export const clearStorage = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.clear();
  sessionStorage.clear();

  if ('caches' in window) {
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => caches.delete(key)));
    });
  }

  // Clear cookies
  document.cookie.split(';').forEach((cookie) => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  });
};

import { useEffect, useState } from 'react';

function usePersistedState(key, initialState) {
  const [state, setState] = useState(() => {
    const storageValue = localStorage.getItem(key);
    return storageValue ? JSON.parse(storageValue) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state)); // Use localStorage instead of Cookies
  }, [key, state]);

  return [state, setState];
}

export default usePersistedState;
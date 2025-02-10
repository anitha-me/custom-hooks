import { useState, useEffect } from "react";

export const getLocalStorageValue = (
  key: string,
  defaultValue?: string | number | boolean | object | object[] | number[]
) => {
  const saved = localStorage.getItem(key);
  const initial = saved !== null ? JSON?.parse(saved) : defaultValue;
  return initial;
};

/* Hook: useLocalStorage.
 *
 * Features:
 *  - JSON Serializing
 *  - Value will be updated everywhere, when value updated (via `storage` event)
 */
export const useLocalStorage = (
  key: string,
  defaultValue: string | number | boolean | object | object[] | number[]
) => {
  const [value, setValue] = useState(() => {
    return getLocalStorageValue(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export const setLocalStorageValue = (
  key: string,
  value?: string | number | boolean | object | object[] | number[]
) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorageValue = (key: string) => {
  localStorage.removeItem(key);
};

export const clearAllLocalStorageValue = () => {
  localStorage.clear();
};

import { useState } from 'react';

export const useLocalStorage = <T>(key: string, initVal: T) => {
  const [storedValue, setStoredValue] = useState<T>((): T => {
    try {
      const item = window.localStorage.getItem(key);

      if (item) {
        const val: unknown = JSON.parse(item);

        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return (val ?? initVal) as T;
      }

      return initVal;
    } catch (error) {
      return initVal;
    }
  });

  const setValue = (value: T | ((args: T) => T)) => {
    const freshValue =
      typeof value === 'function'
        ? (value as (args: T) => T)(storedValue)
        : value;

    setStoredValue(freshValue);
    window.localStorage.setItem(key, JSON.stringify(freshValue));
  };

  return [storedValue, setValue] as const;
};

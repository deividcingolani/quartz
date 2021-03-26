import { useEffect, useState } from 'react';

const useDebounce = <T = any>(
  value: T,
  delay: number,
  callback?: (value: T) => void,
) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);

      if (callback) {
        callback(value);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, callback]);

  return debouncedValue;
};

export default useDebounce;

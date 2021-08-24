import { useEffect, useRef } from 'react';

const useInterval = (cb: () => void, delay: number): void => {
  const callbackRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    callbackRef.current = cb;
  });

  useEffect(() => {
    const tick = () => {
      if (typeof callbackRef.current === 'function') callbackRef.current();
    };
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
};

export default useInterval;

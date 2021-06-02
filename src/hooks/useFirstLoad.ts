import { useEffect, useState } from 'react';

const useFirstLoad = <T>(data: T): T | undefined => {
  const [isFirstLoad, setFirstLoad] = useState(true);
  const [dataAfterLoad, setData] = useState<T>();

  useEffect(() => {
    if (data && isFirstLoad) {
      setData(data);
      setFirstLoad(false);
    }
  }, [data, isFirstLoad]);
  return dataAfterLoad;
};

export default useFirstLoad;

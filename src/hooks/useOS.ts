import { useEffect, useState } from 'react';

export enum OSNames {
  'MAC' = 'mac',
  'OTHER' = 'other',
}

const useOS = () => {
  const [name, setName] = useState<OSNames>();

  useEffect(() => {
    if (window.navigator.userAgent.indexOf('Mac') !== -1) {
      setName(OSNames.MAC);
    } else {
      setName(OSNames.OTHER);
    }
  }, []);

  return { name };
};

export default useOS;

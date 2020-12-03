import { useMemo } from 'react';
import { DataEntity } from '../types';

export const useLatestVersion = <T extends DataEntity>(
  data: T | undefined,
  all: T[],
) => {
  const latestVersion = useMemo(() => {
    const versions = all
      .filter(({ name }) => name === data?.name)
      .map(({ version }) => version.toString());
    return versions.sort((v1, v2) => -v1.localeCompare(v2))[0];
  }, [data, all]);

  return {
    latestVersion,
  };
};

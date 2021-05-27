import { TrainingDataset } from '../../../../types/training-dataset';
import { useMemo } from 'react';

export const versionsSort = <T extends TrainingDataset | null>(
  data: T,
  latestVersion: number,
): any => {
  const versions = useMemo(() => {
    return (
      data?.versions
        ?.sort((versionA, versionB) => {
          return Math.sign(versionA.version - versionB.version);
        })
        .map(
          ({ version }) =>
            `${version} ${version === latestVersion ? '(latest)' : ''}`,
        ) || []
    );
  }, [data, latestVersion]);

  return { versions };
};

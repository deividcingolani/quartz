import { Box, Flex } from 'rebass';
import React, { FC, useMemo } from 'react';
import { Callout, CalloutTypes, Value } from '@logicalclocks/quartz';

import { FeatureGroup } from '../../../types/feature-group';

export interface MatchingErrorProps {
  features: string[];
  featureGroups: FeatureGroup[];
}

const MatchingError: FC<MatchingErrorProps> = ({ featureGroups, features }) => {
  const isMatchingFeatureGroups = useMemo(
    () =>
      featureGroups.every(({ features: fgFeatures }) =>
        features.every((feature) =>
          fgFeatures.map(({ name }) => name).includes(feature),
        ),
      ),
    [featureGroups, features],
  );

  const notMatchingFeatureGroups = useMemo(
    () =>
      featureGroups.filter(
        ({ features: fgFeatures }) =>
          !features.every((feature) =>
            fgFeatures.map(({ name }) => name).includes(feature),
          ),
      ),
    [featureGroups, features],
  );

  if (isMatchingFeatureGroups) {
    return null;
  }

  return (
    <Box mt="20px">
      <Callout
        type={CalloutTypes.error}
        content={
          <Flex flexDirection="column">
            <Value color="labels.red">
              Not all the attached feature groups contain the selected features.
            </Value>
            <Box ml="4px">
              <ul style={{ margin: 0, paddingLeft: '15px' }}>
                {notMatchingFeatureGroups.map(
                  ({ features: fgFeatures, name }) => {
                    const notMatchingFeatures = features.filter(
                      (feature) =>
                        !fgFeatures
                          .map(({ name: featureName }) => featureName)
                          .includes(feature),
                    );

                    return (
                      <li key={name}>
                        <Value ml="-3px" color="labels.red">
                          {name} does not contain the following features:{' '}
                          {notMatchingFeatures.join(', ')}
                        </Value>
                      </li>
                    );
                  },
                )}
              </ul>
            </Box>
          </Flex>
        }
      />
    </Box>
  );
};

export default MatchingError;

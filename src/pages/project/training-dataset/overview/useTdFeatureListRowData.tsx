// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { useCallback, useMemo } from 'react';
import { Box } from 'rebass';
import { Value, Labeling, Badge, Tooltip } from '@logicalclocks/quartz';

import TdFeatureGroupHandle from './TdFeatureGroupHandle';
import { Feature } from '../../../../types/feature';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';

import icons from '../../../../sources/icons';

const useTdFeatureListRowData = (features: Feature[]) => {
  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      // Is this route correct
      navigate(
        route.replace(':featureId', String(id)),
        'p/:id/fs/:fsId/td/:tdId',
      );
    },
    [navigate],
  );

  const groupComponents = useMemo(() => {
    return features.map(({ label }) => [
      Value,
      Badge,
      TdFeatureGroupHandle,
      Labeling,
      ...(label ? [Badge] : [() => null]),
      Tooltip,
    ]);
  }, [features]);

  const groupProps = useMemo(() => {
    return features.map(({ name, featuregroup, description, type, label }) => [
      {
        children: name,
      },
      {
        value: type,
        variant: 'bold',
        width: 'max-content',
      },
      {
        featureGroup: featuregroup,
      },
      {
        children: description || '-',
        gray: true,
      },
      label
        ? {
            value: 'target feature',
            width: 'max-content',
            variant: 'success',
          }
        : {},
      {
        mainText: 'Statistics',
        children: (
          <Box
            p="5px"
            height="28px"
            sx={{
              cursor: 'pointer',
              backgroundColor: '#ffffff',
              transition: 'all .4s ease',

              ':hover': {
                backgroundColor: 'grayShade3',
              },

              svg: {
                width: '20px',
                height: '20px',
              },
            }}
            onClick={handleNavigate(1, `/statistics/f/${name}`)}
          >
            {icons.stats}
          </Box>
        ),
      },
    ]);
  }, [features, handleNavigate]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useTdFeatureListRowData;

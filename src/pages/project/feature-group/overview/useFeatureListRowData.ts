import React, { useCallback, useMemo } from 'react';

import {
  Value,
  Badge,
  Labeling,
  IconButton,
  Tooltip,
} from '@logicalclocks/quartz';

import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import { Feature } from '../../../../types/feature-group';
import { Flex } from 'rebass';

const useFeatureListRowData = (features: Feature[]) => {
  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (route: string) => (): void => {
      navigate(route, 'p/:id/fg/:fgId');
    },
    [navigate],
  );

  const groupComponents = useMemo(() => {
    return features.map(({ partition, primary }) => [
      Value,
      Labeling,
      ...(partition ? [Badge] : [() => null]),
      ...(primary ? [Badge] : [() => null]),
      Badge,
      Tooltip,
    ]);
  }, [features]);

  const groupProps = useMemo(() => {
    return features.map(({ type, name, description, partition, primary }) => [
      {
        children: name,
      },
      {
        children: description || 'No description ',
        gray: true,
      },
      partition
        ? {
            value: 'partition key',
            width: 'max-content',
            variant: 'success',
          }
        : {},
      primary
        ? {
            value: 'primary key',
            width: 'max-content',
            variant: 'success',
          }
        : {},
      {
        value: type,
        variant: 'bold',
        marginLeft: 'auto',
        width: 'max-content',
      },
      {
        disabled: true,
        children: React.createElement(
          Flex,
          {},
          React.createElement(IconButton, {
            intent: 'ghost',
            icon: 'table',
            tooltip: 'Data preview',
            onClick: handleNavigate(`/data-preview/${name}`),
          }),
          React.createElement(IconButton, {
            intent: 'ghost',
            icon: 'poll',
            tooltip: 'Statistics',
            onClick: handleNavigate(`/statistics/f/${name}`),
          }),
        ),
      },
    ]);
  }, [features, handleNavigate]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useFeatureListRowData;

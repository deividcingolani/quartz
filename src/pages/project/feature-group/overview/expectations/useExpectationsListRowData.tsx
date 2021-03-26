import { Box, Flex } from 'rebass';
import React, { useCallback, useMemo } from 'react';
import { Value, Tooltip } from '@logicalclocks/quartz';

import LastValidation from './LastValidation';
import icons from '../../../../../sources/icons';
import {
  ActivityItemData,
  FeatureGroup,
} from '../../../../../types/feature-group';
import useNavigateRelative from '../../../../../hooks/useNavigateRelative';
import { rulesMap } from '../../../../expectation/types';
import { cropText } from '../../../storage-connectors/utils';
import { getStatusCount } from '../../../../../components/activity/utils';

const useExpectationsListRowData = (
  data: FeatureGroup,
  onOpenDrawer: (name: string) => () => void,
  onDelete: (name: string) => () => void,
) => {
  const groupComponents = useMemo(() => {
    return data.expectations?.map(() => [
      Value,
      LastValidation,
      Value,
      Value,
      Flex,
    ]);
  }, [data]);

  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (route: string) => (): void => {
      navigate(route, 'p/:id/*');
    },
    [navigate],
  );

  const groupProps = useMemo(() => {
    let successCount = 0;
    let warningCount = 0;
    let alertCount = 0;

    if (data.lastValidation) {
      const validation = {
        validations: data.lastValidation[0] as unknown,
      } as ActivityItemData;

      successCount = getStatusCount('SUCCESS', validation);

      warningCount = getStatusCount('WARNING', validation);

      alertCount = getStatusCount('FAILURE', validation);
    }

    return data.expectations?.map(({ name, rules, features }) => [
      {
        children: name,
      },
      {
        success: successCount,
        warning: warningCount,
        alert: alertCount,
      },
      {
        children: cropText(
          rules.map(({ name }) => rulesMap.getByKey(name)).join(', '),
          90,
        ),
      },
      {
        children: cropText(features.join(', '), 50),
      },
      {
        children: (
          <Flex>
            <Tooltip mainText="Detach">
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
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(name)();
                }}
              >
                {icons.bin}
              </Box>
            </Tooltip>
            <Tooltip ml="8px" mainText="Edit">
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
                onClick={handleNavigate(`/expectation/${name}`)}
              >
                {icons.edit}
              </Box>
            </Tooltip>
            <Tooltip ml="8px" mainText="Open">
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
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDrawer(name)();
                }}
              >
                {icons.eye}
              </Box>
            </Tooltip>
          </Flex>
        ),
      },
    ]);
  }, [data, handleNavigate, onOpenDrawer, onDelete]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useExpectationsListRowData;

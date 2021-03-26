import { Box } from 'rebass';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { Value } from '@logicalclocks/quartz';

import { Validation } from '../../../../../../types/expectation';
import { shortDateFormat } from '../../../../../../components/activity/ActivityItem';

const useActivityListRowData = (data: Validation[]) => {
  const groupComponents = useMemo(() => {
    return data.length
      ? data[0].expectationResults.map(() => [Box, Value])
      : [];
  }, [data]);

  const groupProps = useMemo(() => {
    return data.length
      ? data[0].expectationResults.map(({ status }) => [
          {
            width: '10px',
            height: '10px',
            sx: {
              borderRadius: '50%',
            },
            backgroundColor:
              status === 'SUCCESS' ? 'labels.green' : 'labels.red',
          },
          {
            children: format(data[0].validationTime, shortDateFormat),
          },
        ])
      : [];
  }, [data]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useActivityListRowData;

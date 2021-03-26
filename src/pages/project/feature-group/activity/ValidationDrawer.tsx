import { Box } from 'rebass';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { Drawer, Value } from '@logicalclocks/quartz';

import { ActivityItemData } from '../../../../types/feature-group';
import { dateFormat } from '../../../../components/activity/ActivityItem';
import ExpectationResult from './ExpectationResults';

export interface ExpectationDrawerProps {
  isOpen: boolean;
  data: ActivityItemData;
  handleToggle: () => void;
}

const ValidationDrawer = ({
  data,
  isOpen,
  handleToggle,
}: ExpectationDrawerProps) => {
  const results = useMemo(
    () =>
      data.validations.expectationResults.reduce(
        (acc: any, { results, expectation }) => ({
          ...acc,
          [expectation.name]: acc[expectation.name]
            ? { ...acc[expectation.name], ...results }
            : results,
        }),
        {},
      ),
    [data],
  );

  return (
    <Drawer
      mt="10px"
      bottom="20px"
      isOpen={isOpen}
      singleBottom={false}
      onClose={handleToggle}
      headerLine={<Value>{format(data.timestamp, dateFormat)}</Value>}
    >
      <Drawer.Section title="">
        <Box mt="-20px" width="100%">
          {Object.entries(results).map(([name, result]) => (
            <ExpectationResult
              key={name}
              name={name}
              data={result as any[]}
              results={data.validations.expectationResults}
            />
          ))}
        </Box>
      </Drawer.Section>
    </Drawer>
  );
};

export default ValidationDrawer;

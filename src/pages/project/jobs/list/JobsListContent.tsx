import React, { ComponentType } from 'react';
import useJobsRows from './useJobsRows';
import { Row } from '@logicalclocks/quartz';
import { Box } from 'rebass';
import { jobsListStyles } from './jobsListStyles';

export const JobsListContent = ({ data }: any) => {
  const [groupComponents, groupProps] = useJobsRows(data);

  return (
    <Box sx={jobsListStyles}>
      <Row
        onRowClick={(_, index) => {
          const id = data[index].id;
        }}
        legend={[
          'ID',
          'Name',
          'Author',
          'Type',
          'Last run',
          'Duraction',
          'State',
          'Status',
        ]}
        middleColumn={9}
        groupComponents={groupComponents as ComponentType<any>[][]}
        groupProps={groupProps}
      />
    </Box>
  );
};

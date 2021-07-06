// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useMemo } from 'react';
import { Box, Flex } from 'rebass';
import { Labeling, Value } from '@logicalclocks/quartz';
import { format } from 'date-fns';
import ActivityCircle from '../ActivityCircle';
import { ActivityItemData } from '../../../types/feature-group';
import { getRowsCount } from '../utils';
import icons from '../../../sources/icons';

export interface DataIngestionProps {
  activity: ActivityItemData;
}

const dateFormat = 'yyyy-MM-dd HH:mm:ss';

const DataIngestion: FC<DataIngestionProps> = ({ activity }) => {
  const { commit } = activity;
  const {
    rowsUpdated = 0,
    rowsInserted = 0,
    rowsDeleted = 0,
    commitID,
  } = commit;

  const commitLabel = useMemo(() => {
    return format(+commitID, dateFormat);
  }, [commitID]);

  const allRowsCount = rowsDeleted + rowsUpdated + rowsInserted;

  return (
    <Flex bg="white" height="56px" alignItems="center">
      <Flex
        ml="20px"
        sx={{
          alignItems: 'center',
        }}
      >
        <Box>{icons.ingest}</Box>
        <Labeling width="110px" bold ml="8px" gray>
          Data ingestion
        </Labeling>

        <Flex alignItems="center" width="110px" ml="20px">
          <ActivityCircle
            rowsUpdated={rowsUpdated}
            rowsDeleted={rowsDeleted}
            rowsInserted={rowsInserted}
            allRowsCount={allRowsCount}
          />
        </Flex>

        <Labeling ml="20px">commit</Labeling>
        <Value ml="5px">{commitLabel}</Value>
        <Value ml="20px">{getRowsCount(rowsInserted)}</Value>
        <Labeling ml="5px">new rows,</Labeling>
        <Value ml="5px">{getRowsCount(rowsUpdated)}</Value>
        <Labeling ml="5px">updated rows,</Labeling>
        <Value ml="5px">{getRowsCount(rowsDeleted)}</Value>
        <Labeling ml="5px">deleted rows</Labeling>
      </Flex>
    </Flex>
  );
};

export default DataIngestion;

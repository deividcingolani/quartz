import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import ActivityCircle from '../ActivityCircle';
import { Labeling, Value } from '@logicalclocks/quartz';
import { ActivityItemData } from '../../../types/feature-group';
import { getRowsCount } from '../utils';

export interface DataIngestionProps {
  activity: ActivityItemData;
}

const DataIngestion: FC<DataIngestionProps> = ({ activity }) => {
  const { commit } = activity;
  const { rowsUpdated, rowsInserted, rowsDeleted, commitID } = commit;

  const allRowsCount = rowsDeleted + rowsUpdated + rowsInserted;

  return (
    <Flex bg="white" height="56px" alignItems="center">
      <Box ml="20px">
        <svg
          width="16"
          height="18"
          viewBox="0 0 16 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.84973 8.98646L15.6476 15.1264C16.1175 15.5508 16.1175 16.237 15.6476 16.6569L14.518 17.6772C14.0481 18.1016 13.2883 18.1016 12.8235 17.6772L8 13.3296L3.18151 17.6817C2.71165 18.1061 1.95189 18.1061 1.48704 17.6817L0.35239 16.6614C-0.117463 16.237 -0.117463 15.5508 0.35239 15.1309L7.15027 8.99097C7.62012 8.56208 8.37988 8.56208 8.84973 8.98646ZM7.15027 0.318284L0.35239 6.45824C-0.117463 6.88262 -0.117463 7.56885 0.35239 7.98871L1.48204 9.00903C1.95189 9.43341 2.71165 9.43341 3.17651 9.00903L7.995 4.65689L12.8135 9.00903C13.2833 9.43341 14.0431 9.43341 14.508 9.00903L15.6376 7.98871C16.1075 7.56434 16.1075 6.8781 15.6376 6.45824L8.83974 0.318284C8.37988 -0.106095 7.62012 -0.106095 7.15027 0.318284Z"
            fill="#A0A0A0"
          />
        </svg>
      </Box>
      <Labeling width="110px" bold ml="8px" gray>
        Data ingestion
      </Labeling>

      <Flex alignItems="center" width="100px">
        <ActivityCircle
          rowsUpdated={rowsUpdated}
          rowsDeleted={rowsDeleted}
          rowsInserted={rowsInserted}
          allRowsCount={allRowsCount}
          ml="20px"
        />
      </Flex>

      <Labeling ml="20px">commit</Labeling>
      <Value ml="5px">{commitID}</Value>
      <Value ml="20px">{getRowsCount(rowsInserted)}</Value>
      <Labeling ml="5px">new rows,</Labeling>
      <Value ml="5px">{getRowsCount(rowsUpdated)}</Value>
      <Labeling ml="5px">updated rows,</Labeling>
      <Value ml="5px">{getRowsCount(rowsDeleted)}</Value>
      <Labeling ml="5px">deleted rows</Labeling>
    </Flex>
  );
};

export default DataIngestion;

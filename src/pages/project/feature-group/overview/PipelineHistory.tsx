// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { ComponentType, FC, memo, useMemo } from 'react';
import formatDistance from 'date-fns/formatDistance';
import { Box, Flex } from 'rebass';
import {
  Button,
  Card,
  Text,
  Row as QRow,
  Labeling,
} from '@logicalclocks/quartz';
import { Job } from '../../../../types/job';
import usePipelineHistoryRowData from './usePipelineHistoryRowData';

export interface PipelineHistoryProps {
  data?: Job[];
}

const Row = memo(QRow);

const PipelineHistory: FC<PipelineHistoryProps> = ({ data }) => {
  const [groupComponents, groupProps] = usePipelineHistoryRowData(data);

  const lastSuccessJob = useMemo(() => {
    const [first] =
      data
        ?.filter(({ jobStatus }) => jobStatus === 'Succeeded')
        .sort(({ lastComputed: c1 }, { lastComputed: c2 }) => {
          const time1 = new Date(c1).getTime();
          const time2 = new Date(c2).getTime();

          if (time1 === time2) {
            return 0;
          }

          return time1 < time2 ? 1 : -1;
        }) || [];

    if (!first) {
      return 'not found';
    }

    return `${formatDistance(new Date(first.lastComputed), new Date())} ago`;
  }, [data]);

  if (!groupComponents || !groupProps) {
    return (
      <Card
        mt="20px"
        title="Pipeline History"
        actions={
          <Button p={0} intent="inline">
            edit
          </Button>
        }
      >
        <Box mt="20px" mx="-20px">
          <Flex height="50px" mt="30px" justifyContent="center">
            <Labeling fontSize="18px" gray>
              No pipeline history
            </Labeling>
          </Flex>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      mt="20px"
      title="Pipeline History"
      actions={
        <Button p={0} intent="inline">
          edit
        </Button>
      }
    >
      <Flex>
        <Text>last job success {lastSuccessJob}</Text>
      </Flex>
      <Box mt="20px" mx="-20px">
        <Row
          middleColumn={2}
          groupComponents={groupComponents as ComponentType<any>[][]}
          groupProps={groupProps}
        />
      </Box>
    </Card>
  );
};

export default memo(PipelineHistory);

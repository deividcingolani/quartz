// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { ComponentType, FC } from 'react';
import { Button, Card, Row, Value } from '@logicalclocks/quartz';
// Components
import { Box, Flex } from 'rebass';

const RecentlyOpenCard: FC = () => {
  // PARAMS TO BE RETRIEVED - START

  // const recentlyOpened = null;

  const recentlyOpened = [
    [
      { children: 'experiment_ideal_pasta_pesto_ratio.ipynd' },
      { children: '2021-01-02 13:30:30' },
      { children: 'Open in Jupyter ↗', intent: 'secondary' },
    ],
  ];

  //  PARAMS TO BE RETRIEVED - END

  return (
    <Card title="Recently opened" mb="20px">
      {recentlyOpened ? (
        <Box>
          <Row
            legend={['Filename', 'Last run']}
            middleColumn={0}
            groupComponents={[[Value, Value, Button]] as ComponentType<any>[][]}
            groupProps={recentlyOpened}
          />
        </Box>
      ) : (
        <Flex flexDirection="column" alignItems="center" my="auto" p="20px">
          <Value fontFamily="Inter" fontSize="18px">
            No recent file
          </Value>
        </Flex>
      )}
    </Card>
  );
};

export default RecentlyOpenCard;

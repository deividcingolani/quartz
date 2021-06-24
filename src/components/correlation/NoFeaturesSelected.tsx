// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Flex } from 'rebass';
import { Card, Labeling } from '@logicalclocks/quartz';

const NoFeaturesSelected: FC = () => {
  return (
    <Card>
      <Flex height="100px" alignItems="center" justifyContent="center">
        <Labeling fontSize="18px" gray>
          Select at least one feature
        </Labeling>
      </Flex>
    </Card>
  );
};

export default NoFeaturesSelected;

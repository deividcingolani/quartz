// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Flex } from 'rebass';
import { Button, Labeling, Subtitle, Text } from '@logicalclocks/quartz';

export interface FilterResultProps {
  subject: string;
  result: number;
  onReset: () => void;
}

const FilterResult: FC<FilterResultProps> = ({ subject, result, onReset }) => {
  if (!result) {
    return (
      <Flex
        mt="40px"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Subtitle>{`0 ${subject} match with the filters`}</Subtitle>
        <Text mt="10px">Change or reset filters</Text>
        <Button onClick={onReset} mt="50px">
          Reset Filters
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      mt="40px"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      {result === 1 && (
        <Labeling>{`There is 1 single match. Reset filters to display all ${subject}`}</Labeling>
      )}
      <Button mt="20px" onClick={onReset}>
        Reset Filters
      </Button>
    </Flex>
  );
};

export default FilterResult;

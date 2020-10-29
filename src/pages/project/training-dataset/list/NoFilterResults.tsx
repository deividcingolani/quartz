import React, { FC } from 'react';
import { Flex } from 'rebass';
import { Button, Subtitle, Labeling } from '@logicalclocks/quartz';

interface INoFilterResultsProps {
  handleResetFilters: () => void;
}

export const NoFilterResults: FC<INoFilterResultsProps> = (
  props: INoFilterResultsProps,
) => {
  const { handleResetFilters } = props;

  return (
    <Flex
      flexGrow={1}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Subtitle>0 training datasets match with the filters</Subtitle>
      <Labeling mt="11px" mb="58px">
        Change or reset filters
      </Labeling>

      <Flex alignItems="center">
        <Button intent="primary" onClick={handleResetFilters}>
          Reset filters
        </Button>
      </Flex>
    </Flex>
  );
};

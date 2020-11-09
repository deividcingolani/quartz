import { Box, Flex } from 'rebass';
import React, { ComponentType, FC, memo } from 'react';
import {
  Row as QRow,
  Card,
  Input,
  Button,
  Select,
  ToggleButton,
} from '@logicalclocks/quartz';

// Types
import { Feature } from '../../../../types/feature-group';
// Hooks
import useFeatureFilter, { KeyFilters } from '../hooks/useFeatureFilters';
import useFeatureListRowData from './useFeatureListRowData';
// Styles
import featureListStyles from './feature-lists-styles';

export interface FeatureListProps {
  data: Feature[];
}

const Row = memo(QRow);

const FeatureList: FC<FeatureListProps> = ({ data }) => {
  const {
    dataFiltered,
    types,
    search,
    typeFilters,
    keyFilter,
    onTypeFiltersChange,
    onSearchChange,
    onToggleKey,
  } = useFeatureFilter(data);

  const [groupComponents, groupProps] = useFeatureListRowData(dataFiltered);

  return (
    <Card
      mt="30px"
      title="Feature list"
      actions={
        <Button p={0} intent="inline">
          inspect data
        </Button>
      }
    >
      {/* Filters */}
      <Flex>
        <Input
          value={search}
          icon="search"
          placeholder="Find feature"
          onChange={onSearchChange}
        />
        <Select
          maxWidth="180px"
          width="max-content"
          ml="15px"
          isMulti
          value={typeFilters}
          options={types}
          placeholder="type"
          onChange={onTypeFiltersChange}
        />
        <ToggleButton
          ml="15px"
          checked={keyFilter === KeyFilters.primary}
          onChange={onToggleKey(KeyFilters.primary)}
        >
          primary key only
        </ToggleButton>
        <ToggleButton
          ml="15px"
          checked={keyFilter === KeyFilters.partition}
          onChange={onToggleKey(KeyFilters.partition)}
        >
          partition key only
        </ToggleButton>
      </Flex>

      {/* Data Rows */}
      <Box mt="30px" mx="-20px" sx={featureListStyles}>
        <Row
          middleColumn={1}
          groupComponents={groupComponents as ComponentType<any>[][]}
          groupProps={groupProps}
        />
      </Box>
    </Card>
  );
};

export default memo(FeatureList);

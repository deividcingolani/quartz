import { Box, Flex } from 'rebass';
import React, { ComponentType, FC, memo } from 'react';
import {
  Row,
  Card,
  Input,
  Button,
  Select,
  ToggleButton,
  Icon,
} from '@logicalclocks/quartz';

// Types
import { FeatureGroup } from '../../../../types/feature-group';
// Hooks
import useFeatureFilter, { KeyFilters } from '../hooks/useFeatureFilters';
import useFeatureListRowData from './useFeatureListRowData';
// Styles
import featureListStyles from './feature-lists-styles';

export interface FeatureListProps {
  data: FeatureGroup;
}

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
  } = useFeatureFilter(data.features);

  const [groupComponents, groupProps] = useFeatureListRowData(
    dataFiltered,
    data,
  );

  return (
    <Card
      mt="20px"
      title="Feature list"
      actions={
        <Button p={0} intent="inline">
          inspect data
        </Button>
      }
      contentProps={{ pb: '1px' }}
      maxHeight="400px"
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
          <Icon icon="star" mr="8px" mt="-1px" size="xs" /> Primary Keys Only
        </ToggleButton>
        <ToggleButton
          ml="15px"
          checked={keyFilter === KeyFilters.partition}
          onChange={onToggleKey(KeyFilters.partition)}
        >
          <Icon icon="grip-lines" mr="8px" mt="-1px" size="xs" /> Partition Keys
          Only
        </ToggleButton>
      </Flex>

      {/* Data Rows */}
      <Box mt="30px" mx="-19px" pb="18px" sx={featureListStyles}>
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
